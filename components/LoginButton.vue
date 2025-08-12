<script setup>
import { useAuth } from '~/composables/useAuth'

const { user } = useAuth()
const showLoginModal = ref(false)

const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
})

const openLoginModal = () => {
  showLoginModal.value = true
}
</script>

<template>
  <div>
    <div v-if="!user" class="flex items-center gap-3">
      <button
        @click="openLoginModal"
        class="flex items-center gap-2.5 px-3 py-2.5 rounded-full backdrop-blur-lg border transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-medium"
        :class="
          isDark
            ? 'border-[#ffffff15] hover:border-[#578FCA] bg-[#1a1a2e]/90 text-gray-200 hover:text-[#578FCA]'
            : 'border-[#00000015] hover:border-[#7091F5] bg-white/90 text-gray-700 hover:text-[#7091F5]'
        "
      >
        <IconsUser class="w-5 h-5" />
        <span>ورود</span>
      </button>
    </div>

    <LoginModal v-model="showLoginModal" />
  </div>
</template> 