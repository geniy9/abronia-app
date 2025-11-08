// // // plugins/fcm.client.js
// import { initializeApp, getApps, getApp } from 'firebase/app'
// import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'

// export default defineNuxtPlugin(async () => {
//   const config = useRuntimeConfig().public

//   const firebaseConfig = {
//     apiKey: config.NUXT_PUBLIC_FIREBASE_API_KEY || import.meta.env.NUXT_PUBLIC_FIREBASE_API_KEY,
//     authDomain: config.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || import.meta.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     projectId: config.NUXT_PUBLIC_FIREBASE_PROJECT_ID || import.meta.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: config.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || import.meta.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: config.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     appId: config.NUXT_PUBLIC_FIREBASE_APP_ID || import.meta.env.NUXT_PUBLIC_FIREBASE_APP_ID,
//   }

//   for (const [k, v] of Object.entries(firebaseConfig)) {
//     if (!v) {
//       console.error('[FCM] missing config', k)
//       return { provide: { fcmSupported: false } }
//     }
//   }

//   const vapidKey = config.NUXT_PUBLIC_FCM_VAPID_KEY || import.meta.env.NUXT_PUBLIC_FCM_VAPID_KEY

//   if (!vapidKey) {
//     console.error('[FCM] missing VAPID key')
//     return { provide: { fcmSupported: false } }
//   }

//   // 1) Проверим поддержку
//   const supported = await isSupported().catch(() => false)
//   if (!supported) {
//     console.warn('[FCM] Messaging is NOT supported in this browser/env')
//     return { provide: { fcmSupported: false } }
//   }

//   // 2) Firebase app
//   const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
//   const messaging = getMessaging(app)

//   async function getRegistration() {
//     if (!('serviceWorker' in navigator)) return null
//     const reg = await navigator.serviceWorker.ready
//     if (!location.pathname.startsWith('/app/')) {
//       console.warn('[FCM] app base is /app/, current path:', location.pathname)
//     }
//     return reg
//   }

//   async function fcmGetToken() {
//     try {
//       const reg = await getRegistration()
//       if (!reg) throw new Error('No serviceWorker support')

//       const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: reg })
//       return token || null
//     } catch (err) {
//       console.error('[FCM] getToken error:', err)
//       return null
//     }
//   }

//   function fcmOnMessage(cb) {
//     try {
//       return onMessage(messaging, cb)
//     } catch (err) {
//       console.error('[FCM] onMessage error:', err)
//       return () => {}
//     }
//   }

//   return {
//     provide: {
//       fcmSupported: true,
//       fcmGetToken,
//       fcmOnMessage,
//     },
//   }
// })



import { initializeApp, getApps, getApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'

function supportReport() {
  const report = {
    https: location.protocol === 'https:' || location.hostname === 'localhost',
    serviceWorker: 'serviceWorker' in navigator,
    notification: 'Notification' in window,
    pushManager: 'PushManager' in window,
    indexedDB: (() => { try { return !!indexedDB } catch { return false } })(),
    scopeOk: location.pathname.startsWith('/app/'),
  }
  report.ok = Object.values(report).every(Boolean)
  return report
}

export default defineNuxtPlugin(async () => {
  // const r = useRuntimeConfig().public

  // const firebaseConfig = {
  //   apiKey: r.NUXT_PUBLIC_FIREBASE_API_KEY,
  //   authDomain: r.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  //   projectId: r.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
  //   storageBucket: r.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  //   messagingSenderId: r.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  //   appId: r.NUXT_PUBLIC_FIREBASE_APP_ID,
  // }
  // const vapidKey = r.NUXT_PUBLIC_FCM_VAPID_KEY
  const firebaseConfig = {
    apiKey: "AIzaSyAlcYvv8uucFD9JayqvjxvJ5i0uMBMowLo",
    authDomain: "abronia-global.firebaseapp.com",
    projectId: "abronia-global",
    storageBucket: "abronia-global.firebasestorage.app",
    messagingSenderId: "773221777990",
    appId: "1:773221777990:web:905d8f50c30c6a253b4047",
    measurementId: "G-1HMHSSVSL6"
  }
  const vapidKey = "BCci20uhuyd-GQ1YrboExuGqiqKrT-o4cVsA1Z8ThUYVZmFQQrxO2ZPCT9Nc_qXnLMTlOYTYWoYYKw-hIv2TayE"

  // отчёт по окружению
  const env = supportReport()

  // быстрый pre-check окружения
  if (!env.ok) {
    console.warn('[FCM] env support report:', env)
    return { provide: { fcmSupported: false, fcmWhy: env } }
  }

  // доп.проверка из SDK
  const sdkSupported = await isSupported().catch(() => false)
  if (!sdkSupported) {
    console.warn('[FCM] firebase.isSupported() = false')
    return { provide: { fcmSupported: false, fcmWhy: { ...env, isSupported: false } } }
  }

  if (!vapidKey) {
    console.error('[FCM] missing VAPID key')
    return { provide: { fcmSupported: false, fcmWhy: { ...env, vapidKey: false } } }
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  const messaging = getMessaging(app)

  async function getRegistration() {
    const reg = await navigator.serviceWorker.ready
    return reg
  }

  async function fcmGetToken() {
    try {
      const reg = await getRegistration()
      const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: reg })
      return token || null
    } catch (err) {
      console.error('[FCM] getToken error:', err)
      return null
    }
  }

  function fcmOnMessage(cb) {
    try { return onMessage(messaging, cb) } catch { return () => {} }
  }

  return { provide: { fcmSupported: true, fcmWhy: { ...env, isSupported: true }, fcmGetToken, fcmOnMessage } }
})