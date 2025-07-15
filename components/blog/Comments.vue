<!-- <script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useDark } from "@vueuse/core";

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
});

const { $supabase } = useNuxtApp();
const toast = useToast();
const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
});

const newComment = ref({
  name: "",
  email: "",
  content: "",
});
const showAuthModal = ref(true)

const isSubmitting = ref(false);
const formErrors = ref({});
const showDeleteModal = ref(false);
const commentToDelete = ref(null);
const comments = ref([]);
const loading = ref(false);
const likedComments = ref([]);

const validateForm = () => {
  const errors = {};
  if (!newComment.value.name.trim()) {
    errors.name = "نام الزامی است";
  } else if (newComment.value.name.length < 2) {
    errors.name = "نام باید حداقل ۲ کاراکتر باشد";
  }
  if (!newComment.value.email.trim()) {
    errors.email = "ایمیل الزامی است";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newComment.value.email)) {
    errors.email = "لطفاً یک ایمیل معتبر وارد کنید";
  }
  if (!newComment.value.content.trim()) {
    errors.content = "متن نظر الزامی است";
  } else if (newComment.value.content.length < 10) {
    errors.content = "متن نظر باید حداقل ۱۰ کاراکتر باشد";
  }
  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const openDeleteModal = (comment) => {
  commentToDelete.value = comment;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  commentToDelete.value = null;
};

async function fetchComments() {
  loading.value = true;
  try {
    const { data, error } = await $supabase
      .from("comments")
      .select("*")
      .eq("post_id", props.postId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    comments.value = data || [];
  } catch (error) {
    toast.error("خطا در دریافت نظرات");
    comments.value = [];
  } finally {
    loading.value = false;
  }
}

async function submitComment() {
  if (!validateForm()) {
    toast.error("لطفاً خطاهای فرم را برطرف کنید", {
      position: "bottom-right",
      timeout: 3000,
    });
    return;
  }
  try {
    isSubmitting.value = true;
    const { error } = await $supabase.from("comments").insert([
      {
        post_id: props.postId,
        author: newComment.value.name,
        email: newComment.value.email,
        content: newComment.value.content,
        likes: 0,
      },
    ]);
    if (error) throw error;
    newComment.value = { name: "", email: "", content: "" };
    toast.success("نظر شما با موفقیت ثبت شد", {
      position: "bottom-right",
      timeout: 3000,
    });
    await fetchComments();
  } catch (error) {
    toast.error("خطا در ثبت نظر. لطفاً دوباره تلاش کنید", {
      position: "bottom-right",
      timeout: 2500,
    });
  } finally {
    isSubmitting.value = false;
  }
}

const formatCommentDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

onMounted(() => {
  fetchComments();
});

const likeComment = async (commentId, currentLikes) => {
  try {
    const { error } = await $supabase
      .from("comments")
      .update({ likes: (currentLikes || 0) + 1 })
      .eq("id", commentId);
    if (error) throw error;
    // await fetchComments();
  } catch (error) {
    toast.error("خطا در لایک کردن کامنت");
  }
};
</script>

<template>
  <div class="comments-section space-y-6">
    <div
      class="p-6 rounded-2xl border transition-all duration-300"
      :class="
        isDark ? 'bg-[#1a1a2e] border-[#ffffff15]' : 'bg-white border-gray-200'
      "
    >
      <h3
        class="text-xl font-bold mb-6"
        :class="isDark ? 'text-gray-200' : 'text-gray-800'"
      >
        ارسال نظر
      </h3>
      <form @submit.prevent="submitComment" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              v-model="newComment.name"
              type="text"
              placeholder="نام *"
              :disabled="isSubmitting"
              class="w-full px-4 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2"
              :class="[
                isDark
                  ? 'bg-[#0f0f1d] text-gray-300 border-[#ffffff15] focus:ring-[#578FCA]/20'
                  : 'bg-gray-50 text-gray-700 border-gray-200 focus:ring-[#7091F5]/20',
                formErrors.name ? 'border-red-500' : '',
              ]"
            />
            <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">
              {{ formErrors.name }}
            </p>
          </div>
          <div>
            <input
              v-model="newComment.email"
              type="email"
              placeholder="ایمیل *"
              :disabled="isSubmitting"
              class="w-full px-4 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2"
              :class="[
                isDark
                  ? 'bg-[#0f0f1d] text-gray-300 border-[#ffffff15] focus:ring-[#578FCA]/20'
                  : 'bg-gray-50 text-gray-700 border-gray-200 focus:ring-[#7091F5]/20',
                formErrors.email ? 'border-red-500' : '',
              ]"
            />
            <p v-if="formErrors.email" class="mt-1 text-sm text-red-500">
              {{ formErrors.email }}
            </p>
          </div>
        </div>
        <div>
          <textarea
            v-model="newComment.content"
            rows="4"
            placeholder="نظر خود را بنویسید... *"
            :disabled="isSubmitting"
            class="w-full px-4 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2"
            :class="[
              isDark
                ? 'bg-[#0f0f1d] text-gray-300 border-[#ffffff15] focus:ring-[#578FCA]/20'
                : 'bg-gray-50 text-gray-700 border-gray-200 focus:ring-[#7091F5]/20',
              formErrors.content ? 'border-red-500' : '',
            ]"
          ></textarea>
          <p v-if="formErrors.content" class="mt-1 text-sm text-red-500">
            {{ formErrors.content }}
          </p>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            :class="
              isDark ? 'bg-[#578FCA] text-white' : 'bg-[#7091F5] text-white'
            "
          >
            <span v-if="isSubmitting">در حال ارسال...</span>
            <span v-else>ارسال نظر</span>
          </button>
        </div>
      </form>
    </div>
    <div
      class="p-3 rounded-2xl border transition-all duration-300"
      :class="
        isDark ? 'bg-[#1a1a2e] border-[#ffffff15]' : 'bg-white border-gray-200'
      "
    >
      <h3
        class="inline text-xl font-bold mb-2"
        :class="isDark ? 'text-gray-200' : 'text-gray-800'"
      >
        نظرات
        <span class="text-sm font-normal"> ({{ comments.length }}) </span>
      </h3>
      <div
        v-if="loading"
        class="text-center py-5 text-gray-500 dark:text-gray-400"
      >
        در حال بارگذاری نظرات...
      </div>
      <div v-else-if="comments.length === 0" class="text-center">
        <p
          class="text-lg pb-5"
          :class="isDark ? 'text-gray-400' : 'text-gray-500'"
        >
          نظری نداریم!!😀 اولین نفر باشید!
        </p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="p-5 rounded-xl border transition-all duration-300 hover:border-opacity-50"
          :class="
            isDark
              ? 'bg-[#0f0f1d] border-[#ffffff10] hover:bg-[#0f0f1d]/80'
              : 'bg-gray-50 border-gray-100 hover:bg-gray-50/80'
          "
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold shadow-inner"
                :class="
                  isDark
                    ? 'bg-[#578FCA]/20 text-[#578FCA]'
                    : 'bg-[#7091F5]/20 text-[#7091F5]'
                "
              >
                {{ comment.author ? comment.author[0].toUpperCase() : "?" }}
              </div>
              <div>
                <h4 class="font-semibold text-base">{{ comment.author }}</h4>
                <p
                  class="text-sm mt-0.5"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                >
                  {{ formatCommentDate(comment.created_at) }}
                </p>
              </div>
            </div>
          </div>
          <p
            class="text-justify leading-6"
            :class="isDark ? 'text-gray-300' : 'text-gray-600'"
          >
            {{ comment.content }}
          </p>
          <div class="flex items-center gap-2 mt-4">
            <button
              @click="likeComment(comment.id, comment.likes)"
              class="like-btn"
              :class="likedComments.includes(comment.id) ? 'liked' : ''"
              :disabled="likedComments.includes(comment.id)"
              title="لایک"
            >
              <svg
                v-if="likedComments.includes(comment.id)"
                class="like-heart"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#f43f5e"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
              <svg v-else class="like-heart" viewBox="0 0 24 24">
                <path
                  fill="#cbd5e1"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
            <span class="text-sm font-bold">{{ comment.likes || 0 }} لایک</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.like-heart {
  width: 24px;
  height: 24px;
  transition: fill 0.2s;
}
@keyframes like-pop {
  0% {
    transform: scale(1);
  }
  60% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style> -->

<script setup>
import { ref, onMounted } from "vue"
import { useToast } from "vue-toastification"
import { useDark } from "@vueuse/core"

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
})

const { $supabase } = useNuxtApp()
const toast = useToast()
const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
})

const newComment = ref({ name: "", email: "", content: "" })
const showAuthModal = ref(false)
const isSubmitting = ref(false)
const formErrors = ref({})
const showDeleteModal = ref(false)
const commentToDelete = ref(null)
const comments = ref([])
const loading = ref(false)
const likedComments = ref([])
const user = ref(null)

const validateForm = () => {
  const errors = {}
  if (!newComment.value.name.trim()) errors.name = "نام الزامی است"
  else if (newComment.value.name.length < 2) errors.name = "نام باید حداقل ۲ کاراکتر باشد"
  if (!newComment.value.email.trim()) errors.email = "ایمیل الزامی است"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newComment.value.email)) errors.email = "لطفاً یک ایمیل معتبر وارد کنید"
  if (!newComment.value.content.trim()) errors.content = "متن نظر الزامی است"
  else if (newComment.value.content.length < 10) errors.content = "متن نظر باید حداقل ۱۰ کاراکتر باشد"
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const openDeleteModal = (comment) => {
  commentToDelete.value = comment
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  commentToDelete.value = null
}

const fetchComments = async () => {
  loading.value = true
  try {
    const { data, error } = await $supabase
      .from("comments")
      .select("*")
      .eq("post_id", props.postId)
      .order("created_at", { ascending: false })
    if (error) throw error
    comments.value = data || []
  } catch {
    toast.error("خطا در دریافت نظرات")
    comments.value = []
  } finally {
    loading.value = false
  }
}

const fetchUser = async () => {
  const { data } = await $supabase.auth.getUser()
  user.value = data.user
}

const submitComment = async () => {
  if (!user.value) {
    showAuthModal.value = true
    return
  }
  if (!validateForm()) {
    toast.error("لطفاً خطاهای فرم را برطرف کنید", { position: "bottom-right", timeout: 3000 })
    return
  }
  try {
    isSubmitting.value = true
    const { error } = await $supabase.from("comments").insert([
      {
        post_id: props.postId,
        author: newComment.value.name,
        email: newComment.value.email,
        content: newComment.value.content,
        likes: 0,
      },
    ])
    if (error) throw error
    newComment.value = { name: "", email: "", content: "" }
    toast.success("نظر شما با موفقیت ثبت شد", { position: "bottom-right", timeout: 3000 })
    await fetchComments()
  } catch {
    toast.error("خطا در ثبت نظر. لطفاً دوباره تلاش کنید", { position: "bottom-right", timeout: 2500 })
  } finally {
    isSubmitting.value = false
  }
}
const likeComment = async (commentId, currentLikes) => {
  const alreadyLiked = likedComments.value.includes(commentId)

  try {
    const { error } = await $supabase
      .from("comments")
      .update({ likes: alreadyLiked ? currentLikes - 1 : currentLikes + 1 })
      .eq("id", commentId)

    if (error) throw error

    if (alreadyLiked) {
      likedComments.value = likedComments.value.filter(id => id !== commentId)
    } else {
      likedComments.value.push(commentId)
    }
  } catch {
    toast.error("خطا در تغییر وضعیت لایک")
  }
}


const formatCommentDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

onMounted(() => {
  fetchUser()
  fetchComments()
})
</script>

<template>
  <div class="comments-section space-y-6">
    <div
      class="p-4 rounded-2xl border transition-all duration-300"
      :class="isDark ? 'bg-[#1a1a2e] border-[#ffffff15]' : 'bg-white border-gray-200'"
    >
      <h3 class="text-xl font-bold mb-6" :class="isDark ? 'text-gray-200' : 'text-gray-800'">ارسال نظر</h3>
      <form @submit.prevent="submitComment" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              v-model="newComment.name"
              type="text"
              placeholder="نام *"
              :disabled="isSubmitting"
              class="w-full px-4 py-2 rounded-lg border"
              :class="[
                isDark ? 'bg-[#0f0f1d] text-gray-300 border-[#ffffff15]' : 'bg-gray-50 text-gray-700 border-gray-200',
                formErrors.name ? 'border-red-500' : '',
              ]"
            />
            <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">{{ formErrors.name }}</p>
          </div>
          <div>
            <input
              v-model="newComment.email"
              type="email"
              placeholder="ایمیل *"
              :disabled="isSubmitting"
              class="w-full px-4 py-2 rounded-lg border"
              :class="[
                isDark ? 'bg-[#0f0f1d] text-gray-300 border-[#ffffff15]' : 'bg-gray-50 text-gray-700 border-gray-200',
                formErrors.email ? 'border-red-500' : '',
              ]"
            />
            <p v-if="formErrors.email" class="mt-1 text-sm text-red-500">{{ formErrors.email }}</p>
          </div>
        </div>
        <div>
          <textarea
            v-model="newComment.content"
            rows="4"
            placeholder="نظر خود را بنویسید... *"
            :disabled="isSubmitting"
            class="w-full px-4 py-2 rounded-lg border"
            :class="[
              isDark ? 'bg-[#0f0f1d] text-gray-300 border-[#ffffff15]' : 'bg-gray-50 text-gray-700 border-gray-200',
              formErrors.content ? 'border-red-500' : '',
            ]"
          ></textarea>
          <p v-if="formErrors.content" class="mt-1 text-sm text-red-500">{{ formErrors.content }}</p>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 rounded-lg font-medium"
            :class="isDark ? 'bg-[#578FCA] text-white' : 'bg-[#7091F5] text-white'"
          >
            <span v-if="isSubmitting">در حال ارسال...</span>
            <span v-else>ارسال نظر</span>
          </button>
        </div>
      </form>
    </div>

    <div class="p-3 rounded-2xl border transition-all duration-300"
         :class="isDark ? 'bg-[#1a1a2e] border-[#ffffff15]' : 'bg-white border-gray-200'">
      <h3 class="text-xl font-bold mb-2" :class="isDark ? 'text-gray-200' : 'text-gray-800'">
        نظرات <span class="text-sm font-normal">({{ comments.length }})</span>
      </h3>

      <div v-if="loading" class="text-center py-5 text-gray-500 dark:text-gray-400">در حال بارگذاری نظرات...</div>
      <div v-else-if="comments.length === 0" class="text-center">
        <p class="text-lg pb-5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">نظری نداریم!!😀 اولین نفر باشید!</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="comment in comments" :key="comment.id"
             class="p-5 rounded-xl border transition-all duration-300 hover:border-opacity-50"
             :class="isDark ? 'bg-[#0f0f1d] border-[#ffffff10] hover:bg-[#0f0f1d]/80' : 'bg-gray-50 border-gray-100 hover:bg-gray-50/80'">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold shadow-inner"
                   :class="isDark ? 'bg-[#578FCA]/20 text-[#578FCA]' : 'bg-[#7091F5]/20 text-[#7091F5]'">
                {{ comment.author ? comment.author[0].toUpperCase() : "?" }}
              </div>
              <div>
                <h4 class="font-semibold text-base">{{ comment.author }}</h4>
                <p class="text-sm mt-0.5" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  {{ formatCommentDate(comment.created_at) }}
                </p>
              </div>
            </div>
          </div>
          <p class="text-justify leading-6" :class="isDark ? 'text-gray-300' : 'text-gray-600'">{{ comment.content }}</p>
          <div class="flex items-center gap-2 mt-4">
            <button @click="likeComment(comment.id, comment.likes)" class="like-btn" :class="likedComments.includes(comment.id) ? 'liked' : ''"
                    :disabled="likedComments.includes(comment.id)" title="لایک">
              <svg v-if="likedComments.includes(comment.id)" class="like-heart" viewBox="0 0 24 24">
                <path fill="#f43f5e" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <svg v-else class="like-heart" viewBox="0 0 24 24">
                <path fill="#cbd5e1" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
            <span class="text-sm font-bold">{{ comment.likes || 0 }} لایک</span>
          </div>
        </div>
        <login-modal v-model="showAuthModal" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.like-heart {
  width: 24px;
  height: 24px;
  transition: fill 0.2s;
}
</style>
