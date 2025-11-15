<script setup>
const { humanDate, expireDateStatus, truncate, unitMeasurement } = useConfig()
const { update, delete: _delete } = useStrapi()
const toast = useToast()

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
const data = reactive({
  loading: false,
  active: null
})

const inStock = ref(props.item?.parLevel)
const expireDate = ref(props.item?.expireDate)

async function onSubmit() {
  data.loading = true;
  try {
    await update('samples', props.item.documentId, { 
      parLevel: inStock.value,
      expireDate: expireDate.value
    });
    toast.add({ 
      title: 'Образец обновлен', 
      color: 'success', 
      icon: 'hugeicons:checkmark-circle-02'
    });
    data.active = null

  } catch (e) {
    toast.add({ 
      title: 'Ошибка', 
      description: 'Ошибка при обновлении оразца, попробуйте еще раз', 
      color: 'error', 
      icon: 'hugeicons:cancel-circle'
    })
  } finally {
    data.loading = false;
  }
}
</script>
<template>
  <div class="flex items-center justify-between bg-gray-200 dark:bg-gray-900 rounded-lg px-3">
    <UAccordion v-model="data.active" :items="[{ trailingIcon: 'hugeicons:arrow-down-01', slot: 'sample' }]">
      <template #leading>
        <div class="flex justify-between items-center w-full gap-2 text-gray-900 dark:text-white">
          <div class="flex flex-col items-start gap-1">
            <h3 class="font-bold">
              {{ truncate(item.name, 20) }}
            </h3>
            <span class="text-xs opacity-50">
              {{ item.sku }}
            </span>
          </div>
          <div class="flex flex-col gap-1 items-end">
            <UBadge v-if="expireDate" :color="expireDateStatus(expireDate)" size="sm">
              {{ humanDate(expireDate) }}
            </UBadge>
            <div>
              <span class="font-bold">{{ inStock }}</span>
              <span class="text-xs uppercase opacity-50">{{ unitMeasurement(item.unit, inStock) }}</span>
            </div>
          </div>
        </div>
      </template>
      <template #sample>
        <div class="grid gap-4 pb-3">
          <USeparator />

          <div class="flex justify-between items-center">
            <DateModify v-model:inputDate="expireDate" title="Срок годности" />
            <UFormField label="Количество" class="flex flex-col items-end">
              <UInputNumber 
                v-model="inStock" 
                :min="0" 
                :step="0.01"
                :ui="{ base: 'bg-white dark:bg-gray-950 text-black dark:text-white text-base leading-3 font-bold' }"
                :decrement="{ icon: 'hugeicons:minus-sign-circle', size: 'md', class: 'p-0' }" 
                :increment="{ icon: 'hugeicons:plus-sign-circle', size: 'md', class: 'p-0' }"
                variant="none" 
                class="w-36" />
            </UFormField>
          </div>
          <div class="flex items-center justify-between gap-2">
            <RemoveEntry :id="item.documentId" api="samples" :entry-name="`образец ${item.name}`" />
            <UButton @click="onSubmit" :loading="data.loading" size="sm">
              Сохранить
            </UButton>
          </div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>