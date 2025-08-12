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
      دنیای
      <span :class="isDark ? 'text-[#578FCA]' : 'text-[#7091F5]'">یادگیری</span>
    </h1>

   
    <div
      class="mt-2 sm:mt-3 w-16 sm:w-20 h-1 mx-auto blur-md animate-pulse"
      :class="isDark ? 'bg-[#578FCA]/70' : 'bg-[#7091F5]/70'"
    ></div>

    <div class="mt-6 flex justify-center gap-8 text-sm sm:text-base">
      <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <IconsCategory :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="w-5 h-5" />
        <span :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ totalPosts }} پست</span>
      </div>
      <div  class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <IconsTag :class="isDark ? 'text-gray-300' : 'text-gray-700'" class="w-5 h-5" />
        <span :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ totalCategories }} دسته‌بندی</span>
      </div>
    </div>
  </header>
</template> 