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
        ? 'bg-[#7091F5]/10 text-[#7091F5] border-[#7091F5]/20 dark:bg-[#578FCA]/10 dark:text-[#578FCA] dark:border-[#578FCA]/20'
        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200 dark:bg-[#ffffff05] dark:text-gray-300 dark:hover:bg-[#ffffff10] dark:border-white/10',
      $attrs.class || 'px-1.5 sm:px-2 py-0.5 sm:py-1'
    ]"
  >
    <LucideTag
      v-if="showIcon"
      class="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-300 group-hover:scale-110"
    />
    <slot>{{ text }}</slot>
  </button>
</template> 