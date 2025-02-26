<script setup>
const slug = useRoute().params.slug;
const { data: post } = await useAsyncData(`blog-${slug}`, () => {
  return queryCollection("blog").path(`/blog/${slug}`).first();
});

</script>

<template>
  <div>
    <main class="min-h-screen bg-[#0a0a12] overflow-hidden relative">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:40px_40px]"></div>
        <div class="absolute inset-0 bg-[linear-gradient(45deg,#00000000_49%,#7c3aed20_50%,#00000000_51%)] [background-size:10px_10px] opacity-30 animate-grid-pulse"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10 py-28">
        <article 
          v-if="post"
          class="max-w-4xl mx-auto bg-gradient-to-br from-[#0f0f1d] to-[#16213e] rounded-[3rem] p-12 shadow-2xl border-2 border-[#ffffff10] hover:border-[#7c3aed60] transition-all duration-700 group"
          style="transform-style: preserve-3d;"
        >
          <div class="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_center,#7c3aed30_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div class="relative space-y-8 [transform:translateZ(30px)]">
            <header class="mb-12 text-center">
              <h1 class="text-6xl font-orbitron bg-gradient-to-r from-[#7c3aed] to-[#00ff87] bg-clip-text text-transparent [text-shadow:0_0_30px_#7c3aed80] animate-title-glow">
                {{ post.title }}
              </h1>
              <div class="mt-6 flex items-center justify-center space-x-4">
                <div class="w-3 h-3 bg-[#00ff87] rounded-full animate-pulse"></div>
                <p class="text-gray-400">
                  {{ new Date(post.date).toLocaleDateString("fa-IR") }}
                </p>
              </div>
            </header>

            <div class="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed backdrop-blur-lg p-8 rounded-2xl bg-[#ffffff05]">
              <ContentRenderer :value="post" />
            </div>

            <div class="mt-16 flex justify-start">
              <NuxtLink
                to="/blog"
                class="inline-flex items-center gap-3 px-8 py-4 bg-[linear-gradient(45deg,#7c3aed30,#00ff8730)] hover:bg-[linear-gradient(45deg,#7c3aed50,#00ff8750)] backdrop-blur-xl border-2 border-[#ffffff30] hover:border-[#7c3aed] rounded-2xl transition-all duration-400 group/btn"
              >
              <svg class="w-6 h-6 -rotate-180 group-hover/btn:rotate-0 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
                <span class=" font-medium text-lg">بازگشت به وبلاگ</span>
              </NuxtLink>
            </div>
          </div>
        </article>

        <p 
          v-else 
          class="text-center text-4xl font-orbitron bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse"
        >
          404 | پستی یافت نشد 🔍
        </p>
      </div>

      <div class="particles absolute inset-0 z-0 pointer-events-none"></div>
    </main>
  </div>
</template>

<style>
@keyframes title-glow {
  0%, 100% { text-shadow: 0 0 30px #7c3aed80; }
  50% { text-shadow: 0 0 60px #7c3aed, 0 0 30px #00ff8780; }
}

.animate-title-glow {
  animation: title-glow 3s ease-in-out infinite;
}

@keyframes grid-pulse {
  0% { background-position: 0 0; }
  100% { background-position: 10px 10px; }
}

.animate-grid-pulse {
  animation: grid-pulse 20s linear infinite;
}

.particles::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, #7c3aed20 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, #00ff8720 0%, transparent 50%);
  animation: particles-float 40s linear infinite;
}

@keyframes particles-float {
  0% { transform: translate(0, 0); }
  33% { transform: translate(5vw, 5vh); }
  66% { transform: translate(-5vw, -5vh); }
  100% { transform: translate(0, 0); }
}


::-webkit-scrollbar {
  width: 12px;
  background: #0a0a12;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #7c3aed, #00ff87);
  border-radius: 10px;
  border: 3px solid #0a0a12;
}
</style>