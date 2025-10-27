<script setup>
import { useApiStore } from '~/store/api'

const apiStore = useApiStore()
const { delete: _delete } = useStrapi()
const toast = useToast()
const isOpen = ref(false)

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  api: {
    type: String,
    default: ''
  },
  entryName: {
    type: String,
    default: ''
  }
})
const data = reactive({
  loading: false,
})

async function onSubmit() {
  data.loading = true;
  try {
    if (props.id && props.api) {
      await _delete(props.api, props.id);
      toast.add({ 
        title: 'Успешно удален', 
        color: 'success', 
        icon: 'hugeicons:checkmark-circle-02'
      });
      apiStore.removeEntryFromState(props.api, props.id)
    }
  } catch (e) {
    toast.add({ 
      title: 'Ошибка', 
      description: 'Ошибка при удалении, попробуйте еще раз', 
      color: 'error', 
      icon: 'hugeicons:cancel-circle'
    })
  } finally {
    data.loading = false;
  }
}
</script>
<template>
  <UModal v-model:open="isOpen" 
    title="Подтвердите действие!" 
    close-icon="hugeicons:cancel-01"
    :ui="{ content: 'max-w-xs' }">

    <UButton 
      icon="hugeicons:delete-02"
      variant="outline" 
      color="primary" 
      size="sm">
      Удалить
    </UButton>

    <template #body>
      <div class="space-y-3">
        
        <div class="py-3 text-center">
          Вы действительно хотите удалить {{ entryName }}?
        </div>

        <div class="flex items-center justify-between w-full">
          <UButton @click="isOpen = false" color="neutral" variant="ghost">
            Отмена
          </UButton>
          <UButton 
            icon="hugeicons:delete-02" 
            @click="onSubmit"
            :loading="data.loading"
            type="submit" 
            variant="solid"
            color="primary" 
            size="sm">
            Удалить
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>