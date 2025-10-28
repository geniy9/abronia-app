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

      <div class="grid grid-cols-[auto_1fr_auto] items-center dark:text-white text-black">
        <NuxtLink to="/home" class="text-2xl leading-0 p-2">
          <UIcon name="hugeicons:link-backward" />
        </NuxtLink>
        <div>
          <NuxtLink to="/orders" class="body_head">
            <img src="/img/order.png" alt="Склад" />
          </NuxtLink>
          <h2 class="main_title">Заказы</h2>
        </div>
        <NuxtLink :to="isAdd ? '/orders' : '/orders#add'" class="text-2xl leading-0 p-2">
          <UIcon :name="isAdd ? 'hugeicons:cancel-square' : 'hugeicons:shopping-basket-add-03'" class="text-2xl" />
        </NuxtLink>
      </div>

      <OrderAdd v-if="isAdd" />
      <div v-else class="flex flex-col gap-4">
        <SearchBar placeholder="Поиск по заказам" api="orders" />
        <OrderList :items="orders" :loading="apiStore.loadingOrders" />
      </div>
      
    </div>
  </div>
</template>