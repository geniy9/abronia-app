<script setup>
const { humanDate, statusInvoice, colorStatusInvoice }= useConfig()
const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
const invoiceYear = new Date(props.item?.shipmentDate).getFullYear()
</script>
<template>
  <NuxtLink :to="`/invoices/${invoiceYear}/${item.documentId}`" class="flex justify-between items-center cursor-pointer w-full text-sm bg-gray-200 dark:bg-gray-900 rounded-lg p-2">
    <div class="text-gray-900 dark:text-white">
      {{ item.invoiceNumber }}
    </div>
    <UBadge :color="colorStatusInvoice(item.invoiceStatus)" size="xs" class="rounded-full">
      {{ statusInvoice(item.invoiceStatus) }}
    </UBadge>
    <div class="flex items-center justify-center text-gray-900 dark:text-white">
      {{ humanDate(item.shipmentDate) }}
    </div>
  </NuxtLink>
</template>