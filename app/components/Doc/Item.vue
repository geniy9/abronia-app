<script setup>
const { humanDate, expireDateStatus } = useConfig()
const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
</script>
<template>
  <NuxtLink :to="`/docs/${item.documentId}`" 
    class="grid items-start gap-4 cursor-pointer w-full text-sm bg-gray-200 dark:bg-gray-900 rounded-lg p-2">
    <div class="flex flex-col gap-4 text-gray-900 dark:text-white">

      <USeparator :label="item.product?.name" class="mb-1" />

      <div v-if="item.document?.length" v-for="(d, i) in item.document" :key="i" 
        class="flex items-center justify-between gap-2 w-full">
        <div class="flex items-center gap-2 opacity-80">
          <UChip :text="d.attachments?.length || 0" size="3xl" color="neutral">
            <UIcon name="hugeicons:document-attachment" class="w-7 h-7" />
          </UChip>
          <span>{{ d.name }}</span>
        </div>
        <UBadge v-if="d.expireDate" :color="expireDateStatus(d.expireDate)" size="sm" class="rounded-full">
          {{ humanDate(d.expireDate) }}
        </UBadge>
      </div>
    </div>
  </NuxtLink>
</template>