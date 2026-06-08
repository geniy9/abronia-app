<script setup>
definePageMeta({
  hideHeader: true,
  hideFooter: true
})
</script>
<template>
  <div class="absolute top-1/2 left-1/2 -translate-1/2">
    <div class="flex flex-col gap-8">
      <div class="flex items-center justify-center">
        <img src="/abronia.svg" alt="logo" class="w-60" />
      </div>
      <USeparator label="Global App" />
      <NuxtLink to="/home" class="flex gap-2 items-center justify-center text-xs text-white tracking-widest">
        <span>Войти</span>
      </NuxtLink>
    </div>
  </div>
</template>