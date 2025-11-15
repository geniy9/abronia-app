<script setup>
import { useApiStore } from '~/store/api'
import { z } from 'zod'

const apiStore = useApiStore()
const { update, findOne } = useStrapi()
const { invoiceStatusList } = useConfig()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['on-edited'])

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  invoiceData: {
    type: Object,
    default: null
  },
})

const schema = z.object({
  invoiceNumber: z.string().min(1, 'Укажите артикул/номер инвойса'),
  invoiceStatus: z.enum(invoiceStatusList.map(unit => unit.value)),
  orderId: z.string().min(1, 'Выберите заказ'),
  totalAmount: z.number().min(0, 'Введите сумму к оплате'),
  paidAmount: z.number().min(0, 'Введите оплаченную сумму'),
  shipmentDate: z.date(),
});

const state = reactive({
  invoiceNumber: props.invoiceData?.invoiceNumber || '',
  invoiceStatus: props.invoiceData?.invoiceStatus || 'new',
  orderId: props.invoiceData?.order?.documentId || '',
  totalAmount: props.invoiceData?.totalAmount || 0,
  paidAmount: props.invoiceData?.paidAmount || 0,
  shipmentDate: props.invoiceData?.shipmentDate ? new Date(props.invoiceData.shipmentDate) : new Date(),
});
const data = reactive({
  orders: [],
  loading: false,
  loadingFields: false
});

onMounted(async () => {
  data.loadingFields = true;
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
    data.loadingFields = false;
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
      paidAmount: state.paidAmount,
      order: { connect: [state.orderId] },
      shipmentDate: state.shipmentDate.toISOString(),
    };

    const res = await update('invoices', props.id, invoicePayload);
    
    if (res?.data) {
      const updatedInvoiceData = await findOne('invoices', props.id, {
        populate: {
          order: {
            populate: {
              customer: true,
              productItems: {
                populate: { product: true }
              }
            }
          },
          comment: true,
          attachments: true,
        }
      });

      toast.add({
        title: 'Инвойс успешно обновлен',
        color: 'success',
        icon: 'hugeicons:checkmark-circle-02',
      });
      emit('on-edited', updatedInvoiceData.data);
      router.push(route.path);
    }

  } catch (e) {
    console.error('Ошибка при обновлении инвойса:', e);
    const errorMessage = e instanceof z.ZodError ?
      e.errors.map(err => err.message).join('; ') :
      e.message || 'Произошла неизвестная ошибка.';

    toast.add({
      title: 'Ошибка',
      description: `Ошибка при обновлении инвойса: ${errorMessage}`,
      color: 'error',
      icon: 'hugeicons:cancel-circle',
    });
  } finally {
    data.loading = false;
  }
}
function onRemoved() { router.push('/invoices') }

const isDisabled = computed(() => {
  return data.loading || !state.invoiceNumber || !state.orderId || state.totalAmount <= 0 || state.paidAmount > state.totalAmount;
});
</script>
<template>
  <UCard>
    <UForm :schema="schema" :state="state" class="space-y-5" @submit.prevent="onSubmit">
      <UFormField label="Номер инвойса" name="invoiceNumber" required>
        <UInput v-model="state.invoiceNumber" placeholder="Номер/код инвойса" type="text" class="w-full" />
      </UFormField>

      <UFormField label="Статус инвойса" name="invoiceStatus" required>
        <USelect
          v-model="state.invoiceStatus"
          :items="invoiceStatusList.map(status => ({ label: status.name, value: status.value }))"
          placeholder="Выберите статус"
          class="w-60" />
      </UFormField>

      <UFormField label="Заказ" name="orderId" required>
        <USelect
          v-model="state.orderId"
          :items="data.orders"
          placeholder="Выберите заказ"
          :loading="data.loadingFields" class="w-60" />
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

      <UFormField label="Оплачено" name="paidAmount" required>
        <UInput 
          v-model.number="state.paidAmount" 
          placeholder="Оплаченная сумма" 
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
        <RemoveEntry 
          :id="id" api="invoices" 
          :entry-name="`инвойс ${state.invoiceNumber}?`" 
          @on-removed="onRemoved" />
        <UFieldGroup>
          <UButton :to="route.path" color="neutral" variant="soft" size="sm">
            Отмена
          </UButton>
          <UButton 
            type="submit" size="sm"
            :disabled="isDisabled" 
            :loading="data.loading">
            Обновить инвойс
          </UButton>
        </UFieldGroup>
      </div>
    </UForm>
  </UCard>
</template>