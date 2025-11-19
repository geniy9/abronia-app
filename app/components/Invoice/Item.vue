<script setup>
const { humanDate, statusInvoice }= useConfig()
const props = defineProps({
  item: {
    type: [Object, Date],
    default: null
  }
})
const statusObject = computed(() => statusInvoice(props.item.invoiceStatus))
</script>
<template>
  <NuxtLink :to="`/invoices/${item.documentId}`" 
    class="grid grid-cols-[auto_auto_1fr] items-start gap-4 cursor-pointer w-full text-sm bg-gray-200 dark:bg-gray-900 rounded-lg p-2">
    <div class="flex flex-col gap-1 text-gray-900 dark:text-white">
      <div class="opacity-80">
        <span>#</span>
        <span>{{ item.invoiceNumber }}</span>
      </div>
      <div v-if="item.attachments" class="flex items-center gap-0.5">
        <UIcon v-if="item.attachments" name="hugeicons:file-attachment" class="w-5 h-5" />
        <span>{{ item.attachments.length }}</span>
      </div>
    </div>
    <div class="flex items-center">
      <UBadge :color="statusObject?.color" size="sm" class="rounded-full">
        {{ statusObject?.name }}
      </UBadge>
    </div>
    <div class="flex flex-col items-end gap-1 text-gray-900 dark:text-white">
      <div class="px-0.5 opacity-80">{{ humanDate(item.createdAt) }}</div>
      <div class="flex items-center gap-2">
        <span v-if="item.paidAmount" class="opacity-50">{{ item.paidAmount }} $</span>
        <span class="font-bold">{{ item.totalAmount }} $</span>
      </div>
    </div>
  </NuxtLink>
</template>