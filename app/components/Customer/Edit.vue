<script setup>
import { z } from 'zod'

const { update, findOne } = useStrapi()   
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
  description: z.string().optional(),
  website: z.string().optional(),
  contact: z.array(z.object({
    position: z.string().optional(),
    name: z.string().min(1, 'Укажите имя контакта'),
    phone: z.string().min(6, 'Укажите номер телефона').optional(), 
    email: z.email('Неверный формат email').optional().or(z.literal('')),
  })).optional()
});

const data = reactive({
  name: props.customerData?.name || '',
  description: props.customerData?.description || '',
  website: props.customerData?.website || '',
  contact: props.customerData?.contact && props.customerData.contact.length > 0 
    ? JSON.parse(JSON.stringify(props.customerData.contact)) 
    : [{ position: '', name: '', phone: '', email: '' }],
  loading: false,
})

function addContact() {
  data.contact.push({ position: '', name: '', phone: '', email: '' });
}
function removeContact(index) { data.contact.splice(index, 1) }

async function onSubmit(event) {
  data.loading = true;
  try {
    const customerPayload = { ...event.data }
    
    if (customerPayload.contact && customerPayload.contact.length) {
      customerPayload.contact.forEach(person => {
        if (person.position === '') person.position = null;
        if (person.phone === '') person.phone = null;
        if (person.email === '') person.email = null;
      });
    }

    const responseCustomer = await update('customers', props.id, customerPayload);
    if (responseCustomer?.data) {
      const res = await findOne('customers', props.id, {
        populate: { comment: true, contact: true }
      })
      toast.add({ 
        title: 'Клиент успешно обновлен', 
        color: 'success', 
        icon: 'hugeicons:checkmark-circle-02'
      });
      emit('on-edited', res.data)
    }

  } catch (e) {
    console.error(e); // Для отладки
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
function onRemoved() { router.push('/customers') }
const isDisabled = computed(() => { return !data.name })
</script>
<template>
  <UCard>
    <UForm :schema="schema" :state="data" class="space-y-4" @submit="onSubmit">
      <UFormField label="Клиент" name="name" required>
        <UInput v-model="data.name" placeholder="Название компании / Имя клиента" class="w-full" />
      </UFormField>
      <UFormField label="Описание" name="description">
        <UTextarea v-model="data.description" placeholder="Краткое описание деятельности" autoresize class="w-full" />
      </UFormField>
      <UFormField label="Сайт" name="website">
        <UFieldGroup class="w-full">
          <UBadge color="neutral" variant="outline" label="https://" />
          <UInput v-model="data.website" placeholder="company.com" type="text" class="w-full" />
        </UFieldGroup>
      </UFormField>

      <USeparator label="Контакты" class="my-6" />

      <div v-for="(person, i) in data.contact" :key="i" class="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg space-y-4 relative">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-gray-900 dark:text-white">Контакт #{{ i + 1 }}</h3>
          <UButton v-if="data.contact.length > 1"
            icon="hugeicons:cancel-01" 
            size="sm" 
            color="error" 
            square 
            variant="soft"
            @click="removeContact(i)" />
        </div>
        <UFormField label="Должность" :name="`contact.${i}.position`">
          <UInput v-model="person.position" placeholder="Менеджер по продажам" class="w-full" />
        </UFormField>
        <UFormField label="Имя" :name="`contact.${i}.name`">
          <UInput v-model="person.name" placeholder="Имя Фамилия" class="w-full" />
        </UFormField>
        <UFormField label="Телефон" :name="`contact.${i}.phone`">
          <UInput v-model="person.phone" placeholder="+993 (XX) XX-XX-XX" class="w-full" />
        </UFormField>
        <UFormField label="Email" :name="`contact.${i}.email`">
          <UInput v-model="person.email" placeholder="example@company.com" type="email" class="w-full" />
        </UFormField>
      </div>

      <UButton 
        label="Добавить контакт" 
        icon="hugeicons:user-add-02" 
        variant="outline"
        @click="addContact" />
      
      <div class="flex items-center justify-between pt-4">
        <RemoveEntry 
          :id="id" api="customers" 
          :entry-name="`клиент ${data.name}`" 
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