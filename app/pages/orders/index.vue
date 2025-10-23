<script setup>
import { useApiStore } from '~/store/api'
const apiStore = useApiStore()
const route = useRoute()

definePageMeta({
  middleware: 'auth'
})

onMounted(async () => { await apiStore.getOrders() })

const orders = computed(() => apiStore.orders)
const isAdd = computed(() => route.hash === '#add')
</script>
<template>
  <div class="body_layout">
    <div class="body_content">
      <NuxtLink to="/orders" class="body_head">
        <img src="/img/order.png" alt="Склад" />
      </NuxtLink>
      <h2 class="main_title">Заказы</h2>

      <OrderAdd v-if="isAdd" />
      <div v-else class="flex flex-col gap-4">
        <SearchBar placeholder="Поиск по заказам" api="orders" />
        <UButton to="/orders#add" color="primary" block icon="hugeicons:shopping-basket-add-03">
          Создать новый заказ
        </UButton>
        <OrderList :items="orders" :loading="apiStore.loadingOrders" />
      </div>
      
    </div>
  </div>
</template>