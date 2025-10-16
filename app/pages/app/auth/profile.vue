<script setup>
definePageMeta({
  middleware: 'auth'
})
const user = useStrapiUser()
</script>
<template>
  <div class="page_layout">
    <div v-if="user" class="w-full">
      <AuthSendEmailConfirmationBanner v-if="!user.confirmed" />
      
      <AuthProfile class="mt-4" />

    </div>
  </div>
</template>