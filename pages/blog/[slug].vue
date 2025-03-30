<script setup>
const slug = useRoute().params.slug;
const { data: post } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection("blog").path(`/blog/${slug}`).first()
);
import { useRoute } from "vue-router";
import { useHead } from "#imports";

const postTitle = ref("در حال بارگذاری...");

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
</script>

<template>
  <main
    class="duration-300 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 max-w-5xl mx-auto"
  >
    <div class="relative min-h-screen">
      <div
        class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]"
      ></div>
      <div class="relative z-10 container mx-auto max-w-6xl px-4 xl:px-0 py-10">
        <article
          v-if="post"
          class="mx-auto rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-300 border border-[#ffffff44]"
          :class="isDark ? 'bg-[#0f0f1d] shadow-2xl' : 'bg-white shadow-lg'"
        >
          <header class="mb-6 border-b border-[#fff8] pb-4">
            <h1
              class="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 title-gradient"
              :class="isDark ? 'text-[#7091F5]' : 'text-[#578FCA]'"
            >
              {{ post.title }}
            </h1>
            <div
              class="flex items-center gap-2 text-xs sm:text-sm"
              :class="isDark ? 'text-gray-400' : 'text-gray-600'"
            >
              <IconsDate></IconsDate>
              <span>{{ new Date(post.date).toLocaleDateString("fa-IR") }}</span>
            </div>
          </header>
          <div
            class="content-renderer prose max-w-none mb-6"
            :class="isDark ? 'prose-invert text-gray-300' : 'text-gray-700'"
          >
            <ContentRenderer :value="post" />
          </div>
          <div class="flex justify-center sm:justify-end">
            <NuxtLink
              to="/blog"
              class="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-3 text-sm sm:text-base md:text-lg border rounded-full transition-all duration-300"
              :class="
                isDark
                  ? 'border-[#ffffff30] hover:border-[#7091F5] text-gray-300 hover:text-[#7091F5]'
                  : 'border-[#00000020] hover:border-[#578FCA] text-gray-700 hover:text-[#578FCA]'
              "
            >
              <span class="font-medium">بازگشت به وبلاگ</span>
              <IconsArrow2
                class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
              ></IconsArrow2>
            </NuxtLink>
          </div>
        </article>
        <p
          v-else
          class="text-center text-xl sm:text-2xl md:text-3xl font-bold py-20"
          :class="isDark ? 'text-[#7091F5]' : 'text-[#578FCA]'"
        >
          ۴۰۴ | مقاله مورد نظر یافت نشد
        </p>
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
</style>
