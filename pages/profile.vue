<script setup>
import { useDark } from '@vueuse/core'

definePageMeta({ alias: ['/me', '/account'] })

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'vueuse-dark',
})

const { user } = useAuth()
</script>

<template>
  <main class="min-h-screen py-16">
    <div class="max-w-2xl mx-auto px-4">
      <div class="mb-4">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors"
          :class="isDark ? 'border-[#ffffff15] text-gray-200 hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
        >
          <IconsArrow class="w-4 h-4 rotate-180" />
          <span>بازگشت</span>
        </NuxtLink>
      </div>
      <section class="rounded-2xl p-10 border text-center" :class="isDark ? 'bg-[#0f0f1d] border-[#ffffff10] text-gray-100' : 'bg-white border-gray-200 text-gray-800'">
        <h1 class="text-2xl font-extrabold mb-2">پروفایل</h1>
        <p class="text-sm mb-6" :class="isDark ? 'text-gray-400' : 'text-gray-600'">این صفحه فعلاً ساده است و بعداً تکمیل می‌شود.</p>
        <div class="inline-flex items-center gap-3 px-4 py-3 rounded-xl border" :class="isDark ? 'border-[#ffffff15] bg-white/5' : 'border-gray-200 bg-gray-50'">
          <IconsUser class="w-5 h-5" />
          <span class="font-medium">{{ user?.email || 'کاربر' }}</span>
        </div>
      </section>
    </div>
  </main>
</template>

