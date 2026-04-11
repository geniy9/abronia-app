<script setup>
const { truncate, humanDate, expireDateStatus } = useConfig()
const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
</script>
<template>
  <NuxtLink :to="`/stock/${item?.documentId}`" 
    class="flex justify-between items-start cursor-pointer p-2 bg-gray-200 dark:bg-gray-900 rounded-lg">
    <div class="flex flex-col items-start text-gray-900 dark:text-white">
      <h3 class="font-bold">
        {{ truncate(item.name, 24) }}
      </h3>
      <span class="text-xs opacity-50">
        {{ item.sku }}
      </span>
    </div>
    <UBadge v-if="item.expireDate" :color="expireDateStatus(item.expireDate)" size="sm">
      {{ humanDate(item.expireDate) }}
    </UBadge>
  </NuxtLink>
</template>