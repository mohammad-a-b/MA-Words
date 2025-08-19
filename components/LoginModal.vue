<script setup>
import { ref, watch, reactive, computed } from "vue";
import { useToast } from "vue-toastification";
import { useVuelidate } from "@vuelidate/core";
import { useAuthValidation } from "~/composables/useAuthValidation";

const isSignup = ref(false);
const isSubmitting = ref(false);
const showPassword = ref(false);
const modalRef = ref(null);
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'vueuse-dark',
});
const modelValue = defineModel({ default: false });
const supabase = useNuxtApp().$supabase;
const toast = useToast();
const { getValidationRules } = useAuthValidation();

const state = reactive({
  email: "",
  password: "",
  confirmPassword: "",
});

const rules = computed(() => getValidationRules(isSignup.value));

const v$ = useVuelidate(rules, state, { $autoDirty: false });

watch(isSignup, () => {
  v$.value.$reset();
});

watch(modelValue, (newVal) => {
  if (!newVal) {
    v$.value.$reset();
    isSubmitting.value = false;
    showPassword.value = false;
  }
});

const closeModal = () => {
  modelValue.value = false;

  v$.value.$reset();
  isSubmitting.value = false;
  showPassword.value = false;
};

const toggleMode = () => {
  isSignup.value = !isSignup.value;
  v$.value.$reset();
};

onClickOutside(modalRef, () => {
  if (modelValue.value) closeModal();
});

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

  if (isSignup.value && state.password !== state.confirmPassword) {
    showMessage("رمز عبور و تکرار آن مطابقت ندارند", "error");
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
        } else if (error.message.includes("magic link") || error.message.includes("email")) {
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
      ref="modalRef"
      class="relative w-full max-w-md rounded-2xl p-6 shadow-2xl transition-all border"
      :class="isDark ? 'bg-[#0f0f1d] border-gray-700' : 'bg-white border-gray-200'"
    >
      <button
        @click="closeModal"
        class="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
        :class="isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'"
        aria-label="بستن"
      >
        <LucideX class="w-5 h-5" />
      </button>

      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <LucideUserRound class="w-8 h-8 text-white" />        
        </div>
        <h2 class="text-2xl font-bold mb-2" :class="isDark ? 'text-gray-100' : 'text-gray-800'">
          {{ isSignup ? "ثبت‌نام در وبلاگ" : "ورود به حساب" }}
        </h2>
        <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
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
          <label for="email" class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">ایمیل</label>
          <div class="relative">
            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <LucideMail class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="state.email"
              @blur="v$.email.$touch()"
              type="email"
              id="email"
              name="email"
              placeholder="example@email.com"
              autocomplete="email"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              :disabled="isSubmitting"
              dir="ltr"
              class="w-full pr-10 pl-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-left [&::placeholder]:text-right"
              :class="[
                isSubmitting
                  ? (isDark ? 'bg-gray-800 cursor-not-allowed' : 'bg-gray-50 cursor-not-allowed')
                  : (isDark ? 'bg-gray-800' : 'bg-white'),
                v$.email.$error && v$.email.$dirty
                  ? 'border-red-500 focus:border-red-500'
                  : (isDark ? 'border-gray-600 focus:border-blue-500' : 'border-gray-200 focus:border-blue-500'),
                isDark ? 'text-gray-100 placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              ]"
            />
          </div>
          <p
            v-if="v$.email.$error && v$.email.$dirty"
            class="mt-2 text-sm text-red-500 flex items-center"
          >
            <LucideAlertCircle class="w-4 h-4 mr-1" />
            {{ v$.email.$errors[0].$message }}
          </p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">رمز عبور</label>
          <div class="relative">
            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <LucideLock class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="state.password"
              @blur="v$.password.$touch()"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              placeholder="رمز عبور خود را وارد کنید"
              :autocomplete="isSignup ? 'new-password' : 'current-password'"
              :disabled="isSubmitting"
              dir="ltr"
              class="w-full pr-10 pl-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-left [&::placeholder]:text-right"
              :class="[
                isSubmitting
                  ? (isDark ? 'bg-gray-800 cursor-not-allowed' : 'bg-gray-50 cursor-not-allowed')
                  : (isDark ? 'bg-gray-800' : 'bg-white'),
                v$.password.$error && v$.password.$dirty
                  ? 'border-red-500 focus:border-red-500'
                  : (isDark ? 'border-gray-600 focus:border-blue-500' : 'border-gray-200 focus:border-blue-500'),
                isDark ? 'text-gray-100 placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              ]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <LucideEyeOff v-if="showPassword" class="h-5 w-5" />
              <LucideEye v-else class="h-5 w-5" />
            </button>
          </div>
          <p
            v-if="v$.password.$error && v$.password.$dirty"
            class="mt-2 text-sm text-red-500 flex items-center"
          >
            <LucideAlertCircle class="w-4 h-4 mr-1" />
            {{ v$.password.$errors[0].$message }}
          </p>
        </div>

        <div v-if="isSignup">
          <label for="confirmPassword" class="block text-sm font-medium mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">تکرار رمز عبور</label>
          <div class="relative">
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <LucideLock class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="state.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="رمز عبور را دوباره وارد کنید"
              autocomplete="new-password"
              :disabled="isSubmitting"
              dir="ltr"
              class="w-full pr-10 pl-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-left [&::placeholder]:text-right"
              :class="[
                isSubmitting
                  ? (isDark ? 'bg-gray-800 cursor-not-allowed' : 'bg-gray-50 cursor-not-allowed')
                  : (isDark ? 'bg-gray-800' : 'bg-white'),
                state.confirmPassword && state.confirmPassword !== state.password
                  ? 'border-red-500 focus:border-red-500'
                  : (isDark ? 'border-gray-600 focus:border-blue-500' : 'border-gray-200 focus:border-blue-500'),
                isDark ? 'text-gray-100 placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              ]"
            />
          </div>
          <p
            v-if="state.confirmPassword && state.confirmPassword !== state.password"
            class="mt-2 text-sm text-red-500 flex items-center"
          >
            <LucideAlertCircle class="w-4 h-4 mr-1" />
            رمز عبور و تکرار آن مطابقت ندارند
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
            <LucideLoader2 class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
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
