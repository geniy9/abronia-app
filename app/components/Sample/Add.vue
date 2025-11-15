<script setup>
import { useApiStore } from '~/store/api'
import { z } from 'zod'

const apiStore = useApiStore()
const client = useStrapiClient()
const { productUnits } = useConfig()
const toast = useToast()
const router = useRouter()

const schema = z.object({
  name: z.string().min(1, 'Укажите наименование образца'),
  sku: z.string().min(1, 'Укажите артикул образца'),
  unit: z.enum(productUnits.map(unit => unit.value)),
  parLevel: z.number().min(0, 'Укажите количество'),
  expireDate: z.date()
});

const data = reactive({
  name: '',
  sku: '',
  parLevel: 0,
  unit: productUnits[0].value,
  expireDate: null,
  loading: false,
})

async function onSubmit(event) {
  data.loading = true;
  try {
    const sampleResponse = await client('/samples', {
      method: 'POST',
      body: { data: { ...event.data } },
    });

    if (sampleResponse?.data) { 
      apiStore.addEntryToState('samples', sampleResponse.data)
      toast.add({ 
        title: 'Образец успешно добавлен', 
        color: 'success', 
        icon: 'hugeicons:checkmark-circle-02'
      });
      router.push('/stock/samples')
    }

  } catch (e) {
    toast.add({ 
      title: 'Ошибка', 
      description: 'Ошибка при добавлении образца, попробуйте еще раз', 
      color: 'error', 
      icon: 'hugeicons:cancel-circle'
    })
  } finally {
    clearData()
    data.loading = false;
  }
}

function clearData() {
  data.name = ''
  data.sku = ''
  data.parLevel = 0
  data.unit = productUnits[0].value
}

const isDisabled = computed(() => {
  return !data.name || !data.sku || !data.unit || data.parLevel <= 0
})
</script>
<template>
  <UCard>
    <template #header>
      <h2 class="main_title">{{ data.name || 'Новый образец' }}</h2>
    </template>

    <UForm :schema="schema" :state="data" class="space-y-3" @submit.prevent="onSubmit">
      <UFormField label="Название" name="name" required>
        <UInput v-model="data.name" placeholder="Наименование образца" type="text" class="w-full" />
      </UFormField>

      <UFormField label="Артикул" name="sku" required>
        <UInput v-model="data.sku" placeholder="Артикул образца" type="text" class="w-full" />
      </UFormField>

      <UFormField label="Срок годности" name="expireDate">
        <DateModify v-model:inputDate="data.expireDate" />
      </UFormField>

      <UFormField label="Количество" name="parLevel" required>
        <UInputNumber 
          v-model.number="data.parLevel"
          :min="0" 
          :step="0.01"
          :ui="{ base: 'bg-white dark:bg-gray-950 text-black dark:text-white text-sm leading-3 font-bold' }"
          :decrement="{ icon: 'hugeicons:minus-sign-circle', size: 'md', class: 'p-0' }" 
          :increment="{ icon: 'hugeicons:plus-sign-circle', size: 'md', class: 'p-0' }" 
          variant="none" 
          class="w-40" />
      </UFormField>

      <UFormField label="Единица измерения" name="unit" required>
        <URadioGroup 
          v-model="data.unit" 
          :items="productUnits.map(item => ({ label: item.name, value: item.value }))" 
          orientation="horizontal" variant="card" size="sm" />
      </UFormField>
      
      <div class="flex items-center justify-between">
        <UButton to="/stock/samples" color="primary" variant="ghost">
          Отмена
        </UButton>
        <UButton 
          type="submit" 
          :disabled="isDisabled" 
          :class="isDisabled ? 'opacity-50' : 'opacity-100'"
          :loading="data.loading">
          Создать
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>