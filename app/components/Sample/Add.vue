<script setup>
import { z } from 'zod'

const client = useStrapiClient()
const { productUnits } = useConfig()
const toast = useToast()
const router = useRouter()

const schema = z.object({
  name: z.string().min(3, 'Укажите наименование'),
  unit: z.enum(productUnits.map(unit => unit.value)),
  parLevel: z.number().min(1, 'Укажите количество'),
});

const data = reactive({
  name: '',
  parLevel: 0,
  unit: productUnits[0].value,
  loading: false,
})

async function onSubmit(event) {
  data.loading = true;
  try {
    const productPayload = { ...event.data };
    await client('/samples', {
      method: 'POST',
      body: { data: productPayload },
    });
    toast.add({ 
      title: 'Образец успешно добавлен', 
      color: 'success', 
      icon: 'hugeicons:checkmark-circle-02'
    });
    clearData()
    router.push('/stock/samples/')

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
  data.parLevel = 0
  data.unit = productUnits[0].value
}

const isDisabled = computed(() => {
  return !data.name || !data.unit || data.parLevel <= 0
})
</script>
<template>
  <UCard>
    <template #header>
      <h2 class="main_title">{{ data.name || 'Новый образец' }}</h2>
    </template>

    <UForm :schema="schema" :state="data" class="space-y-3" @submit.prevent="onSubmit">
      <UFormField label="Название" name="name" required>
        <UInput v-model="data.name" placeholder="Наименование образца" type="text" class="w-xs" />
      </UFormField>

      <UFormField label="Количество" name="parLevel" required>
        <UInput
          v-model.number="data.parLevel"
          type="number"
          min="0"
          class="w-xs" />
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