<script setup>
const { truncate } = useConfig()
const router = useRouter()

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const inStock = ref(props.item?.quantityInStock)

const isSamples = computed(() => props.item?.category.slug === 'samples')

function goProduct() {
  if (isSamples.value) {
    return
  } else {
    router.push(`/stock/${props.item?.category?.documentId}/${props.item?.documentId}`)
  }
}
</script>
<template>
  <div @click="goProduct" class="flex items-center w-full p-2" 
    :class="isSamples ? 'justify-between' : 'justify-center cursor-pointer'">
    <h3 class="font-bold text-gray-900 dark:text-white px-2">
      {{ truncate(item.name, 20) }}
    </h3>
    <div v-if="isSamples" class="flex items-center justify-center">
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