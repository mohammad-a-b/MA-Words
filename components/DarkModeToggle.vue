<template>
  <button
    @click="toggleDark()"
    class="fixed top-4 right-4 z-[9999] p-3 rounded-full backdrop-blur-lg border transition-all duration-500 shadow-xl hover:scale-110"
    :class="isDark ? 
      'border-[#00ff8770] hover:border-[#00ff87] bg-[#00000030]' :
      'border-[#7c3aed70] hover:border-[#7c3aed] bg-[#ffffff20]'"
  >
    <div class="relative w-6 h-6">
      <svg
        v-show="isDark"
        class="absolute inset-0 text-[#00ff87] transition-all duration-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>
      <svg
        v-show="!isDark"
        class="absolute inset-0 text-[#7c3aed] transition-all duration-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
    </div>
  </button>
</template>

<script setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'vueuse-dark'
})
const toggleDark = useToggle(isDark)
</script>
