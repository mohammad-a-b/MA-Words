import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    position: "bottom-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,  
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: false,
    icon: true,
    rtl: true,
    maxToasts: 5,
    newestOnTop: true,
    containerClassName: "ontainer",
    toastClassName: "ontainer",
    bodyClassName: "ontainer",
  });
}); 