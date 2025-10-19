<script setup>
// const { menuMain } = useMenu()

const router = useRouter()
const route = useRoute()
const hideFooter = computed(() => {
  const routeMeta = route.meta
  return routeMeta.hideFooter || false
})

function backStep() {
  if (route.path === '/home') {
    return 
  } else {
    router.go(-1)
  }
}

const items = ref([
  [
    {
      label: 'Добавить клиента',
      icon: 'hugeicons:user-add-01',
      to: '/customers#new'
    }
  ],
  [
    {
      label: 'Новый товар',
      icon: 'hugeicons:shopping-basket-add-03',
      to: '/stock#new'
    },
    {
      label: 'Создать заказ',
      icon: 'hugeicons:store-add-01',
      to: '/orders#new'
    },
    {
      label: 'Создать инвойс',
      icon: 'hugeicons:add-invoice',
      to: '/invoices#new'
    },
  ],
  [
    {
      label: 'Добавить заметку',
      icon: 'hugeicons:comment-add-01',
      to: '/comments#new'
    }
  ]
])
</script>
<template>
  <footer class="fixed bottom-0 w-full bg-primary rounded-t-2xl p-2 transition-all duration-300" 
    :class="[hideFooter ? 'rounded-t-none translate-y-full' : 'rounded-t-2xl translate-y-0']">
    <div class="section grid grid-cols-3 items-center text-white gap-4">

      <UIcon name="hugeicons:link-backward" 
        @click="backStep" 
        class="text-3xl cursor-pointer" />

      <NuxtLink to="/home" class="flex items-center justify-center">
        <UIcon name="hugeicons:dashboard-square-01" class="text-3xl" />
      </NuxtLink>

      <div class="flex justify-end">
        <UDropdownMenu :items="items">
          <UIcon name="hugeicons:add-01" class="text-3xl" />
        </UDropdownMenu>
        
        <!-- <ul class="flex flex-col items-center xs:items-start">
          <li v-for="(m, i) in menuMain" :key="i">
            <NuxtLink :to="m.to" class="block text-xs font-medium select-none space-y-1 rounded-md py-3 leading-none no-underline outline-none uppercase">
              {{ `nav.${m.name}` }}
            </NuxtLink>
          </li>
        </ul> -->
      </div>

    </div>
  </footer>
</template>