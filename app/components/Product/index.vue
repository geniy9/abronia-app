<script setup>
import { useCartStore } from '@/store/cart'

const cartStore = useCartStore()
const { copyBoofer, unitMeasurement } = useConfig()

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

// const quantity = ref(1)
// const totalPrice = computed(() => {
//   return quantity.value * props.item?.price
// })
// const handleAddToCart = () => {
//   if (props.item) {
//     cartStore.addItem(props.item, quantity.value);
//   }
// }
</script>
<template>
  <div class="flex flex-col w-full gap-4">

    <div class="bg-primary text-white text-center rounded-lg p-2">
      <p class="text-xs">{{ item.category.name }}</p>
      <h2 class="text-lg font-bold">
        {{ item.name }}
      </h2>
    </div>

    <div class="flex flex-col gap-2 px-2 pb-2">

      <div v-if="item.sku" class="flex items-center justify-between gap-2">
        <span class="text-gray-900 dark:text-white">
          Артикул
        </span>
        <span @click="copyBoofer(item.sku)" 
          class="text-gray-900 dark:text-white text-sm font-medium">
          {{ item.sku }}
        </span>
      </div>
      <div v-if="item.quantityInStock" class="flex justify-between gap-2">
        <span class="text-gray-900 dark:text-white">
          Количество
        </span>
        <span class="text-gray-900 dark:text-white text-sm font-medium">
          {{ item.quantityInStock + unitMeasurement(item.unit) }}
        </span>
      </div>
      <div v-if="item.comment" class="flex flex-col justify-between gap-1">
        <span class="text-gray-900 dark:text-white">
          Комментарий
        </span>
        <span v-html="item.comment.message" class="text-sm p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400"></span>
      </div>
    </div>

  </div>
</template>