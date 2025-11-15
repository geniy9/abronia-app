<script setup>
import { useApiStore } from '~/store/api'

const apiStore = useApiStore()
const router = useRouter()
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

const isAdd = computed(() => route.hash === '#add')
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
          <h2 class="text-lg font-bold">
            {{ apiStore.getterCategory.name }}
          </h2>
        </div>
        <div @click="isAdd ? '/stock' : router.push({ 
          path: '/stock', 
          hash: '#add', 
          query: { categoryId: apiStore.getterCategory.documentId } })">
          <UIcon :name="isAdd ? 'hugeicons:cancel-square' : 'hugeicons:package-add'" class="text-2xl cursor-pointer" />
        </div>
      </div>

      <ProductList :items="apiStore.products" :loading="apiStore.loadingProducts" />
      <div v-if="(apiStore.hasProducts === 0)" class="flex flex-col gap-4 items-center p-4">
        <span class="text-center text-gray-400">
          Товары в данной категории пока отсутствуют
        </span>
        <UButton to="/stock#add" color="primary" icon="hugeicons:package-add">
          Добавить товар
        </UButton>
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