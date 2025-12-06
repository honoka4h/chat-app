// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  ssr: false,
  app: {
    baseURL: './'
  },
  vite: {
    plugins: [tsconfigPaths()]
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://222.122.202.26:8000'
    }
  },
  css: [
    '~/assets/css/main.css'
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
