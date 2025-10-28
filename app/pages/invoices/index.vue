<script setup>
import { useApiStore } from '~/store/api'
const apiStore = useApiStore()
const route = useRoute()

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
          <NuxtLink to="/invoices" class="body_head">
            <img src="/img/invoice.png" alt="Склад" />
          </NuxtLink>
          <h2 class="main_title">Инвойсы</h2>
        </div>
        <NuxtLink :to="isAdd ? '/invoices' : '/invoices#add'" class="text-2xl leading-0 p-2">
          <UIcon :name="isAdd ? 'hugeicons:cancel-square' : 'hugeicons:add-invoice'" class="text-2xl" />
        </NuxtLink>
      </div>

      <InvoiceAdd v-if="isAdd" />
      <div v-else class="flex flex-col gap-4">
        <SearchBar placeholder="Поиск по инвойсам" api="invoices" />
        <InvoiceByYears :items="yearsForSelect" :loading="apiStore.loadingInvoices" />
      </div>

    </div>
  </div>
</template>