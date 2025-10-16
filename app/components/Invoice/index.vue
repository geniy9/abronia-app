<script setup>
const { copyBoofer, humanDateTime, unitMeasurement, statusInvoice, colorStatusInvoice } = useConfig()

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const columns = [{
  accessorKey: 'product.name',
  header: 'Товар'
},{
  accessorKey: 'quantity',
  header: () => h('div', { class: 'text-right' }, 'Кол-во'),
}]
</script>
<template>
  <div class="flex flex-col w-full gap-4">

    <UChip :color="colorStatusInvoice(item.invoiceStatus)" :text="statusInvoice(item.invoiceStatus)" size="3xl" position="bottom-center">
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
            <p>{{ unitMeasurement(row.original.product.unit) }}</p>
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
      <div v-if="(item.totalAmount > item.paidAmount)">
        <NotifyDatePicker :notified="item.remindPaymentDate" />
      </div>
      <UFileUpload 
        icon="hugeicons:file-upload"
        color="neutral"
        highlight
        label="Прикрепить инвойс"
        description="JPG, PNG или PDF (max. 2MB)"
        class="w-full min-h-32" />
      <div v-if="item.comment" class="flex flex-col justify-between gap-1">
        <UFormField label="Комментарий">
          <UTextarea v-model="item.comment.message" disabled 
            placeholder="Оставить комментарий..." 
            class="w-full" />
        </UFormField>
      </div>
    </div>

  </div>
</template>