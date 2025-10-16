<script setup>
const { humanDateTime } = useConfig()
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
      <div class="flex items-center justify-start gap-2 w-full">
        <USkeleton class="w-14 h-4" />
        <USkeleton class="w-12 h-4" />
        <USkeleton class="w-10 h-4" />
      </div>
    </div>
    <div v-else class="flex flex-col gap-4 pb-2">
      <div v-for="(item, i) in items" :key="i" :item="item" class="flex flex-col gap-2 w-full bg-gray-200 dark:bg-gray-900 rounded-lg p-2 text-gray-900 dark:text-white">
        <span class="text-xs opacity-60">
          {{ humanDateTime(item.createdAt) }}
        </span>
        <span class="text-sm font-bold">
          {{ item.message }}
        </span>
      </div>
    </div>

  </div>
</template>