// // plugins/fcm.client.js
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig().public

  const firebaseConfig = {
    apiKey: config.NUXT_PUBLIC_FIREBASE_API_KEY || import.meta.env.NUXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: config.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || import.meta.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: config.NUXT_PUBLIC_FIREBASE_PROJECT_ID || import.meta.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: config.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || import.meta.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: config.NUXT_PUBLIC_FIREBASE_APP_ID || import.meta.env.NUXT_PUBLIC_FIREBASE_APP_ID,
  }

  for (const [k, v] of Object.entries(firebaseConfig)) {
    if (!v) {
      console.error('[FCM] missing config', k)
      return { provide: { fcmSupported: false } }
    }
  }

  const vapidKey = config.NUXT_PUBLIC_FCM_VAPID_KEY || import.meta.env.NUXT_PUBLIC_FCM_VAPID_KEY

  if (!vapidKey) {
    console.error('[FCM] missing VAPID key')
    return { provide: { fcmSupported: false } }
  }

  // 1) Проверим поддержку
  const supported = await isSupported().catch(() => false)
  if (!supported) {
    console.warn('[FCM] Messaging is NOT supported in this browser/env')
    return { provide: { fcmSupported: false } }
  }

  // 2) Firebase app
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  const messaging = getMessaging(app)

  async function getRegistration() {
    if (!('serviceWorker' in navigator)) return null
    const reg = await navigator.serviceWorker.ready
    if (!location.pathname.startsWith('/app/')) {
      console.warn('[FCM] app base is /app/, current path:', location.pathname)
    }
    return reg
  }

  async function fcmGetToken() {
    try {
      const reg = await getRegistration()
      if (!reg) throw new Error('No serviceWorker support')

      const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: reg })
      return token || null
    } catch (err) {
      console.error('[FCM] getToken error:', err)
      return null
    }
  }

  function fcmOnMessage(cb) {
    try {
      return onMessage(messaging, cb)
    } catch (err) {
      console.error('[FCM] onMessage error:', err)
      return () => {}
    }
  }

  return {
    provide: {
      fcmSupported: true,
      fcmGetToken,
      fcmOnMessage,
    },
  }
})
