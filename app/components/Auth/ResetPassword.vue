<script setup>
import { z } from 'zod'
const { resetPassword } = useStrapiAuth()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const code = route.query.code

const schema = z.object({
  password: z.string().min(8, 'Пароль должен содержать не менее 8 символов'),
  passwordConfirmation: z.string().min(8, 'Пароль должен содержать не менее 8 символов'),
}).refine(data => data.password === data.passwordConfirmation, {
  message: 'Пароли не совпадают',
  path: ["passwordConfirmation"],
});


const state = reactive({
  password: '',
  passwordConfirmation: '',
});

const handleResetPassword = async () => {
  if (!code) {
    error.value = 'Кода для сброса пароля нет. Пожалуйста, запросите ссылку еще раз'
    return;
  }
  loading.value = true
  error.value = ''

  try {
    await resetPassword({
      code,
      password: state.password,
      passwordConfirmation: state.passwordConfirmation,
    });
    await router.push('/auth/profile')
  } catch (e) {
    error.value = e.error?.message || 'Неверный или просроченный код. Попробуйте еще раз.'
    console.error(e)
  } finally {
    loading.value = false
  }
};
</script>
<template>
  <UCard class="max-w-md mx-auto">
    <template #header>
      <h2 class="text-2xl font-bold text-center">
        Установка нового пароля
      </h2>
    </template>

    <UForm :state="state" :schema="schema" @submit.prevent="handleResetPassword">
      <UFormField label="Новый пароль" name="password" class="mb-4">
        <UInput v-model="state.password" type="password" placeholder="••••••••" />
      </UFormField>

      <UFormField label="Подтвердите новый пароль" name="passwordConfirmation" class="mb-6">
        <UInput v-model="state.passwordConfirmation" type="password" placeholder="••••••••" />
      </UFormField>

      <UButton type="submit" block :loading="loading" color="primary">
        Обновить пароль
      </UButton>

      <UAlert
        v-if="error"
        icon="hugeicons:alert-01"
        color="error"
        variant="soft"
        class="mt-4"
        :title="error"
      />
    </UForm>
  </UCard>
</template>