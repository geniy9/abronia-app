<script setup>
definePageMeta({
  middleware: 'auth'
})
const route = useRoute()
const user = useStrapiUser()
const isEdit = computed(() => route.hash === '#edit')
</script>
<template>
  <div class="body_layout">
    <div v-if="user" class="body_content">

      <div class="grid grid-cols-[auto_1fr_auto] items-center dark:text-white text-black">
        <NuxtLink to="/home" class="text-2xl leading-0 p-2">
          <UIcon name="hugeicons:link-backward" />
        </NuxtLink>
        <div>
          <NuxtLink to="/auth/profile" class="body_head">
            <UIcon name="hugeicons:user-circle-02" class="bg-primary w-16 h-16" />
          </NuxtLink>
          <h2 class="main_title">Профиль</h2>
        </div>
        <NuxtLink :to="isEdit ? route.path : `${route.path}#edit`" class="text-2xl leading-0 p-2">
          <UIcon :name="isEdit ? 'hugeicons:cancel-square' : 'hugeicons:settings-01'" class="text-2xl" />
        </NuxtLink>
      </div>

      <AuthSendEmailConfirmationBanner v-if="!user.confirmed" />
      
      <AuthProfile />

    </div>
  </div>
</template>