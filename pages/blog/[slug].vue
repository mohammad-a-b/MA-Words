<script setup>
import { useRoute } from "vue-router";
import { useHead } from "#imports";
import { useBlogStore } from "~/stores/blog";
import PostSidebar from "~/components/blog/PostSidebar.vue";
import Comments from "~/components/blog/Comments.vue";

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


onMounted(() => {
  blogStore.initBookmarks();
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
  const onScroll = () => {
    const article = document.querySelector("article");
    if (!article) {
      readingProgress.value = 0;
      return;
    }

    const rect = article.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const totalHeight = rect.height - windowHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), totalHeight);

    readingProgress.value = totalHeight > 0 ? (scrolled / totalHeight) * 100 : 100;
  };

  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", onScroll);
  onScroll();

  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  });
});


</script>

<template>
  <main class="min-h-screen transition-colors duration-300">
    <div
      class="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--gradient-brand-from)] to-[var(--gradient-brand-to)] z-50"
      :style="{ width: `${readingProgress}%` }"
    ></div>

    <div class="relative min-h-screen">
      <div class="container mx-auto px-0 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div v-if="pending" class="flex justify-center items-center py-20">
          <div class="spinner w-8 h-8 border-4 border-t-4 rounded-full animate-spin border-gray-200 border-t-[#7091F5] dark:border-gray-700 dark:border-t-[#578FCA]"></div>
        </div>

        <div v-else>
          <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <article
              v-if="post"
              class="flex-1 w-full lg:w-auto mx-auto rounded-2xl sm:rounded-3xl p-2.5 sm:p-6 md:p-8 transition-all duration-300 bg-white shadow-lg dark:bg-[#0f0f1d] dark:shadow-2xl"
            >
              <header class="mb-6 sm:mb-8">
                <div v-if="post.meta?.image" class="mb-5 sm:mb-7">
                  <figure class="relative rounded-2xl overflow-hidden shadow-lg">
                    <img
                      :src="post.meta.image"
                      :alt="post.title"
                      class="w-full h-56 sm:h-72 md:h-80 object-cover"
                    />
                    <figcaption class="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-xs sm:text-sm text-white/90 bg-gradient-to-t from-black/60 to-transparent">
                      {{ post.title }}
                    </figcaption>
                  </figure>
                </div>
                <div class="flex items-center justify-between mb-4">
                  <NuxtLink to="/blog" class="flex items-center gap-2 group">
                    <LucideArrowLeft class="w-4 sm:w-5 h-4 sm:h-5 transform rotate-180 transition-transform duration-300 group-hover:-translate-x-1 text-gray-600 dark:text-gray-400" />
                    <span class="text-sm sm:text-base text-gray-600 dark:text-gray-400">بازگشت</span>
                  </NuxtLink>

                  <div class="flex items-center gap-3">
                    <button @click="toggleBookmark" class="p-2 rounded-full transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-[#ffffff10]">
                      <LucideBookmark class="w-5 h-5" :class="isBookmarked ? 'text-yellow-400' : 'text-gray-600 dark:text-gray-400'" />
                    </button>

                    <div class="relative">
                      <button @click="sharePost" class="p-2 rounded-full transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-[#ffffff10]">
                        <LucideShare2 class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>

                      <div v-if="showShareMenu" class="absolute left-0 top-full mt-2 p-2 rounded-lg shadow-lg bg-white border border-gray-200 dark:bg-[#0f0f1d] dark:border-[#ffffff20]">
                        <button @click="copyLink" class="flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-[#ffffff10]">
                          <LucideCopy class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span class="text-sm text-gray-700 dark:text-gray-300">کپی لینک</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <h1
                  class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 bg-gradient-to-r from-[var(--gradient-brand-from)] to-[var(--gradient-brand-to)] bg-clip-text text-transparent"
                >
                  {{ post.title }}
                </h1>

                <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div class="flex items-center gap-2">
                    <LucideCalendar class="w-4 h-4" />
                    <span>{{ formatDate(post.date) }}</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <LucideClock3 class="w-4 h-4" />
                    <span>{{ calculateReadingTime(post) }} دقیقه مطالعه</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <LucideGrid2x2 class="w-4 h-4" />
                    <span>{{ post.meta?.category }}</span>
                  </div>
                </div>

                <div v-if="post.tags?.length" class="flex flex-wrap gap-2 mt-4">
                  <span v-for="tag in post.tags" :key="tag" class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 border bg-gray-50 text-gray-600 border-gray-200 dark:bg-[#ffffff05] dark:text-gray-300 dark:border-white/10">
                    <LucideTag class="w-3 h-3" />
                    {{ tag }}
                  </span>
                </div>
              </header>

              <div class="content-renderer prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-6 sm:mb-8 text-gray-700 dark:prose-invert dark:text-gray-300">
                <ContentRenderer :value="post" />
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t mb-6 sm:mb-8 border-gray-200 dark:border-[#ffffff20]">
                <div class="flex items-center gap-2">
                  <div>
                    <h3 class="font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      {{ post?.meta?.author }}
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      نویسنده
                    </p>
                  </div>
                </div>

               <div class="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3">
                  <button @click="toggleBookmark" class="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all duration-300 text-sm sm:text-base"
                    :class="isBookmarked ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' : 'text-gray-600 bg-black/5 hover:bg-black/10 border-black/10 dark:text-gray-400 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10'">
                    <LucideBookmark
                      class="w-4 sm:w-5 h-4 sm:h-5"
                    />
                    <span>{{ isBookmarked ? "ذخیره شد" : "ذخیره" }}</span>
                  </button>

                  <button @click="sharePost" class="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all duration-300 text-sm sm:text-base text-gray-600 bg-black/5 hover:bg-black/10 border-black/10 dark:text-gray-400 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10">
                    <LucideShare2 class="w-4 sm:w-5 h-4 sm:h-5" />
                    <span>اشتراک‌گذاری</span>
                  </button>
                </div>
              </div>

              <div class="mt-6 sm:mt-8 flex justify-start">
                <NuxtLink to="/blog" class="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full border transition-all duration-300 group text-sm sm:text-base border-[#00000020] hover:border-[#578FCA] text-gray-700 hover:text-[#578FCA] dark:border-[#ffffff30] dark:hover:border-[#7091F5] dark:text-gray-300 dark:hover:text-[#7091F5]">
                  <LucideArrowRight 
                    class="w-4 sm:w-5 h-4 sm:h-5 transform rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
                  />
                  <span class="font-medium">بازگشت به وبلاگ</span>
                </NuxtLink>
              </div>
            </article>

            <aside class="w-full lg:w-80 xl:w-96">
              <PostSidebar :current-post="post" />
            </aside>

            <p v-if="!post" class="text-center text-xl sm:text-2xl md:text-3xl font-bold py-20 text-[#578FCA] dark:text-[#7091F5]">
              ۴۰۴ | مقاله مورد نظر یافت نشد
            </p>
          </div>
        </div>
        <div class="mt-8 sm:mt-12 lg:mt-16 max-w-3xl w-full">
          <Comments v-if="post" :post-id="slug" />
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

.prose {
  @apply max-w-none;
}
@media (max-width: 640px) {
  .prose {
    font-size: 0.95rem;
  }

  .prose h1 {
    font-size: 1.75rem;
  }

  .prose h2 {
    font-size: 1.5rem;
  }

  .prose h3 {
    font-size: 1.25rem;
  }
}
</style>
