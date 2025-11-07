// plugins/fcm.client.js
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

export default defineNuxtPlugin(() => {
  const publicRuntime = useRuntimeConfig().public
  const firebaseConfig = {
    apiKey: publicRuntime.NUXT_PUBLIC_FIREBASE_API_KEY || import.meta.env.NUXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: publicRuntime.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || import.meta.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: publicRuntime.NUXT_PUBLIC_FIREBASE_PROJECT_ID || import.meta.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: publicRuntime.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || import.meta.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: publicRuntime.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: publicRuntime.NUXT_PUBLIC_FIREBASE_APP_ID || import.meta.env.NUXT_PUBLIC_FIREBASE_APP_ID,
  }

  for (const [k, v] of Object.entries(firebaseConfig)) {
    if (!v) {
      console.error('[FCM] missing config', k)
      return
    }
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  const messaging = getMessaging(app)

  const vapidKey = publicRuntime.NUXT_PUBLIC_FCM_VAPID_KEY || import.meta.env.NUXT_PUBLIC_FCM_VAPID_KEY

  async function fcmGetToken () {
    if (!('serviceWorker' in navigator)) return
    const reg = await navigator.serviceWorker.ready
    return await getToken(messaging, { vapidKey, serviceWorkerRegistration: reg })
  }

  function fcmOnMessage (cb) {
    return onMessage(messaging, cb)
  }

  return { provide: { fcmGetToken, fcmOnMessage } }
})