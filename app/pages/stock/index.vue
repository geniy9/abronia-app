<script setup>
import { useApiStore } from '~/store/api'
const route = useRoute()

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
const isAdd = computed(() => route.hash === '#add')
</script>
<template>
  <div class="body_layout">
    <div class="body_content">
      <NuxtLink to="/stock" class="body_head">
        <img src="/img/stock.png" alt="Склад" />
      </NuxtLink>
      <h2 class="main_title">Склад</h2>

      <ProductAdd v-if="isAdd" />
      <div v-else class="flex flex-col gap-4">
        <SearchBar placeholder="Поиск по товарам" api="products" />
        <UButton to="/stock#add" color="primary" block icon="hugeicons:package-add">
          Добавить новый товар
        </UButton>

        <NuxtLink to="/stock/samples" class="bg-primary dark:bg-primary/50 rounded-lg p-2">
          <div class="flex items-center justify-between w-full">
            <h3 class="font-bold text-white dark:text-white px-2">
              Образцы
            </h3>
            <div class="flex items-center justify-center bg-white dark:bg-primary/50 rounded-lg w-10 h-10">
              <UIcon name="hugeicons:arrow-right-02" class="w-6 h-6 text-black dark:text-white" />
            </div>
          </div>
        </NuxtLink>

        <Categories :items="categories" :loading="apiStore.loadingCategories" />
      </div>
      
    </div>
  </div>
</template>