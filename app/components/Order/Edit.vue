<script setup>
import { useApiStore } from '~/store/api'
import { z } from 'zod'

const apiStore = useApiStore()
const { update, findOne } = useStrapi()
const client = useStrapiClient()
const { orderStatusList, unitMeasurement } = useConfig()
const cartComponent = ref(null);
const toast = useToast()
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['on-edited'])

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  orderData: {
    type: Object,
    default: null
  },
})

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
  orderNumber: props.orderData?.orderNumber || '',
  orderStatus: props.orderData?.orderStatus || '',
  customerId: props.orderData?.customer?.documentId || '',
  productItems: props.orderData?.productItems ? props.orderData.productItems.map(item => ({
    id: item.product.documentId,
    name: item.product.name,
    quantity: item.quantity,
    unit: item.product.unit
  })) : [],
  stocks: props.orderData?.stocks || [],
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
    const orderResponse = await update('orders', props.id, orderPayload);
    const orderId = orderResponse.data.documentId;

    // Преобразуем productItems для сравнения
    const oldProducts = new Map();
    props.orderData?.productItems.forEach(item => {
      oldProducts.set(item.product.documentId, item.quantity);
    });
    const newProducts = new Map();
    state.productItems.forEach(item => {
      newProducts.set(item.id, item.quantity);
    });

    // возврат на склад (+)
    for (const [productId, oldQuantity] of oldProducts.entries()) {
      const newQuantity = newProducts.get(productId) || 0;
      if (oldQuantity > newQuantity) {
        const quantityToReturn = oldQuantity - newQuantity;
        const stockPayload = {
          type: 'cancellation',
          quantity: quantityToReturn,
          product: { connect: [productId] },
          order: { connect: [orderId] },
        };
        await client('/stocks', { method: 'POST', body: { data: stockPayload } });
      }
    }
    // списание со склада (-)
    for (const [productId, newQuantity] of newProducts.entries()) {
      const oldQuantity = oldProducts.get(productId) || 0;
      if (newQuantity > oldQuantity) {
        const quantityToSale = newQuantity - oldQuantity;
        const stockPayload = {
          type: 'sale',
          quantity: quantityToSale,
          product: { connect: [productId] },
          order: { connect: [orderId] },
        };
        await client('/stocks', { method: 'POST', body: { data: stockPayload } });
      }
    }

    const res = await findOne('orders', orderId, {
      populate: {
        customer: true,
        comment: true,
        productItems: {
          populate: {
            product: true
          }
        }
      }
    });

    if (res?.data) {
      toast.add({
        title: 'Заказ успешно обновлен',
        color: 'success',
        icon: 'hugeicons:checkmark-circle-02',
      });
      emit('on-edited', res.data);
    } else {
      toast.add({
        title: 'Ошибка обновления',
        description: 'Заказ обновлен, но не удалось загрузить актуальные данные.',
        color: 'warning',
        icon: 'hugeicons:information-circle',
      });
      emit('on-edited', { 
        ...orderResponse.data, 
        productItems: state.productItems.map(item => ({ 
          product: { documentId: item.id, name: item.name }, 
          quantity: item.quantity 
        })) 
      });
    }
    router.push(route.path);

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
    data.loading = false;
  }
}
function onRemoved() { router.push(route.path) }

const isDisabled = computed(() => {
  return data.loading || !state.orderNumber || !state.customerId || state.productItems.length === 0;
});
</script>
<template>
  <UCard>
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
            <span class="flex-1">{{ item.quantity }} {{ unitMeasurement(item.unit, item.quantity) }}</span>
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
        <RemoveEntry 
          :id="id" api="orders" 
          :entry-name="`заказ ${state.orderNumber}?`" 
          @on-removed="onRemoved" />
        <UFieldGroup>
          <UButton :to="route.path" color="neutral" variant="soft" size="sm">
            Отмена
          </UButton>
          <UButton 
            type="submit" size="sm"
            :disabled="isDisabled" 
            :loading="data.loading">
            Обновить заказ
          </UButton>
        </UFieldGroup>
      </div>
    </UForm>

    <OrderCart
      ref="cartComponent"
      :products="data.products"
      :initial-selected="state.productItems.map(item => ({ 
        product: { documentId: item.id, name: item.name, unit: item.unit }, 
        quantity: item.quantity 
      }))"
      @add-to-order="handleProductsAdded" />
  </UCard>
</template>