import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      supabaseUrl: 'https://fpxuyexrbcxxppzehvoa.supabase.co',
      supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZweHV5ZXhyYmN4eHBwemVodm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MzQ0MzYsImV4cCI6MjA2MDIxMDQzNn0.CZIojdUva0paY-v5eF6BZgkM3xfzG1nWe81JtmknYFM'
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "fa-IR",
        dir: "rtl",
      },
      meta: [
        { name: 'color-scheme', content: 'light dark' },
      ],
    },
  },

  modules: ["@nuxt/content", "@vueuse/nuxt", "@nuxtjs/google-fonts", "nuxt-lucide-icons"],

  build: {
    transpile: ['vue-toastification', '@vuelidate/core', '@vuelidate/validators'],
  },

  css: [
    "~/assets/css/main.css",
    "~/assets/css/blog.css",
    "vue-toastification/dist/index.css"
  ],

  googleFonts: {
    families: {
      Vazirmatn: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    display: "swap",
    prefetch: true,
    preconnect: true,
    download: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  compatibilityDate: "2025-04-14",
});
