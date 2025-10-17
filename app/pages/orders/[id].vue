<script setup>
const route = useRoute()

const order = ref(null)
const hasOrder = ref(null)
const data = reactive({
  id: route.params.id || null,
  loading: false,
})

async function getOrder() {
  try {
    data.loading = true
    const { findOne } = useStrapi()
    const res = await findOne('orders', data.id, {
      populate: { 
        customer: true,
        comment: true,
        productItems: {
          populate: {
            product: true
          } 
        } 
      }
    })
    if (res?.data) {
      order.value = res.data
      hasOrder.value = res.meta
    } else {
      hasOrder.value = 0
    }
  } catch (error) {
    console.log(error)
  } finally {
    data.loading = false
  }
}
onMounted(async () => { await getOrder() })
onUnmounted(() => { order.value = null })
</script>
<template>
  <div class="page_layout">
    <div class="flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full">

      <div v-if="data.loading" class="grid grid-cols-1 gap-4">
        <USkeleton class="w-full h-12" />
        <div class="w-full flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-4">
            <USkeleton v-for="i in 12" class="h-4" />
          </div>
        </div>
      </div>
      <Order v-else-if="order" :item="order" />
      <div v-else-if="hasOrder === 0" class="text-center text-gray-500 py-4">
        Ивойса нет
      </div>

    </div>
  </div>
</template>