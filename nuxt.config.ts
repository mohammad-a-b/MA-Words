import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  modules: [
    "@nuxt/content",
    "@vueuse/nuxt",
  ],
  compatibilityDate: "2025-02-23",
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: tailwindcss(),
  },
});