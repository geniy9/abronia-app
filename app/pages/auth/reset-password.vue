<script setup>
const route = useRoute()
</script>
<template>
  <div class="body_layout">
    <div v-if="!route.query.code" class="text-center">
      <UAlert
        icon="hugeicons:alert-01"
        color="warning"
        variant="soft"
        title="Неверная ссылка для сброса пароля"
        description="Пожалуйста, перейдите по ссылке в письме или запросите новую" />
      <UButton to="/auth/forgot-password" class="mt-4">
        Запросить новую ссылку
      </UButton>
    </div>
    <AuthResetPassword v-else />
  </div>
</template>