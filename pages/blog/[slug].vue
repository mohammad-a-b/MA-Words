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
    <div class="parallax-wrapper">
      <div
        class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]"
      ></div>
    </div>

    <div class="relative z-10 container mx-auto px-4 xl:px-0 py-20">
      <article
        v-if="post"
        class="max-w-3xl mx-auto rounded-3xl p-8 transition-all duration-300"
        :class="isDark ? 'bg-[#0f0f1d] shadow-2xl' : 'bg-white shadow-lg'"
      >
        <header class="mb-12 text-center">
          <h1
            class="text-4xl md:text-5xl font-bold mb-8 animate-float"
            :class="
              isDark
                ? 'text-[#7091F5] [text-shadow:0_0_20px_#7091F550]'
                : 'text-[#578FCA] [text-shadow:0_0_20px_#578FCA30]'
            "
          >
            {{ post.title }}
          </h1>
          <div class="flex items-center justify-center gap-4">
            <div
              class="w-2 h-2 rounded-full animate-pulse"
              :class="isDark ? 'bg-[#7091F5]' : 'bg-[#578FCA]'"
            ></div>
            <p
              class="text-sm"
              :class="isDark ? 'text-gray-400' : 'text-gray-600'"
            >
              {{ new Date(post.date).toLocaleDateString("fa-IR") }}
            </p>
          </div>
        </header>

        <div
          class="prose prose-lg max-w-none mb-12"
          :class="isDark ? 'prose-invert' : 'text-gray-700'"
        >
          <ContentRenderer :value="post" />
        </div>

        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300"
          :class="
            isDark
              ? 'border-[#ffffff30] hover:border-[#7091F5] text-gray-300 hover:text-[#7091F5]'
              : 'border-[#00000020] hover:border-[#578FCA] text-gray-700 hover:text-[#578FCA]'
          "
        >
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
          <span class="font-medium">بازگشت به وبلاگ</span>
        </NuxtLink>
      </article>

      <p
        v-else
        class="text-center text-3xl font-bold py-20"
        :class="isDark ? 'text-[#7091F5]' : 'text-[#578FCA]'"
      >
        ۴۰۴ | مقاله مورد نظر یافت نشد
      </p>
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
    transform: translateY(-8px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.stars {
  background: radial-gradient(1.5px at 90% 20%, #fff8 50%, transparent),
    radial-gradient(1.5px at 10% 90%, #fff8 50%, transparent);
  background-size: 200% 200%;
  animation: scan 60s linear infinite;
}
</style>
