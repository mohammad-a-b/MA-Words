<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
  >
    <div
      class="relative w-full max-w-md rounded-xl bg-white dark:bg-[#0f0f1d] p-6 shadow-lg transition-all"
    >

      <button
        @click="modelValue = false"
        class="absolute top-3 right-6 scale-150 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl"
        aria-label="بستن"
      >
        &times;
      </button>


      <h2 class="text-xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        {{ isSignup ? "ثبت‌نام" : "ورود به حساب" }}
      </h2>


      <form @submit.prevent="isSignup ? handleSignup() : handleLogin()" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="ایمیل"
          required
          autofocus
          class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#181829] text-sm p-2.5 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="password"
          type="password"
          placeholder="رمز عبور"
          required
          class="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#181829] text-sm p-2.5 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="w-full rounded-md bg-blue-600 hover:bg-blue-700 transition text-white py-2 text-sm font-medium"
        >
          {{ isSignup ? "ثبت‌نام" : "ورود" }}
        </button>
      </form>


      <p class="text-sm mt-5 text-center text-gray-600 dark:text-gray-400">
        {{ isSignup ? "حساب داری؟" : "حساب نداری؟" }}
        <span
          @click="isSignup = !isSignup"
          class="text-blue-500 cursor-pointer hover:underline"
        >
          {{ isSignup ? "وارد شو" : "ثبت‌نام کن" }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue'

const email = ref('')
const password = ref('')
const isSignup = ref(false)
const modelValue = defineModel({ default: false })
const supabase = useNuxtApp().$supabase

const handleLogin = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (!error) {
    modelValue.value = false
  } else {
    alert('خطا در ورود: ' + error.message)
  }
}

const handleSignup = async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  if (!error) {
    alert('ثبت‌نام موفق بود. لطفاً ایمیل‌تان را تأیید کنید.')
    isSignup.value = false
  } else {
    alert('خطا در ثبت‌نام: ' + error.message)
  }
}
</script>
