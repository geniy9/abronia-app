<script setup>
const { truncate } = useConfig()
const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const inStock = ref(props.item?.parLevel)
</script>
<template>
  <div class="flex items-center justify-between w-full p-2">
    <h3 class="font-bold text-gray-900 dark:text-white px-2">
      {{ truncate(item.name, 20) }}
    </h3>
    <div class="flex items-center justify-center">
      <UInputNumber 
        v-model="inStock" 
        :min="0" 
        :step="1" 
        :ui="{ base: 'bg-white dark:bg-gray-950 text-black dark:text-white text-sm leading-3 font-bold' }"
        :increment="{ icon: 'hugeicons:plus-sign-circle', size: 'md', class: 'p-0' }"
        :decrement="{ icon: 'hugeicons:minus-sign-circle', size: 'md', class: 'p-0' }" 
        variant="none" 
        class="w-28" 
        size="sm" />
    </div>
  </div>
</template>