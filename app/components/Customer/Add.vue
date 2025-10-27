<script setup>
import { z } from 'zod'

const client = useStrapiClient()
const toast = useToast()
const router = useRouter()

const schema = z.object({
  name: z.string().min(3, 'Укажите название компании или имя клиента'),
  description: z.optional(z.string()),
  contactName: z.string().min(3, 'Укажите контактное лицо'),
  contacts: z.object({
    phone: z.string().min(6, 'Укажите номер телефона').optional(), 
    email: z.email('Неверный формат email').optional(),
    website: z.string().min(6, 'Укажите вебсайт').optional(),
  }).optional()
});

const data = reactive({
  name: '',
  description: '',
  contactName: '',
  contacts: {
    phone: '',
    email: '',
    website: '',
  },
  loading: false,
})

async function onSubmit(event) {
  data.loading = true;
  try {
    const contactsPayload = {};
    if (data.contacts.phone) contactsPayload.phone = data.contacts.phone;
    if (data.contacts.email) contactsPayload.email = data.contacts.email;
    if (data.contacts.website) contactsPayload.website = data.contacts.website;

    const customerPayload = { 
      ...event.data, 
      contacts: contactsPayload
    };
    const res = await client('/customers', {
      method: 'POST',
      body: { data: customerPayload },
    });
    if (res?.data) {
      const newCustomerId = res.data.documentId;
      toast.add({ 
        title: 'Клиент успешно добавлен', 
        color: 'success', 
        icon: 'hugeicons:checkmark-circle-02'
      });
      router.push(`/customers/${newCustomerId}`)
    }

  } catch (e) {
    toast.add({ 
      title: 'Ошибка', 
      description: 'Ошибка при добавлении клиента, попробуйте еще раз', 
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
  data.description = ''
  data.contactName = '';
  data.contacts = {
    phone: '',
    email: '',
    website: '',
  }
}
const isDisabled = computed(() => { return !data.name || !data.contactName })
</script>
<template>
  <UCard>
    <template #header>
      <h2 class="main_title">{{ data.name || 'Новый клиент' }}</h2>
    </template>

    <UForm :schema="schema" :state="data" class="space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Клиент" name="name" required>
        <UInput v-model="data.name" placeholder="Название компании / Имя клиента" type="text" class="w-full" />
      </UFormField>
      <UFormField label="Описание" name="description" required>
        <UTextarea v-model="data.description" placeholder="Краткое описание деятельности" autoresize class="w-full" />
      </UFormField>
      <UFormField label="Контактное лицо" name="contactName" required>
        <UInput v-model="data.contactName" placeholder="Контактное лицо" type="text" class="w-full" />
      </UFormField>

      <h3 class="font-semibold mt-6 mb-2">Контактная информация</h3>
      <UFormField label="Телефон" name="contacts.phone">
        <UInput v-model="data.contacts.phone" placeholder="+993 (XX) XX-XX-XX" type="text" class="w-full" />
      </UFormField>
      <UFormField label="Email" name="contacts.email">
        <UInput v-model="data.contacts.email" placeholder="example@company.com" type="email" class="w-full" />
      </UFormField>
      <UFormField label="Сайт" name="contacts.website">
        <UFieldGroup class="w-80">
          <UBadge color="neutral" variant="outline" label="https://" />
          <UInput v-model="data.contacts.website" placeholder="www.company.com" type="text" class="w-full" />
        </UFieldGroup>
      </UFormField>
      
      <div class="flex items-center justify-between">
        <UButton to="/customers" color="primary" variant="ghost">
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