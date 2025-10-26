<script setup>
const { copyBoofer, humanDateTime, unitMeasurement, statusOrder } = useConfig()
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

const columns = [{
  accessorKey: 'product.name',
  header: 'Товар'
},{
  accessorKey: 'quantity',
  header: () => h('div', { class: 'text-right' }, 'Кол-во'),
}]
const statusObject = computed(() => statusOrder(props.item.orderStatus))
</script>
<template>
  <div class="flex flex-col w-full gap-4">

    <UChip :color="statusObject?.color" :text="statusObject?.name" size="3xl" position="bottom-center">
      <div class="bg-primary text-white text-center rounded-lg w-full p-2">
        <p class="text-xs">Заказ</p>
        <h2 @click="copyBoofer(item.orderNumber)" class="text-lg font-bold cursor-pointer">
          {{ item.orderNumber }}
        </h2>
      </div>
    </UChip>

    <div class="flex flex-col gap-2 px-2 pb-2">

      <div v-if="item.orderNumber" class="flex items-center justify-between gap-2">
        <span class="text-gray-900 dark:text-white">
          Номер заказа
        </span>
        <span class="text-gray-900 dark:text-white text-sm">
          {{ item.orderNumber }}
        </span>
      </div>
      <div v-if="item.createdAt" class="flex items-center justify-between gap-2">
        <span class="text-gray-900 dark:text-white">
          Дата заказа
        </span>
        <span class="text-gray-900 dark:text-white text-sm">
          {{ humanDateTime(item.createdAt) }}
        </span>
      </div>
      <div v-if="item.customer" class="flex justify-between gap-2">
        <span class="text-gray-900 dark:text-white">
          Заказчик
        </span>
        <span class="text-white bg-primary dark:bg-gray-900 px-2 py-1 text-sm rounded-lg">
          {{ item.customer.name }}
        </span>
      </div>
      <UTable v-if="item.productItems" :data="item.productItems" :columns="columns" class="flex-1">
        <template #quantity-cell="{ row }">
          <div class="flex items-center justify-end gap-1">
            <p>{{ row.original.quantity }}</p>
            <p>{{ unitMeasurement(row.original.product?.unit, row.original.quantity) }}</p>
          </div>
        </template>
      </UTable>

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
      entry-name="order"
      @handle-comment="handleComment" />

  </div>
</template>