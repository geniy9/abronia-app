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
        <USkeleton class="w-12 h-4" />
        <USkeleton class="w-32 h-4" />
      </div>
    </div>
    <InvoiceItem v-else v-for="(item, i) in items" :key="i" :item="item" />
  </div>
</template>