<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <div class="grid grid-cols-1 gap-2 w-full">
    <div v-if="loading" v-for="i in 5" 
      class="flex flex-col items-center gap-6 border border-gray-300 rounded-xl w-full p-2">
      <div class="flex items-center justify-between gap-2 w-full">
        <USkeleton class="w-32 h-4" />
        <USkeleton class="w-10 h-10" />
      </div>
    </div>
    <NuxtLink v-else v-for="(item, i) in items" :key="i" 
      :to="`/stock/${item.documentId}`" 
      class="bg-gray-200 dark:bg-gray-900 rounded-lg p-2">
      <div class="flex items-center justify-between w-full">
        <h3 class="font-bold text-gray-900 dark:text-white px-2">
          {{ item.name }}
        </h3>
        <div class="flex items-center justify-center bg-white dark:bg-gray-950 rounded-lg w-10 h-10">
          <UIcon name="hugeicons:arrow-right-double" class="w-6 h-6 text-primary" />
        </div>
      </div>
    </NuxtLink>
  </div>
</template>