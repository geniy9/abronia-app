<script setup>
import { z } from 'zod'

const client = useStrapiClient()
const emit = defineEmits(['update:modelValue', 'handle-comment']);
const isOpen = ref(false)
const toast = useToast()

const props = defineProps({
  entryId: {
    type: String,
    default: ''
  },
  entryName: {
    type: String,
    default: ''
  }
})

const schema = z.object({
  message: z.string().min(1, 'Добавьте текст комментария'),
});
const data = reactive({
  message: '',
  loading: false,
})

async function onSubmit(event) {
  data.loading = true;
  try {
    const commentPayload = { ...event.data };
    if (props.entryName) {
      commentPayload[props.entryName] = { connect: [props.entryId] }
    }
    const res = await client('/comments', {
      method: 'POST',
      body: { data: commentPayload },
    });
    if (res?.data) {
      toast.add({ 
        title: 'Комментарий добавлен', 
        color: 'success', 
        icon: 'hugeicons:checkmark-circle-02'
      });
      emit('handle-comment', res.data);
    }

  } catch (e) {
    toast.add({ 
      title: 'Ошибка', 
      description: 'Ошибка при добавлении комментария, попробуйте еще раз', 
      color: 'error', 
      icon: 'hugeicons:cancel-circle'
    })
  } finally {
    data.message = ''
    isOpen.value = false
    data.loading = false;
  }
}
function openCommentPrompt() { isOpen.value = true }
defineExpose({ openCommentPrompt });
const isDisabled = computed(() => { return !data.message })
</script>
<template>
  <UModal v-model:open="isOpen" 
    title="Комментарий" 
    close-icon="hugeicons:cancel-01"
    :ui="{ content: 'max-w-sm' }">

    <template #body>
      <UForm :schema="schema" :state="data" class="space-y-3" @submit.prevent="onSubmit">
        <UFormField>
          <UTextarea v-model="data.message" name="message" placeholder="Текст сообщения..." 
            class="w-full" :rows="12" required />
        </UFormField>

        <div class="flex items-center justify-between w-full">
          <UButton @click="isOpen = false" color="primary" variant="ghost">
            Отмена
          </UButton>
          <UButton
            label="Сохранить"
            type="submit" 
            :disabled="isDisabled"
            :loading="data.loading" 
            color="primary" 
            size="lg" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>