<script setup>
const { humanDateTime, truncate } = useConfig()
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
    <div v-if="loading" class="grid gap-2">
      <div v-for="i in 5" class="grid gap-2 border border-gray-300 rounded-xl p-2">
        <USkeleton v-for="i in 3" class="h-2" :class="[i === 1 ? 'w-1/3' : 'w-full']" />
      </div>
    </div>
    <div v-else class="flex flex-col gap-2 pb-2">
      <NuxtLink :to="`/comments/${item.documentId}`" v-for="(item, i) in items" :key="i" class="flex flex-col gap-2 w-full bg-gray-200 dark:bg-gray-900 rounded-lg p-4 text-gray-900 dark:text-white">
        <span class="flex items-center justify-between text-xs opacity-60">
          <span>{{ humanDateTime(item.createdAt) }}</span>
          <UIcon name="hugeicons:link-square-02" />
        </span>
        <span class="text-sm font-bold">
          {{ truncate(item.message, 100) }}
        </span>
      </NuxtLink>
    </div>

  </div>
</template>