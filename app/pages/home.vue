<script setup>
definePageMeta({
  middleware: 'auth'
})
const user = useStrapiUser()
const { menuMain } = useMenu()
</script>
<template>
  <div class="body_layout">

    <NuxtLink v-if="user" to="/auth/profile" 
      class="flex items-center gap-2 border border-primary rounded-xl w-full p-2">
      <div class="bg-gray-300 w-9 h-9 rounded-lg">
        <UIcon name="hugeicons:user-circle-02" class="bg-gray-500 w-9 h-9" />
      </div>
      <div>
        <p class="text-sm text-gray-400">Пользователь</p>
        <p class="font-medium">{{ user.username }}</p>
      </div>
    </NuxtLink>

    <div class="flex flex-col gap-2 items-start w-full">
      <NuxtLink v-for="(m, i) in menuMain" :key="i" :to="m.to" 
        class="flex items-center gap-4 rounded-xl p-2 bg-white dark:bg-gray-900 w-full">
        <img v-if="m.img" :src="m.img" :alt="m.name" class="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-lg p-1" />
        <UIcon v-else name="hugeicons:image-03" class="w-20 h-20 bg-gray-300 dark:bg-gray-600 p-1" />
        <span class="font-bold text-black dark:text-white">
          {{ m.name }}
        </span>
      </NuxtLink>
    </div>
    
  </div>
</template>