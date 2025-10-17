import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxt/ui',
    '@nuxt/image', 
    '@nuxtjs/strapi',
    '@pinia/nuxt',
  ],

  routeRules: {
    '/auth/**': { ssr: false },
    '/es/auth/**': { ssr: false },
    '/checkout': { ssr: false },
    '/es/checkout': { ssr: false },
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
})