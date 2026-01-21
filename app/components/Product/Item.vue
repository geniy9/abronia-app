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
    class="flex justify-between items-center cursor-pointer p-2 bg-gray-200 dark:bg-gray-900 rounded-lg">
    <h3 class="font-bold text-gray-900 dark:text-white">
      {{ truncate(item.name, 30) }}
    </h3>
    <UBadge v-if="item.expireDate" :color="expireDateStatus(item.expireDate)" size="sm">
      {{ humanDate(item.expireDate) }}
    </UBadge>
  </NuxtLink>
</template>