<script setup>
const { data: allPosts } = await useAsyncData("blog-posts", () =>
  queryCollection("blog").order("date", "DESC").all()
);

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
  <main class="duration-300 p-4 sm:p-6 md:p-8 lg:p-8 xl:p-10">
    <header class="text-center py-6 sm:py-8 md:py-10">
      <h1
        class="font-bold animate-float"
        :class="
          isDark
            ? '[text-shadow:0_0_15px_#7091F5]'
            : '[text-shadow:0_0_15px_#7091F560]'
        "
        style="font-size: clamp(3rem, 8vw, 6rem); line-height: 1.2"
      >
        وبلاگ
        <span :class="isDark ? 'text-[#578FCA]' : 'text-[#7091F5]'">من</span>
      </h1>
      <div
        class="mt-3 w-20 h-1 mx-auto blur-md animate-pulse"
        :class="isDark ? 'bg-[#578FCA]/70' : 'bg-[#7091F5]/70'"
      ></div>
    </header>

    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-center mb-4">
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
    </section>

    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div
        v-if="filteredPosts.length === 0"
        class="text-center text-lg text-gray-500"
      >
        هیچ نتیجه‌ای پیدا نشد.
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
      >
        <article
          v-for="post in filteredPosts"
          :key="post.id"
          class="group rounded-2xl p-3 sm:p-5 transition-all duration-300 relative flex flex-col border"
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
          <NuxtLink :to="post.path" class="relative block">
            <div
              class="relative h-48 sm:h-56 mb-3 rounded-2xl transition-transform duration-300 group-hover:scale-105"
            >
              <div
                class="absolute inset-0 bg-gradient-to-t from-[#000000cc] to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-70"
              ></div>
              <img
                v-if="post.meta.image"
                :src="post.meta.image"
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-300 rounded-2xl"
              />
              <div class="absolute bottom-2 right-2 flex items-center gap-1">
                <span
                  class="px-1 py-0.5 rounded text-xs sm:text-sm text-white/90 bg-[#00000090] backdrop-blur-sm"
                >
                  {{ new Date(post.date).toLocaleDateString("fa-IR") }}
                </span>
                <IconsDate> </IconsDate>
              </div>
            </div>
          </NuxtLink>
          <div class="flex flex-col flex-grow">
            <h2
              class="text-lg sm:text-xl md:text-2xl font-bold mb-2 transition-all duration-300"
              :class="isDark ? 'text-[#578FCA]' : 'text-[#7091F5]'"
            >
              {{ post.title }}
            </h2>
            <p
              class="mb-3 text-xs sm:text-sm md:text-base line-clamp-3 text-justify"
              :class="isDark ? 'text-gray-300/90' : 'text-gray-600/90'"
            >
              {{ post.description || "..." }}
            </p>
          </div>
          <div>
            <NuxtLink
              :to="post.path"
              class="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full border transition-all duration-300 hover:pr-6"
              :class="
                isDark
                  ? 'bg-[#ffffff08] border-[#ffffff15] hover:border-[#578FCA] hover:text-[#578FCA]'
                  : 'bg-[#f8f9fa] border-[#7091F520] hover:border-[#7091F5] hover:text-[#7091F5]'
              "
            >
              <div class="z-10 flex items-center gap-2">
                <IconsArrow></IconsArrow>
                <span class="text-sm sm:text-base">مطالعه بیشتر</span>
              </div>
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <section
      class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t mt-4"
      :class="isDark ? 'border-[#ffffff10]' : 'border-[#00000010]'"
    >
      <div class="flex flex-col items-center text-center space-y-3">
        <div
          class="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4"
          :class="isDark ? 'border-[#578FCA]' : 'border-[#7091F5]'"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_zfYdfminxFt2Ymu1k-hyEz3slVvH1nZN_Yetgfk2S0WZhvybVuL5zKQ&s"
            alt="عکس پروفایل"
            class="w-full h-full object-cover"
          />
        </div>
        <h2
          class="text-lg sm:text-xl md:text-2xl font-bold"
          :class="isDark ? 'text-[#578FCA]' : 'text-[#7091F5]'"
        >
          درباره من
        </h2>
        <p
          class="max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed"
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
    transform: translateY(-10px) rotate(1deg);
  }
  50% {
    transform: translateY(-15px) rotate(-1deg);
  }
}
.animate-float {
  animation: float 5s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
}
article {
  transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28),
    box-shadow 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28), border-color 0.3s ease;
  will-change: transform, box-shadow;
}
article:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 20px 40px -10px rgba(113, 145, 245, 0.3);
}
</style>
