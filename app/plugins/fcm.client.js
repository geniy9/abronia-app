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
  const pub = useRuntimeConfig().public
  const firebaseConfig = {
    apiKey: pub.NUXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: pub.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: pub.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: pub.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: pub.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: pub.NUXT_PUBLIC_FIREBASE_APP_ID,
  }
  const vapidKey = pub.NUXT_PUBLIC_FCM_VAPID_KEY

  // const firebaseConfig = {
  //   apiKey: import.meta.env.NUXT_PUBLIC_FIREBASE_API_KEY,
  //   authDomain: import.meta.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  //   projectId: import.meta.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
  //   storageBucket: import.meta.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  //   messagingSenderId: import.meta.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  //   appId: import.meta.env.NUXT_PUBLIC_FIREBASE_APP_ID,
  // }

  const env = supportReport()
  if (!env.ok) {
    console.warn('[FCM] env support report:', env)
    return { provide: { fcmSupported: false, fcmWhy: env } }
  }

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