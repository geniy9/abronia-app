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
<!-- <style>
.page-enter-active,
.page-leave-active {
  transition: all 0.7s ease-in-out;
}
.page-enter-from {
  opacity: 0;
  transform: rotateY(-60deg);
}
.page-leave-to {
  opacity: 0;
  transform: rotateY(60deg);
}
.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: rotateY(0deg);
}
</style> -->

