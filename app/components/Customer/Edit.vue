<script setup>
import { z } from 'zod'

const { update } = useStrapi()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['on-edited'])

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  customerData: {
    type: Object,
    default: null
  },
})

const schema = z.object({
  name: z.string().min(3, 'Укажите название компании или имя клиента'),
  description: z.optional(z.string()),
  contactName: z.string().min(3, 'Укажите контактное лицо'),
  phone: z.string().optional(), 
  email: z.email('Неверный формат email').optional(),
  website: z.string().optional(),
});

const data = reactive({
  name: props.customerData?.name || '',
  description: props.customerData?.description || '',
  contactName: props.customerData?.contactName || '',
  phone: props.customerData?.phone || '',
  email: props.customerData?.email || '',
  website: props.customerData?.website || '',
  loading: false,
})

async function onSubmit(event) {
  data.loading = true;
  try {
    const customerPayload = { ...event.data }
    const res = await update('customers', props.id, customerPayload);
    if (res?.data) {
      toast.add({ 
        title: 'Клиент успешно обновлен', 
        color: 'success', 
        icon: 'hugeicons:checkmark-circle-02'
      });
      emit('on-edited', res.data)
      router.push(route.path);
    }

  } catch (e) {
    toast.add({ 
      title: 'Ошибка', 
      description: 'Ошибка при обновлении клиента, попробуйте еще раз', 
      color: 'error', 
      icon: 'hugeicons:cancel-circle'
    })
  } finally {
    data.loading = false;
  }
}
function onRemoved() { router.push(route.path) }
const isDisabled = computed(() => { return !data.name })
</script>
<template>
  <UCard>
    <UForm :schema="schema" :state="data" class="space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Клиент" name="name" required>
        <UInput v-model="data.name" placeholder="Название компании / Имя клиента" type="text" class="w-full" />
      </UFormField>
      <UFormField label="Описание" name="description">
        <UTextarea v-model="data.description" placeholder="Краткое описание деятельности" autoresize class="w-full" />
      </UFormField>
      <UFormField label="Контактное лицо" name="contactName">
        <UInput v-model="data.contactName" placeholder="Контактное лицо" type="text" class="w-full" />
      </UFormField>

      <h3 class="font-semibold mt-6 mb-2">Контактная информация</h3>
      <UFormField label="Телефон" name="phone">
        <UInput v-model="data.phone" placeholder="+993 (XX) XX-XX-XX" type="text" class="w-full" />
      </UFormField>
      <UFormField label="Email" name="email">
        <UInput v-model="data.email" placeholder="example@company.com" type="email" class="w-full" />
      </UFormField>
      <UFormField label="Сайт" name="website">
        <UFieldGroup class="w-80">
          <UBadge color="neutral" variant="outline" label="https://" />
          <UInput v-model="data.website" placeholder="www.company.com" type="text" class="w-full" />
        </UFieldGroup>
      </UFormField>
      
      <div class="flex items-center justify-between mt-8">
        <RemoveEntry 
          :id="id" api="customers" 
          :entry-name="`клиент ${data.name}?`" 
          @on-removed="onRemoved" />
        <UFieldGroup>
          <UButton :to="route.path" color="neutral" variant="soft" size="sm">
            Отмена
          </UButton>
          <UButton 
            type="submit" size="sm"
            :disabled="isDisabled" 
            :loading="data.loading">
            Обновить
          </UButton>
        </UFieldGroup>
      </div>
    </UForm>
  </UCard>
</template>