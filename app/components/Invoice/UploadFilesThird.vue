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
const ACCEPTED_MIMES = ['image/jpeg', 'image/png', 'application/pdf'];
const ACCEPTED_EXT = /\.(jpe?g|png|pdf)$/i;

const schema = z.object({
  images: z.array(
    z.instanceof(File)
      .refine(file => file.size <= MAX_FILE_SIZE, {
        message: 'Файл слишком большой. Пожалуйста приложите файл менее 5 Мегабайт!'
      })
      .refine(file => {
        if (ACCEPTED_MIMES.includes(file.type)) return true;
        if (!file.type && file.name) return ACCEPTED_EXT.test(file.name);
        return false;
      }, {
        message: 'Пожалуйста используйте валидный формат файла (JPG, PNG или PDF).'
      })
  ).min(1, 'Выберите хотя бы один файл.').max(10, 'Можно загрузить не более 10 файлов.')
});

const state = reactive({
  images: [],
  loading: false
})

async function onSubmit() {
  if (!state.images.length) {
    toast.add({
      title: 'Выберите хотя бы один файл.',
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    });
    return
  }
  if (!props.documentId) {
    return
  }
  state.loading = true
  try {
    const formData = new FormData()
    state.images.forEach(file => { formData.append('files', file) })

    const uploadedFiles = await client('/upload', {
      method: 'POST',
      body: formData
    })

    if (!uploadedFiles || uploadedFiles.length === 0) {
      toast.add({
        title: 'Не удалось загрузить файлы.',
        color: 'error',
        icon: 'hugeicons:cancel-circle',
      });
      return
    }

    const existIds = apiStore.getterInvoice?.attachments?.map(file => file.id) || [];
    const newIds = uploadedFiles.map(file => file.id)
    const allIds = [...existIds, ...newIds]

    await client(`/invoices/${props.documentId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { attachments: allIds } })
    });

    toast.add({
      title: 'Файлы успешно загружены и прикреплены!',
      color: 'success',
      icon: 'hugeicons:checkmark-circle-02',
    });

    apiStore.addAttachmentsToInvoice(uploadedFiles);
    state.images = []

  } catch (error) {
    console.error('Общая ошибка в onSubmit:', error)
    toast.add({
      title: 'Произошла ошибка при загрузке файлов.',
      description: error.message || 'Проверьте консоль для деталей.',
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    });
  } finally {
    state.loading = false
  }
}
</script>
<template>
  <UForm :schema="schema" :state="state" class="space-y-1" @submit="onSubmit">
    <UFormField name="images">
      <UFileUpload
        v-model="state.images"
        icon="hugeicons:upload-04"
        label="Приложить фото"
        description="JPG, PNG, или PDF (max. 5MB)"
        layout="grid"
        multiple
        class="w-full min-h-32">
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

    <div class="flex">
      <UButton 
        icon="hugeicons:file-upload" 
        type="submit" 
        label="Загрузить" 
        color="neutral" 
        variant="outline" 
        block
        :loading="state.loading" />
    </div>
  </UForm>
</template>