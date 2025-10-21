<script setup>
import { useApiStore } from '~/store/api'
const apiStore = useApiStore()

definePageMeta({
  middleware: 'auth'
})

onMounted(async () => { await apiStore.getComments() })

const comments = computed(() => apiStore.comments)
</script>
<template>
  <div class="body_layout">
    <div class="relative flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full">
      <div class="bg-primary text-white text-center rounded-lg w-full p-2">
        <h2 class="text-lg font-bold">
          Заметки
        </h2>
      </div>
      <UButton to="/comments#add" color="primary" block icon="hugeicons:message-add-01">
        Добавить заметку
      </UButton>
      <CommentList :items="comments" :loading="apiStore.loadingComments" />
    </div>
  </div>
</template>