<script setup>
const route = useRoute()

const invoice = ref(null)
const hasInvoice = ref(null)
const data = reactive({
  id: route.params.id || null,
  loading: false,
})

async function getInvoice() {
  try {
    data.loading = true
    const { findOne } = useStrapi()
    const res = await findOne('invoices', data.id, {
      populate: { 
        order: {
          populate: {
            customer: true,
            productItems: { populate: ['product'] }
          },
        },
        attachments: true,
        comment: true
      }
    })
    if (res?.data) {
      invoice.value = res.data
      hasInvoice.value = res.meta
    } else {
      hasInvoice.value = 0
    }
  } catch (error) {
    console.log(error)
  } finally {
    data.loading = false
  }
}
onMounted(async () => { await getInvoice() })
onUnmounted(() => { invoice.value = null })
</script>
<template>
  <div class="body_layout">
    <div class="flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full">

      <div v-if="data.loading" class="grid grid-cols-1 gap-4">
        <USkeleton class="w-full h-12" />
        <div class="w-full flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-4">
            <USkeleton v-for="i in 12" class="h-4" />
          </div>
        </div>
      </div>
      <Invoice v-else-if="invoice" :item="invoice" />
      <div v-else-if="hasInvoice === 0" class="text-center text-gray-500 py-4">
        Ивойса нет
      </div>

    </div>
  </div>
</template>