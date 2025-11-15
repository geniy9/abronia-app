<script setup>
import { useApiStore } from '~/store/api'
import { z } from 'zod'

const apiStore = useApiStore()
const client = useStrapiClient()
const { productUnits } = useConfig()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const schema = z.object({
  name: z.string().min(1, 'Укажите наименование товара'),
  sku: z.string().min(1, 'Укажите артикул товара'),
  unit: z.enum(productUnits.map(unit => unit.value)),
  categoryId: z.string().min(1, 'Выберите категорию'),
  quantity: z.number().min(0, 'Укажите количество товара для прихода'),
  expireDate: z.date()
});

const data = reactive({
  name: '',
  sku: '',
  unit: productUnits[0].value,
  categoryId: route.query?.categoryId || '',
  quantity: 0,
  expireDate: null,
  categories: apiStore.categories.map(item => ({ label: item.name, value: item.documentId })) || [],
  loading: false,
})

onMounted(async () => {
  try {
    data.loading = true
    await apiStore.getCategories()
  } catch (error) {
    toast.add({
      title: 'Ошибка загрузки категорий',
      description: 'Не удалось загрузить список категорий. Попробуйте обновить страницу.',
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    });
  } finally {
    data.loading = false
  }
});

async function onSubmit(event) {
  data.loading = true;
  try {
    const { categoryId, quantity, ...formData } = event.data
    const productPayload = {
      ...formData,
      category: { connect: [categoryId] }
    };
    const productResponse = await client('/products', {
      method: 'POST',
      body: { data: productPayload },
    });
    const newProductId = productResponse.data.documentId;
    const stockPayload = {
      type: 'stock_in',
      quantity: quantity,
      product: { connect: [newProductId] },
    };
    await client('/stocks', {
      method: 'POST',
      body: { data: stockPayload },
    });

    toast.add({ 
      title: 'Товар успешно добавлен', 
      color: 'success', 
      icon: 'hugeicons:checkmark-circle-02'
    });
    router.push(`/stock/${categoryId}/${newProductId}`)

  } catch (e) {
    toast.add({ 
      title: 'Ошибка', 
      description: 'Ошибка при добавлении товара, попробуйте еще раз', 
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
  data.unit = productUnits[0].value;
  data.categoryId = '';
  data.quantity = 0;
  data.expireDate = null
}

const isDisabled = computed(() => {
  return !data.name || !data.sku || !data.unit || !data.categoryId || data.quantity <= 0
})
</script>
<template>
  <UCard>
    <template #header>
      <h2 class="main_title">{{ data.name || 'Новый товар' }}</h2>
    </template>

    <UForm :schema="schema" :state="data" class="space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Название" name="name" required>
        <UInput v-model="data.name" placeholder="Наименование товара" type="text" class="w-full" />
      </UFormField>

      <UFormField label="Артикул" name="sku" required>
        <UInput v-model="data.sku" placeholder="Артикул товара" type="text" class="w-full" />
      </UFormField>

      <UFormField label="Срок годности" name="expireDate">
        <DateModify v-model:inputDate="data.expireDate" />
      </UFormField>

      <UFormField label="Количество" name="quantity" required>
        <UInputNumber 
          v-model.number="data.quantity"
          :min="0" 
          :step="0.01"
          :ui="{ base: 'bg-white dark:bg-gray-950 text-black dark:text-white text-sm leading-3 font-bold' }"
          :increment="{ icon: 'hugeicons:plus-sign-circle', size: 'md', class: 'p-0' }"
          :decrement="{ icon: 'hugeicons:minus-sign-circle', size: 'md', class: 'p-0' }" 
          variant="none" 
          class="w-40" />
      </UFormField>

      <UFormField label="Единица измерения" name="unit" required>
        <URadioGroup 
          v-model="data.unit" 
          :items="productUnits.map(item => ({ label: item.name, value: item.value }))" 
          orientation="horizontal" variant="card" size="sm" />
      </UFormField>

      <UFormField label="Категория" name="categoryId" required>
        <USelect
          v-model="data.categoryId"
          :items="data.categories"
          placeholder="Выберите категорию"
          class="w-xs" />
      </UFormField>
      
      <div class="flex items-center justify-between mt-8">
        <UButton to="/stock" color="primary" variant="ghost">
          Отмена
        </UButton>
        <UButton 
          type="submit" 
          :disabled="isDisabled" 
          :loading="data.loading">
          Создать
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>