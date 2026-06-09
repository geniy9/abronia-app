<script setup>
const { getRoleLabel, getRoleColor } = useConfig()
const user = useStrapiUser()
const { menuMain } = useMenu()

const isAdminOrManager = computed(() => {
  return (user.value?.role?.type === 'admin' || user.value?.role?.type === 'manager') ? true : false
})
</script>
<template>
  <div class="body_layout">

    <NuxtLink v-if="user" to="/auth/profile" 
      class="flex items-center gap-2 border border-primary rounded-xl w-full p-2">
      <div class="bg-gray-300 rounded-lg w-12 h-12">
        <UIcon name="hugeicons:user-circle-02" class="bg-gray-500 w-12 h-12" />
      </div>
      <div>
        <p class="font-medium">{{ user.username }}</p>
        <UBadge variant="soft" size="sm" :color="getRoleColor(user.role?.type)">
          {{ getRoleLabel(user.role?.type) }}
        </UBadge>
      </div>
    </NuxtLink>

    <div v-if="isAdminOrManager" class="flex flex-col gap-2 items-start w-full">
      <NuxtLink v-for="(m, i) in menuMain" :key="i" :to="m.to" 
        class="flex items-center gap-4 rounded-xl p-2 bg-white dark:bg-gray-900 w-full">
        <img v-if="m.img" :src="m.img" :alt="m.name" class="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-lg p-1" />
        <UIcon v-else name="hugeicons:image-03" class="w-20 h-20 bg-gray-300 dark:bg-gray-600 p-1" />
        <span class="font-bold text-black dark:text-white">
          {{ m.name }}
        </span>
      </NuxtLink>
    </div>
    <UCard v-else>
      <UPageFeature
        title="Доступ ограничен!"
        description="Для получения доступа к хабу Abronia обратитесь к администратору"
        icon="hugeicons:information-circle" 
        :ui="{ leadingIcon: 'text-warning', description: 'text-sm' }"/>
    </UCard>
    
  </div>
</template>