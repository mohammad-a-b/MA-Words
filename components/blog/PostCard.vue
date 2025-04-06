<script setup>
import { useBlogStore } from "~/stores/blog";
import BlogTag from "./BlogTag.vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,     
  },
  layout: {
    type: String,
    default: "grid",
    validator: (value) => ["grid", "list"].includes(value),
  },
});

const blogStore = useBlogStore();

const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
});

const isBookmarked = computed(() => blogStore.isBookmarked(props.post));

const handleToggleBookmark = (event) => {
  event.preventDefault();
  event.stopPropagation();

  blogStore.toggleBookmark(props.post);
};
</script>

<template>
  <article
    v-if="layout === 'grid'"
    class="group rounded-xl sm:rounded-2xl p-3 sm:p-3 transition-all duration-300 relative flex flex-col border hover:shadow-lg blog-post-card"
    :class="
      isDark
        ? 'bg-[#0f0f1d] border-[#ffffff10] hover:border-[#578FCA]/20'
        : 'bg-white border-[#00000010] hover:border-[#7091F5]/20'
    "
  >
    <NuxtLink :to="post.path" class="relative block">
      <div
        class="relative h-36 xs:h-40 sm:h-48 md:h-56 mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden image-overlay"
      >
        <img
          v-if="post.meta?.image"
          :src="post.meta.image"
          :alt="post.title"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div
          class="absolute bottom-2 right-2 flex items-center gap-1.5 sm:gap-2 flex-wrap"
        >
          <span
            class="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] xs:text-xs text-white/90 bg-[#00000090] backdrop-blur-sm flex items-center gap-1"
          >
            <IconsCalendar class="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {{ formatDate(post.date) }}
          </span>
          <span
            class="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] xs:text-xs text-white/90 bg-[#00000090] backdrop-blur-sm flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-2.5 h-2.5 sm:w-3 sm:h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ calculateReadingTime(post) }} دقیقه
          </span>
        </div>
      </div>
    </NuxtLink>

    <div class="flex items-center justify-between mb-2">
      <BlogTag
        v-if="post.meta?.category"
        :text="post.meta.category"
        :show-icon="false"
        class="category-tag px-2 py-1 rounded-lg"
        :class="
          isDark
            ? 'bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white'
            : 'bg-gradient-to-r from-[#818cf8] to-[#6366f1] text-white'
        "
      />

      <button
        @click="handleToggleBookmark"
        class="bookmark-btn p-1.5 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-6 z-10 shadow-sm border"
        :class="[
          isBookmarked
            ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
            : isDark
            ? 'text-gray-400 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
            : 'text-gray-500 bg-black/5 hover:bg-black/10 border-black/10 hover:border-black/20',
        ]"
      >
        <IconsBookmark class="w-4 h-4" :filled="isBookmarked" />
      </button>
    </div>

    <h2
      class="text-sm xs:text-base sm:text-lg md:text-xl font-bold mb-2 transition-all duration-300 line-clamp-2 group-hover:text-[#85a4ffc3]"
    >
      {{ post.title }}
    </h2>

    <p
      class="mb-3 sm:mb-4 text-xs sm:text-sm line-clamp-3 text-justify"
      :class="isDark ? 'text-gray-300/90' : 'text-gray-600/90'"
    >
      {{ post.description || "..." }}
    </p>

    <div
      v-if="post.tags?.length"
      class="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4"
    >
      <BlogTag v-for="tag in post.tags.slice(0, 3)" :key="tag" :text="tag" />
      <BlogTag
        v-if="post.tags.length > 3"
        :text="`+${post.tags.length - 3}`"
        :show-icon="false"
      />
    </div>

    <div class="mt-auto">
      <NuxtLink
        :to="post.path"
        class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all duration-300 hover:pr-6 group"
        :class="
          isDark
            ? 'bg-[#ffffff08] border-[#ffffff15] hover:border-[#578FCA] hover:text-[#578FCA]'
            : 'bg-[#f8f9fa] border-[#7091F520] hover:border-[#7091F5] hover:text-[#7091F5]'
        "
      >
        <div class="z-10 flex items-center gap-2">
          <IconsArrow
            class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
          />
          <span class="text-xs sm:text-sm">مطالعه بیشتر</span>
        </div>
      </NuxtLink>
    </div>
  </article>

  <article
    v-else
    class="group flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border rounded-xl transition-all duration-300 relative blog-post-card"
    :class="
      isDark ? 'bg-[#0f0f1d] border-[#ffffff10]' : 'bg-white border-[#00000010]'
    "
  >
    <NuxtLink :to="post.path" class="sm:w-48 md:w-64 shrink-0">
      <div
        class="relative h-32 xs:h-40 sm:h-full rounded-lg overflow-hidden image-overlay"
      >
        <img
          v-if="post.meta?.image"
          :src="post.meta.image"
          :alt="post.title"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </NuxtLink>

    <div class="flex flex-col flex-grow">
      <div class="flex items-center justify-between mb-2">
        <div
          class="flex items-center gap-2 sm:gap-3 text-[10px] xs:text-xs sm:text-sm"
          :class="isDark ? 'text-gray-400' : 'text-gray-500'"
        >
          <span class="flex items-center gap-1">
            <IconsCalendar class="w-3 h-3 sm:w-4 sm:h-4" />
            {{ formatDate(post.date) }}
          </span>
          <span class="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ calculateReadingTime(post) }} دقیقه
          </span>
          <span
            v-if="post.meta?.category"
            class="category-tag px-2 py-0.5 rounded-full shadow-sm transition-all duration-300 hover:shadow-md"
            :class="
              isDark
                ? 'bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white'
                : 'bg-gradient-to-r from-[#818cf8] to-[#6366f1] text-white'
            "
          >
            {{ post.meta.category }}
          </span>
        </div>

        <button
          @click="handleToggleBookmark"
          class="bookmark-btn p-1.5 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-6 z-10 shadow-sm border"
          :class="[
            isBookmarked
              ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
              : isDark
              ? 'text-gray-400 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
              : 'text-gray-500 bg-black/5 hover:bg-black/10 border-black/10 hover:border-black/20',
          ]"
        >
          <IconsBookmark class="w-4 h-4" :filled="isBookmarked" />
        </button>
      </div>

      <h2
        class="text-sm xs:text-base sm:text-lg font-bold mb-2 blog-text-primary"
      >
        {{ post.title }}
      </h2>

      <p
        class="text-[10px] xs:text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2"
        :class="isDark ? 'text-gray-300' : 'text-gray-600'"
      >
        {{ post.description }}
      </p>

      <div
        v-if="post.tags?.length"
        class="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3"
      >
        <BlogTag v-for="tag in post.tags.slice(0, 3)" :key="tag" :text="tag" />
        <BlogTag
          v-if="post.tags.length > 3"
          :text="`+${post.tags.length - 3}`"
          :show-icon="false"
        />
      </div>

      <div class="mt-auto">
        <NuxtLink
          :to="post.path"
          class="inline-flex items-center gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border transition-all duration-300 hover:pr-4 sm:hover:pr-6 group"
          :class="
            isDark
              ? 'bg-[#ffffff08] border-[#ffffff15] hover:border-[#578FCA] hover:text-[#578FCA]'
              : 'bg-[#f8f9fa] border-[#7091F520] hover:border-[#7091F5] hover:text-[#7091F5]'
          "
        >
          <div class="z-10 flex items-center gap-2">
            <IconsArrow
              class="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1"
            />
            <span class="text-[10px] xs:text-xs sm:text-sm">مطالعه بیشتر</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
