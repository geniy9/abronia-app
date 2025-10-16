<script setup>
definePageMeta({
  hideHeader: true,
  hideFooter: true
})
</script>
<template>
  <div class="absolute top-1/2 left-1/2 -translate-1/2">
    <div class="flex flex-col gap-8">
      <NuxtLink to="/" class="flex items-center justify-center">
        <img src="/abronia.svg" alt="logo" class="w-60" />
      </NuxtLink>
      <NuxtLink to="/app" class="flex gap-2 items-center justify-center text-xs text-white tracking-widest">
        <UIcon name="hugeicons:more-horizontal-square-01" class="text-lg" />
        <span>Global App</span>
        <UIcon name="hugeicons:more-horizontal-square-01" class="text-lg" />
      </NuxtLink>
    </div>
  </div>
</template>