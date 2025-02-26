<!-- <script setup>
const { data: allPosts } = await useAsyncData("blog-posts", () => {
  return queryCollection("blog").order("date", "DESC").all();
});
</script>

<template>
  <main
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 py-20"
  >
    <div class="container mx-auto px-4">
      <div
        class="relative h-[400px] overflow-hidden mb-16 rounded-3xl shadow-2xl"
      >
        <img
          src="https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="تصویر هدر"
          class="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-1000"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r flex items-center justify-center"
        >
          <h1 class="text-9xl font-extrabold text-white animate-fade-in">
            وبلاگ من
          </h1>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          border
          v-for="post in allPosts"
          :key="post.id"
          class="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-200"
        >
          <NuxtLink :to="post.path" class="block">
            <div
              class="h-56 bg-gray-300 rounded-xl mb-6 overflow-hidden relative"
            >
              <img
                v-if="post.meta.image"
                :src="post.meta.image"
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div
                v-else
                class="flex items-center justify-center h-full text-gray-500"
              >
                تصویر موجود نیست
              </div>
            </div>
            <h2
              class="text-2xl font-bold text-gray-800 hover:text-blue-500 transition-colors duration-300"
            >
              {{ post.title }}
            </h2>
            <p class="text-sm text-gray-500 mt-2">
              📅 {{ new Date(post.date).toLocaleDateString("fa-IR") }}
            </p>
            <p
              class="text-gray-600 mt-4 line-clamp-3 leading-relaxed"
              v-html="
                post.description || 'خلاصه‌ای از این پست در اینجا قرار می‌گیرد.'
              "
            ></p>
          </NuxtLink>
          <div class="mt-4 flex items-center justify-between">
            <NuxtLink
              :to="post.path"
              class="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              ادامه مطلب
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<style>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 1s ease-out;
}

@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-scale-in {
  animation: scale-in 1s ease-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
.animate-pulse {
  animation: pulse 1s infinite;
}
</style>
   -->

<script setup>
const { data: allPosts } = await useAsyncData("blog-posts", () => {
  return queryCollection("blog").order("date", "DESC").all();
});
</script>

<template>
  <main class="min-h-screen bg-[#0a0a12] text-gray-100 overflow-x-hidden p-8">
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
          <div class="stars absolute inset-0"></div>
        </div>
        <div
          class="parallax-layer absolute inset-0 flex items-center justify-center"
        >
          <h1
            class="text-[10vw] leading-none text-center [text-shadow:0_0_30px_#7c3aed] animate-float"
          >
            وبلاگ <span class="text-[#00ff87]"> من </span>
            <div
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#00ff87] blur-lg animate-pulse"
            ></div>
          </h1>
        </div>
      </div>
    </div>

    <div class="relative z-10 container mx-auto px-4 xl:px-0 py-32">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <article
          v-for="post in allPosts"
          :key="post.id"
          class="bg-[#0f0f1d] rounded-2xl p-6 transition transform hover:-translate-y-2 hover:shadow-xl"
          style="transform-style: preserve-3d"
        >
          <div
            class="absolute inset-0 rounded-3xl [background:linear-gradient(45deg,#7c3aed12,#00ff8708)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>

          <NuxtLink :to="post.path" class="relative block">
            <div
              class="relative h-64 mb-8 rounded-2xl overflow-hidden [transform:translateZ(30px)]"
            >
              <div
                class="absolute inset-0 bg-[linear-gradient(120deg,#7c3aed30_0%,#00ff8730_100%)]"
              ></div>
              <img
                v-if="post.meta.image"
                :src="post.meta.image"
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute bottom-4 left-4 flex items-center space-x-2">
                <div
                  class="w-2 h-2 bg-[#00ff87] rounded-full animate-pulse"
                ></div>
                <span class="text-sm">{{
                  new Date(post.date).toLocaleDateString("fa-IR")
                }}</span>
              </div>
            </div>

            <h2
              class="text-2xl font-bold mb-4 [text-shadow:0_2px_8px_#7c3aed40] group-hover:[text-shadow:0_2px_20px_#7c3aed80] transition-all duration-500"
            >
              {{ post.title }}
            </h2>
            <p
              class="text-gray-400 mb-6 line-clamp-3 leading-relaxed [transform:translateZ(20px)]"
              v-html="post.description || '...'"
            ></p>
          </NuxtLink>

          <NuxtLink
            :to="post.path"
            class="inline-flex items-center gap-2 px-6 py-3 bg-[#ffffff08] hover:bg-[#ffffff12] backdrop-blur-lg rounded-full border border-[#ffffff10] hover:border-[#7c3aed] transition-all duration-300"
          >
            <span>مطالعه بیشتر</span>
            <svg
              class="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </NuxtLink>
        </article>
      </div>
    </div>
  </main>
</template>

<style>
html {
  scroll-behavior: smooth;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(-160px) rotate(-1deg);
  }
  50% {
    transform: translateY(  -200px) rotate(1deg);
  }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

@keyframes parallax {
  from {
    transform: translateY(-20vh);
  }
  to {
    transform: translateY(20vh);
  }
}

.parallax-layer {
  animation: parallax 20s linear infinite alternate;
}

@keyframes scan {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100%;
  }
}

.stars {
  animation: scan 30s linear infinite;
}

article {
  box-shadow: 0 0 0 0 #7c3aed40;
  transition: box-shadow 0.4s, transform 0.4s;
}

article:hover {
  box-shadow: 0 0 60px -20px #7c3aed80;
  transform: translateY(-8px) scale(1.02);
}

::-webkit-scrollbar {
  width: 10px;
  background: #0a0a12;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #7c3aed, #00ff87);
  border-radius: 8px;
  border: 2px solid #0a0a12;
}
</style>
