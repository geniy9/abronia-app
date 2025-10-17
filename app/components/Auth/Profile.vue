<script setup>
const user = useStrapiUser()
const { logout } = useStrapiAuth()
const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/')
};

onMounted(() => {
  if (!user.value) {
    router.push('/auth/login')
  }
})
</script>
<template>
  <div class="flex flex-col gap-8">
    <UCard v-if="user">
      <template #header>
        <h2 class="text-2xl font-bold dark:text-white text-gray-700">
          Профиль
        </h2>
      </template>

      <div class="space-y-4">
        <div>
          <p class="text-sm text-gray-500">Имя пользователя</p>
          <p class="font-medium dark:text-white text-gray-700">{{ user.username }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Email</p>
          <p class="font-medium dark:text-white text-gray-700">{{ user.email }}</p>
        </div>
        <UFormField label="Тема дизайна">
          <ToggleTheme legend />
        </UFormField>
        <UCollapsible class="flex flex-col gap-2 w-full">
          <UButton
            class="group"
            label="Сменить пароль"
            color="neutral"
            variant="soft"
            trailing-icon="hugeicons:arrow-down-01"
            :ui="{
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
            }"
            block />
          <template #content>
            <AuthChangePassword />
          </template>
        </UCollapsible>
      </div>

      <template #footer>
        <UButton @click="handleLogout" color="primary" variant="solid" block>
          Выход
        </UButton>
      </template>
    </UCard>
  </div>
</template>