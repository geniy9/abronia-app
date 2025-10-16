<script setup>
import { z } from 'zod'

const { changePassword } = useStrapiAuth()

const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const schema = z.object({
  currentPassword: z.string().min(1, 'Обязательное поле'),
  password: z.string().min(8, 'Пароль должен содержать не менее 8 символов'),
  passwordConfirmation: z.string(),
}).refine(data => data.password === data.passwordConfirmation, {
  message: 'Пароли не совпадают',
  path: ["passwordConfirmation"],
});

const state = reactive({
  currentPassword: '',
  password: '',
  passwordConfirmation: '',
});

const handleChangePassword = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''
  try {
    await changePassword({
      currentPassword: state.currentPassword,
      password: state.password,
      passwordConfirmation: state.passwordConfirmation,
    });
    successMessage.value = 'Пароль успешно изменен!'
    state.currentPassword = ''
    state.password = ''
    state.passwordConfirmation = ''
  } catch (e) {
    error.value = e.error?.message || 'Сменить пароль не удалось. Проверьте текущий пароль'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <div v-if="successMessage" class="p-3 mb-4 bg-green-100 text-green-800 rounded-md text-sm">
      {{ successMessage }}
    </div>

    <UForm :state="state" :schema="schema" @submit.prevent="handleChangePassword" class="space-y-2">
      <UFormField label="Текущий пароль" name="currentPassword">
        <UInput v-model="state.currentPassword" type="password" class="w-full" />
      </UFormField>

      <UFormField label="Новый пароль" name="password">
        <UInput v-model="state.password" type="password" class="w-full" />
      </UFormField>

      <UFormField label="Подтвердите новый пароль" name="passwordConfirmation">
        <UInput v-model="state.passwordConfirmation" type="password" class="w-full" />
      </UFormField>

      <UButton type="submit" :loading="loading" variant="soft" block>
        Изменить пароль
      </UButton>

      <UAlert
        v-if="error"
        icon="hugeicons:alert-01"
        color="red"
        variant="soft"
        class="mt-4"
        :title="error" />
    </UForm>
  </div>
</template>