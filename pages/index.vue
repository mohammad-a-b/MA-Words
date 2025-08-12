<script setup>
import { useDark } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'vueuse-dark',
})
</script>

<template>
  <main
    class="fixed inset-0 w-screen h-screen overflow-hidden transition-colors duration-300"
    :class="isDark ? 'bg-gradient-to-br from-[var(--bg-gradient-dark-from)] to-[var(--bg-gradient-dark-to)]' : 'bg-gradient-to-br from-[var(--bg-gradient-light-from)] to-[var(--bg-gradient-light-to)]'"
  >
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="text-center space-y-16 max-w-4xl mx-auto">
        <div class="space-y-8 animate-fade-in">
          <h1 class="text-6xl md:text-8xl font-black bg-gradient-to-r from-[var(--gradient-brand-from)] to-[var(--gradient-brand-to)] bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-300">
            سلام.
          </h1>
          <p class="text-2xl md:text-4xl font-medium text-gray-700 dark:text-gray-200">
            توسعه‌دهنده فرانت‌اند و علاقه‌مند به تکنولوژیم
          </p>
        </div>

        <div class="max-w-2xl mx-auto text-xl text-gray-700 dark:text-gray-200 leading-loose backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 p-6 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 transition duration-300">
          <p>
            این وبلاگ جایی‌ست برای اشتراک‌گذاری تجربه‌ها و یادداشت‌هایی درباره‌ی توسعه وب، ابزارهای مدرن برنامه‌نویسی، و مفاهیمی که در مسیر یادگیری و ساخت پروژه‌های واقعی با آن‌ها روبه‌رو می‌شوم.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <NuxtLink
            to="/blog"
            class="group w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[var(--gradient-brand-from)] to-[var(--gradient-brand-to)] text-white text-xl rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span class="flex items-center justify-center gap-2">
              ورود به وبلاگ
              <IconsArrowRight class="h-6 w-6 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </NuxtLink>

          <a
            href="https://github.com/mohammad-a-b"
            target="_blank"
            class="p-4 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
            title="گیت‌هاب من"
          >
            <IconsGithub class="w-8 h-8" />
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
