<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  showIcon: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['click']);

const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
});

const handleClick = () => {
  emit('click', props.text);
};
</script>

<template>
  <button
    @click="handleClick"
    class="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2 group border transition-all duration-200 blog-tag-button"
    :class="[
      active
        ? isDark
          ? 'bg-[#578FCA]/10 text-[#578FCA] border-[#578FCA]/20'
          : 'bg-[#7091F5]/10 text-[#7091F5] border-[#7091F5]/20'
        : isDark
        ? 'bg-[#ffffff05] text-gray-300 hover:bg-[#ffffff10] border-white/10'
        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200',
    ]"
  >
    <IconsTag
      v-if="showIcon"
      class="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:scale-110"
    />
    <slot>{{ text }}</slot>
  </button>
</template> 