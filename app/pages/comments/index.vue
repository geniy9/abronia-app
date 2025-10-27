<script setup>
import { useApiStore } from '~/store/api'
const apiStore = useApiStore()
const route = useRoute()

definePageMeta({
  middleware: 'auth'
})

onMounted(async () => { await apiStore.getComments() })

const comments = computed(() => apiStore.comments)
const isAdd = computed(() => route.hash === '#add')
</script>
<template>
  <div class="body_layout">
    <div class="relative flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full">
      <!-- <div class="bg-primary text-white text-center rounded-lg w-full p-2">
        <h2 class="text-lg font-bold">
          Заметки
        </h2>
      </div> -->
      <div class="grid grid-cols-[auto_1fr_auto] items-center gap-2 bg-primary text-white rounded-lg p-2">
        <NuxtLink to="/home" class="text-2xl leading-0 py-2">
          <UIcon name="hugeicons:link-backward" />
        </NuxtLink>
        <div>
          <h2 class="text-lg font-bold text-center">
            Заметки
          </h2>
        </div>
        <NuxtLink to="/comments#add" class="text-2xl leading-0 py-2">
          <UIcon name="hugeicons:message-add-01" />
        </NuxtLink>
      </div>

      <CommentAdd v-if="isAdd" />
      <CommentList v-else :items="comments" :loading="apiStore.loadingComments" />
    </div>
  </div>
</template>