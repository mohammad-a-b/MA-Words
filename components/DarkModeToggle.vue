<script setup>
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
});
const toggleDark = useToggle(isDark);
</script>

<template>
  <button
    @click="toggleDark()"
    class="p-3 rounded-full backdrop-blur-lg border transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-110"
    :class="
      isDark
        ? 'border-[#ffffff15] hover:border-[#578FCA] bg-[#1a1a2e]/90 text-gray-200 hover:text-[#578FCA]'
        : 'border-[#00000015] hover:border-[#7091F5] bg-white/90 text-gray-700 hover:text-[#7091F5]'
    "
  >
    <div class="relative w-6 h-6">
      <IconsMoon v-show="isDark" class="w-6 h-6" />
      <IconsSun v-show="!isDark" class="w-6 h-6" />
    </div>
  </button>
</template>
