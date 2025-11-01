<script setup>
const { humanDate, statusInvoice, invoiceYear }= useConfig()
const props = defineProps({
  item: {
    type: [Object, Date],
    default: null
  }
})
const statusObject = computed(() => statusInvoice(props.item.invoiceStatus))
</script>
<template>
  <NuxtLink :to="`/invoices/${invoiceYear(item?.createdAt)}/${item.documentId}`" class="flex justify-between items-center cursor-pointer w-full text-sm bg-gray-200 dark:bg-gray-900 rounded-lg p-2">
    <div class="flex flex-col gap-1 text-gray-900 dark:text-white">
      <div class="opacity-50">
        <span class="px-0.5">#</span>
        <span>{{ item.invoiceNumber }}</span>
      </div>
    </div>
    <UBadge :color="statusObject?.color" size="sm" class="rounded-full">
      {{ statusObject?.name }}
    </UBadge>
    <div class="flex flex-col items-end gap-1 text-gray-900 dark:text-white">
      <div class="px-0.5 opacity-50">{{ humanDate(item.createdAt) }}</div>
      <div class="flex items-center gap-2">
        <span v-if="item.paidAmount" class="opacity-50">{{ item.paidAmount }} $</span>
        <span class="font-bold">{{ item.totalAmount }} $</span>
      </div>
    </div>
  </NuxtLink>
</template>