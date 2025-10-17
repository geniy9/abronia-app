<script setup>
import { useApiStore } from '~/store/api'
const apiStore = useApiStore()

definePageMeta({
  middleware: 'auth'
})

onMounted(async () => { await apiStore.getOrders() })

const orders = computed(() => apiStore.orders)
</script>
<template>
  <div class="body_layout">
    <div class="relative flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full mt-9 pt-9">
      <img src="/img/order.png" alt="Заказы" class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-15 h-15 p-1 rounded-full bg-gray-200 dark:bg-gray-500" />
      <h2 class="text-center text-lg font-bold text-black dark:text-white">
        Заказы
      </h2>
      <SearchBar placeholder="Поиск по заказам" api="orders" />

      <UButton color="primary" block trailing icon="hugeicons:plus-sign-circle">
        Создать новый заказ
      </UButton>

      <OrderList :items="orders" :loading="apiStore.loadingOrders" />
    </div>
  </div>
</template>