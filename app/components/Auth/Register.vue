<script setup>
import { z } from 'zod';

const { register } = useStrapiAuth()
const router = useRouter()
const loading = ref(false)
const error = ref('')

const schema = z.object({
  username: z.string().min(3, 'Имя должно содержать не менее 3 символов'),
  email: z.email('Неправильный формат электронной почты'),
  password: z.string().min(8, 'Пароль должен содержать не менее 8 символов'),
});

const state = reactive({
  username: '',
  email: '',
  password: '',
});

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  try {
    await register({
      username: state.username,
      email: state.email,
      password: state.password,
    });
    router.push('/app/auth/profile');
  } catch (e) {
    error.value = e.error?.message || 'Во время регистрации произошла ошибка';
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <h2 class="text-2xl font-bold text-center">
      Регистрация
    </h2>

    <UForm :state="state" :schema="schema" @submit.prevent="handleRegister">
      <UFormField label="Имя пользователя" name="username" class="mb-4">
        <UInput v-model="state.username" placeholder="Дональд Трамп" class="w-full" />
      </UFormField>

      <UFormField label="Email" name="email" class="mb-4">
        <UInput v-model="state.email" type="email" placeholder="you@example.com" class="w-full" />
      </UFormField>

      <UFormField label="Пароль" name="password" class="mb-6">
        <UInput v-model="state.password" type="password" placeholder="••••••••" class="w-full" />
      </UFormField>

      <UButton type="submit" block :loading="loading" color="primary">
        Зарегистрироваться
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
        Уже есть аккаунт?
        <NuxtLink to="/auth/login" class="text-primary">
          Войти
        </NuxtLink>
      </p>
    </div>
  </div>
</template>