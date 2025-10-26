<script setup>
const { copyBoofer, humanDateTime, unitMeasurement, statusInvoice } = useConfig()

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
const statusObject = computed(() => statusInvoice(props.item.invoiceStatus))
</script>
<template>
  <div class="flex flex-col w-full gap-4">

    <UChip :color="statusObject?.color" :text="statusObject?.name" size="3xl" position="bottom-center">
      <div class="bg-primary text-white text-center rounded-lg w-full p-2">
        <p class="text-xs">Инвойс</p>
        <h2 @click="copyBoofer(item.invoiceNumber)" class="text-lg font-bold cursor-pointer">
          {{ item.invoiceNumber }}
        </h2>
      </div>
    </UChip>

    <div class="flex flex-col gap-2 px-2 pb-2">

      <div v-if="item.invoiceNumber" class="flex items-center justify-between gap-2">
        <span class="text-gray-900 dark:text-white">
          Номер инвойса
        </span>
        <span class="text-gray-900 dark:text-white text-sm">
          {{ item.invoiceNumber }}
        </span>
      </div>
      <div v-if="item.shipmentDate" class="flex items-center justify-between gap-2">
        <span class="text-gray-900 dark:text-white">
          Дата отгрузки
        </span>
        <span class="text-gray-900 dark:text-white text-sm">
          {{ humanDateTime(item.shipmentDate) }}
        </span>
      </div>
      <div v-if="item.order?.customer" class="flex justify-between gap-2">
        <span class="text-gray-900 dark:text-white">
          Заказчик
        </span>
        <span class="text-white bg-primary dark:bg-gray-900 px-2 py-1 text-sm rounded-lg">
          {{ item.order?.customer.name }}
        </span>
      </div>
      <UTable v-if="item.order?.productItems" :data="item.order.productItems" :columns="columns" class="flex-1">
        <template #quantity-cell="{ row }">
          <div class="flex items-center justify-end gap-1">
            <p>{{ row.original.quantity }}</p>
            <p>{{ unitMeasurement(row.original.product.unit, row.original.quantity) }}</p>
          </div>
        </template>
      </UTable>
      <div v-if="item.totalAmount" class="flex justify-between gap-2">
        <span class="text-gray-900 dark:text-white">
          Общая сумма
        </span>
        <span class="text-gray-900 dark:text-white text-sm font-medium">
          {{ item.totalAmount }} $
        </span>
      </div>
      <div v-if="item.paidAmount" class="flex justify-between gap-2">
        <span class="text-gray-900 dark:text-white">
          Оплачено
        </span>
        <span class="text-gray-900 dark:text-white text-sm font-medium">
          {{ item.paidAmount }} $
        </span>
      </div>
      <div v-if="item.paidAmount" class="flex justify-between gap-2">
        <span class="text-gray-900 dark:text-white">
          Остаток
        </span>
        <span class="text-gray-900 dark:text-white text-sm font-medium">
          {{ (item.totalAmount - item.paidAmount) }} $
        </span>
      </div>
      <div v-if="(item.totalAmount > item.paidAmount)" class="print:hidden">
        <NotifyDate :notified="item.remindPaymentDate" />
      </div>
      <div class="grid print:hidden">
        <div v-if="item.attachments?.length" class="grid gap-2">
          <span class="text-gray-900 dark:text-white">
            Вложенные файлы
          </span>
          <Slider :items="item.attachments" />
        </div>
        <UAccordion :items="[{
            label: 'Приложить файлы',
            icon: 'hugeicons:plus-sign-circle',
            trailingIcon: 'hugeicons:arrow-down-01',
            slot: 'upload',
          }]">
          <template #upload>
            <InvoiceUploadFiles :document-id="item.documentId" />
          </template>
        </UAccordion>

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
    </div>

    <CommentAddEntry
      ref="commentPrompt"
      :entry-id="item.documentId"
      entry-name="invoice"
      @handle-comment="handleComment" />

  </div>
</template>