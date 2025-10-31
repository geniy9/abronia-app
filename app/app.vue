<script setup>
useHead({
  titleTemplate: (title) => {
    return title ? `${title} | Abronia` : "Abronia Global"
  }
})
</script>
<template>
  <UApp>
    <VitePwaManifest />
    <div class="flex flex-col min-h-screen overflow-hidden bg-black text-white">
      <Background />
      <Headers />
      <div class="flex-grow py-16 px-2 z-0">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </div>
      <Footers />
    </div>
  </UApp>
</template>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

