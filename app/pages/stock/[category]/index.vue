<script setup>
import { useApiStore } from '~/store/api'

const apiStore = useApiStore()
const route = useRoute()

const data = reactive({
  id: route.params.category || null,
  currentPage: 1
})

async function getProductsByCategory() {
  try {
    await apiStore.getProductsByCategory(data.id)
  } catch (error) {
    console.log(error)
  }
}
onMounted(async () => { await getProductsByCategory() })

watch(() => data.currentPage, (value) => {
  if (value) { apiStore.paginate(value, data.id) }
})
</script>
<template>
  <div class="page_layout">
    <div class="flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full">
      <div v-if="apiStore.getterCategory" class="bg-primary rounded-lg p-3">
        <h2 class="text-center text-lg font-bold text-white">
          {{ apiStore.getterCategory.name }}
        </h2>
      </div>
      <ProductList :items="apiStore.products" :loading="apiStore.loadingProducts" />
      <div v-if="(apiStore.hasProduct === 0)" class="text-center text-gray-500 py-4">
        Продукция в данной категории пока отсутствует
      </div>

      <div v-if="(apiStore.totalProducts > apiStore.pageSize)" class="flex justify-center w-full mt-10">
        <UPagination 
          v-model:page="currentPage" 
          :items-per-page="apiStore.pageSize" 
          :total="apiStore.totalProducts" 
          active-color="primary" 
          :sibling-count="1"
          firstIcon="material-symbols:keyboard-double-arrow-left-rounded" 
          prevIcon="material-symbols:chevron-left-rounded" 
          nextIcon="material-symbols:chevron-right-rounded" 
          lastIcon="material-symbols:keyboard-double-arrow-right-rounded" />
      </div>
    </div>
  </div>
</template>