<script setup>
import { ref, watch, reactive, computed } from "vue";
import { useToast } from "vue-toastification";
import { useVuelidate } from "@vuelidate/core";
import { useAuthValidation } from "~/composables/useAuthValidation";

const isSignup = ref(false);
const isSubmitting = ref(false);
const showPassword = ref(false);
const modelValue = defineModel({ default: false });
const supabase = useNuxtApp().$supabase;
const toast = useToast();
const { getValidationRules } = useAuthValidation();

const state = reactive({
  email: "",
  password: "",
});

const rules = computed(() => getValidationRules(isSignup.value));

const v$ = useVuelidate(rules, state, { $autoDirty: false });

watch(isSignup, () => {
  v$.value.$reset();
});

watch(modelValue, (newVal) => {
  if (!newVal) {
    state.email = "";
    state.password = "";
    v$.value.$reset();
    isSubmitting.value = false;
    showPassword.value = false;
  }
});

const closeModal = () => {
  modelValue.value = false;
  state.email = "";
  state.password = "";
  v$.value.$reset();
  isSubmitting.value = false;
  showPassword.value = false;
};

const toggleMode = () => {
  isSignup.value = !isSignup.value;
  state.email = "";
  state.password = "";
  v$.value.$reset();
};

const showMessage = (message, type = "success") => {
  try {
    if (type === "success") {
      toast.success(message, {
        position: "bottom-right",
        timeout: 4000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
    } else {
      toast.error(message, {
        position: "bottom-right",
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
    }
  } catch (error) {
    alert(message);
  }
};

const handleLogin = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    showMessage("لطفاً خطاهای فرم را برطرف کنید", "error");
    return;
  }

  try {
    isSubmitting.value = true;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: state.email.trim(),
      password: state.password,
    });

    if (!error && data.session) {
      showMessage("ورود موفقیت‌آمیز بود! خوش آمدید");
      closeModal();
    } else {
      let errorMessage = "خطا در ورود";

      if (error?.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "ایمیل یا رمز عبور اشتباه است";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "لطفاً ابتدا ایمیل خود را تأیید کنید";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "تعداد درخواست‌ها زیاد است. لطفاً کمی صبر کنید";
        } else {
          errorMessage = error.message;
        }
      }

      showMessage(errorMessage, "error");
    }
  } catch (error) {
    console.error("Login error:", error);
    showMessage("خطا در اتصال به سرور. لطفاً دوباره تلاش کنید", "error");
  } finally {
    isSubmitting.value = false;
  }
};

const handleSignup = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    showMessage("لطفاً خطاهای فرم را برطرف کنید", "error");
    return;
  }

  try {
    isSubmitting.value = true;

    const { data, error } = await supabase.auth.signUp({
      email: state.email.trim(),
      password: state.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (!error) {
      if (data.user && !data.user.email_confirmed_at) {
        showMessage(
          "ثبت‌نام موفق بود! لطفاً ایمیل‌تان را چک کنید و روی لینک تأیید کلیک کنید. اگر ایمیل را نمی‌بینید، پوشه spam را بررسی کنید.",
          "success"
        );
        closeModal();
      } else if (data.session) {
        showMessage("ثبت‌نام و ورود موفقیت‌آمیز بود! خوش آمدید", "success");
        closeModal();
      }
    } else {
      let errorMessage = "خطا در ثبت‌نام";

      if (error?.message) {
        if (error.message.includes("User already registered")) {
          errorMessage = "این ایمیل قبلاً ثبت شده است. لطفاً وارد شوید";
        } else if (
          error.message.includes("magic link") ||
          error.message.includes("email")
        ) {
          errorMessage = "مشکل در ارسال ایمیل تأیید. لطفاً دوباره تلاش کنید";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "رمز عبور باید حداقل ۶ کاراکتر باشد";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "لطفاً یک ایمیل معتبر وارد کنید";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "تعداد درخواست‌ها زیاد است. لطفاً کمی صبر کنید";
        } else {
          errorMessage = error.message;
        }
      }

      showMessage(errorMessage, "error");
    }
  } catch (error) {
    console.error("Signup error:", error);
    showMessage("خطا در اتصال به سرور. لطفاً دوباره تلاش کنید", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
  >
    <div
      class="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#0f0f1d] p-6 shadow-2xl transition-all border border-gray-200 dark:border-gray-700"
    >
      <button
        @click="closeModal"
        class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all hover:scale-110"
        aria-label="بستن"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>

      <div class="text-center mb-8">
        <div
          class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {{ isSignup ? "ثبت‌نام در وبلاگ" : "ورود به حساب" }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          {{
            isSignup
              ? "حساب کاربری جدید بسازید"
              : "به حساب کاربری خود وارد شوید"
          }}
        </p>
      </div>

      <form
        @submit.prevent="isSignup ? handleSignup() : handleLogin()"
        class="space-y-6"
      >
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            ایمیل
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                ></path>
              </svg>
            </div>
            <input
              v-model="state.email"
              @blur="v$.email.$touch()"
              type="email"
              placeholder="example@email.com"
              :disabled="isSubmitting"
              class="w-full pr-10 pl-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              :class="[
                isSubmitting
                  ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800',
                v$.email.$error && v$.email.$dirty
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-600 focus:border-blue-500',
                'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
              ]"
            />
          </div>
          <p
            v-if="v$.email.$error && v$.email.$dirty"
            class="mt-2 text-sm text-red-500 flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {{ v$.email.$errors[0].$message }}
          </p>
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            رمز عبور
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>
            <input
              v-model="state.password"
              @blur="v$.password.$touch()"
              :type="showPassword ? 'text' : 'password'"
              placeholder="رمز عبور خود را وارد کنید"
              :disabled="isSubmitting"
              class="w-full pr-10 pl-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              :class="[
                isSubmitting
                  ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800',
                v$.password.$error && v$.password.$dirty
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-600 focus:border-blue-500',
                'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
              ]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg
                v-if="showPassword"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                ></path>
              </svg>
              <svg
                v-else
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
            </button>
          </div>
          <p
            v-if="v$.password.$error && v$.password.$dirty"
            class="mt-2 text-sm text-red-500 flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {{ v$.password.$errors[0].$message }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
          :class="
            isSubmitting
              ? 'bg-gray-400'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          "
        >
          <span v-if="isSubmitting" class="flex items-center justify-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isSignup ? "در حال ثبت‌نام..." : "در حال ورود..." }}
          </span>
          <span v-else>{{ isSignup ? "ثبت‌نام" : "ورود" }}</span>
        </button>

        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ isSignup ? "قبلاً حساب دارید؟" : "حساب کاربری ندارید؟" }}
            <button
              type="button"
              @click="toggleMode"
              class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              {{ isSignup ? "ورود" : "ثبت‌نام" }}
            </button>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
