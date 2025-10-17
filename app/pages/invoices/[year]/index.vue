<script setup>
import { useApiStore } from '~/store/api'
const apiStore = useApiStore()
const route = useRoute()

definePageMeta({
  middleware: 'auth'
})
const data = reactive({
  year: route.params.year || null,
  currentPage: 1
})
onMounted(async () => { await apiStore.getInvoicesByYear(data.year) })

const invoices = computed(() => apiStore.invoices)

// watch(() => data.currentPage, (value) => {
//   if (value) { apiStore.paginate(value, data.id) }
// })
</script>
<template>
  <div class="body_layout">
    <div class="relative flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full">
      <div class="bg-primary text-white text-center rounded-lg p-2">
        <p class="text-xs">Инвойсы</p>
        <h2 class="text-lg font-bold">
          {{ data.year }}
        </h2>
      </div>
      <SearchBar placeholder="Поиск по инвойсам" api="invoices" />
      <InvoiceList :items="invoices" :loading="apiStore.loadingInvoices" />
      <div v-if="(apiStore.hasInvoices === 0)" class="text-center text-gray-500 py-4">
        Ивойсов пока нет
      </div>
    </div>
  </div>
</template>