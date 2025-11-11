<script setup>
import { useApiStore } from '~/store/api'
import { z } from 'zod'

const apiStore = useApiStore()
const { update, findOne } = useStrapi()
const client = useStrapiClient()
const { productUnits, stockStatusList } = useConfig()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['on-edited'])

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  productData: {
    type: Object,
    default: null
  },
})

const schema = z.object({
  name: z.string().min(1, 'Укажите наименование товара'),
  sku: z.string().min(1, 'Укажите артикул товара'),
  unit: z.enum(productUnits.map(unit => unit.value)),
  // stockType: z.enum(stockStatusList.map(item => item.value)),
  categoryId: z.string().min(1, 'Выберите категорию'),
  quantity: z.number().min(0, 'Укажите количество товара'),
});

const data = reactive({
  name: props.productData?.name || '',
  sku: props.productData?.sku || '',
  unit: props.productData?.unit || productUnits[0].value,
  categoryId: props.productData?.category?.documentId || '',
  stockType: '',
  quantity: 0,
  loading: false,
})

onMounted(async () => {
  try {
    data.loadingCategories = true
    await apiStore.getCategories()
  } catch (error) {
    toast.add({
      title: 'Ошибка загрузки категорий',
      description: 'Не удалось загрузить список категорий. Попробуйте обновить страницу.',
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    });
  } finally {
    data.loadingCategories = false
  }
});

async function onSubmit(event) {
  data.loading = true;
  try {
    const { categoryId, quantity, stockType, ...formData } = event.data
    const productPayload = {
      ...formData,
      category: { connect: [categoryId] }
    };
    const updatedPoduct = await update('products', props.id, productPayload);

    if (data.stockType) {
      const stockPayload = {
        type: data.stockType,
        quantity: quantity,
        product: { connect: [props.id] },
      };
      await client('/stocks', { method: 'POST', body: { data: stockPayload } });
    }
    
    const responsePoduct = await findOne('products', props.id, {
      populate: {
        category: true,
        comment: true
      }
    });

    if (updatedPoduct?.data && responsePoduct?.data) {
      toast.add({ 
        title: 'Продукт успешно обновлен', 
        color: 'success', 
        icon: 'hugeicons:checkmark-circle-02'
      });
      emit('on-edited', responsePoduct.data)
      router.push(route.path);
    }

  } catch (e) {
    toast.add({ 
      title: 'Ошибка', 
      description: 'Ошибка при обновлении товара, попробуйте еще раз', 
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
  data.stockType = '';
  data.quantity = 0;
}
function onRemoved() { router.push('/invoices') }

const isDisabled = computed(() => {
  return !data.name || !data.sku || !data.unit || !data.categoryId
})
</script>
<template>
  <UCard>
    <template #header>
      <h2 class="main_title">{{ data.name }}</h2>
    </template>

    <UForm :schema="schema" :state="data" class="space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Название" name="name" required>
        <UInput v-model="data.name" placeholder="Наименование товара" type="text" class="w-xs" />
      </UFormField>
      <UFormField label="Артикул" name="sku" required>
        <UInput v-model="data.sku" placeholder="Артикул товара" type="text" class="w-xs" />
      </UFormField>

      <UFormField label="Категория" name="categoryId" required>
        <USelect
          v-model="data.categoryId"
          :items="apiStore.categories.map(item => ({ label: item.name, value: item.documentId }))" 
          :loading="data.loadingCategories"
          placeholder="Выберите категорию"
          class="w-xs" />
      </UFormField>

      <div class="flex items-start gap-6">
        <UFormField label="Количество" name="quantity">
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
        <UFormField label="Единица измерения" name="unit">
          <URadioGroup 
            v-model="data.unit" 
            :items="productUnits.map(item => ({ label: item.name, value: item.value }))" 
            orientation="horizontal" variant="card" size="xs" />
        </UFormField>
      </div>

      <UFormField label="Движение по складу" 
        description="Тип движения по складу влияет на его остаток (необязательно)" 
        name="stockType">
        <USelect
          v-model="data.stockType"
          :items="stockStatusList.map(status => ({ label: status.name, value: status.value }))"
          placeholder="Тип движения"
          class="w-xs" />
      </UFormField>
      
      <div class="flex items-center justify-between mt-8">
        <RemoveEntry 
          :id="id" 
          api="products" 
          :entry-name="`товар ${data.name}? (Движение по складу будет проведено как 'списание товара')`" 
          @on-removed="onRemoved" />
        <UFieldGroup>
          <UButton :to="route.path" color="neutral" variant="soft" size="sm">
            Отмена
          </UButton>
          <UButton 
            type="submit" size="sm"
            :disabled="isDisabled" 
            :loading="data.loading">
            Обновить товар
          </UButton>
        </UFieldGroup>
      </div>
    </UForm>
  </UCard>
</template>