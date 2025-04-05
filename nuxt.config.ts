import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "fa-IR",
        dir: "rtl",
      },
    },
  },

  modules: ["@nuxt/content", "@vueuse/nuxt", "@nuxtjs/google-fonts"],

  content: {
    documentDriven: true,
    experimental: {
      clientDB: true,
    },
    api: {
      baseURL: "/api/_content",
    },
    navigation: {
      fields: ["navTitle"],
    },
    highlight: {
      theme: "github-dark",
    },
  },

  nitro: {
    routeRules: {
      "/api/**": {
        cors: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    },
  },

  googleFonts: {
    families: {
      Vazirmatn: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    display: "swap",
    prefetch: true,
    preconnect: true,
    download: true,
  },

  css: ["~/assets/css/main.css", "~/assets/css/blog.css"],
  vite: {
    plugins: tailwindcss(),
  },
});
