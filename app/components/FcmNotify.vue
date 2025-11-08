<script setup>
const { $fcmGetToken, $fcmOnMessage, $fcmSupported, $fcmWhy } = useNuxtApp()
const config = useRuntimeConfig()

const permission = ref(Notification.permission)
const token = ref(null)
const loading = ref(false)
const error = ref(null)
const done = computed(() => permission.value === 'granted' && !!token.value)

async function askPermission() {
  try {
    loading.value = true
    error.value = null
    if (!$fcmSupported) {
      error.value = 'Браузер не поддерживает Web Push (FCM)'
      return
    }
    
    if (permission.value !== 'granted') {
      const result = await Notification.requestPermission()
      permission.value = result
      if (result !== 'granted') {
        error.value = 'Разрешение отклонено'
        return
      }
    }
    token.value = await $fcmGetToken()
    if (!token.value) {
      error.value = 'Не удалось получить FCM токен'
      return
    }

    await $fetch(`${config.public.STRAPI_URL}/api/push/register`, {
      method: 'POST',
      body: { 
        token: token.value, 
        platform: 'web' 
      },
    })
  } catch (e) {
    error.value = e?.message || 'Ошибка'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if ($fcmSupported) {
    $fcmOnMessage((payload) => {
      const title = payload?.notification?.title || 'Напоминания'
      const body  = payload?.notification?.body  || 'У вас новое напоминание'
      console.log('[FCM] foreground message', payload)
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/app/icons/icon-192x192.png', data: payload?.data || {} })
      }
    })
  }
})
</script>

<!-- <template>
  <div class="flex items-center gap-2">
    <UButton @click="askPermission" :loading="loading" color="primary" icon="hugeicons:notification-01">
      Разрешить уведомления
    </UButton>
    <span v-if="done" class="text-xs opacity-70">Готово</span>
    <span v-else-if="!$fcmSupported" class="text-xs opacity-70">Не поддерживается</span>
    <span v-if="error" class="text-xs text-red-400">{{ error }}</span>
  </div>
</template> -->

<template>
  <div class="flex items-center gap-2">
    <UButton @click="askPermission" :loading="loading" color="primary" icon="hugeicons:notification-01">
      Разрешить уведомления
    </UButton>

    <span v-if="done" class="text-xs opacity-70">Готово</span>
    <span v-else-if="!$fcmSupported" class="text-xs text-red-400">
      Не поддерживается
      <UTooltip :text="JSON.stringify($fcmWhy)" />
    </span>

    <span v-if="error" class="text-xs text-red-400">{{ error }}</span>
  </div>
</template>
