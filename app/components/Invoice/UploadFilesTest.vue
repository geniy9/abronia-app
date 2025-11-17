<script setup>
import { z } from 'zod'
import { useApiStore } from '~/store/api'

const { strapiUrl } = useConfig()
const client = useStrapiClient()
const apiStore = useApiStore()
const toast = useToast()

const props = defineProps({
  documentId: {
    type: String,
    default: ''
  }
})

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_MIMES = ['image/jpeg', 'image/png', 'application/pdf']
const ACCEPTED_EXT = /\.(jpe?g|png|pdf)$/i

const schema = z.object({
  images: z.array(
    z.instanceof(File)
      .refine(file => file.size <= MAX_FILE_SIZE, {
        message: 'Файл слишком большой. Пожалуйста приложите файл менее 5 Мегабайт!'
      })
      .refine(file => {
        if (ACCEPTED_MIMES.includes(file.type)) return true
        if (!file.type && file.name) return ACCEPTED_EXT.test(file.name)
        return false
      }, {
        message: 'Пожалуйста используйте валидный формат файла (JPG, PNG или PDF).'
      })
  ).min(1, 'Выберите хотя бы один файл.').max(10, 'Можно загрузить не более 10 файлов.')
})

const state = reactive({
  images: [],
  loading: false
})
const filesMeta = reactive({})

function makeKey(file) {
  return `${file.name}_${file.size}_${file.lastModified ?? 0}`
}

function createPreview(file) {
  if (file.type.startsWith('image/')) {
    try {
      return URL.createObjectURL(file)
    } catch {
      return null
    }
  }
  return null
}

watch(() => state.images, (newFiles, oldFiles) => {
  const newKeys = new Set((newFiles || []).map(makeKey))
  const oldKeys = new Set(Object.keys(filesMeta))

  for (const file of newFiles || []) {
    const key = makeKey(file)
    if (!filesMeta[key]) {
      filesMeta[key] = {
        file,
        progress: 0,
        status: 'ready', // ready, uploading, uploaded, error, cancelled
        xhr: null,
        preview: createPreview(file),
        response: null,
        error: null
      }
    } else {
      filesMeta[key].file = file
    }
  }

  for (const key of Object.keys(filesMeta)) {
    if (!newKeys.has(key)) {
      const meta = filesMeta[key]
      if (meta && meta.xhr && meta.status === 'uploading') {
        try { meta.xhr.abort() } catch {}
      }
      if (meta && meta.preview) {
        try { URL.revokeObjectURL(meta.preview) } catch {}
      }
      delete filesMeta[key]
    }
  }
}, { deep: true })

onBeforeUnmount(() => {
  for (const k of Object.keys(filesMeta)) {
    const m = filesMeta[k]
    if (m?.xhr && m.status === 'uploading') {
      try { m.xhr.abort() } catch {}
    }
    if (m?.preview) {
      try { URL.revokeObjectURL(m.preview) } catch {}
    }
  }
})

const filesList = computed(() => {
  return (state.images || []).map(f => {
    const key = makeKey(f)
    return filesMeta[key] || { file: f, progress: 0, status: 'ready', preview: createPreview(f) }
  })
})

const overallProgress = computed(() => {
  const list = filesList.value
  if (!list.length) return 0
  const sum = list.reduce((s, m) => s + (m.progress || 0), 0)
  return Math.round(sum / list.length)
})

function cancelFile(meta) {
  if (meta && meta.xhr && meta.status === 'uploading') {
    try {
      meta.xhr.abort()
      meta.status = 'cancelled'
      meta.progress = 0
      toast.add({ title: `Загрузка отменена: ${meta.file.name}`, color: 'neutral' })
    } catch (e) {
      console.error('Cancel error', e)
    }
  } else {
    const key = makeKey(meta.file)
    state.images = state.images.filter(f => makeKey(f) !== key)
  }
}

async function onSubmit() {
  if (!state.images.length) {
    toast.add({
      title: 'Выберите хотя бы один файл.',
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    })
    return
  }
  if (!props.documentId) {
    toast.add({
      title: 'Не указан документ (инвойс) для прикрепления файлов.',
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    })
    return
  }

  try {
    schema.parse({ images: state.images })
  } catch (err) {
    const msg = err?.errors?.[0]?.message || 'Неверные файлы.'
    toast.add({ title: msg, color: 'error', icon: 'hugeicons:cancel-circle' })
    return
  }

  state.loading = true
  const metas = filesList.value
  try {
    const uploadPromises = metas.map(meta => uploadSingle(meta))
    const results = await Promise.allSettled(uploadPromises)

    const uploadedFiles = results
      .filter(r => r.status === 'fulfilled' && r.value)
      .map(r => r.value)

    if (!uploadedFiles.length) {
      toast.add({
        title: 'Не удалось загрузить файлы.',
        color: 'error',
        icon: 'hugeicons:cancel-circle',
      })
      return
    }

    const existIds = apiStore.getterInvoice?.attachments?.map(file => file.id) || []
    const newIds = uploadedFiles.map(file => file.id)
    const allIds = [...existIds, ...newIds]

    await client(`/invoices/${props.documentId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { attachments: allIds } })
    })

    toast.add({
      title: 'Файлы успешно загружены и прикреплены!',
      color: 'success',
      icon: 'hugeicons:checkmark-circle-02',
    })

    apiStore.addAttachmentsToInvoice(uploadedFiles)

    for (const k of Object.keys(filesMeta)) {
      const m = filesMeta[k]
      if (m?.preview) try { URL.revokeObjectURL(m.preview) } catch {}
    }
    state.images = []
  } catch (error) {
    console.error('Общая ошибка в onSubmit:', error)
    toast.add({
      title: 'Произошла ошибка при загрузке файлов.',
      description: error?.message || 'Проверьте консоль для деталей.',
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    })
  } finally {
    state.loading = false
  }
}

function uploadSingle(meta) {
  return new Promise(async (resolve, reject) => {
    const file = meta.file
    const key = makeKey(file)

    const xhr = new XMLHttpRequest()
    meta.xhr = xhr
    meta.status = 'uploading'
    meta.progress = 0

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        meta.progress = Math.round((e.loaded / e.total) * 100)
      }
    }

    xhr.onload = function () {
      try {
        if (xhr.status >= 200 && xhr.status < 300) {
          const res = JSON.parse(xhr.responseText)
          meta.status = 'uploaded'
          meta.progress = 100
          meta.response = res?.data
          let uploaded = null
          if (Array.isArray(res?.data)) uploaded = res.data[0]
          else uploaded = res?.data
          resolve(uploaded)
        } else {
          meta.status = 'error'
          meta.error = `HTTP ${xhr.status}`
          reject(new Error(`Upload failed: ${xhr.status}`))
        }
      } catch (err) {
        meta.status = 'error'
        meta.error = err
        reject(err)
      }
    }

    xhr.onerror = function () {
      meta.status = 'error'
      meta.error = 'network'
      reject(new Error('Network error during upload'))
    }

    xhr.onabort = function () {
      meta.status = 'cancelled'
      meta.progress = 0
      reject(new Error('Upload aborted'))
    }

    try {
      xhr.open('POST', `${strapiUrl}/api/upload`, true)
      xhr.withCredentials = true

      const token = useCookie('strapi_jwt')
      if (token && token.value) {
        xhr.setRequestHeader('Authorization', `Bearer ${token.value}`)
      }
      const fd = new FormData()
      fd.append('files', file, file.name)
      xhr.send(fd)
    } catch (err) {
      meta.status = 'error'
      meta.error = err
      reject(err)
    }
  })
}
</script>
<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField name="images">
      <UFileUpload
        v-model="state.images"
        icon="hugeicons:upload-04"
        label="Приложить фото"
        description="JPG, PNG, или PDF (max. 5MB)"
        layout="grid"
        multiple
        class="w-full min-h-32"
      >
        <template #files-top="{ open, files }">
          <div v-if="files?.length" class="mb-2 flex items-center justify-between">
            <p class="font-bold">Файлы ({{ files?.length }})</p>
            <div class="flex gap-2 items-center">
              <UButton
                icon="hugeicons:plus-sign-circle"
                label="Добавить"
                color="neutral"
                variant="outline"
                class="-my-2"
                @click="open()" />
            </div>
          </div>
        </template>
      </UFileUpload>
    </UFormField>

    <div v-if="filesList.length" class="space-y-3">
      <div class="flex items-center justify-between">
        <p class="text-sm text-muted-foreground">Загрузка</p>
        <p class="text-sm text-muted-foreground">{{ overallProgress }}%</p>
      </div>

      <UProgress v-if="overallProgress > 0 || overallProgress <= 100" 
        v-model="overallProgress" size="sm" class="w-full" />

      <div class="space-y-2 mt-2">
        <div v-for="meta in filesList" :key="meta.file.name + '_' + meta.file.size" class="flex items-center">
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div class="truncate">
                <p class="font-medium truncate">{{ meta.file.name }}</p>
                <p class="text-xs text-muted-foreground">{{ Math.round(meta.file.size / 1024) }} KB</p>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="meta.status === 'uploading'" class="text-xs">{{ meta.progress }}%</span>
                <span v-else-if="meta.status === 'uploaded'" class="text-xs text-green-500">Готово</span>
                <span v-else-if="meta.status === 'error'" class="text-xs text-red-500">Ошибка</span>
                <UButton size="xs" variant="ghost" :icon="meta.status === 'uploading' ? 'hugeicons:cancel-circle' : 'hugeicons:trash' " @click="cancelFile(meta)" />
              </div>
            </div>
            <UProgress v-if="meta.progress > 0 || meta.progress <= 100" 
              v-model="meta.progress" size="xs" class="mt-2" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex">
      <UButton
        icon="hugeicons:file-upload"
        type="submit"
        label="Загрузить"
        color="neutral"
        variant="outline"
        block
        :loading="state.loading"
        :disabled="state.loading || !state.images.length"
      />
    </div>
  </UForm>
</template>
