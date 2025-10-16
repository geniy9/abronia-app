<script setup>
const user = useStrapiUser()
</script>
<template>
  <div class="flex items-center leading-0">
    <NuxtLink v-if="user" to="/app/auth/profile">
      <UIcon name="hugeicons:user-circle-02" class="text-primary w-6 h-6" />
    </NuxtLink>
    <NuxtLink v-else to="/app/auth/login">
      <UIcon name="hugeicons:user-circle-02" class="text-primary w-6 h-6" />
    </NuxtLink>
  </div>
</template>