<script setup>
import { useApiStore } from '~/store/api'
const apiStore = useApiStore()
const route = useRoute()

const data = reactive({
  id: route.params.id || null,
})

onMounted(async () => { await apiStore.getInvoice(data.id) })

const hasInvoice = computed(() => {
  return apiStore.loadingInvoices ? null : apiStore.getterInvoice ? 1 : 0;
})
</script>
<template>
  <div class="body_layout">
    <div class="flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full">

      <div v-if="apiStore.loadingInvoices" class="grid grid-cols-1 gap-4">
        <USkeleton class="w-full h-15" />
        <div class="w-full flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-4">
            <USkeleton v-for="i in 12" class="h-4" />
          </div>
        </div>
      </div>
      <Invoice v-else-if="apiStore.getterInvoice" :item="apiStore.getterInvoice" />
      <div v-else-if="hasInvoice === 0" class="text-center text-gray-500 py-4">
        Ивойса нет
      </div>

    </div>
  </div>
</template>