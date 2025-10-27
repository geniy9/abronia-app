<script setup>
import { z } from 'zod'

const client = useStrapiClient()
const toast = useToast()
const router = useRouter()

const schema = z.object({
  message: z.string().min(1, 'Добавьте текст заметки'),
});
const data = reactive({
  message: '',
  loading: false,
})

async function onSubmit(event) {
  data.loading = true;
  try {
    const res = await client('/comments', {
      method: 'POST',
      body: { data: { ...event.data } },
    });
    if (res?.data) {
      toast.add({ 
        title: 'Заметка добавлена', 
        color: 'success', 
        icon: 'hugeicons:checkmark-circle-02'
      });
      const newCommentId = res.data.documentId;
      router.push(`/comments/${newCommentId}`);
    }
  } catch (e) {
    toast.add({ 
      title: 'Ошибка', 
      description: 'Ошибка при добавлении заметки, попробуйте еще раз', 
      color: 'error', 
      icon: 'hugeicons:cancel-circle'
    })
  } finally {
    data.message = ''
    data.loading = false;
  }
}

const isDisabled = computed(() => { return !data.message })
</script>
<template>
  <UCard>
    <template #header>
      <h2 class="main_title">Новая заметка</h2>
    </template>

    <UForm :schema="schema" :state="data" class="space-y-3" @submit.prevent="onSubmit">
      <UFormField>
        <UTextarea v-model="data.message" name="message" placeholder="Текст сообщения..." 
          class="w-full" :rows="12" required />
      </UFormField>
      
      <div class="flex items-center justify-between">
        <UButton to="/comments" color="primary" variant="ghost">
          Отмена
        </UButton>
        <UButton 
          type="submit" 
          :disabled="isDisabled" 
          :class="isDisabled ? 'opacity-50' : 'opacity-100'"
          :loading="data.loading">
          Добавить
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>