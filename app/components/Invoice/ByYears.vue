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
  <div class="grid gap-2">
    <div v-if="loading" v-for="i in 5" class="flex items-center justify-between border border-gray-300 rounded-xl p-2">
      <USkeleton class="w-24 h-4" />
      <USkeleton class="w-9 h-9" />
    </div>
    <NuxtLink v-else v-for="(item, i) in items" :key="i" :to="`/invoices/${item}`" 
      class="bg-gray-200 dark:bg-gray-900 rounded-lg p-2">
      <div class="flex items-center justify-between w-full">
        <h3 class="font-bold text-gray-900 dark:text-white px-2">
          {{ item }} год
        </h3>
        <div class="flex items-center justify-center bg-white dark:bg-gray-950 rounded-lg w-10 h-10">
          <UIcon name="hugeicons:arrow-right-02" class="w-6 h-6 text-primary" />
        </div>
      </div>
    </NuxtLink>
  </div>
</template>