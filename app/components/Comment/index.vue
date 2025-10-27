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

    <div class="grid grid-cols-[auto_1fr_auto] items-center gap-2 bg-primary text-white rounded-lg p-2">
      <NuxtLink to="/comments" class="text-2xl leading-0 py-2">
        <UIcon name="hugeicons:link-backward" />
      </NuxtLink>
      <div class="text-center">
        <p class="text-xs">Заметка</p>
        <h2 class="text-lg font-bold cursor-pointer">
          {{ humanDateTime(item.createdAt) }}
        </h2>
      </div>
      <NuxtLink to="#" class="text-2xl leading-0 py-2">
        <UIcon name="hugeicons:settings-01" class="text-2xl" />
      </NuxtLink>
    </div>
    
    <div class="grid gap-1">
      <div class="flex flex-col items-stretch bg-gray-200 dark:bg-gray-900 rounded-lg p-2 gap-4">
        <div class="text-gray-900 dark:text-white">
          {{ item.message }}
        </div>
        
        <UFieldGroup v-if="item.product" class="self-end">
          <UBadge color="neutral" variant="soft" icon="hugeicons:package-03" />
          <UButton :to="`/stock/${item.product.category?.documentId}/${item.product.documentId}`" color="neutral" variant="soft" icon="hugeicons:link-square-02" size="sm" trailing>
            {{ item.product.name }}
          </UButton>
        </UFieldGroup>

        <UFieldGroup v-if="item.order" class="self-end">
          <UBadge color="neutral" variant="soft" icon="hugeicons:shopping-basket-03" />
          <UButton :to="`/orders/${item.order.documentId}`" color="neutral" variant="soft" icon="hugeicons:link-square-02" size="sm" trailing>
            {{ item.order.orderNumber }}
          </UButton>
        </UFieldGroup>

        <UFieldGroup v-if="item.invoice" class="self-end">
          <UBadge color="neutral" variant="soft" icon="hugeicons:invoice-01" />
          <UButton :to="`/invoices/${invoiceYear(item.invoice.createdAt)}/${item.invoice.documentId}`" color="neutral" variant="soft" icon="hugeicons:link-square-02" size="sm" trailing>
            {{ item.invoice.invoiceNumber }}
          </UButton>
        </UFieldGroup>

        <UFieldGroup v-if="item.customer" class="self-end">
          <UBadge color="neutral" variant="soft" icon="hugeicons:user-circle" />
          <UButton :to="`/customers/${item.customer.documentId}`" color="neutral" variant="soft" icon="hugeicons:link-square-02" size="sm" trailing>
            {{ item.customer.name }}
          </UButton>
        </UFieldGroup>
      </div>
    </div>

  </div>
</template>