<script setup>
import { useBlogStore } from '~/stores/blog';
import PostCard from './PostCard.vue';

const blogStore = useBlogStore();

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
          v-for="post in blogStore.sortedFilteredPosts"
          :key="post.id"
          :post="post"
          layout="grid"
        />
      </div>

      <div v-else class="space-y-4">
        <PostCard 
          v-for="post in blogStore.sortedFilteredPosts"
          :key="post.id"
          :post="post"
          layout="list"
        />
      </div>
    </template>
  </section>
</template> 