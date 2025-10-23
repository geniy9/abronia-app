<script setup>
const route = useRoute()

const customer = ref(null)
const hasCustomer = ref(null)
const data = reactive({
  id: route.params.id || null,
  loading: false,
})

async function getCustomer() {
  try {
    data.loading = true
    const { findOne } = useStrapi()
    const res = await findOne('customers', data.id, {
      populate: { contacts: true, comment: true }
    })
    if (res?.data) {
      customer.value = res.data
      hasCustomer.value = res.meta
    } else {
      hasCustomer.value = 0
    }
  } catch (error) {
    console.log(error)
  } finally {
    data.loading = false
  }
}
onMounted(async () => { await getCustomer() })
onUnmounted(() => { customer.value = null })
</script>
<template>
  <div class="body_layout">
    <div class="flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full">

      <div v-if="data.loading" class="grid grid-cols-1 gap-4">
        <USkeleton class="w-full h-15" />
        <div class="w-full flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-4">
            <USkeleton v-for="i in 12" class="h-4" />
          </div>
        </div>
      </div>
      <Customer v-else-if="customer" :item="customer" />
      <div v-else-if="hasCustomer === 0" class="text-center text-gray-500 py-4">
        Клиентов пока нет
      </div>

    </div>
  </div>
</template>