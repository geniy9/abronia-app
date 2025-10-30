<script setup>
const { humanDateTime, unitMeasurement, statusOrder } = useConfig()
const route = useRoute()
const props = defineProps({
  order: {
    type: Object,
    default: null
  }
})
const item = ref(props.order)

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
function onEdited(obj) { item.value = obj }

const columns = [{
  accessorKey: 'product.name',
  header: 'Товар'
},{
  accessorKey: 'quantity',
  header: () => h('div', { class: 'text-right' }, 'Кол-во'),
}]

const statusObject = computed(() => statusOrder(item.value.orderStatus))
const isEdit = computed(() => route.hash === '#edit')
</script>
<template>
  <div class="grid gap-4">

    <UChip :color="statusObject?.color" :text="statusObject?.name" size="3xl" position="bottom-center">
      <div class="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 bg-primary text-white rounded-lg p-2">
        <NuxtLink to="/orders" class="text-2xl leading-0 py-2">
          <UIcon name="hugeicons:link-backward" />
        </NuxtLink>
        <div class="text-center">
          <p class="text-xs">Заказ</p>
          <h2 class="text-lg font-bold">
            {{ item.orderNumber }}
          </h2>
        </div>
        <NuxtLink :to="isEdit ? route.path : `${route.path}#edit`" class="text-2xl leading-0 py-2">
          <UIcon :name="isEdit ? 'hugeicons:cancel-square' : 'hugeicons:settings-01'" class="text-2xl" />
        </NuxtLink>
      </div>
    </UChip>

    <OrderEdit 
      v-if="isEdit" 
      :id="item.documentId" 
      :orderData="item" 
      @onEdited="onEdited" />
    <div v-else class="flex flex-col gap-2 px-2 pb-2">
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