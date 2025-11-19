<script setup>
import { useApiStore } from '~/store/api'
import { z } from 'zod'

const apiStore = useApiStore()
const client = useStrapiClient()
const { orderStatusList, unitMeasurement } = useConfig()
const toast = useToast()
const router = useRouter()
const cartComponent = ref(null);

const schema = z.object({
  orderNumber: z.string().min(1, 'Укажите артикул/номер заказа'),
  orderStatus: z.enum(orderStatusList.map(unit => unit.value)),
  customerId: z.string().min(1, 'Выберите клиента'),
  productItems: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number().min(0, 'Укажите количество'),
  })).min(1, 'Выберите хотя бы один товар для заказа'),
});

const state = reactive({
  orderNumber: '',
  orderStatus: 'pending',
  customerId: '',
  productItems: [], // Выбранные товары
});
const data = reactive({
  customers: [],
  products: [],
  loading: false,
  loadingFields: false
});

onMounted(async () => {
  data.loadingFields = true;
  try {
    await Promise.all([apiStore.getCustomers(), apiStore.getProducts()])

    data.customers = apiStore.customers.map(item => ({ label: item.name, value: item.documentId }));
    data.products = apiStore.products.map(item => ({
      documentId: item.documentId,
      category: item.category?.name,
      name: item.name,
      unit: item.unit,
    }));
  } catch (error) {
    toast.add({
      title: 'Ошибка загрузки данных',
      description: 'Не удалось загрузить клиентов или товары. Попробуйте обновить страницу.',
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    });
  } finally {
    data.loadingFields = false;
  }
});

function openProductSelection() {
  cartComponent.value?.openCart()
}
function handleProductsAdded(selectedProducts) {
  state.productItems = selectedProducts
}

async function onSubmit(event) {
  data.loading = true;
  try {
    await schema.parseAsync(state);

    const orderPayload = {
      orderNumber: state.orderNumber,
      orderStatus: state.orderStatus,
      customer: { connect: [state.customerId] },
      productItems: state.productItems.map(item => ({
        product: { connect: [item.id] },
        quantity: item.quantity,
      })),
    };

    const orderResponse = await client('/orders', {
      method: 'POST',
      body: { data: orderPayload },
    });
    const newOrderId = orderResponse.data.documentId;

    for (const item of state.productItems) {
      const stockPayload = {
        type: 'sale',
        quantity: item.quantity,
        product: { connect: [item.id] },
        order: { connect: [newOrderId] },
      };
      await client('/stocks', {
        method: 'POST',
        body: { data: stockPayload },
      });
    }
    toast.add({
      title: 'Заказ успешно создан',
      color: 'success',
      icon: 'hugeicons:checkmark-circle-02',
    });
    router.push(`/orders/${newOrderId}`);

  } catch (e) {
    console.error('Ошибка при создании заказа:', e);
    const errorMessage = e instanceof z.ZodError ?
      e.errors.map(err => err.message).join('; ') :
      e.message || 'Произошла неизвестная ошибка.';

    toast.add({
      title: 'Ошибка',
      description: `Ошибка при создании заказа: ${errorMessage}`,
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    });
  } finally {
    clearForm();
    data.loading = false;
  }
}
function clearForm() {
  state.orderNumber = '';
  state.orderStatus = 'pending';
  state.customerId = '';
  state.productItems = [];
}

const isDisabled = computed(() => {
  return data.loading || !state.orderNumber || !state.customerId || state.productItems.length === 0;
});
</script>
<template>
  <UCard>
    <template #header>
      <h2 class="main_title">{{ state.orderNumber || 'Новый заказ' }}</h2>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Номер заказа" name="orderNumber" required>
        <UInput v-model="state.orderNumber" placeholder="Номер/код заказа" type="text" class="w-full" />
      </UFormField>
      
      <UFormField label="Товары" name="productItems" required>
        <UButton
          icon="hugeicons:plus-sign-circle"
          label="Выбрать товары" 
          variant="outline" block 
          :loading="data.loadingFields"
          @click="openProductSelection" />
        <div v-if="state.productItems.length > 0" class="mt-2 space-y-2">
          <div v-for="item in state.productItems" :key="item.id" class="flex justify-between gap-2 items-center bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded-md">
            <span class="flex-1"><UBadge :label="item.name" color="neutral" /></span>
            <span class="flex-1">
              {{ item.quantity }} {{ unitMeasurement(item.unit, item.quantity) }}
            </span>
            <UButton
              icon="hugeicons:cancel-01"
              color="red"
              variant="soft"
              size="sm"
              @click="state.productItems = state.productItems.filter(p => p.id !== item.id)"
            />
          </div>
        </div>
      </UFormField>

      <UFormField label="Клиент" name="customerId" required>
        <USelect
          v-model="state.customerId"
          :items="data.customers"
          placeholder="Выберите клиента" 
          trailing-icon="hugeicons:arrow-down-01"
          :loading="data.loadingFields" class="w-60" />
      </UFormField>
      
      <div class="flex items-center justify-between mt-8">
        <UButton to="/orders" color="primary" variant="ghost">
          Отмена
        </UButton>
        <UButton 
          type="submit" 
          :disabled="isDisabled" 
          :loading="data.loading">
          Создать заказ
        </UButton>
      </div>
    </UForm>

    <OrderCart
      ref="cartComponent"
      :products="data.products"
      :initial-selected="state.productItems.map(item => ({ 
        product: { documentId: item.id, name: item.name }, 
        quantity: item.quantity 
      }))"
      @add-to-order="handleProductsAdded" />
  </UCard>
</template>