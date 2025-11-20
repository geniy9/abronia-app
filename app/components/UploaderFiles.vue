<script setup>
import { z } from 'zod'

const client = useStrapiClient()
const toast = useToast()

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_MIMES = ['image/jpeg', 'image/png', 'application/pdf']
const ACCEPTED_EXT = /\.(jpe?g|png|pdf)$/i

const schema = z.object({
  images: z.array(
    z.instanceof(File)
      .refine(file => file.size <= MAX_FILE_SIZE, {
        message: 'Файл слишком большой (макс. 5MB)'
      })
      .refine(file => {
        if (ACCEPTED_MIMES.includes(file.type)) return true
        if (!file.type && file.name) return ACCEPTED_EXT.test(file.name)
        return false
      }, {
        message: 'Неверный формат (только JPG, PNG, PDF)'
      })
  ).max(10, 'Максимум 10 файлов')
})

const state = reactive({
  images: [],
  loading: false,
  progress: 0
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
  if (success) setTimeout(() => { state.progress = 0 }, 700)
}
function clearSimulatedProgress() {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}
onBeforeUnmount(() => { clearSimulatedProgress() })

function normalizeUploadedResponse(res) {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (res.data && Array.isArray(res.data)) return res.data
  if (res.data) return [res.data]
  return [res]
}

defineExpose({ uploadFiles })
async function uploadFiles() {
  if (!state.images.length) return []

  try {
    schema.parse({ images: state.images })
  } catch (err) {
    const msg = err?.errors?.[0]?.message || 'Ошибка валидации файлов'
    toast.add({ title: msg, color: 'error', icon: 'hugeicons:cancel-circle' })
    throw new Error(msg)
  }

  state.loading = true
  startSimulatedProgress()

  try {
    const formData = new FormData()
    state.images.forEach(file => formData.append('files', file))

    const res = await client('/upload', { method: 'POST', body: formData })
    const uploadedFiles = normalizeUploadedResponse(res)
    
    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new Error('Сервер не вернул данные о файлах')
    }
    const fileIds = uploadedFiles.map(f => f.id).filter(Boolean)
    
    finishSimulatedProgress(true)
    return fileIds

  } catch (error) {
    console.error('Upload error:', error)
    finishSimulatedProgress(false)
    toast.add({
      title: 'Ошибка загрузки файлов',
      description: error?.message,
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    })
    throw error // Пробрасываем ошибку родителю
  } finally {
    state.loading = false
  }
}
</script>
<template>
  <UForm :schema="schema" :state="state" class="space-y-2">
    <UFormField name="images">
      <UFileUpload
        v-model="state.images"
        icon="hugeicons:upload-04"
        label="Файлы документа"
        description="JPG, PNG, PDF (макс. 5MB)"
        layout="grid"
        multiple
        class="w-full min-h-32">
        <template #files-top="{ open, files }">
          <div v-if="files?.length" class="mb-2 flex items-center justify-between">
            <p class="font-bold text-sm">Выбрано: {{ files?.length }}</p>
            <UButton
              icon="hugeicons:plus-sign-circle"
              label="Добавить"
              color="neutral"
              variant="outline"
              size="xs"
              class="-my-2"
              @click="open()" />
          </div>
        </template>
      </UFileUpload>
    </UFormField>

    <div v-if="state.loading || state.progress > 0" class="space-y-1">
      <div class="flex justify-between items-center text-xs text-gray-400">
        <div>Загрузка на сервер...</div>
        <div>{{ state.progress }}%</div>
      </div>
      <UProgress v-model="state.progress" size="xs" class="w-full" />
    </div>
  </UForm>
</template>