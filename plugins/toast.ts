import Toast, { type PluginOptions } from 'vue-toastification'

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    position: 'top-center',
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    rtl: true,
  }

  nuxtApp.vueApp.use(Toast, options)
}) 