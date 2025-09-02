import { defineNuxtPlugin } from 'nuxt/app'
import { createPinia } from 'pinia'

export default defineNuxtPlugin(nuxtApp => {
  const pinia = createPinia()
  nuxtApp.vueApp.use(pinia)

  if (process.client) {
    try {
      const { useAuth } = require('~/composables/useAuth')
      useAuth().initAuth()
    } catch {}
  }
}) 