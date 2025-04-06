<script setup>
import { useBlogStore } from '~/stores/blog';
import { useDark } from '@vueuse/core';

const blogStore = useBlogStore();
const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
});

const totalPosts = computed(() => blogStore.allPosts.length);
const totalCategories = computed(() => blogStore.allCategories.length);
</script>

<template>
  <header class="text-center py-6 sm:py-8 md:py-10">
   
    <h1
      class="font-bold animate-float"
      :class="
        isDark
          ? '[text-shadow:0_0_15px_#7091F5]'
          : '[text-shadow:0_0_15px_#7091F560]'
      "
      style="font-size: clamp(2rem, 8vw, 4.5rem); line-height: 1.2"
    >
      وبلاگ
      <span :class="isDark ? 'text-[#578FCA]' : 'text-[#7091F5]'">من</span>
    </h1>

   
    <div
      class="mt-2 sm:mt-3 w-16 sm:w-20 h-1 mx-auto blur-md animate-pulse"
      :class="isDark ? 'bg-[#578FCA]/70' : 'bg-[#7091F5]/70'"
    ></div>

    <div class="mt-6 flex justify-center gap-8 text-sm sm:text-base">
      <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <svg :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ totalPosts }} پست</span>
      </div>
      <div  class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <svg :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <span :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ totalCategories }} دسته‌بندی</span>
      </div>
    </div>
  </header>
</template> 