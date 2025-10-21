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
  <div class="body_layout">
    <div class="body_content">
      <NuxtLink to="/invoices" class="body_head">
        <img src="/img/invoice.png" alt="Склад" />
      </NuxtLink>
      <h2 class="main_title">Инвойсы</h2>
      <SearchBar placeholder="Поиск по инвойсам" api="invoices" />

      <UButton color="primary" block icon="hugeicons:add-invoice">
        Создать новый инвойс
      </UButton>

      <InvoiceByYears :items="yearsForSelect" :loading="apiStore.loadingInvoices" />
    </div>
  </div>
</template>