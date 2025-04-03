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
    class="fixed top-4 right-4 z-[9999] p-3 rounded-full backdrop-blur-lg border transition-all duration-500 shadow-xl hover:scale-110"
    :class="
      isDark
        ? 'border-[#ffffffab] hover:border-[#4d6c6482] bg-[#00000030]'
        : 'border-[#000000ab] hover:border-[#182a2381] bg-[#ffffff20]'
    "
  >
    <div class="relative w-6 h-6">
      <IconsMoon v-show="isDark"></IconsMoon>
      <IconsSun v-show="!isDark"></IconsSun>
    </div>
  </button>
</template>
