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
    class="flex items-center justify-center cursor-pointer w-full p-2">
    <h3 class="font-bold text-gray-900 dark:text-white px-2">
      {{ truncate(item.name, 20) }}
    </h3>
  </NuxtLink>
</template>