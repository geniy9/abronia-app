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

      <div class="grid grid-cols-[auto_1fr_auto] items-center dark:text-white text-black">
        <NuxtLink to="/home" class="text-2xl leading-0 px-2 py-4">
          <UIcon name="hugeicons:link-backward" />
        </NuxtLink>
        <div>
          <NuxtLink to="/customers" class="body_head">
            <img src="/img/customer.png" alt="Склад" />
          </NuxtLink>
          <h2 class="main_title">База клиентов</h2>
        </div>
        <NuxtLink to="/customers#add" class="text-2xl leading-0 px-2 py-4">
          <UIcon name="hugeicons:user-add-02" class="text-2xl" />
        </NuxtLink>
      </div>

      <CustomerAdd v-if="isAdd" />
      <div v-else class="flex flex-col gap-4">
        <SearchBar placeholder="Поиск по клиентам" api="customers" />
        <CustomerList :items="apiStore.customers" :loading="apiStore.loadingCustomers" />
      </div>

    </div>
  </div>
</template>