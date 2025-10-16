<script setup>
const user = useStrapiUser()
const { find } = useStrapi()
const router = useRouter()

const orders = ref([])
const loadingOrders = ref(true)
const orderColumns = [
  { accessorKey: 'productName', header: 'Продукция' },
  { accessorKey: 'quantity', header: () => h('div', { class: 'text-right' }, 'Кол-во') },
  // { 
  //   accessorKey: 'price', 
  //   header: () => h('div', { class: 'text-right' }, 'Подытог'), 
  // }
]

const fetchOrders = async () => {
  if (!user.value) return
  loadingOrders.value = true
  try {
    const response = await find('orders', {
      filters: {
        user: { id: { $eq: user.value.id } }
      },
      sort: 'createdAt:desc',
    })
    orders.value = response.data
  } catch (error) {
    console.error("Failed to fetch orders:", error)
  } finally {
    loadingOrders.value = false
  }
}

onMounted(() => {
  if (!user.value) {
    router.push('/app/auth/login')
  } else {
    fetchOrders()
  }
});
</script>
<template>
  <div class="flex flex-col gap-8">
    <div class="space-y-4">
      <h2 class="text-2xl font-bold">История заказов</h2>

      <div v-if="loadingOrders" class="space-y-3">
        <USkeleton class="h-8 w-full" />
        <USkeleton class="h-8 w-full" />
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-8">
        <p class="text-gray-500">Заказов пока нет</p>
      </div>

      <UAccordion v-else :items="orders" multiple>
        <template #default="{ item, index, open }">
          <UButton color="gray" variant="ghost" :ui="{ padding: { sm: 'p-4' } }">
            <template #leading>
              <div class="flex flex-col sm:flex-row sm:items-center text-left gap-2 sm:gap-4 w-full">
                <span class="font-bold">Order #{{ item.id }}</span>
                <span class="text-xs text-gray-500">
                  {{ new Date(item.createdAt).toLocaleDateString() }}
                </span>
                <UBadge :label="item.order_status" color="success" variant="subtle" size="xs" />
              </div>
            </template>
            
            <!-- <template #trailing>
              <div class="flex items-center gap-4">
                <span class="font-medium">Total amount</span>
              </div>
            </template> -->
          </UButton>
        </template>
        
        <template #body="{ item }">
          <div class="p-4 bg-gray-200/50 rounded-md">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4 text-gray-700">
              <div>
                <span class="font-medium">{{ 'phone_number' }}: </span> 
                {{ item.customer_phone }}
              </div>
              <div>
                <span class="font-medium">Email: </span> 
                {{ item.customer_email }}
              </div>
            </div>
            <UTable v-if="item.order_items" 
              :data="item.order_items" 
              :columns="orderColumns" 
              class="flex-1" 
              :ui="{ th: 'px-2 py-1 text-gray-700', td: 'px-2 py-1 text-sm' }">
              <template #productName-cell="{ row }">
                <span class="text-xs">{{ row.original.productName }}</span>
              </template>
              <template #quantity-cell="{ row }">
                <span class="text-xs font-bold flex justify-end">
                  {{ row.original.quantity }}
                </span>
              </template>
              <!-- <template #quantity-cell="{ row }">
                <span class="text-xs">{{ row.original.quantity }} x ${{ row.original.price }}</span>
              </template>
              <template #price-cell="{ row }">
                <span class="text-xs font-bold flex justify-end">
                  ${{ (row.original.price * row.original.quantity).toFixed(2) }}
                </span>
              </template> -->
            </UTable>
          </div>
        </template>
      </UAccordion>
    </div>
  </div>
</template>