<script setup>
import { useCartStore } from '@/store/cart'

const cartStore = useCartStore()
const { imageUrl } = useConfig()
const router = useRouter()

const isOpen = ref(false)

async function checkOut() {
  isOpen.value = false
  await nextTick()
  router.push('/checkout')
}
</script>
<template>
  <USlideover 
    title="Корзина" 
    v-model:open="isOpen" 
    close-icon="material-symbols:close-rounded" 
    class="text-gray-200">
    <UChip :text="cartStore.totalItems" :show="cartStore.totalItems > 0" color="neutral" size="3xl">
      <!-- <UButton 
        icon="material-symbols:shopping-cart-rounded" 
        :label="cartStore.totalItems > 0 ? '$' + cartStore.totalPrice : ''"
        color="primary" variant="subtle"
        aria-label="Корзина" 
        size="sm"
      /> -->
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
          <p class="font-medium">Корзина пуста</p>
        </div>

        <ul v-else role="list" class="divide-y divide-gray-200">
          <li v-for="item in cartStore.items" :key="item.id" class="flex gap-2 py-4">
            <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img v-if="item.image" :src="imageUrl + item.image" :alt="item.name" class="h-full w-full object-cover object-center">
              <div v-else class="h-full w-full bg-gray-100 flex items-center justify-center">
                <UIcon name="hugeicons:image-01" class="text-3xl text-gray-400" />
              </div>
            </div>

            <div class="flex flex-1 flex-col">
              <div>
                <div class="flex justify-between font-medium text-sm text-white">
                  <h3 class="text-lg">{{ item.name }}</h3>
                  <!-- <p class="ml-4">${{ (item.price * item.quantity).toFixed(2) }}</p> -->
                </div>
                <p class="text-gray-300">{{ item.sku }} {{ item.package }}</p>
              </div>
              <div class="flex flex-1 items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-gray-400 uppercase text-xs">{{ 'text.quantity' }}:</span>
                  <UInputNumber 
                    :model-value="item.quantity" 
                    @update:model-value="val => cartStore.updateQuantity(item.id, val)" 
                    :min="1" :max="50" 
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
        <div class="flex justify-between text-base font-medium text-gray-900">
          <p>Итого </p>
          <p>${{ cartStore.totalPrice }}</p>
        </div>
        <UButton 
          label="Оформить"
          @click="checkOut" 
          color="primary"
          block 
          size="lg" class="mt-4" />
        <div class="mt-4 gap-1 flex flex-col items-center justify-center text-center text-sm text-gray-300">
          <p>или</p>
          <UButton 
            label="Продолжить собирать корзину"
            variant="link" 
            @click="isOpen = false" 
            class="text-white" />
        </div>
      </div>
    </template>
  </USlideover>
</template>