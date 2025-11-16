<script setup>
import { useApiStore } from '~/store/api'
const route = useRoute()

definePageMeta({
  middleware: 'auth'
})

const apiStore = useApiStore()
const data = reactive({
  loading: false,
  isEdit: false
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
function toggleEdit() { data.isEdit = data.isEdit ? false : true }

onMounted(async () => { await getCategories() })

const categories = computed(() => apiStore.categories)
const isAdd = computed(() => route.hash === '#add')
</script>
<template>
  <div class="body_layout">
    <div class="body_content">
      
      <div class="grid grid-cols-[auto_1fr_auto] items-center dark:text-white text-black">
        <NuxtLink to="/home" class="text-2xl leading-0 p-2">
          <UIcon name="hugeicons:link-backward" />
        </NuxtLink>
        <div>
          <NuxtLink to="/stock" class="body_head">
            <img src="/img/stock.png" alt="Склад" />
          </NuxtLink>
          <h2 class="main_title">Склад</h2>
        </div>
        <div v-if="data.isEdit" @click="toggleEdit" class="text-2xl cursor-pointer leading-0 p-2">
          <UIcon name="hugeicons:cancel-01" />
        </div>
        <UDropdownMenu v-else :items="[{
            label: 'Добавить категорию',
            icon: 'hugeicons:node-add',
            to: '/stock#add'
          },{
            label: 'Удалить категорию',
            icon: 'hugeicons:node-remove',
            onSelect() { toggleEdit() }
          }]" arrow>
          <span class="text-2xl cursor-pointer leading-0 p-2">
            <UIcon name="hugeicons:node-edit" />
          </span>
        </UDropdownMenu>
      </div>

      <CategoryAdd v-if="isAdd" />
      <div v-else class="flex flex-col gap-4">
        <SearchBar placeholder="Поиск по товарам" api="products" />

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

        <CategoryList 
          :items="categories" 
          :loading="apiStore.loadingCategories" 
          :isEdit="data.isEdit" 
          @on-removed-category="data.isEdit = false" />
      </div>
      
    </div>
  </div>
</template>