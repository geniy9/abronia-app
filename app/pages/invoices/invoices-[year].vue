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
const isAdd = computed(() => route.hash === '#add')

// watch(() => data.currentPage, (value) => {
//   if (value) { apiStore.paginate(value, data.id) }
// })
</script>
<template>
  <div class="body_layout">
    <div class="relative flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full">

      <div class="grid grid-cols-[auto_1fr_auto] items-center gap-2 bg-primary text-white rounded-lg p-2">
        <NuxtLink to="/invoices" class="text-2xl leading-0 p-2">
          <UIcon name="hugeicons:link-backward" />
        </NuxtLink>
        <div class="text-center">
          <p class="text-xs">Инвойсы</p>
          <h2 class="text-lg font-bold">
            {{ data.year }}
          </h2>
        </div>
        <NuxtLink :to="isAdd ? '/invoices' : '/invoices#add'" class="text-2xl leading-0 p-2">
          <UIcon :name="isAdd ? 'hugeicons:cancel-square' : 'hugeicons:add-invoice'" class="text-2xl" />
        </NuxtLink>
      </div>

      <InvoiceAdd v-if="isAdd" />
      <div v-else class="flex flex-col gap-4">
        <SearchBar placeholder="Поиск по инвойсам" api="invoices" />
        <InvoiceList :items="invoices" :loading="apiStore.loadingInvoices" />
        <div v-if="(apiStore.hasInvoices === 0)" class="text-center text-gray-500 py-4">
          Ивойсов пока нет
        </div>
      </div>

      
    </div>
  </div>
</template>