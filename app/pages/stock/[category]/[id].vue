<script setup>
const route = useRoute()

const product = ref(null)
const hasProduct = ref(null)
const data = reactive({
  id: route.params.id || null,
  loading: false,
})

async function getProduct() {
  try {
    data.loading = true
    const { findOne } = useStrapi()
    const res = await findOne('products', data.id, {
      populate: { 
        category: true,
        comment: true
      }
    })
    if (res) {
      product.value = res.data
      hasProduct.value = res.meta?.pagination?.total || 0;
    }
  } catch (error) {
    console.log(error)
  } finally {
    data.loading = false
  }
}
onMounted(async () => { await getProduct() })
onUnmounted(() => { product.value = null })
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
      <Product v-else-if="product" :product="product" />

    </div>
  </div>
</template>