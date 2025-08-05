<script setup>
import { useAuth } from '~/composables/useAuth'
import { useToast } from 'vue-toastification'

const { user, logout } = useAuth()
const toast = useToast()
const isMenuOpen = ref(false)
const isLoggingOut = ref(false)

const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = async () => {
  if (isLoggingOut.value) return
  
  try {
    isLoggingOut.value = true
    const result = await logout()
    
    if (result.success) {
      toast.success('خروج موفقیت‌آمیز بود!', {
        position: "bottom-right",
        timeout: 3000,
      })
      isMenuOpen.value = false
    } else {
      toast.error('خطا در خروج: ' + result.error, {
        position: "bottom-right",
        timeout: 4000,
      })
    }
  } catch (error) {
    toast.error('خطا در خروج از حساب کاربری', {
      position: "bottom-right",
      timeout: 4000,
    })
  } finally {
    isLoggingOut.value = false
  }
}

onMounted(() => {
  const handleClickOutside = (event) => {
    if (isMenuOpen.value && !event.target.closest('.user-menu')) {
      isMenuOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<template>
  <div v-if="user" class="user-menu relative">
    <button
      @click="toggleMenu"
      class="flex items-center gap-2 p-2 rounded-2xl backdrop-blur-lg border transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
      :class="
        isDark
          ? 'border-[#ffffff15] hover:border-[#578FCA] bg-[#1a1a2e]/90 text-gray-200 hover:text-[#578FCA]'
          : 'border-[#00000015] hover:border-[#7091F5] bg-white/90 text-gray-700 hover:text-[#7091F5]'
      "
    >
      <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
        {{ user.email?.charAt(0).toUpperCase() }}
      </div>
      <svg
        class="w-4 h-4 transition-transform duration-300"
        :class="[
          isMenuOpen ? 'rotate-180' : 'rotate-0',
          isDark ? 'text-gray-300' : 'text-gray-600'
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isMenuOpen"
        class="absolute top-full right-0 mt-3 w-72 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 z-50"
        :class="
          isDark
            ? 'bg-[#1a1a2e]/95 border-[#ffffff10] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]'
            : 'bg-white/95 border-gray-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]'
        "
      >
        <div class="p-5 border-b" :class="isDark ? 'border-[#ffffff10]' : 'border-gray-100'">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {{ user.email?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate" :class="isDark ? 'text-gray-100' : 'text-gray-800'">
                {{ user.email }}
              </p>
              <p class="text-xs mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                کاربر فعال
              </p>
            </div>
          </div>
        </div>

        <div class="p-3">
          <button
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            :class="
              isDark
                ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                : 'text-red-600 hover:bg-red-50 hover:text-red-700'
            "
          >
            <svg
              class="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span class="flex-1 font-medium">
              {{ isLoggingOut ? 'در حال خروج...' : 'خروج از حساب' }}
            </span>
            <div
              v-if="isLoggingOut"
              class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0"
            ></div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.user-menu {
  z-index: 1000;
}
</style> 