<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const isSystemDark = ref(false)
let mediaQuery

const applyThemeFromSystem = (isDark) => {
  isSystemDark.value = isDark
  const root = document.documentElement
  if (isDark) {
    root.classList.add('dark')
    root.classList.remove('light')
    root.setAttribute('data-theme', 'dark')
  } else {
    root.classList.remove('dark')
    root.classList.add('light')
    root.setAttribute('data-theme', 'light')
  }
}

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  applyThemeFromSystem(mediaQuery.matches)
  mediaQuery.addEventListener('change', (e) => applyThemeFromSystem(e.matches))
})

onBeforeUnmount(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', (e) => applyThemeFromSystem(e.matches))
  }
})
</script>

<template>
  <div
    class="p-3 rounded-full backdrop-blur-lg border transition-all duration-500 shadow-lg border-[#00000015] bg-white/90 text-gray-700 dark:border-[#ffffff15] dark:bg-[#1a1a2e]/90 dark:text-gray-200"
    title="هماهنگ با تم سیستم"
  >
    <div class="relative w-6 h-6">
      <LucideMoon v-show="isSystemDark" class="w-6 h-6" />
      <LucideSun v-show="!isSystemDark" class="w-6 h-6" />
    </div>
  </div>
</template>
