<script setup>
const { humanDate, statusInvoice }= useConfig()
const props = defineProps({
  item: {
    type: [Object, Date],
    default: null
  }
})
const statusObject = computed(() => statusInvoice(props.item.invoiceStatus))
const invoiceYear = new Date(props.item?.createdAt).getFullYear()
</script>
<template>
  <NuxtLink :to="`/invoices/${invoiceYear}/${item.documentId}`" class="flex justify-between items-center cursor-pointer w-full text-sm bg-gray-200 dark:bg-gray-900 rounded-lg p-2">
    <div class="text-gray-900 dark:text-white">
      <span class="opacity-50 px-0.5 font-bold">#</span>
      <span>{{ item.invoiceNumber }}</span>
    </div>
    <UBadge :color="statusObject?.color" size="sm" class="rounded-full">
      {{ statusObject?.name }}
    </UBadge>
    <div class="flex items-center justify-center text-gray-900 dark:text-white">
      {{ humanDate(item.createdAt) }}
    </div>
  </NuxtLink>
</template>