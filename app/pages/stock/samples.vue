<script setup>
import { useApiStore } from '~/store/api'

const apiStore = useApiStore()
const route = useRoute()

const data = reactive({
  currentPage: 1
})

async function getSamples() {
  try {
    await apiStore.getSamples()
  } catch (error) {
    console.log(error)
  }
}
onMounted(async () => { await getSamples() })

const isAdd = computed(() => route.hash === '#add')

// watch(() => data.currentPage, (value) => {
//   if (value) { apiStore.paginate(value, data.id) }
// })
</script>
<template>
  <div class="body_layout">
    <div class="flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full">
      <div class="bg-primary rounded-lg p-3">
        <h2 class="text-center text-lg font-bold text-white">
          Образцы
        </h2>
      </div>

      <SampleAdd v-if="isAdd" />
      <div v-else class="flex flex-col gap-4">
        <UButton to="/stock/samples#add" color="primary" block icon="hugeicons:keyframes-double-add">
          Добавить образец
        </UButton>
        <SampleList :items="apiStore.samples" :loading="apiStore.loadingSamples" />
        <div v-if="(apiStore.hasSamples === 0)" class="text-center text-gray-500 py-4">
          Образцы пока отсутствуют
        </div>

        <div v-if="(apiStore.totalSamples > apiStore.pageSize)" class="flex justify-center w-full mt-10">
          <UPagination 
            v-model:page="currentPage" 
            :items-per-page="apiStore.pageSize" 
            :total="apiStore.totalSamples" 
            active-color="primary" 
            :sibling-count="1"
            firstIcon="material-symbols:keyboard-double-arrow-left-rounded" 
            prevIcon="material-symbols:chevron-left-rounded" 
            nextIcon="material-symbols:chevron-right-rounded" 
            lastIcon="material-symbols:keyboard-double-arrow-right-rounded" />
        </div>
      </div>

    </div>
  </div>
</template>