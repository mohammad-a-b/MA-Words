<script setup>
const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})
</script>

<template>
  <main class="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
    <div class="absolute inset-0 flex items-center justify-center p-4">
      <div class="text-center space-y-16 max-w-4xl mx-auto">
        <div class="space-y-8 animate-fade-in">
          <h1 class="text-6xl md:text-8xl font-black bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-300">
            سلام.
          </h1>
          <p class="text-2xl md:text-4xl font-medium text-gray-700 dark:text-gray-200">
            توسعه‌دهنده فرانت‌اند و علاقه‌مند به تکنولوژیم
          </p>
        </div>

        <div class="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-xl">
          <p>
            به وبلاگ من خوش آمدید. اینجا درباره تجربیاتم در توسعه وب، یادگیری
            ماشین و تکنولوژی‌های جدید می‌نویسم.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <NuxtLink
            to="/blog"
            class="group w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xl rounded-xl shadow-lg hover:shadow-2xl dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            <span class="flex items-center justify-center gap-2">
              ورود به وبلاگ
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </NuxtLink>

          <a
            href="https://github.com/mohammad-a-b"
            target="_blank"
            class="p-4 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
            title="گیت‌هاب من"
          >
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
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
