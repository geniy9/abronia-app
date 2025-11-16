<script setup>
const { truncate } = useConfig()
const emit = defineEmits(['on-removed-category'])
const props = defineProps({
  items: {
    type: Array,
    default: []
  },
  loading: {
    type: Boolean,
    default: false
  },
  isEdit: {
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
    <div v-else class="grid gap-2">
      <div v-for="(item, i) in items" :key="i" class="flex items-center gap-2">
        <NuxtLink :to="`/stock/category-${item.documentId}`" 
          class="flex-1 bg-gray-200 dark:bg-gray-900 rounded-lg p-2">
          <div class="flex items-center justify-between w-full">
            <div class="flex flex-col text-gray-900 dark:text-white">
              <h3 class="font-bold">
                {{ item.name }}
              </h3>
              <span v-if="item.description" class="text-sm opacity-50">
                {{ truncate(item.description, 50) }}
              </span>
            </div>
            <div class="flex items-center justify-center bg-white dark:bg-gray-950 rounded-lg w-10 h-10">
              <UIcon name="hugeicons:arrow-right-02" class="w-6 h-6 text-primary" />
            </div>
          </div>
        </NuxtLink>
        <RemoveEntry v-if="isEdit"
          :id="item.documentId" api="categories" 
          :entry-name="`категория ${item.name}`" 
          @on-removed="emit('on-removed-category')" />
      </div>
    </div>
    
  </div>
</template>