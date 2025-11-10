/// <reference lib="webworker" />
export {}
declare const self: ServiceWorkerGlobalScope

declare const __SW_FIREBASE_API_KEY__: string
declare const __SW_FIREBASE_AUTH_DOMAIN__: string
declare const __SW_FIREBASE_PROJECT_ID__: string
declare const __SW_FIREBASE_STORAGE_BUCKET__: string
declare const __SW_FIREBASE_MESSAGING_SENDER_ID__: string
declare const __SW_FIREBASE_APP_ID__: string

import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

precacheAndRoute(self.__WB_MANIFEST)

import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

let initialized = false

async function initFCM() {
  if (initialized) return
  // const res = await fetch('/app/api/firebase-config', { cache: 'no-store' })
  // if (!res.ok) { console.error('[SW] Failed to load firebase-config'); return }
  // const firebaseConfig = await res.json()

  const firebaseConfig = {
    apiKey: import.meta.env.NUXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.NUXT_PUBLIC_FIREBASE_APP_ID,
  }
  
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
  event.notification.close();
  const d = event.notification?.data || {};
  const target = d.link || (d.invoiceId ? `/app/invoices/${d.invoiceId}` : '/app/');

  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const app = all.find((c: any) => c.url.includes('/app/'));
    if (app) {
      await (app as WindowClient).focus();
      try { await (app as WindowClient).navigate(target); } catch {}
    } else {
      await self.clients.openWindow(target);
    }
  })());
});

// DevTools/произвольных push-сообщений
self.addEventListener('push', (event: any) => {
  let title = 'Push';
  let body = 'New notification';
  let data: any = { source: 'push' };
  try {
    const json = event?.data?.json?.();
    if (json && typeof json === 'object') {
      title = json.title ?? json.notification?.title ?? 'Push';
      body =
        json.body ??
        json.message ??
        json.notification?.body ??
        json.data?.message ??
        'New notification';

      data = json.data ?? json;
    }
  } catch {
    const txt = event?.data?.text?.();
    if (txt) {
      body = txt;
    }
  }
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/app/icons/icon-192x192.png',
      data,
    })
  );
});

registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries:  100,
        maxAgeSeconds:  365 * 24 * 60 *  60,
      }),
    ]
  })
)