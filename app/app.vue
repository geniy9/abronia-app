<script setup>
useHead({
  titleTemplate: (title) => {
    return title ? `${title} | Abronia` : "Abronia Global"
  }
})
const { $pwa } = useNuxtApp();
</script>
<template>
  <UApp>

    <NuxtPwaManifest />

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

    <ClientOnly>
      <div v-if="$pwa?.offlineReady || $pwa?.needRefresh"
        class="fixed bottom-4 right-4 m-4 p-4 border border-gray-300 rounded-md shadow-lg z-[9999] text-left bg-white text-gray-800"
        role="alert">
        <div class="mb-2">
          <span v-if="$pwa.offlineReady">
            Приложение готово к утсновке
          </span>
          <span v-else>
            Доступен новый контент, нажмите "Обновить", чтобы применить.
          </span>
        </div>
        <button v-if="$pwa.needRefresh"
          @click="$pwa.updateServiceWorker()"
          class="bg-gray-800 text-white border border-gray-800 outline-none mr-2 rounded-md px-3 py-1 cursor-pointer hover:opacity-80 transition-opacity duration-200">
          Обновить
        </button>
        <button @click="$pwa.cancelPrompt()"
          class="bg-transparent text-gray-800 border border-gray-300 outline-none rounded-md px-3 py-1 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
          Закрыть
        </button>
      </div>

      <!-- Запрос на установку -->
      <div v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh"
        class="fixed bottom-4 right-4 m-4 p-4 border border-gray-300 rounded-md shadow-lg z-[9999] text-left bg-white text-gray-800" role="alert">
        <div class="mb-2">
          <span>Установить Abronia App?</span>
        </div>
        <button 
          @click="$pwa.install()"
          class="bg-primary text-white outline-none mr-2 rounded-md px-3 py-1 cursor-pointer hover:bg-primary/80 transition-colors duration-200">
          Установить
        </button>
        <button 
          @click="$pwa.cancelInstall()"
          class="bg-transparent text-gray-800 border border-gray-300 outline-none rounded-md px-3 py-1 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
          Отмена
        </button>
      </div>
    </ClientOnly>
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

