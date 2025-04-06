<script setup>
import { useBlogStore } from "~/stores/blog";
import { useDark } from "@vueuse/core";
import IconsRelated from "~/components/icons/Related.vue";
import IconsCalendar from "~/components/icons/Calendar.vue";

const blogStore = useBlogStore();
const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
});

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
    <div
      class="p-5 rounded-2xl transition-all duration-300 shadow-sm"
      :class="
        isDark
          ? 'bg-[#0f0f1d]/80 backdrop-blur-lg border border-[#ffffff10]'
          : 'bg-white/80 backdrop-blur-lg border border-gray-100'
      "
    >
      <button
        @click="togglePosts"
        class="w-full text-base font-bold mb-5 flex items-center justify-between hover:opacity-80 transition-opacity"
        :class="isDark ? 'text-gray-100' : 'text-gray-800'"
      >
        <div class="flex items-center gap-3">
          <IconsRelated
            class="w-5 h-5"
            :class="isDark ? 'text-[#578FCA]' : 'text-[#7091F5]'"
          />
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
            class="block p-4 rounded-xl transition-all duration-300 border hover:-translate-y-0.5"
            :class="
              isDark
                ? 'bg-[#1a1a2e]/50 hover:bg-[#1f1f3d]/50 border-[#ffffff08]'
                : 'bg-gray-50/50 hover:bg-white/50 border-gray-100'
            "
          >
            <h4
              class="text-sm font-medium line-clamp-1 mb-3"
              :class="isDark ? 'text-gray-200' : 'text-gray-800'"
            >
              {{ post.title }}
            </h4>
            <div
              class="flex items-center gap-2 text-[11px]"
              :class="isDark ? 'text-gray-400' : 'text-gray-500'"
            >
              <IconsCalendar class="w-3.5 h-3.5" />
              <span>{{ formatDate(post.date) }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped></style>
