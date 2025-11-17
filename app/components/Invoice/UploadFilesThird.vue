<script setup>
import { z } from 'zod'
import { useApiStore } from '~/store/api'

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
  loading: false,
  progress: 0 // общий прогресс 0..100
})

let progressTimer = null

function startSimulatedProgress() {
  clearSimulatedProgress()
  state.progress = 5
  progressTimer = setInterval(() => {
    if (!state.loading) return
    const maxTarget = 95
    const increment = 1 + Math.floor(Math.random() * 6)
    state.progress = Math.min(maxTarget, state.progress + increment)
  }, 300)
}

function finishSimulatedProgress(success = true) {
  state.progress = success ? 100 : 0
  clearSimulatedProgress()
  if (success) {
    setTimeout(() => { state.progress = 0 }, 700)
  }
}

function clearSimulatedProgress() {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

onBeforeUnmount(() => {
  clearSimulatedProgress()
})

function normalizeUploadedResponse(res) {
  if (!res) return []
  if (res.data !== undefined) {
    if (Array.isArray(res.data)) return res.data
    if (res.data === null) return []
    return [res.data]
  }
  if (Array.isArray(res)) return res
  return []
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
  startSimulatedProgress()

  try {
    const formData = new FormData()
    state.images.forEach(file => formData.append('files', file))

    const res = await client('/upload', {
      method: 'POST',
      body: formData
    })

    const uploadedFiles = normalizeUploadedResponse(res)

    if (!uploadedFiles || uploadedFiles.length === 0) {
      finishSimulatedProgress(false)
      toast.add({
        title: 'Не удалось загрузить файлы.',
        color: 'error',
        icon: 'hugeicons:cancel-circle',
      })
      return
    }

    const existIds = apiStore.getterInvoice?.attachments?.map(file => file.id) || []
    const newIds = uploadedFiles.map(f => f.id).filter(Boolean)
    const allIds = [...existIds, ...newIds]

    await client(`/invoices/${props.documentId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { attachments: allIds } })
    })

    await apiStore.getInvoice(props.documentId)

    // apiStore.addAttachmentsToInvoice(uploadedFiles)
    toast.add({
      title: 'Файлы успешно загружены и прикреплены!',
      color: 'success',
      icon: 'hugeicons:checkmark-circle-02',
    })

    finishSimulatedProgress(true)
    state.images = []
  } catch (error) {
    console.error('Ошибка в onSubmit:', error)
    finishSimulatedProgress(false)
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
            <UButton
              icon="hugeicons:plus-sign-circle"
              label="Добавить"
              color="neutral"
              variant="outline"
              class="-my-2"
              @click="open()" />
          </div>
        </template>
      </UFileUpload>
    </UFormField>

    <div v-if="state.loading || state.progress > 0" class="space-y-2">
      <div class="flex justify-between items-center text-sm text-gray-300">
        <div>Загрузка</div>
        <div>{{ state.progress }}%</div>
      </div>
      <UProgress v-model="state.progress" size="sm" class="w-full" />
    </div>

    <div v-if="state.images.length" class="mt-2 space-y-1">
      <div v-for="(f, idx) in state.images" :key="f.name + '_' + f.size + '_' + idx" class="flex items-center justify-between">
        <div class="truncate">{{ f.name }}</div>
        <div class="text-xs text-gray-300">{{ f.type || 'file' }}</div>
      </div>
    </div>

    <div class="flex">
      <UButton
        icon="hugeicons:file-upload"
        type="submit"
        label="Начать загрузку"
        color="neutral"
        variant="outline"
        block
        :loading="state.loading"
        :disabled="state.loading || !state.images.length"
      />
    </div>
  </UForm>
</template>