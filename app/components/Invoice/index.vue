<script setup>
const { humanDateTime, unitMeasurement, statusInvoice, invoiceYear } = useConfig()
const { update } = useStrapi()
const client = useStrapiClient()
const route = useRoute()
const toast = useToast()

const props = defineProps({
  invoice: {
    type: Object,
    default: null
  }
})
const item = ref(props.invoice)
const newRemindDate = ref('')
const commentPrompt = ref(null)
const currentComment = ref({
  message: props.item?.comment?.message,
  documentId: props.item?.comment?.documentId
})
const data = reactive({
  loadingNotify: false
});

function openCommentPrompt() {
  commentPrompt.value?.openCommentPrompt()
}
function handleComment(data) {
  currentComment.value.message = data.message
  currentComment.value.documentId = data.documentId
}
function onEdited(obj) { item.value = obj }
function onSetRemindDate(newDate) {
  newRemindDate.value = new Date(newDate).toISOString()
}
async function saveRemindPaymentDate() {
  data.loadingNotify = true;
  try {
    if (!newRemindDate.value) return

    const remindId = item.value.remind?.documentId

    const remindPayload = {
      remindDate: newRemindDate.value,
      message: `Напоминание по инвойсу ${item.value.invoiceNumber || ''}`,
      invoice: item.value.documentId, 
      sent: false,
    }
    if (remindId) {
      const res = await update('reminds', remindId, remindPayload)
      item.value.remind = res?.data // мержим локально при обновлении
    } else {
      const res = await client('/reminds', {
        method: 'POST',
        body: { data: remindPayload },
      });
      item.value.remind = res?.data // мержим локально при добавлении
    }
    toast.add({
      title: 'Напоминание успешно сохранено',
      description: `Сработает ${humanDateTime(newRemindDate.value)}`,
      color: 'success',
      icon: 'hugeicons:checkmark-circle-02',
    });
  } catch (e) {
    toast.add({
      title: 'Ошибка',
      description: `Ошибка при создании напоминания: ${e}`,
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    });
  } finally {
    data.loadingNotify = false
  }
}

const columns = [{
  accessorKey: 'product.name',
  header: 'Товар'
},{
  accessorKey: 'quantity',
  header: () => h('div', { class: 'text-right' }, 'Кол-во'),
}]

const statusObject = computed(() => statusInvoice(item.value?.invoiceStatus))
const isEdit = computed(() => route.hash === '#edit')
</script>
<template>
  <div class="flex flex-col w-full gap-4">

    <UChip :color="statusObject?.color" :text="statusObject?.name" size="3xl" position="bottom-center">
      <div class="grid w-full grid-cols-[auto_1fr_auto] items-center bg-primary text-white rounded-lg p-2">
        <NuxtLink :to="`/invoices/invoices-${invoiceYear(item?.createdAt)}`" class="text-2xl leading-0 p-2">
          <UIcon name="hugeicons:link-backward" />
        </NuxtLink>
        <div class="text-center">
          <p class="text-xs">Инвойс</p>
          <h2 class="text-lg font-bold">
            {{ item.invoiceNumber }}
          </h2>
        </div>
        <NuxtLink :to="isEdit ? route.path : `${route.path}#edit`" class="text-2xl leading-0 p-2">
          <UIcon :name="isEdit ? 'hugeicons:cancel-square' : 'hugeicons:settings-01'" class="text-2xl" />
        </NuxtLink>
      </div>
    </UChip>

    <InvoiceEdit 
      v-if="isEdit" 
      :id="item.documentId" 
      :invoiceData="item" 
      @onEdited="onEdited" />
    <div v-else class="flex flex-col gap-4 px-2 pb-2">
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
        <UButton :to="`/customers/${item.order.customer?.documentId}`" color="neutral" variant="soft" icon="hugeicons:link-square-02" size="sm" trailing>
          {{ item.order.customer?.name }}
        </UButton>
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

      <div class="grid print:hidden">
        <UAccordion :items="[{
            label: 'Напоминание',
            icon: item.remind ? 'hugeicons:notification-01' : 'hugeicons:notification-block-01',
            trailingIcon: 'hugeicons:arrow-down-01',
            slot: 'notify',
          }]">
          <template #notify>
            <div class="flex items-end gap-2 p-4 border border-gray-400 dark:border-gray-600 rounded-md">
              <NotifyDate 
                :dateOfRemind="item.remind?.remindDate" 
                @on-set-date="onSetRemindDate" 
                class="flex-1" />
              <UButton 
                :label="item.remind?.remindDate ? 'Обновить' : 'Сохранить'" 
                @click="saveRemindPaymentDate" 
                :loading="data.loadingNotify" />
            </div>
          </template>
        </UAccordion>

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