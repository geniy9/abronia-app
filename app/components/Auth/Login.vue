<script setup>
import { z } from 'zod'
const { login } = useStrapiAuth()
const router = useRouter()

const loading = ref(false)
const error = ref('')

const schema = z.object({
  identifier: z.email('Неправильный формат электронной почты'),
  password: z.string().min(8, 'Пароль не менее 8 символов'),
});

const state = reactive({
  identifier: '',
  password: '',
});

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await login({
      identifier: state.identifier,
      password: state.password,
    });
    router.push('/app');
  } catch (e) {
    error.value = 'Неправильный адрес электронной почты или пароль';
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <h2 class="text-2xl font-bold text-center">
      Вход в аккаунт
    </h2>

    <UForm :state="state" :schema="schema" @submit.prevent="handleLogin">
      <UFormField label="Email" name="identifier" class="mb-2">
        <UInput v-model="state.identifier" type="email" placeholder="you@example.com" class="w-full" />
      </UFormField>

      <UFormField label="Пароль" name="password" class="mb-6">
        <UInput v-model="state.password" type="password" placeholder="••••••••" class="w-full" />
      </UFormField>

      <UButton type="submit" block :loading="loading" color="primary">
        Войти
      </UButton>

      <UAlert
        v-if="error"
        icon="hugeicons:alert-01"
        color="error"
        variant="soft"
        class="mt-4"
        :title="error" />
    </UForm>

    <div class="text-center">
      <p class="text-sm">
        Еще нет аккаунта?
        <NuxtLink to="/auth/register" class="text-primary">
          Создать аккаунт
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
