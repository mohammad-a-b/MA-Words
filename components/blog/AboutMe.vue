<script setup>
import IconsGithub from "~/components/icons/Github.vue";
import IconsTelegram from "~/components/icons/Telegram.vue";
import IconsEmail from "~/components/icons/Email.vue";

const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
});

const socialLinks = [
  {
    icon: IconsGithub,
    url: "https://github.com/mohammad-a-b",
    label: "پروفایل گیت‌هاب من",
  },
  {
    icon: IconsTelegram,
    url: "https://t.me/MohammaadA_b",
    label: "کانال تلگرام من",
  },
  {
    icon: IconsEmail,
    url: "mailto:m.amir.b1389@gmail.com",
    label: "ارسال ایمیل به من",
  },
];

const skills = [
  "Vue.js",
  "Nuxt.js",
  "JavaScript",
  "TypeScript",
  "CSS",
  "HTML",
  "Node.js",
];
</script>

<template>
  <section
    class="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t relative"
    :class="isDark ? 'border-[#ffffff10]' : 'border-[#00000010]'"
  >
    <div class="absolute top-4 right-4 flex space-x-4">
      <a
        v-for="link in socialLinks"
        :key="link.url"
        :href="link.url"
        target="_blank"
        :aria-label="link.label"
        class="p-2 rounded-2xl transition-all duration-300 hover:scale-110"
        :class="
          isDark
            ? 'bg-[#ffffff20] text-gray-200 hover:bg-[#ffffff30] hover:text-[#578FCA]'
            : 'bg-[#00000015] text-gray-700 hover:bg-[#00000025] hover:text-[#7091F5]'
        "
      >
        <component :is="link.icon" class="w-6 h-6" />
      </a>
    </div>

    <div class="flex flex-col items-center text-center space-y-6 sm:space-y-8">
      <div
        class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 transition-all duration-300 hover:scale-105"
        :class="isDark ? 'border-[#578FCA]' : 'border-[#7091F5]'"
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_zfYdfminxFt2Ymu1k-hyEz3slVvH1nZN_Yetgfk2S0WZhvybVuL5zKQ&s"
          alt="عکس پروفایل"
          class="w-full h-full object-cover"
        />  
      </div>

      <div class="space-y-2">
        <h2
          class="text-xl sm:text-2xl md:text-3xl font-bold"
          :class="isDark ? 'text-[#578FCA]' : 'text-[#7091F5]'"
        >
          <!-- محمد امیر برخورداری -->
        </h2>
        <p
          class="text-sm sm:text-base"
          :class="isDark ? 'text-gray-300' : 'text-gray-600'"
        >
          توسعه‌دهنده فرانت‌اند و نویسنده محتوا
        </p>
      </div>

      <p
        class="max-w-2xl text-sm sm:text-base leading-relaxed"
        :class="isDark ? 'text-gray-300' : 'text-gray-600'"
      >
        سلام، ما توسعه‌دهنده و نویسنده محتوا هستیم. در این وبلاگ
        تجربیات، نکات و مطالب مفیدی در زمینه برنامه‌نویسی و فناوری را به اشتراک
        می‌گذاریم. هدف ما الهام‌بخشی و کمک به رشد ایده‌های نو است.
      </p>

      <div class="flex flex-wrap justify-center gap-2 max-w-2xl">
        <span
          v-for="skill in skills"
          :key="skill"
          class="px-3 py-1 text-xs sm:text-sm rounded-full"
          :class="
            isDark
              ? 'bg-[#ffffff10] text-gray-300'
              : 'bg-[#00000010] text-gray-600'
          "
        >
          {{ skill }}
        </span>
      </div>
    </div>
  </section>
</template>
