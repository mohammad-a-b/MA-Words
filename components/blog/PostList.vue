<script setup>
import { useBlogStore } from '~/stores/blog';
import PostCard from './PostCard.vue';
import { ref, computed } from 'vue';
import { useDark } from '@vueuse/core';

const blogStore = useBlogStore();

const postsPerPage = 6;
const currentPage = ref(1);

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage;
  const end = start + postsPerPage;
  return blogStore.sortedFilteredPosts.slice(start, end);
});

const totalPages = computed(() => 
  Math.ceil(blogStore.sortedFilteredPosts.length / postsPerPage)
);

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    scrollToTop();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    scrollToTop();
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
});
</script>

<template>
  <section>
    <div
      v-if="blogStore.sortedFilteredPosts.length === 0"
      class="text-center py-8 sm:py-12 animate-fadeIn"
      :class="isDark ? 'text-gray-400' : 'text-gray-500'"
    >
      <IconsEmpty
        class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4"
        :class="isDark ? 'text-gray-600' : 'text-gray-400'"
      />
      <p class="text-base sm:text-lg">هیچ نتیجه‌ای پیدا نشد.</p>
    </div>

    <template v-else>
      <div
        v-if="blogStore.viewType === 'grid'"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 blog-grid"
      >
        <PostCard 
          v-for="post in paginatedPosts"
          :key="post._path"
          :post="post"
          layout="grid"
        />
      </div>

      <div v-else class="space-y-4">
        <PostCard 
          v-for="post in paginatedPosts"
          :key="post._path"
          :post="post"
          layout="list"
        />
      </div>

      <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          :class="[
            isDark 
              ? 'bg-[#1a1a2e] hover:bg-[#252542] text-white border border-[#ffffff15]' 
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm',
            currentPage === 1 ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
          ]"
        >
          <IconsArrow class="h-5 w-5 rotate-180" />
          قبلی
        </button>

        <div class="flex items-center gap-2">
          <div v-for="page in totalPages" :key="page">
            <button
              v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
              @click="currentPage = page"
              class="w-10 h-10 flex items-center justify-center rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
              :class="[
                currentPage === page 
                  ? isDark 
                    ? 'bg-[#578FCA] text-white border-[#578FCA]'
                    : 'bg-[#7091F5] text-white border-[#7091F5] shadow-lg'
                  : isDark
                    ? 'bg-[#1a1a2e] hover:bg-[#252542] text-white border border-[#ffffff15]'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
              ]"
            >
              {{ page }}
            </button>
            <span
              v-else-if="page === currentPage - 2 || page === currentPage + 2"
              class="w-10 h-10 flex items-center justify-center text-lg"
              :class="isDark ? 'text-gray-400' : 'text-gray-600'"
            >...</span>
          </div>
        </div>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          :class="[
            isDark 
              ? 'bg-[#1a1a2e] hover:bg-[#252542] text-white border border-[#ffffff15]' 
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm',
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
          ]"
        >
          بعدی
          <IconsArrow class="h-5 w-5" />
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>

</style> 