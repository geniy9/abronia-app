<script setup>
import { useCartStore } from '@/store/cart'

const cartStore = useCartStore()
const isOpen = ref(false)

async function addToOrder() {
  isOpen.value = false
}
</script>
<template>
  <USlideover 
    title="Корзина" 
    v-model:open="isOpen" 
    close-icon="material-symbols:close-rounded" 
    class="text-gray-200">
    <UChip :text="cartStore.totalItems" :show="cartStore.totalItems > 0" color="neutral" size="3xl">
      <UButton 
        icon="material-symbols:shopping-cart-rounded" 
        :label="'' + cartStore.totalItems"
        color="neutral" variant="subtle"
        aria-label="Корзина" 
        class="text-white" 
        size="sm"
      />
    </UChip>

    <template #body>
      <div class="flex-1 overflow-y-auto">
        <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-full text-center">
          <UIcon name="material-symbols:shopping-cart-outline-rounded" class="text-8xl text-gray-300 mb-4" />
          <p class="font-medium">Товары не выбраны</p>
        </div>

        <ul v-else role="list" class="divide-y divide-gray-200">
          <li v-for="item in cartStore.items" :key="item.id" class="flex gap-2 py-4">

            <div class="flex flex-1 flex-col">
              <div>
                <div class="flex justify-between font-medium text-sm text-white">
                  <h3 class="text-lg">{{ item.name }}</h3>
                </div>
                <p class="text-gray-300">{{ item.sku }}</p>
              </div>
              <div class="flex flex-1 items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-gray-400 uppercase text-xs">Количество</span>
                  <UInputNumber 
                    :model-value="item.quantity" 
                    @update:model-value="val => cartStore.updateQuantity(item.id, val)" 
                    :min="1" 
                    :ui="{ base: 'rounded-none bg-primary text-white text-sm leading-3 font-bold' }"
                    :increment="{ 
                      icon: 'material-symbols:add', 
                      size: 'sm', 
                      class: 'bg-secondary p-0'
                      }"
                    :decrement="{ 
                      icon: 'material-symbols:remove', 
                      size: 'sm', 
                      class: 'bg-secondary p-0'
                      }" 
                    variant="none" 
                    size="xs" />
                </div>
                <UButton type="button" variant="link" color="error" 
                  @click="cartStore.removeItem(item.id)">
                  Удалить
                </UButton>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>

    <template #footer v-if="cartStore.items.length > 0">
      <div class="w-full px-4 sm:px-6">
        <UButton 
          label="Добавить в заказ"
          @click="addToOrder" 
          color="primary"
          block 
          size="lg" class="mt-4" />
      </div>
    </template>
  </USlideover>
</template>