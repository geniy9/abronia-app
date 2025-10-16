<script setup>
const { menuMain } = useMenu()
const isOpen = ref(false)

const route = useRoute()
const hideHeader = computed(() => {
  const routeMeta = route.meta
  return routeMeta.hideHeader || false
})
</script>
<template>
  <header class="fixed top-0 w-full p-2 z-20 bg-white rounded-b-2xl transition-all duration-300" 
    :class="[hideHeader ? 'rounded-b-none -translate-y-full' : 'rounded-b-2xl translate-y-0']">
    <div class="section grid grid-cols-3 items-center gap-4">
      
      <ToggleTheme />

      <NuxtLink to="/app/home" class="flex justify-center">
        <img src="/abronia.svg" alt="logo" class="w-30" />
      </NuxtLink>
      
      <div class="flex justify-end gap-4">

        <!-- <Cart class="flex" /> -->

        <AuthBar />

        <!-- <USlideover v-model:open="isOpen" close-icon="hugeicons:cancel-01" :ui="{ content: 'w-8/9'}">
          <Icon name="hugeicons:dialpad-circle-01" @click="isOpen = true" class="w-7 h-7 cursor-pointer" />

          <template #header>
            <div @click="isOpen = false" class="flex items-center justify-between w-full">
              <NuxtLink to="/">
                <img src="/logo.svg" alt="logo" class="w-24 h-auto" />        
              </NuxtLink>
              <Icon name="hugeicons:cancel-01" @click="isOpen = false" class="w-7 h-7 cursor-pointer scale-100 hover:scale-110 transition-all text-secondary" />
            </div>
          </template>

          <template #body>
            <div class="relative flex flex-col justify-start gap-12">
              <div @click="isOpen = false" class="relative max-w-full flex items-start justify-between">
                <AuthBar class="flex md:hidden" />
              </div>
              <SearchBar class="flex md:hidden" @close-slideover="isOpen = false" />

              <nav @click="isOpen = false">
                <ul class="flex flex-col items-start">
                  <li v-for="(m, i) in menuMain" :key="i">
                    <NuxtLink :to="m.to" class="block text-sm font-black tracking-widest select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none uppercase">
                      {{ m.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </nav>

            </div>
          </template>
        </USlideover> -->

      </div>
    </div>
  </header>
</template>
