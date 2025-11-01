import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
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

  app: {
    baseURL: '/app/',
    head: {
      charset: 'utf-16',
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
    }
  },

  css: ['~/assets/css/main.css', '~/assets/scss/app.scss'],

  vite: {
    plugins: [
      tailwindcss()
    ],
  },

  pwa: {
    enabled: true,
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
      sourcemap: process.env.NODE_ENV === 'development',
      navigateFallback: '/app/',
      globPatterns: [
        '**/*.{js,css,html,png,svg,ico,woff2,json}' // типы файлов, которые должны быть кэшированы
      ],
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.origin === STRAPI_URL_PWA, // Кэшируем запросы к Strapi API
          handler: 'NetworkFirst', // Сначала сеть, затем кэш
          options: {
            cacheName: 'abronia-api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7 // Кэш на 7 дней
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        // Пример кэширования изображений
        {
          urlPattern: /\.(?:png|gif|jpg|jpeg|svg|webp)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30, // Кэш на 30 дней
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true, // Показать запрос на установку PWA
      // registrationStrategy: 'prompt', // Или 'registerImmediately'
      // periodicSyncForUpdates: 20 // Проверять обновления каждые 20 часов
    },
    devOptions: {
      enabled: true, 
      suppressWarnings: true,
      type: 'module',
    },
    define: {
      STRAPI_URL_PWA: JSON.stringify(process.env.STRAPI_URL), // Или runtimeConfig.public.STRAPI_URL
    },
  },
})