<!-- <script setup>
import { z } from 'zod'

const client = useStrapiClient()
const toast = useToast()
const router = useRouter()

const schema = z.object({
  name: z.string().min(3, 'Укажите название компании или имя клиента'),
  description: z.optional(z.string()),
  contactName: z.string().min(3, 'Укажите контактное лицо'),
  phone: z.string().min(6, 'Укажите номер телефона').optional(), 
  email: z.email('Неверный формат email').optional(),
  website: z.string().optional(),
});

const data = reactive({
  name: '',
  description: '',
  contactName: '',
  phone: '',
  email: '',
  website: '',
  loading: false,
})

async function onSubmit(event) {
  data.loading = true;
  try {
    const res = await client('/customers', {
      method: 'POST',
      body: { data: { ...event.data } },
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
  data.name = data.description = data.contactName = ''
  data.phone = data.email = data.website = ''
}
const isDisabled = computed(() => { return !data.name })
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
        <UButton to="/customers" color="primary" variant="ghost">
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
</template> -->

<script setup>
import { z } from 'zod'

const client = useStrapiClient()
const toast = useToast()
const router = useRouter()

const schema = z.object({
  name: z.string().min(1, 'Укажите название компании или имя клиента'),
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
  name: '',
  description: '',
  website: '',
  contact: [{ position: '', name: '', phone: '', email: '' }],
  loading: false,
})

function addContact() {
  data.contact.push({ position: '', name: '', phone: '', email: '' });
}
function removeContact(index) { data.contact.splice(index, 1) }

async function onSubmit(event) {
  data.loading = true;
  const payload = { ...event.data }; 
  if (payload.contact && payload.contact.length) {
    payload.contact.forEach(person => {
      if (person.position === '') person.position = null;
      if (person.phone === '') person.phone = null;
      if (person.email === '') person.email = null;
    });
  }
  try {
    const res = await client('/customers', {
      method: 'POST',
      body: { data: { ...payload } },
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
    console.error(e)
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
  data.website = ''
  data.contact = [{ position: '', name: '', phone: '', email: '' }]
}
const isDisabled = computed(() => { return !data.name })
</script>
<template>
  <UCard>
    <template #header>
      <h2 class="main_title">{{ data.name || 'Новый клиент' }}</h2>
    </template>

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
      
      <UDivider label="Контакты" class="my-6" />

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
        @click="addContact"
      />
      
      <div class="flex items-center justify-between pt-4">
        <UButton to="/customers" color="primary" variant="ghost">
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