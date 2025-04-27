// import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
// import 'vue-toastification/dist/index.css'

// export default defineNuxtPlugin((nuxtApp) => {
//   if (process.server) return

//   const options: PluginOptions = {
//     position: POSITION.BOTTOM_RIGHT,
//     timeout: 3000,
//     closeOnClick: true,
//     pauseOnFocusLoss: true,
//     pauseOnHover: true,
//     draggable: true,
//     draggablePercent: 0.6,
//     showCloseButtonOnHover: false,
//     hideProgressBar: true,
//     closeButton: false,
//     icon: true,
//     rtl: true,
//     maxToasts: 3,
//     newestOnTop: true,
//     toastClassName: 'custom-toast',
//     bodyClassName: 'custom-toast-body',
//   }

//   nuxtApp.vueApp.use(Toast, options)
// }) 