<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-[#0f0f1d] rounded-xl p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4 text-center">
        {{ isSignup ? "ثبت‌نام" : "ورود به حساب" }}
      </h2>
      <form @submit.prevent="isSignup ? handleSignup() : handleLogin()">
        <input
          v-model="email"
          type="email"
          placeholder="ایمیل"
          required
          class="mb-3 w-full border border-gray-300 p-2 rounded"
        />
        <input
          v-model="password"
          type="password"
          placeholder="رمز عبور"
          required
          class="mb-4 w-full border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {{ isSignup ? "ثبت‌نام" : "ورود" }}
        </button>
      </form>
      <p class="text-sm mt-4 text-center text-gray-600">
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
const email = ref("")
const password = ref("")
const isSignup = ref(false)
const modelValue = defineModel({ default: false })

const supabase = useNuxtApp().$supabase

const handleLogin = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (!error) modelValue.value = false
  else alert("خطا در ورود: " + error.message)
}

const handleSignup = async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  if (!error) {
    alert("ثبت‌نام موفق بود. لطفاً ایمیل‌تان را تأیید کنید.")
    isSignup.value = false
  } else {
    alert("خطا در ثبت‌نام: " + error.message)
  }
}
</script>
