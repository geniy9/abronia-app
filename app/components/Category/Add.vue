<script setup>
import { useApiStore } from '~/store/api'
import { z } from 'zod'

const apiStore = useApiStore()

const client = useStrapiClient()
const toast = useToast()
const router = useRouter()

const schema = z.object({
  name: z.string().min(1, 'Укажите название категории'),
  description: z.optional(z.string()),
  // sortId: z.number().min(0, 'Укажите индекс сортировки'),
});

const data = reactive({
  name: '',
  description: '',
  sortId: null,
})

async function onSubmit(event) {
  data.loading = true;
  try {
    const res = await client('/categories', {
      method: 'POST',
      body: { data: { ...event.data } },
    });
    if (res?.data) {
      apiStore.addEntryToState('categories', res.data)
      toast.add({ 
        title: 'Категория успешно добавлена', 
        color: 'success', 
        icon: 'hugeicons:checkmark-circle-02'
      });
      router.push(`/stock`)
    }

  } catch (e) {
    toast.add({ 
      title: 'Ошибка', 
      description: 'Ошибка при добавлении категории, попробуйте еще раз', 
      color: 'error', 
      icon: 'hugeicons:cancel-circle'
    })
  } finally {
    data.name = ''
    data.loading = false;
  }
}

const isDisabled = computed(() => { return !data.name })
</script>
<template>
  <UCard>
    <template #header>
      <h2 class="main_title">{{ data.name || 'Новая категория' }}</h2>
    </template>

    <UForm :schema="schema" :state="data" class="space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Название категории" name="name" required>
        <UInput v-model="data.name" placeholder="Название категории" type="text" class="w-full" />
      </UFormField>
      <UFormField label="Описание" name="description">
        <UTextarea v-model="data.description" placeholder="Краткое описание категории" autoresize class="w-full" />
      </UFormField>
      
      <div class="flex items-center justify-between mt-8">
        <UButton to="/stock" color="primary" variant="ghost">
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