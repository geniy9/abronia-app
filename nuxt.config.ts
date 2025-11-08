import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  // ssr: false,
  modules: [
    '@nuxt/ui',
    '@nuxt/image', 
    '@nuxtjs/strapi',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
  ],

  routeRules: {
    '/auth/**': { ssr: false },
  },

  ui: {
    colorMode: true,
  },

  icon: {
    clientBundle: {
      scan: true,
    }
  },

  app: {
    baseURL: '/app/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
      link: [
        { rel: "icon", type: "image/ico", sizes: "32x32", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/32.png" },
        { rel: "apple-touch-icon", type: "image/png", sizes: "180x180", href: "/180.png" },
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'slide', mode: 'out-in' }
  },

  strapi: {
    url: process.env.STRAPI_URL,
    prefix: '/api',
    version: 'v5',
    cookie: {},
    cookieName: 'strapi_jwt'
  },

  pinia: {
    storesDirs: ['./store/**'],
  },

  runtimeConfig: {
    public: {
      ORIGIN: process.env.ORIGIN,
      STRAPI_URL: process.env.STRAPI_URL,

      NUXT_PUBLIC_FIREBASE_API_KEY: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NUXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NUXT_PUBLIC_FIREBASE_APP_ID: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      NUXT_PUBLIC_FCM_VAPID_KEY: process.env.NUXT_PUBLIC_FCM_VAPID_KEY,
    }
  },

  pwa: {
    strategies: 'injectManifest',
    srcDir: 'service-worker',
    filename: 'sw.ts',
    registerType: 'autoUpdate',
    scope: '/app/',
    base: '/app/',
    manifest: {
      name: 'Abronia Global App',
      short_name: 'Abronia Global',
      description: 'Abronia Global Application',
      theme_color: '#000000',
      background_color: '#000000',
      display: 'standalone',
      orientation: 'portrait',
      id: '/app/',
      icons: [
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,xml,svg+xml,ico}'],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      type: 'module',
    },
  },

  css: ['~/assets/css/main.css', '~/assets/scss/app.scss'],

  vite: {
    plugins: [ tailwindcss() ],
  },

})