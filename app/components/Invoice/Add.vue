<script setup>
import { useApiStore } from '~/store/api'
import { z } from 'zod'

const apiStore = useApiStore()
const client = useStrapiClient()
const { invoiceStatusList } = useConfig()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const schema = z.object({
  invoiceNumber: z.string().min(1, 'Укажите артикул/номер инвойса'),
  invoiceStatus: z.enum(invoiceStatusList.map(unit => unit.value)),
  orderId: z.string().min(1, 'Выберите заказ'),
  totalAmount: z.number().min(0, 'Введите сумму к оплате'),
  shipmentDate: z.date()
});

const state = reactive({
  invoiceNumber: '',
  invoiceStatus: 'new',
  orderId: route.query?.orderId || '',
  totalAmount: 0,
  shipmentDate: new Date()
});
const data = reactive({
  orders: [],
  loading: false,
  loadingOrders: false
});

onMounted(async () => {
  data.loadingOrders = true;
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
    data.loadingOrders = false;
  }
});

async function onSubmit(event) {
  data.loading = true;
  try {
    await schema.parseAsync(state);

    const invoicePayload = {
      invoiceNumber: state.invoiceNumber,
      invoiceStatus: state.invoiceStatus,
      totalAmount: state.totalAmount,
      order: { connect: [state.orderId] },
      shipmentDate: state.shipmentDate.toISOString()
    };

    const res = await client('/invoices', {
      method: 'POST',
      body: { data: invoicePayload },
    });
    if (res?.data) {
      const newInvoiceId = res.data.documentId;
      toast.add({
        title: 'Инвойс успешно создан',
        color: 'success',
        icon: 'hugeicons:checkmark-circle-02',
      });
      router.push(`/invoices/${newInvoiceId}`);
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
  state.invoiceNumber = ''
  state.invoiceStatus = 'new'
  state.orderId = ''
  state.shipmentDate = new Date()
  state.totalAmount = 0
}

const isDisabled = computed(() => {
  return data.loading || !state.invoiceNumber || !state.orderId || state.totalAmount <= 0
});
</script>
<template>
  <UCard>
    <template #header>
      <h2 class="main_title">{{ state.invoiceNumber || 'Новый инвойс' }}</h2>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-5" @submit.prevent="onSubmit">
      <UFormField label="Номер инвойса" name="invoiceNumber" required>
        <UInput v-model="state.invoiceNumber" placeholder="Номер/код инвойса" type="text" class="w-full" />
      </UFormField>

      <UFormField label="Заказ" name="orderId" required>
        <USelect
          v-model="state.orderId"
          :items="data.orders"
          placeholder="Выберите заказ"
          :loading="data.loadingOrders" class="w-60" />
      </UFormField>

      <UFormField label="Итоговая сумма" name="totalAmount" required>
        <UInput 
          v-model.number="state.totalAmount" 
          placeholder="Сумма инвойса" 
          type="number" 
          class="w-44" 
          :ui="{ trailing: 'pointer-events-none' }">
          <template #trailing>
            <div class="text-muted tabular-nums" role="currency">
              $
            </div>
          </template>
        </UInput>
      </UFormField>

      <DateModify v-model:inputDate="state.shipmentDate" title="Дата отгрузки" />
      
      <div class="flex items-center justify-between mt-8">
        <UButton to="/invoices" color="primary" variant="ghost">
          Отмена
        </UButton>
        <UButton 
          type="submit" 
          :disabled="isDisabled" 
          :loading="data.loading">
          Создать инвойс
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>