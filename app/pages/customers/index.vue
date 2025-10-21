<script setup>
import { useApiStore } from '~/store/api'
const apiStore = useApiStore()
const route = useRoute()

definePageMeta({
  middleware: 'auth'
})
onMounted(async () => { await apiStore.getCustomers() })

const isAdd = computed(() => route.hash === '#add')
</script>
<template>
  <div class="body_layout">
    <div class="body_content">
      <NuxtLink to="/customers" class="body_head">
        <img src="/img/customer.png" alt="Склад" />
      </NuxtLink>
      <h2 class="main_title">База клиентов</h2>

      <CustomerAdd v-if="isAdd" />
      <div v-else class="flex flex-col gap-4">
        <SearchBar placeholder="Поиск по клиентам" api="customers" />
        <UButton to="/customers#add" color="primary" block icon="hugeicons:user-add-02">
          Добавить нового клиента
        </UButton>
        <CustomerList :items="apiStore.customers" :loading="apiStore.loadingCustomers" />
      </div>

    </div>
  </div>
</template>