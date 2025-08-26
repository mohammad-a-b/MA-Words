<script setup>
import { useBlogStore } from '~/stores/blog';

const blogStore = useBlogStore();
const totalPosts = computed(() => blogStore.allPosts.length);
const totalCategories = computed(() => blogStore.allCategories.length);
</script>

<template>
  <header class="text-center py-6 sm:py-8 md:py-10">
   
    <h1
      class="font-bold animate-float [text-shadow:0_0_15px_#7091F560] dark:[text-shadow:0_0_15px_#7091F5]"
      style="font-size: clamp(2rem, 8vw, 4.5rem); line-height: 1.2"
    >
      دنیای
      <span class="text-[#7091F5] dark:text-[#578FCA]">یادگیری</span>
    </h1>

   
    <div
      class="mt-2 sm:mt-3 w-16 sm:w-20 h-1 mx-auto blur-md animate-pulse bg-[#7091F5]/70 dark:bg-[#578FCA]/70"
    ></div>

    <div class="mt-6 flex justify-center gap-8 text-sm sm:text-base">
      <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <LucideChartBarStacked class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <span class="text-gray-700 dark:text-gray-300">{{ totalPosts }} پست</span>
      </div>
      <div  class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <LucideTag class="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <span class="text-gray-700 dark:text-gray-300">{{ totalCategories }} دسته‌بندی</span>
      </div>
    </div>
  </header>
</template> 