<script setup>
const route = useRoute()

const comment = ref(null)
const data = reactive({
  id: route.params.id || null,
  loading: false,
})

async function getCommet() {
  try {
    data.loading = true
    const { findOne } = useStrapi()
    const res = await findOne('comments', data.id, {
      populate: { 
        order: true, 
        invoice: true, 
        customer: true, 
        product: {
          populate: { category: true }
        }
      }
    })
    if (res?.data) {
      comment.value = res.data
    }
  } catch (error) {
    console.log(error)
  } finally {
    data.loading = false
  }
}
onMounted(async () => { await getCommet() })
onUnmounted(() => { comment.value = null })
</script>
<template>
  <div class="body_layout">
    <div class="flex flex-col gap-4 bg-white dark:bg-gray-700 p-2 rounded-xl w-full">

      <div v-if="data.loading" class="grid grid-cols-1 gap-4">
        <USkeleton class="w-full h-15" />
        <div class="w-full flex flex-col gap-4">
          <div class="grid gap-4">
            <USkeleton v-for="i in 6" class="h-4" />
          </div>
        </div>
      </div>
      <Comment v-else-if="comment" :item="comment" />

    </div>
  </div>
</template>