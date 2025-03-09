<script setup>
const { data: allPosts } = await useAsyncData("blog-posts", () => {
  return queryCollection("blog").order("date", "DESC").all();
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
          />
        </div>

        <div
          class="parallax-layer absolute inset-0 [transform:translateZ(-3px)_scale(1.3)]"
        >
          <div class="stars absolute inset-0 opacity-50" />
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
            style="font-size: clamp(4rem, 8rem, 10vw); line-height: 1.2;"
          >
            وبلاگ
            <span :class="isDark ? 'text-[#578FCA]' : 'text-[#7091F5]'">
              من
            </span>
            <div
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 blur-md animate-pulse"
              :class="isDark ? 'bg-[#578FCA]/70' : 'bg-[#7091F5]/70'"
            />
          </h1>
        </div>
      </div>
    </div>

    <div class="relative z-10 container mx-auto px-4 xl:px-0 py-32">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <article
          v-for="post in allPosts"
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
          />

          <NuxtLink :to="post.path" class="relative block flex-grow">
            <div
              class="relative h-64 mb-8 rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
            >
              <div
                class="absolute inset-0 bg-gradient-to-t from-[#000000cc] to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-70"
              />
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
                <div
                  class="w-2 h-2 rounded-full animate-pulse bg-current"
                  :class="isDark ? 'text-[#578FCA]/80' : 'text-[#7091F5]/80'"
                />
              </div>
            </div>

            <h2
              class="text-2xl font-bold mb-4 pr-2 transition-all duration-300 hover:pr-3.5"
              :class="isDark ? 'text-[#578FCA]' : 'text-[#7091F5]'"
            >
              {{ post.title }}
            </h2>

            <p
              class="mb-4 line-clamp-3 leading-relaxed text-justify text-[15px]"
              :class="isDark ? 'text-gray-300/90' : 'text-gray-600/90'"
              v-html="post.description || '...'"
            />
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
                  class="scale-x-[-1] w-4 h-4 rotate-145 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                <span>مطالعه بیشتر</span>
              </div>
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<style>
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

::-webkit-scrollbar {
  width: 10px;

  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #4338bb, #51c79c);
  border-radius: 10px;
  border: 2px solid #0a0a12;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.group:hover .group-hover\:rotate-180 {
  transform: rotate(180deg) scaleX(-1);
}
</style>
