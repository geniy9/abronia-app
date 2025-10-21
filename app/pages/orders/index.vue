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
    <div class="body_content">
      <NuxtLink to="/orders" class="body_head">
        <img src="/img/order.png" alt="Склад" />
      </NuxtLink>
      <h2 class="main_title">Заказы</h2>
      <SearchBar placeholder="Поиск по заказам" api="orders" />

      <UButton color="primary" block icon="hugeicons:shopping-basket-add-03">
        Создать новый заказ
      </UButton>

      <OrderList :items="orders" :loading="apiStore.loadingOrders" />
    </div>
  </div>
</template>