import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  modules: ["@nuxt/content", "@nuxtjs/color-mode"],
  compatibilityDate: "2025-02-23",
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: tailwindcss(),
  },
});