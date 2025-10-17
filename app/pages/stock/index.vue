<script setup>
import { useApiStore } from '~/store/api'

definePageMeta({
  middleware: 'auth'
})

const apiStore = useApiStore()
const data = reactive({
  loading: false,
})

async function getCategories() {
  try {
    data.loading = true
    await apiStore.getCategories()
  } catch (error) {
    console.log(error)
  } finally {
    data.loading = false
  }
}
onMounted(async () => { await getCategories() })

const categories = computed(() => apiStore.categories)

// onMounted(async () => {
//   if (!apiStore.products.length || !apiStore.searchValue) {
//     await apiStore.fetchProducts()
//   }
// })
</script>
<template>
  <div class="page_layout">
    <div class="relative flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full mt-9 pt-9">
      <img src="/img/stock.png" alt="Склад" class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-15 h-15 p-1 rounded-full bg-gray-200 dark:bg-gray-500" />
      <h2 class="text-center text-lg font-bold text-black dark:text-white">
        Склад
      </h2>
      <SearchBar placeholder="Поиск по складу" api="products" />
      <Categories :items="categories" :loading="apiStore.loadingCategories" />
    </div>
  </div>
</template>