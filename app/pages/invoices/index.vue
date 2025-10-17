<script setup>
import { useApiStore } from '~/store/api'
const apiStore = useApiStore()

definePageMeta({
  middleware: 'auth'
})

onMounted(async () => { await apiStore.getInvoices() })

const yearsForSelect = computed(() => {
  const oldestDate = apiStore.invoices[0]?.shipmentDate
  const years = []
  if (oldestDate) {
    const yearFrom = new Date(oldestDate).getFullYear()
    const yearTo = new Date().getFullYear()
    for (let year = yearTo; year >= yearFrom; year--) {
      years.push(year)
    }
  }
  return years
})
</script>
<template>
  <div class="page_layout">
    <div class="relative flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full mt-9 pt-9">
      <img src="/img/invoice.png" alt="Инвойсы" class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-15 h-15 p-1 rounded-full bg-gray-200 dark:bg-gray-500" />
      <h2 class="text-center text-lg font-bold text-black dark:text-white">
        Инвойсы
      </h2>
      <SearchBar placeholder="Поиск по инвойсам" api="invoices" />

      <UButton color="primary" block trailing icon="hugeicons:plus-sign-circle">
        Создать новый инвойс
      </UButton>

      <InvoiceByYears :items="yearsForSelect" :loading="apiStore.loadingInvoices" />
    </div>
  </div>
</template>