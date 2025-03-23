<script setup>
const { data: allPosts } = await useAsyncData("blog-posts", () => {
  return queryCollection("blog").order("date", "DESC").all();
});
const searchQuery = ref("");
const filteredPosts = computed(() => {
  if (!allPosts.value) return [];
  return allPosts.value.filter((post) => {
    const query = searchQuery.value.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      (post.description && post.description.toLowerCase().includes(query))
    );
  });
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
    class="min-h-screen overflow-x-hidden p-8 transition-colors duration-300"
    dir="rtl"
  >
    <div class="parallax-wrapper relative h-[90vh] -mb-[50vh]">
      <div class="parallax-layers sticky top-0 h-screen">
        <div
          class="parallax-layer absolute inset-0 [transform:translateZ(-5px)_scale(1.6)]"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]"
          ></div>
        </div>
        <div
          class="parallax-layer absolute inset-0 [transform:translateZ(-3px)_scale(1.3)]"
        >
          <div class="stars absolute inset-0 opacity-50"></div>
        </div>
        <div
          class="parallax-layer absolute inset-0 flex items-center justify-center"
        >
          <h1
            class="text-center animate-float font-bold"
            :class="
              isDark
                ? '[text-shadow:0_0_15px_#7091F5]'
                : '[text-shadow:0_0_15px_#7091F560]'
            "
            style="font-size: clamp(4rem, 8rem, 10vw); line-height: 1.2"
          >
            وبلاگ
            <span :class="isDark ? 'text-[#578FCA]' : 'text-[#7091F5]'"
              >من</span
            >
            <div
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 blur-md animate-pulse"
              :class="isDark ? 'bg-[#578FCA]/70' : 'bg-[#7091F5]/70'"
            ></div>
          </h1>
        </div>
      </div>
    </div>

    <section class="relative z-10 container mx-auto px-4 xl:px-0 py-32">
      <div class="flex justify-start mb-8">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="جستجو در مطالب..."
          class="w-full max-w-md px-4 py-2 border rounded-full focus:outline-none transition-all duration-300"
          :class="
            isDark
              ? 'bg-[#0f0f1d] text-white border-[#ffffff20]'
              : 'bg-white text-gray-800 border-[#00000020]'
          "
        />
      </div>
      <div
        v-if="filteredPosts.length === 0"
        class="text-center text-xl text-gray-500"
      >
        هیچ نتیجه‌ای پیدا نشد.
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <article
          v-for="post in filteredPosts"
          :key="post.id"
          class="group rounded-2xl p-6 transition-all duration-300 relative flex flex-col border"
          :class="
            isDark
              ? 'bg-[#0f0f1d] border-[#ffffff10]'
              : 'bg-white border-[#00000010]'
          "
        >
          <div
            class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            :class="
              isDark
                ? 'bg-gradient-to-bl from-[#7091F515] to-[#578FCA10]'
                : 'bg-gradient-to-bl from-[#7091F510] to-[#578FCA08]'
            "
          ></div>
          <NuxtLink :to="post.path" class="relative block flex-grow">
            <div
              class="relative h-64 mb-8 rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
            >
              <div
                class="absolute inset-0 bg-gradient-to-t from-[#000000cc] to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-70"
              ></div>
              <img
                v-if="post.meta.image"
                :src="post.meta.image"
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute bottom-4 right-4 flex items-center gap-2">
                <span
                  class="px-1 py-1 rounded-lg text-sm text-white/90 bg-[#00000090] backdrop-blur-sm"
                >
                  {{ new Date(post.date).toLocaleDateString("fa-IR") }}
                </span>
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-6H3v6a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <h2
              class="text-2xl font-bold mb-4 pr-2 transition-all duration-300"
              :class="isDark ? 'text-[#578FCA]' : 'text-[#7091F5]'"
            >
              {{ post.title }}
            </h2>
            <p
              class="mb-4 line-clamp-3 leading-relaxed text-justify text-[15px]"
              :class="isDark ? 'text-gray-300/90' : 'text-gray-600/90'"
              v-html="post.description || '...'"
            ></p>
          </NuxtLink>
          <div>
            <NuxtLink
              :to="post.path"
              class="inline-flex items-center gap-2 px-4 py-3 rounded-full border transition-all duration-300 hover:pr-6"
              :class="
                isDark
                  ? 'bg-[#ffffff08] border-[#ffffff15] hover:border-[#578FCA] hover:text-[#578FCA]'
                  : 'bg-[#f8f9fa] border-[#7091F520] hover:border-[#7091F5] hover:text-[#7091F5]'
              "
            >
              <div class="z-10 flex justify-center items-center gap-2">
                <svg
                  class="w-5 h-5 transform rotate-300 transition-transform duration-300 group-hover:rotate-360"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H6"
                  />
                </svg>
                <span>مطالعه بیشتر</span>
              </div>
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <section
      class="relative z-10 container mx-auto px-4 xl:px-0 py-20 border-t mt-16"
      :class="isDark ? 'border-[#ffffff10]' : 'border-[#00000010]'"
    >
      <div class="flex flex-col items-center text-center space-y-4">
        <div
          class="w-20 h-20 rounded-full overflow-hidden border-4"
          :class="isDark ? 'border-[#578FCA]' : 'border-[#7091F5]'"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_zfYdfminxFt2Ymu1k-hyEz3slVvH1nZN_Yetgfk2S0WZhvybVuL5zKQ&s"
            alt=" عکس پروفایل"
            class="w-full h-full object-cover"
          />
        </div>
        <h2
          class="text-3xl font-bold"
          :class="isDark ? 'text-[#578FCA]' : 'text-[#7091F5]'"
        >
          درباره من
        </h2>
        <p
          class="max-w-2xl text-lg leading-relaxed"
          :class="isDark ? 'text-gray-300' : 'text-gray-600'"
        >
          سلام، من محمد امیر هستم؛ توسعه‌دهنده و نویسنده محتوا. در این وبلاگ
          تجربیات، نکات و مطالب مفیدی در زمینه برنامه‌نویسی و فناوری را به
          اشتراک می‌گذارم. هدف من الهام‌بخشی و کمک به رشد ایده‌های نو است.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(-160px) rotate(1deg);
  }
  50% {
    transform: translateY(-165px) rotate(-1deg);
  }
}
.animate-float {
  animation: float 5s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
}
@keyframes scan {
  0% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0 0;
  }
}
.stars {
  animation: scan 120s linear infinite;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
article {
  transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28),
    box-shadow 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28), border-color 0.3s ease;
  will-change: transform, box-shadow;
}
article:hover {
  transform: translateY(-8px) scale(1.015);
  box-shadow: 0 25px 60px -12px rgba(113, 145, 245, 0.3);
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 250ms;
}
</style>
