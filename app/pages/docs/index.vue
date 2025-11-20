<script setup>
import { useApiStore } from '~/store/api'
const apiStore = useApiStore()
const route = useRoute()

definePageMeta({
  middleware: 'auth'
})
const data = reactive({
  currentPage: 1
})
onMounted(async () => { await apiStore.getDocs() })

const docs = computed(() => apiStore.docs)
const isAdd = computed(() => route.hash === '#add')

// watch(() => data.currentPage, (value) => {
//   if (value) { apiStore.paginate(value, data.id) }
// })
</script>
<template>
  <div class="body_layout">
    <div class="body_content">

      <div class="grid grid-cols-[auto_1fr_auto] items-center dark:text-white text-black">
        <NuxtLink to="/home" class="text-2xl leading-0 p-2">
          <UIcon name="hugeicons:link-backward" />
        </NuxtLink>
        <div>
          <NuxtLink to="/docs" class="body_head">
            <img src="/img/document.png" alt="Документы" />
          </NuxtLink>
          <h2 class="main_title">Документы</h2>
        </div>
        <NuxtLink :to="isAdd ? '/docs' : '/docs#add'" class="text-2xl leading-0 p-2">
          <UIcon :name="isAdd ? 'hugeicons:cancel-square' : 'hugeicons:file-add'" class="text-2xl" />
        </NuxtLink>
      </div>

      <DocAdd v-if="isAdd" />
      <div v-else class="flex flex-col gap-4">
        <SearchBar placeholder="Поиск по документам" api="docs" />
        <DocList :items="docs" :loading="apiStore.loadingDocs" />
        <div v-if="(apiStore.hasDocs === 0)" class="text-center text-gray-500 py-4">
          Документов пока нет
        </div>
      </div>

      
    </div>
  </div>
</template>