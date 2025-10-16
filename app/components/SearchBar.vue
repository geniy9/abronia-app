<script setup>
import { useApiStore } from '~/store/api'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Поиск'
  }
})

const apiStore = useApiStore()
const router = useRouter()
const route = useRoute()
const loading = ref(false)

const searchValue = computed({
  get: () => apiStore.searchValue,
  set: (value) => { apiStore.searchValue = value }
})

const onSearch = async () => {
  try {
    loading.value = true
    apiStore.currentPage = 1;
    await apiStore.fetchProducts()
    if (route.path !== '/products') {
      await router.push('/products')
    }
  } catch(e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

</script>
<template>
  <UInput
    v-model="searchValue"
    :placeholder="placeholder"
    variant="custom" 
    size="md"
    icon="hugeicons:search-01"
    @keydown.enter="onSearch" 
    :loading="loading"
    class="w-full" />
</template>