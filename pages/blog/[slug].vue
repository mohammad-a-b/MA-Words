<script setup>
const slug = useRoute().params.slug;
const { data: post } = await useAsyncData(`blog-${slug}`, () => {
  return queryCollection("blog").path(`/blog/${slug}`).first();
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
  <main class="overflow-x-hidden p-8 transition-colors duration-300" dir="rtl">
    <div class="relative min-h-screen">
      <div
        class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]"
      ></div>
      <div class="relative z-10 container mx-auto px-4 xl:px-0 py-20">
        <article 
          v-if="post"
          class="max-w-4xl mx-auto rounded-3xl p-10 transition-all duration-300 border-1 border-[#ffffff44]"
          :class="isDark ? 'bg-[#0f0f1d] shadow-2xl' : 'bg-white shadow-lg'"
        >
          <header class="mb-8 border-b border-[#fff8] pb-4">
            <h1
              class="text-4xl md:text-5xl font-extrabold mb-4"
              :class="isDark ? 'text-[#7091F5]' : 'text-[#578FCA]'"
            >
              {{ post.title }}
            </h1>
            <div
              class="flex items-center gap-2 text-sm"
              :class="isDark ? 'text-gray-400' : 'text-gray-600'"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10m-10 4h10m-10 4h10M5 21h14a2 2 0 002-2v-6H3v6a2 2 0 002 2z"
                />
              </svg>
              <span>{{ new Date(post.date).toLocaleDateString("fa-IR") }}</span>
            </div>
          </header>
          <div
            class="content-renderer prose prose-lg max-w-none mb-8"
            :class="isDark ? 'prose-invert' : 'text-gray-700'"
          >
            <ContentRenderer :value="post" />
          </div>
          <div class="flex justify-end">
            <NuxtLink
              to="/blog"
              class="inline-flex justify-end items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300"
              :class="
                isDark
                  ? 'border-[#ffffff30] hover:border-[#7091F5] text-gray-300 hover:text-[#7091F5]'
                  : 'border-[#00000020] hover:border-[#578FCA] text-gray-700 hover:text-[#578FCA]'
              "
            >
              <span class="font-medium">بازگشت به وبلاگ</span>
              <svg
                class="w-5 h-5 rotate-180 transform scale-x-[-1] transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </NuxtLink>
          </div>
        </article>
        <p
          v-else
          class="text-center text-3xl font-bold py-20"
          :class="isDark ? 'text-[#7091F5]' : 'text-[#578FCA]'"
        >
          ۴۰۴ | مقاله مورد نظر یافت نشد
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
