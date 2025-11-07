// service-worker/firebase-config.ts
const config = {
  apiKey: import.meta.env.NUXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.NUXT_PUBLIC_FIREBASE_APP_ID,
}

export const vapidKey = import.meta.env.NUXT_PUBLIC_FCM_VAPID_KEY
export default config
