<script setup>
useHead({
  titleTemplate: (title) => {
    return title ? `${title} | ABRONIA` : "ABRONIA"
  }
})
</script>
<template>
  <UApp>
    <div class="flex flex-col min-h-screen overflow-hidden bg-black text-white">
      <!-- <Background /> -->
      <Headers />
      <div class="flex-grow py-16 z-0">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </div>
      <Footers />
    </div>
  </UApp>
</template>
<!-- <style>
.page-enter-active,
.page-leave-active {
  transition: all 0.5s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(24px);
}
</style> -->
