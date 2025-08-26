<script setup>
import { useBlogStore } from "~/stores/blog";

const blogStore = useBlogStore();

const props = defineProps({
  currentPost: {
    type: Object,
    required: true,
  },
});

const allPosts = computed(() => {
  return blogStore.allPosts
    .filter((post) => post.path !== props.currentPost.path)
    .slice(0, 5);
});

const isExpanded = ref(true);
const contentHeight = ref(0);
const contentRef = ref(null);

const togglePosts = () => {
  isExpanded.value = !isExpanded.value;
};

onMounted(() => {
  if (contentRef.value) {
    contentHeight.value = contentRef.value.scrollHeight;
  }
});

watch(allPosts, () => {
  nextTick(() => {
    if (contentRef.value) {
      contentHeight.value = contentRef.value.scrollHeight;
    }
  });
});
</script>

<template>
  <aside class="w-full lg:w-80 sticky top-24">
    <div class="p-5 rounded-2xl transition-all duration-300 shadow-sm backdrop-blur-lg border bg-white/80 border-gray-100 dark:bg-[#0f0f1d]/80 dark:border-[#ffffff10]">
      <button
        @click="togglePosts"
        class="w-full text-base font-bold mb-5 flex items-center justify-between hover:opacity-80 transition-opacity text-gray-800 dark:text-gray-100"
      >
        <div class="flex items-center gap-3">
          <LucideGitPullRequestArrow class="w-5 h-5 text-[#7091F5] dark:text-[#578FCA]" />
          پست‌های اخیر
        </div>
        <svg
          class="w-4 h-4 transition-transform duration-300"
          :class="isExpanded ? 'rotate-0' : 'rotate-180'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div
        ref="contentRef"
        class="overflow-hidden transition-all duration-300"
        :style="{ maxHeight: isExpanded ? `${contentHeight}px` : '0px' }"
      >
        <div class="space-y-3">
          <NuxtLink
            v-for="post in allPosts"
            :key="post.path"
            :to="post.path"
            class="block p-4 rounded-xl transition-all duration-300 border hover:-translate-y-0.5 bg-gray-50/50 hover:bg-white/50 border-gray-100 dark:bg-[#1a1a2e]/50 dark:hover:bg-[#1f1f3d]/50 dark:border-[#ffffff08]"
          >
            <h4
              class="text-sm font-medium line-clamp-1 mb-3 text-gray-800 dark:text-gray-200"
            >
              {{ post.title }}
            </h4>
            <div
              class="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400"
            >
              <LucideCalendar class="w-3.5 h-3.5" />
              <span>{{ formatDate(post.date) }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped></style>
