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
    class="rounded-full text-[10px] xs:text-xs sm:text-sm flex items-center gap-0.5 sm:gap-1 group border transition-all duration-200 blog-tag-button"
    :class="[
      active
        ? isDark
          ? 'bg-[#578FCA]/10 text-[#578FCA] border-[#578FCA]/20'
          : 'bg-[#7091F5]/10 text-[#7091F5] border-[#7091F5]/20'
        : isDark
        ? 'bg-[#ffffff05] text-gray-300 hover:bg-[#ffffff10] border-white/10'
        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200',
      $attrs.class || 'px-1.5 sm:px-2 py-0.5 sm:py-1'
    ]"
  >
    <IconsTag
      v-if="showIcon"
      class="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-300 group-hover:scale-110"
    />
    <slot>{{ text }}</slot>
  </button>
</template> 