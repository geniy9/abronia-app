<script setup>
import { z } from 'zod'

const { update } = useStrapi()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['on-edited'])

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  }
})

const schema = z.object({
  message: z.string().min(1, 'Добавьте текст заметки'),
});
const data = reactive({
  message: props.message || '',
  loading: false,
})

async function onSubmit(event) {
  data.loading = true;
  try {
    const res = await update('comments', props.id, { ...event.data });
    if (res?.data) {
      toast.add({ 
        title: 'Заметка обновлена', 
        color: 'success', 
        icon: 'hugeicons:checkmark-circle-02'
      });
      emit('on-edited', res.data)
      router.push(route.path);
    }
  } catch (e) {
    toast.add({ 
      title: 'Ошибка', 
      description: 'Ошибка при обновлении, попробуйте еще раз', 
      color: 'error', 
      icon: 'hugeicons:cancel-circle'
    })
  } finally {
    data.loading = false;
  }
}
function onRemoved() { router.push(route.path) }

const isDisabled = computed(() => { return !data.message })
</script>
<template>
  <UCard>
    <UForm :schema="schema" :state="data" class="space-y-3" @submit.prevent="onSubmit">
      <UFormField>
        <UTextarea v-model="data.message" name="message" placeholder="Текст сообщения..." 
          class="w-full" :rows="8" required />
      </UFormField>
      <div class="flex items-center justify-between">
        <RemoveEntry 
          :id="id" api="comments" 
          :entry-name="`комментарий`" 
          @on-removed="onRemoved" />
        <UFieldGroup>
          <UButton :to="route.path" color="neutral" variant="soft" size="sm">
            Отмена
          </UButton>
          <UButton 
            type="submit" size="sm"
            :disabled="isDisabled" 
            :loading="data.loading">
            Изменить
          </UButton>
        </UFieldGroup>
      </div>
    </UForm>
  </UCard>
</template>