/// <reference lib="webworker" />
export {}
declare const self: ServiceWorkerGlobalScope

import { precacheAndRoute } from 'workbox-precaching'
precacheAndRoute(self.__WB_MANIFEST)

import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

let initialized = false

async function initFCM() {
  if (initialized) return
  // ВАЖНО: учесть /app/ базу
  const res = await fetch('/app/api/firebase-config', { cache: 'no-store' })
  if (!res.ok) { console.error('[SW] Failed to load firebase-config'); return }
  const firebaseConfig = await res.json()
  if (!firebaseConfig?.projectId) { console.error('[SW] Missing projectId'); return }

  const app = initializeApp(firebaseConfig)
  const messaging = getMessaging(app)

  onBackgroundMessage(messaging, (payload) => {
    const title = payload?.notification?.title ?? 'Reminder'
    const body  = payload?.notification?.body  ?? 'You have a new reminder'
    const data  = payload?.data ?? {}
    self.registration.showNotification(title, {
      body,
      icon: '/app/icons/icon-192x192.png',
      data
    })
  })

  initialized = true
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.clients.claim()
    await initFCM()
  })())
})

self.addEventListener('notificationclick', (event: any) => {
  event.notification.close()
  const data = event.notification?.data || {}
  const target = data?.invoiceId ? `/app/invoices/${data.invoiceId}` : '/app/'

  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const client = allClients.find((c: any) => c.url.includes('/app/'))
    if (client) {
      await (client as WindowClient).focus()
      try { await (client as WindowClient).navigate(target) } catch {}
    } else {
      await self.clients.openWindow(target)
    }
  })())
})

self.addEventListener('push', (event: any) => {
  const text = event?.data?.text?.() ?? 'DevTools test push'
  event.waitUntil(
    self.registration.showNotification('Test push', {
      body: text,
      icon: '/app/icons/icon-192x192.png',
      data: { source: 'devtools' }
    })
  )
})




// /// <reference lib="webworker" />
// export {} 

// declare const self: ServiceWorkerGlobalScope

// import { precacheAndRoute } from 'workbox-precaching'

// precacheAndRoute(self.__WB_MANIFEST)

// import { initializeApp } from 'firebase/app'
// import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

// let initialized = false

// async function initFCM() {
//   if (initialized) return
//   const res = await fetch('/api/firebase-config', { cache: 'no-store' })
//   if (!res.ok) throw new Error('Failed to load firebase-config')
//   const firebaseConfig = await res.json()

//   if (!firebaseConfig?.projectId) {
//     console.error('[SW] Missing projectId in firebaseConfig')
//     return
//   }

//   const app = initializeApp(firebaseConfig)
//   const messaging = getMessaging(app)

//   onBackgroundMessage(messaging, (payload) => {
//     const title = payload?.notification?.title ?? 'Reminder'
//     const body  = payload?.notification?.body  ?? 'You have a new reminder'
//     const data  = payload?.data ?? {}

//     self.registration.showNotification(title, {
//       body,
//       icon: '/icons/icon-192x192.png',
//       data
//     })
//   })

//   initialized = true
// }

// self.addEventListener('install', (event) => {
//   event.waitUntil(self.skipWaiting())
// })

// self.addEventListener('activate', (event) => {
//   event.waitUntil((async () => {
//     await self.clients.claim()
//     await initFCM() 
//   })())
// })

// self.addEventListener('notificationclick', (event: any) => {
//   event.notification.close()
//   const data = event.notification?.data || {}
//   const target = data?.invoiceId ? `/invoices/${data.invoiceId}` : '/home'

//   event.waitUntil((async () => {
//     const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
//     const same = allClients.find(c => (c as any).url.includes('/app/'))
//     if (same) {
//       (same as WindowClient).focus()
//       ;(same as WindowClient).navigate(target)
//     } else {
//       await self.clients.openWindow(target)
//     }
//   })())
// })

// self.addEventListener('push', (event: any) => {
//   const text = event?.data?.text?.() ?? 'DevTools test push'
//   event.waitUntil(
//     self.registration.showNotification('Test push', {
//       body: text,
//       icon: '/icons/icon-192x192.png',
//       data: { source: 'devtools' }
//     })
//   )
// })

