<script setup>
import { useApiStore } from '~/store/api'
const apiStore = useApiStore()
const route = useRoute()

const data = reactive({
  id: route.params.id || null,
})

onMounted(async () => { await apiStore.getDoc(data.id) })
</script>
<template>
  <div class="body_layout">
    <div class="flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full">

      <div v-if="apiStore.loadingDocs" class="grid grid-cols-1 gap-4">
        <USkeleton class="w-full h-15" />
        <div class="w-full flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-4">
            <USkeleton v-for="i in 12" class="h-4" />
          </div>
        </div>
      </div>
      <Doc v-else-if="apiStore.doc" :item="apiStore.doc" />
      <div v-else-if="apiStore.hasDocs === 0" class="text-center text-gray-500 py-4">
        Документов нет
      </div>

    </div>
  </div>
</template>