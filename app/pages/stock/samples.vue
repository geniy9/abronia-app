<script setup>
import { useApiStore } from '~/store/api'

const apiStore = useApiStore()
const route = useRoute()
const currentPage = ref(1)
const searchQuery = ref('')

async function getSamples() {
  try {
    await apiStore.getSamples()
  } catch (error) {
    console.log(error)
  }
}
onMounted(async () => { await getSamples() })

const isAdd = computed(() => route.hash === '#add')

async function loadSamples() {
  const filters = {};
  if (searchQuery.value) {
    filters.$or = [
      { name: { $containsi: searchQuery.value } },
      { sku: { $containsi: searchQuery.value } },
    ];
  }
  await apiStore.getItems('samples', {
    page: currentPage.value,
    filters: filters,
    sort: ["name:asc"]
  });
}

watch(() => searchQuery.value, async () => { await loadSamples() });
watch(() => currentPage.value, async () => { await loadSamples() });
</script>
<template>
  <div class="body_layout">
    <div class="flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full">

      <div class="grid grid-cols-[auto_1fr_auto] items-center gap-2 bg-primary text-white rounded-lg p-2">
        <NuxtLink to="/stock" class="text-2xl leading-0 p-2">
          <UIcon name="hugeicons:link-backward" />
        </NuxtLink>
        <div class="text-center">
          <p class="text-xs">Склад</p>
          <h2 class="text-lg font-bold">Образцы</h2>
        </div>
        <NuxtLink :to="isAdd ? '/stock/samples' : '/stock/samples#add'" class="text-2xl leading-0 p-2">
          <UIcon :name="isAdd ? 'hugeicons:cancel-square' : 'hugeicons:keyframes-double-add'" class="text-2xl" />
        </NuxtLink>
      </div>

      <SampleAdd v-if="isAdd" />
      <div v-else class="flex flex-col gap-4">

        <SearchBar 
          v-model="searchQuery" 
          placeholder="Поиск образца" 
          :loading="apiStore.loadingSamples" />

        <SampleList :items="apiStore.samples" :loading="apiStore.loadingSamples" />

        <div v-if="(apiStore.hasSamples === 0)" class="text-center text-gray-500 py-4">
          Образцы пока отсутствуют
        </div>

        <div v-if="(apiStore.totalSamples > apiStore.pageSize)" class="flex justify-center">
          <UPagination 
            v-model:page="currentPage" 
            :items-per-page="apiStore.pageSize" 
            :total="apiStore.totalSamples" 
            color="neutral" 
            variant="ghost"
            active-color="primary" 
            activeVariant="solid"
            size="sm" />
        </div>
      </div>

    </div>
  </div>
</template>