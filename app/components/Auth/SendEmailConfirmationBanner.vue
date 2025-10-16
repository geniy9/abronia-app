<script setup>
const { sendEmailConfirmation } = useStrapiAuth()
const user = useStrapiUser()

const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const handleSend = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''
  try {
    await sendEmailConfirmation({ email: user.value.email })
    successMessage.value = 'Письмо успешно отправлено!'
  } catch (e) {
    error.value = e.error?.message || 'Не удалось отправить письмо'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <UAlert
    icon="hugeicons:mail-01"
    color="primary"
    variant="soft"
    title="Подтвердите свой адрес электронной почты"
    class="mb-6">
    <template #description>
      <p v-if="successMessage" class="text-green-600">{{ successMessage }}</p>
      <p v-else>
        Ваш аккаунт не подтвержден. Пожалуйста, проверьте почту или
        <UButton
          :loading="loading"
          variant="link"
          :padded="false"
          @click="handleSend" 
          class="cursor-pointer">
          отправь письмо еще раз
        </UButton>.
      </p>
      <p v-if="error" class="text-red-500 mt-2 text-xs">{{ error }}</p>
    </template>
  </UAlert>
</template>