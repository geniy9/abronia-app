// server/api/firebase-config.get.ts
export default defineEventHandler((event) => {
  const p = useRuntimeConfig(event).public
  return {
    apiKey: p.NUXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: p.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: p.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: p.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: p.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: p.NUXT_PUBLIC_FIREBASE_APP_ID,
    vapidKey: p.NUXT_PUBLIC_FCM_VAPID_KEY,
  }
})
