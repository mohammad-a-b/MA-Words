import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    position: "button-right",
    timeout: 1000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: false,
    icon: true,
    rtl: true,
    maxToasts: 3,
    newestOnTop: true,
    containerClassName: "my-toast-container",
    toastClassName: "my-toast-class",
    bodyClassName: "my-toast-body",
  });
}); 