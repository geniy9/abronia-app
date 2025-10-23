<script setup>
const { truncate } = useConfig()
const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
</script>
<template>
  <NuxtLink :to="`/stock/${item?.category?.documentId}/${item?.documentId}`" 
    class="grid justify-center cursor-pointer p-2 bg-gray-200 dark:bg-gray-900 rounded-lg">
    <h3 class="font-bold text-gray-900 dark:text-white">
      {{ truncate(item.name, 20) }}
    </h3>
  </NuxtLink>
</template>