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
  <div class="grid gap-2">
    <div v-if="loading" class="grid gap-4">
      <div v-for="i in 3" class="grid gap-4 border border-gray-300 rounded-xl p-4">
        <USkeleton v-for="i in 3" class="h-2" />
      </div>
    </div>
    <div v-else class="flex flex-col gap-4 pb-2">
      <NuxtLink :to="`/comments/${item.documentId}`" v-for="(item, i) in items" :key="i" class="flex flex-col gap-2 w-full bg-gray-200 dark:bg-gray-900 rounded-lg p-2 text-gray-900 dark:text-white">
        <span class="text-xs opacity-60">
          {{ humanDateTime(item.createdAt) }}
        </span>
        <span class="text-sm font-bold">
          {{ item.message }}
        </span>
      </NuxtLink>
    </div>

  </div>
</template>