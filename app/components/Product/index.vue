<script setup>
import { useCartStore } from '@/store/cart'

const cartStore = useCartStore()
const { copyBoofer, unitMeasurement } = useConfig()

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const commentPrompt = ref(null)
const currentComment = ref({
  message: props.item?.comment?.message,
  documentId: props.item?.comment?.documentId
})
function openCommentPrompt() {
  commentPrompt.value?.openCommentPrompt()
}
function handleComment(data) {
  currentComment.value.message = data.message
  currentComment.value.documentId = data.documentId
}
</script>
<template>
  <div class="flex flex-col w-full gap-4">

    <div class="grid grid-cols-[auto_1fr_auto] items-center bg-primary text-white rounded-lg p-2">
      <NuxtLink :to="`/stock/${item.category.documentId}`" class="text-2xl leading-0 p-2">
        <UIcon name="hugeicons:link-backward" />
      </NuxtLink>
      <div class="text-center">
        <p class="text-xs">{{ item.category.name }}</p>
        <h2 class="text-lg font-bold">{{ item.name }}</h2>
      </div>
      <NuxtLink to="#" class="text-2xl leading-0 p-2">
        <UIcon name="hugeicons:settings-01" class="text-2xl" />
      </NuxtLink>
    </div>

    <div class="flex flex-col gap-2 px-2 pb-2">

      <div v-if="item.sku" class="flex items-center justify-between gap-2">
        <span class="text-gray-900 dark:text-white">
          Артикул
        </span>
        <span @click="copyBoofer(item.sku)" 
          class="text-gray-900 dark:text-white text-sm font-medium">
          {{ item.sku }}
        </span>
      </div>
      <div v-if="item.quantityInStock" class="flex justify-between gap-2">
        <span class="text-gray-900 dark:text-white">
          Количество
        </span>
        <span class="text-gray-900 dark:text-white text-sm font-medium">
          {{ item.quantityInStock + unitMeasurement(item.unit, item.quantityInStock) }}
        </span>
      </div>

      <UAccordion :items="[{
          label: 'Комментарий',
          icon: 'hugeicons:message-01',
          trailingIcon: 'hugeicons:arrow-down-01',
          slot: 'comment',
        }]">
        <template #comment>
          <div v-if="currentComment.documentId" class="flex flex-col items-stretch gap-2 bg-gray-200 dark:bg-gray-800 rounded-md p-2">
            <div v-html="currentComment.message" class="text-sm text-gray-700 dark:text-gray-400"></div>
            <UButton :to="`/comments/${currentComment.documentId}`" 
              color="neutral" variant="soft" 
              icon="hugeicons:link-square-02" 
              trailing size="sm" 
              class="self-end" />
          </div>
          <div v-else class="grid items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-md p-4">
            <UButton
              icon="hugeicons:plus-sign-circle"
              label="Добавить комментарий" 
              color="primary"
              size="sm"
              @click="openCommentPrompt" />
          </div>
        </template>
      </UAccordion>
    </div>

    <CommentAddEntry
      ref="commentPrompt"
      :entry-id="item.documentId"
      entry-name="product"
      @handle-comment="handleComment" />

  </div>
</template>