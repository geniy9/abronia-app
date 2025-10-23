<script setup>
const { humanDateTime } = useConfig()
const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
const invoiceYear = (item) => {
  return new Date(item).getFullYear()
}
</script>
<template>
  <div class="grid gap-2 w-full">

    <div class="bg-primary text-white text-center rounded-lg w-full p-2">
      <p class="text-xs">Заметка</p>
      <h2 class="text-lg font-bold cursor-pointer">
        {{ humanDateTime(item.createdAt) }}
      </h2>
    </div>
    
    <div class="grid gap-1">
      <div class="flex flex-col items-stretch bg-gray-200 dark:bg-gray-900 rounded-lg p-2 gap-4">
        <div class="text-sm font-bold text-gray-900 dark:text-white">
          {{ item.message }}
        </div>
        
        <UFieldGroup v-if="item.product" class="self-end">
          <UBadge color="primary" variant="soft" label="Продукт" />
          <UButton :to="`/stock/${item.product.category?.documentId}/${item.product.documentId}`" color="primary" variant="soft" icon="hugeicons:link-circle-02" trailing>
            {{ item.product.name }}
          </UButton>
        </UFieldGroup>

        <UFieldGroup v-if="item.order" class="self-end">
          <UBadge color="primary" variant="soft" label="Номер заказа" />
          <UButton :to="`/orders/${item.order.documentId}`" color="primary" variant="soft" icon="hugeicons:link-circle-02" trailing>
            {{ item.order.orderNumber }}
          </UButton>
        </UFieldGroup>

        <UFieldGroup v-if="item.invoice" class="self-end">
          <UBadge color="primary" variant="soft" label="Номер инвойса" />
          <UButton :to="`/invoices/${invoiceYear(item.invoice.createdAt)}/${item.invoice.documentId}`" color="primary" variant="soft" icon="hugeicons:link-circle-02" trailing>
            {{ item.invoice.invoiceNumber }}
          </UButton>
        </UFieldGroup>

        <UFieldGroup v-if="item.customer" class="self-end">
          <UBadge color="primary" variant="soft" label="Клиент" />
          <UButton :to="`/customers/${item.customer.documentId}`" color="primary" variant="soft" icon="hugeicons:link-circle-02" trailing>
            {{ item.customer.name }}
          </UButton>
        </UFieldGroup>
      </div>
    </div>

  </div>
</template>