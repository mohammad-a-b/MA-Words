<script setup>
import { useRoute } from "vue-router";
import { useHead } from "#imports";
import { useBlogStore } from "~/stores/blog";
import PostSidebar from "~/components/blog/PostSidebar.vue";

const route = useRoute();
const slug = route.params.slug;
const blogStore = useBlogStore();

const { data: post, pending } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection("blog").path(`/blog/${slug}`).first()
);

const { data: allPosts } = await useAsyncData("blog-posts", () =>
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

const postTitle = ref("در حال بارگذاری...");
const showShareMenu = ref(false);
const readingProgress = ref(0);

if (post.value) {
  postTitle.value = post.value.title;
}

useHead({
  title: () => `وبلاگ من | ${postTitle.value}`,
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

const isBookmarked = computed(() => {
  return post.value ? blogStore.isBookmarked(post.value) : false;
});

const toggleBookmark = () => {
  if (post.value) {
    blogStore.toggleBookmark(post.value);
  }
};

const sharePost = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: post.value.title,
        text: post.value.description,
        url: window.location.href,
      });
    } catch (err) {
      console.error("Error sharing:", err);
    }
  } else {
    showShareMenu.value = true;
  }
};

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href);
  showShareMenu.value = false;
};

onMounted(() => {
  window.addEventListener("scroll", () => {
    const article = document.querySelector("article");
    if (article) {
      const articleTop = article.getBoundingClientRect().top;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const progress = Math.min(
        100,
        Math.max(0, ((windowHeight - articleTop) / articleHeight) * 100)
      );
      readingProgress.value = progress;
    }
  });
});
</script>

<template>
  <main class="min-h-screen transition-colors duration-300">
    <div
      class="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7091F5] to-[#578FCA] z-50"
      :style="{ width: `${readingProgress}%` }"
    ></div>

    <div class="relative min-h-screen">
      <div
        class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]"
        :class="isDark ? 'opacity-20' : 'opacity-10'"
      ></div>

      <div
        class="absolute inset-0 bg-gradient-to-b from-transparent to-[#7091F5] opacity-5"
      ></div>

      <div class="relative z-10 container mx-auto max-w-6xl px-4 xl:px-0 py-10">
        <div v-if="pending" class="flex justify-center items-center py-20">
          <div
            class="spinner w-8 h-8 border-4 border-t-4 rounded-full animate-spin"
            :class="
              isDark
                ? 'border-gray-700 border-t-[#578FCA]'
                : 'border-gray-200 border-t-[#7091F5]'
            "
          ></div>
        </div>

        <div v-else>
          <div class="flex flex-col lg:flex-row gap-8">
            <article
              v-if="post"
              class="flex-1 mx-auto rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-300"
              :class="isDark ? 'bg-[#0f0f1d] shadow-2xl' : 'bg-white shadow-lg'"
            >
              <header class="mb-8">
                <div class="flex items-center justify-between mb-4">
                  <NuxtLink to="/blog" class="flex items-center gap-2 group">
                    <IconsArrow2
                      class="w-5 h-5 transform rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
                      :class="isDark ? 'text-gray-400' : 'text-gray-600'"
                    />
                    <span
                      class="text-sm sm:text-base"
                      :class="isDark ? 'text-gray-400' : 'text-gray-600'"
                      >بازگشت</span
                    >
                  </NuxtLink>

                  <div class="flex items-center gap-3">
                    <button
                      @click="toggleBookmark"
                      class="p-2 rounded-full transition-colors duration-300"
                      :class="
                        isDark ? 'hover:bg-[#ffffff10]' : 'hover:bg-gray-100'
                      "
                    >
                      <IconsBookmark
                        class="w-5 h-5"
                        :filled="isBookmarked"
                        :class="
                          isBookmarked
                            ? 'text-yellow-400'
                            : isDark
                            ? 'text-gray-400'
                            : 'text-gray-600'
                        "
                      />
                    </button>

                    <div class="relative">
                      <button
                        @click="sharePost"
                        class="p-2 rounded-full transition-colors duration-300"
                        :class="
                          isDark ? 'hover:bg-[#ffffff10]' : 'hover:bg-gray-100'
                        "
                      >
                        <IconsShare
                          class="w-5 h-5"
                          :class="isDark ? 'text-gray-400' : 'text-gray-600'"
                        />
                      </button>

                      <div
                        v-if="showShareMenu"
                        class="absolute left-0 top-full mt-2 p-2 rounded-lg shadow-lg"
                        :class="
                          isDark
                            ? 'bg-[#0f0f1d] border border-[#ffffff20]'
                            : 'bg-white border border-gray-200'
                        "
                      >
                        <button
                          @click="copyLink"
                          class="flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-300"
                          :class="
                            isDark
                              ? 'hover:bg-[#ffffff10]'
                              : 'hover:bg-gray-100'
                          "
                        >
                          <IconsCopy
                            class="w-4 h-4"
                            :class="isDark ? 'text-gray-400' : 'text-gray-600'"
                          />
                          <span
                            class="text-sm"
                            :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                            >کپی لینک</span
                          >
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <h1
                  class="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 title-gradient"
                >
                  {{ post.title }}
                </h1>

                <div
                  class="flex flex-wrap items-center gap-4 text-sm sm:text-base"
                  :class="isDark ? 'text-gray-400' : 'text-gray-600'"
                >
                  <div class="flex items-center gap-2">
                    <IconsCalendar class="w-4 h-4" />
                    <span>{{ formatDate(post.date) }}</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <IconsClock class="w-4 h-4" />
                    <span>{{ calculateReadingTime(post) }} دقیقه مطالعه</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <IconsCategory class="w-4 h-4" />
                    <span>{{ post.meta?.category }}</span>
                  </div>
                </div>

                <div v-if="post.tags?.length" class="flex flex-wrap gap-2 mt-4">
                  <span
                    v-for="tag in post.tags"
                    :key="tag"
                    class="px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 border"
                    :class="
                      isDark
                        ? 'bg-[#ffffff05] text-gray-300 border-white/10'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    "
                  >
                    <IconsTag class="w-3 h-3" />
                    {{ tag }}
                  </span>
                </div>
              </header>

              <div
                class="content-renderer prose max-w-none mb-8"
                :class="isDark ? 'prose-invert text-gray-300' : 'text-gray-700'"
              >
                <ContentRenderer :value="post" />
              </div>

              <div
                class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t"
                :class="isDark ? 'border-[#ffffff20]' : 'border-gray-200'"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-10 h-10 rounded-full overflow-hidden border-2"
                    :class="isDark ? 'border-[#7091F5]' : 'border-[#578FCA]'"
                  >
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_zfYdfminxFt2Ymu1k-hyEz3slVvH1nZN_Yetgfk2S0WZhvybVuL5zKQ&s"
                      alt="عکس پروفایل"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3
                      class="font-semibold"
                      :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                    >
                      محمد امیر
                    </h3>
                    <p
                      class="text-xs"
                      :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                    >
                      نویسنده
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <button
                    @click="sharePost"
                    class="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300"
                    :class="
                      isDark
                        ? 'border-[#ffffff30] hover:border-[#7091F5] text-gray-300 hover:text-[#7091F5]'
                        : 'border-[#00000020] hover:border-[#578FCA] text-gray-700 hover:text-[#578FCA]'
                    "
                  >
                    <IconsShare class="w-4 h-4" />
                    <span class="text-sm">اشتراک‌گذاری</span>
                  </button>

                  <button
                    @click="toggleBookmark"
                    class="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300"
                    :class="
                      isDark
                        ? 'border-[#ffffff30] hover:border-[#7091F5] text-gray-300 hover:text-[#7091F5]'
                        : 'border-[#00000020] hover:border-[#578FCA] text-gray-700 hover:text-[#578FCA]'
                    "
                  >
                    <IconsBookmark
                      class="w-4 h-4"
                      :filled="isBookmarked"
                      :class="isBookmarked ? 'text-yellow-400' : ''"
                    />
                    <span class="text-sm">{{
                      isBookmarked ? "حذف از نشان‌ها" : "نشان کردن"
                    }}</span>
                  </button>
                </div>
              </div>

              <div class="mt-8 flex justify-start">
                <NuxtLink
                  to="/blog"
                  class="flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 group"
                  :class="
                    isDark
                      ? 'border-[#ffffff30] hover:border-[#7091F5] text-gray-300 hover:text-[#7091F5]'
                      : 'border-[#00000020] hover:border-[#578FCA] text-gray-700 hover:text-[#578FCA]'
                  "
                >
                  <IconsArrow2
                    class="w-5 h-5 transform rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
                  />
                  <span class="text-sm font-medium">بازگشت به وبلاگ</span>
                </NuxtLink>
              </div>
            </article>

            <PostSidebar v-if="post" :current-post="post" />

            <p
              v-if="!post"
              class="text-center text-xl sm:text-2xl md:text-3xl font-bold py-20"
              :class="isDark ? 'text-[#7091F5]' : 'text-[#578FCA]'"
            >
              ۴۰۴ | مقاله مورد نظر یافت نشد
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.title-gradient {
  background: linear-gradient(
    45deg,
    #7091f5,
    #c471ed,
    #f64f59,
    #ffa500,
    #098765,
    #123456
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-animation 60s ease infinite;
}

.spinner {
  border-top-color: var(--primary-light);
}
.dark .spinner {
  border-top-color: var(--primary-dark);
}
</style>
