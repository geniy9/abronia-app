<script setup>
const { truncate, unitMeasurement } = useConfig()
const { update } = useStrapi()
const toast = useToast()

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
const data = reactive({
  loading: false,
})

const inStock = ref(props.item?.parLevel)

async function onSubmit() {
  data.loading = true;
  try {
    await update('samples', props.item.documentId, { parLevel: inStock.value });
    toast.add({ 
      title: 'Образец обновлен', 
      color: 'success', 
      icon: 'hugeicons:checkmark-circle-02'
    });

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
    <UAccordion :items="[{ trailingIcon: 'hugeicons:settings-01', slot: 'sample' }]">
      <template #leading>
        <div class="flex justify-between items-center w-full gap-2 text-gray-900 dark:text-white">
          <h3 class="font-bold">
            {{ truncate(item.name, 20) }}
          </h3>
          <div>
            <span class="font-bold">{{ inStock }}</span>
            <span class="text-xs uppercase opacity-50">{{ unitMeasurement(item.unit, inStock) }}</span>
          </div>
        </div>
      </template>
      <template #sample>
        <div class="flex justify-between items-center pb-3">
          <h3 class="font-bold text-gray-900 dark:text-white">
            {{ item.name }}
          </h3>
          <div class="flex items-center justify-center gap-2">
            <!-- <span class="text-xs uppercase opacity-50">{{ unitMeasurement(item.unit, inStock) }}:</span> -->
            <UInputNumber 
              v-model="inStock" 
              :min="0" 
              :step="1" 
              :ui="{ base: 'bg-white dark:bg-gray-950 text-black dark:text-white text-sm leading-3 font-bold' }"
              :increment="{ icon: 'hugeicons:plus-sign-circle', size: 'md', class: 'p-0' }"
              :decrement="{ icon: 'hugeicons:minus-sign-circle', size: 'md', class: 'p-0' }" 
              variant="none" 
              class="w-28" 
              size="sm" />
            <UButton @click="onSubmit" :loading="data.loading" size="sm">
              Сохранить
            </UButton>
          </div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>