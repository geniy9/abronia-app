<script setup>
const { statusOrder } = useConfig()
const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
const statusObject = computed(() => statusOrder(props.item.orderStatus))
</script>
<template>
  <NuxtLink :to="`/orders/${item.documentId}`" class="flex justify-between gap-2 items-center cursor-pointer w-full text-sm bg-gray-200 dark:bg-gray-900 rounded-lg p-2">
    <h3 class="flex flex-1 flex-col gap-0.5 text-gray-900 dark:text-white px-2">
      <div class="flex items-center gap-2">
        <span class="text-xs opacity-80">Заказ</span>
        <span class="text-xs">{{ item.orderNumber }}</span>
      </div>
      <span class="font-bold">{{ item.customer?.name }}</span>
    </h3>
    <UBadge :color="statusObject?.color" size="sm" class="rounded-full">
      {{ statusObject?.name }}
    </UBadge>
    <div class="flex items-center justify-center bg-white dark:bg-gray-950 rounded-lg w-10 h-10">
      <UIcon name="hugeicons:arrow-right-02" class="w-6 h-6 text-primary" />
    </div>
  </NuxtLink>
</template>