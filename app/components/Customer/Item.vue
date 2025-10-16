<script setup>
const router = useRouter()
const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
function goOrder() {
  router.push(`/app/customers/${props.item?.documentId}`)
}
</script>
<template>
  <div @click="goOrder" class="flex justify-between items-center cursor-pointer w-full text-sm bg-gray-200 dark:bg-gray-900 rounded-lg p-2">
    <h3 class="flex flex-col gap-0.5 font-bold text-gray-900 dark:text-white px-2">
      <span>{{ item.name }}</span>
    </h3>
    <div class="flex items-center justify-center bg-white dark:bg-gray-950 rounded-lg w-10 h-10">
      <UIcon name="hugeicons:arrow-right-double" class="w-6 h-6 text-primary" />
    </div>
  </div>
</template>