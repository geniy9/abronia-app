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
    <div v-if="loading" class="grid gap-2">
      <div v-for="i in 5" class="flex items-center justify-between border border-gray-300 rounded-xl p-2">
        <USkeleton class="w-24 h-4" />
        <USkeleton class="w-8 h-8" />
      </div>
    </div>
    <CustomerItem v-else v-for="(item, i) in items" :key="i" :item="item" />
  </div>
</template>