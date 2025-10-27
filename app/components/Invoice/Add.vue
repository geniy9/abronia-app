<script setup>
import { today, CalendarDate } from '@internationalized/date'
import { useApiStore } from '~/store/api'
import { z } from 'zod'
import ShipmentDate from '../ShipmentDate.vue'

const apiStore = useApiStore()
const client = useStrapiClient()
const { invoiceStatusList, unitMeasurement } = useConfig()
const toast = useToast()
const router = useRouter()

const schema = z.object({
  invoiceNumber: z.string().min(1, 'Укажите артикул/номер инвойса'),
  invoiceStatus: z.enum(invoiceStatusList.map(unit => unit.value)),
  orderId: z.string().min(1, 'Выберите заказ'),
  shipmentDate: z.date()
});

const state = reactive({
  invoiceNumber: '',
  invoiceStatus: 'draft',
  orderId: '',
  shipmentDate: new Date()
});
const data = reactive({
  orders: [],
  loading: false,
});

onMounted(async () => {
  data.loading = true;
  try {
    await apiStore.getOrders();
    data.orders = apiStore.orders.map(item => ({ 
      label: item.orderNumber, 
      value: item.documentId
    }));
  } catch (error) {
    toast.add({
      title: 'Ошибка',
      description: 'Не удалось загрузить заказы. Попробуйте обновить страницу.',
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    });
  } finally {
    data.loading = false;
  }
});

async function onSubmit(event) {
  data.loading = true;
  try {
    await schema.parseAsync(state);

    const invoicePayload = {
      invoiceNumber: state.invoiceNumber,
      invoiceStatus: state.invoiceStatus,
      order: { connect: [state.orderId] },
      shipmentDate: state.shipmentDate.toISOString()
    };

    const res = await client('/invoices', {
      method: 'POST',
      body: { data: invoicePayload },
    });
    if (res?.data) {
      const newInvoiceId = res.data.documentId;
      const invoiceYear = new Date(res.data.createdAt).getFullYear()
      toast.add({
        title: 'Инвойс успешно создан',
        color: 'success',
        icon: 'hugeicons:checkmark-circle-02',
      });
      router.push(`/invoices/${invoiceYear}/${newInvoiceId}`);
    }

  } catch (e) {
    console.error('Ошибка при создании инвойса:', e);
    const errorMessage = e instanceof z.ZodError ?
      e.errors.map(err => err.message).join('; ') :
      e.message || 'Произошла неизвестная ошибка.';

    toast.add({
      title: 'Ошибка',
      description: `Ошибка при создании инвойса: ${errorMessage}`,
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    });
  } finally {
    clearForm();
    data.loading = false;
  }
}
function clearForm() {
  state.invoiceNumber = '';
  state.invoiceStatus = 'draft';
  state.orderId = '';
  state.shipmentDate = new Date();
}

const isDisabled = computed(() => {
  return data.loading || !state.invoiceNumber || !state.orderId
});
</script>
<template>
  <UCard>
    <template #header>
      <h2 class="main_title">{{ state.invoiceNumber || 'Новый инвойс' }}</h2>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Номер инвойса" name="invoiceNumber" required>
        <UInput v-model="state.invoiceNumber" placeholder="Номер/код инвойса" type="text" class="w-full" />
      </UFormField>

      <UFormField label="Заказ" name="orderId" required>
        <USelect
          v-model="state.orderId"
          :items="data.orders"
          placeholder="Выберите заказ"
          :loading="data.loading" class="w-60" />
      </UFormField>

      <ShipmentDate v-model:shipment="state.shipmentDate" />
      
      <div class="flex items-center justify-between">
        <UButton to="/invoices" color="primary" variant="ghost">
          Отмена
        </UButton>
        <UButton 
          type="submit" 
          :disabled="isDisabled" 
          :class="isDisabled ? 'opacity-50' : 'opacity-100'"
          :loading="data.loading">
          Создать инвойс
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>