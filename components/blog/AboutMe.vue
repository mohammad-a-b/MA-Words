<script setup>
const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
});
</script>

<template>
  <section
    class="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t"
    :class="isDark ? 'border-[#ffffff10]' : 'border-[#00000010]'"
  >
    <div
      class="flex flex-col items-center text-center space-y-3 sm:space-y-4"
    >
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
</template> 