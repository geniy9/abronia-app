<script setup>
import { z } from 'zod'

const { forgotPassword } = useStrapiAuth()

const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const schema = z.object({
  email: z.email('Неправильный формат электронной почты'),
})
const state = reactive({
  email: '',
})

const handleForgotPassword = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''
  try {
    await forgotPassword({ email: state.email })
    successMessage.value = 'На вашу электронную почту будут отправлены инструкции по сбросу пароля.'
  } catch (e) {
    console.error("Forgot password error:", e);
    successMessage.value = 'Вы уверены, что аккаунт с таким адресом электронной почты существует?'
  } finally {
    loading.value = false
  }
};
</script>
<template>
  <UCard class="max-w-md mx-auto">
    <template #header>
      <h2 class="text-2xl font-bold text-center">
        Забыли пароль?
      </h2>
    </template>

    <div v-if="successMessage" class="p-4 bg-green-100 text-green-800 rounded-md text-center">
      {{ successMessage }}
    </div>
    <UForm v-else :state="state" :schema="schema" @submit.prevent="handleForgotPassword">
      <p class="text-sm text-gray-600 mb-4">
        Введите адрес электронной почты для сброса пароля
      </p>
      <UFormField label="Email" name="email" class="mb-6">
        <UInput v-model="state.email" type="email" placeholder="you@example.com" />
      </UFormField>

      <UButton type="submit" block :loading="loading">
        Отправить ссылку
      </UButton>

      <UAlert
        v-if="error"
        icon="hugeicons:alert-01"
        color="error"
        variant="soft"
        class="mt-4"
        :title="error" />
    </UForm>

    <template #footer>
      <div class="text-center">
        <NuxtLink to="/auth/login" class="text-sm text-primary font-medium">
          Вернуться ко входу
        </NuxtLink>
      </div>
    </template>
  </UCard>
</template>