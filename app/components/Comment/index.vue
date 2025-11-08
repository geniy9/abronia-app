<script setup>
const { humanDateTime } = useConfig()
const route = useRoute()
const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
const message = ref(props.item?.message)

function onEdited(obj) { 
  message.value = obj.message
}
const isEdit = computed(() => route.hash === '#edit')
</script>
<template>
  <div class="grid gap-2 w-full">

    <div class="grid grid-cols-[auto_1fr_auto] items-center gap-2 bg-primary text-white rounded-lg p-2">
      <NuxtLink to="/comments" class="text-2xl leading-0 p-2">
        <UIcon name="hugeicons:link-backward" />
      </NuxtLink>
      <div class="text-center">
        <p class="text-xs">Заметка</p>
        <h2 class="font-bold">
          {{ humanDateTime(item.createdAt) }}
        </h2>
      </div>
      <NuxtLink :to="isEdit ? route.path : `${route.path}#edit`" class="text-2xl leading-0 p-2">
        <UIcon :name="isEdit ? 'hugeicons:cancel-square' : 'hugeicons:settings-01'" class="text-2xl" />
      </NuxtLink>
    </div>
    
    <CommentEdit 
      v-if="isEdit" 
      :id="item.documentId" 
      :message="message" 
      @onEdited="onEdited" />
    <div v-else class="grid gap-1">
      <div class="flex flex-col items-stretch bg-gray-200 dark:bg-gray-900 rounded-lg p-4 gap-4">
        <div class="text-gray-900 dark:text-white">
          <span class="flex items-center gap-1 text-xs opacity-60 mb-2">
            <UIcon name="hugeicons:checkmark-circle-04" class="text-sm" />
            <span>{{ humanDateTime(item.updatedAt) }}</span>
          </span>
          <span>{{ message }}</span>
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
          <UButton :to="`/invoices/${item.invoice.documentId}`" color="neutral" variant="soft" icon="hugeicons:link-square-02" size="sm" trailing>
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