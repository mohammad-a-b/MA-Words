<script setup>
import { useBlogStore } from "~/stores/blog";
import BlogHeader from "~/components/blog/BlogHeader.vue";
import BlogFilters from "~/components/blog/BlogFilters.vue";
import PostList from "~/components/blog/PostList.vue";
import AboutMe from "~/components/blog/AboutMe.vue";

const blogStore = useBlogStore();

const { data: allPosts, pending } = await useAsyncData("blog-posts", () =>
  queryCollection("blog").order("date", "DESC").all()
);

watch(
  allPosts,
  (newPosts) => {
    if (newPosts) {
      blogStore.setAllPosts(newPosts);
    }
  },
  { immediate: true }
);

useHead({
  title: () => "وبلاگ من ",
});

const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
});

onMounted(() => {
  blogStore.initBookmarks();
  blogStore.initDarkMode(isDark.value);
});
</script>

<template>
  <main class="min-h-screen transition-colors duration-300">
    <div
      class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10 blog-container"
    >
      <BlogHeader />
      <BlogFilters />
      <div
        v-if="pending"
        class="flex justify-center items-center py-8 sm:py-10 md:py-12"
      >
        <div
          class="w-6 h-6 sm:w-8 sm:h-8 border-3 sm:border-4 border-t-3 sm:border-t-4 rounded-full animate-spin"
          :class="
            isDark
              ? 'border-gray-700 border-t-[#578FCA]'
              : 'border-gray-200 border-t-[#7091F5]'
          "
        ></div>
      </div>
      <PostList v-else />
      <AboutMe />
    </div>
  </main>
</template>

<style>
@import "~/assets/css/blog.css";
</style>
