<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { useAuth } from "~/composables/useAuth";

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
});

const { $supabase } = useNuxtApp();
const toast = useToast();

const state = reactive({
  name: "",
  email: "",
  content: "",
});

const showAuthModal = ref(false);
const isSubmitting = ref(false);
const comments = ref([]);
const loading = ref(false);
const likedComments = ref([]);
const { user } = useAuth();

const fetchComments = async () => {
  loading.value = true;
  try {
    const { data, error } = await $supabase
      .from("comments")
      .select("*")
      .eq("post_id", props.postId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    comments.value = data || [];
  } catch {
    toast.error("خطا در دریافت نظرات");
    comments.value = [];
  } finally {
    loading.value = false;
  }
};


watch(() => user.value?.id, () => {
  likedComments.value = getLikedCommentsFromStorage();
});

const getLikedCommentsFromStorage = () => {
  if (process.client) {
    const userId = user.value?.id || "anonymous";
    const stored = localStorage.getItem(`likedComments_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

const saveLikedCommentsToStorage = (likedComments) => {
  if (process.client) {
    const userId = user.value?.id || "anonymous";
    localStorage.setItem(
      `likedComments_${userId}`,
      JSON.stringify(likedComments)
    );
  }
};



const submitComment = async () => {
  if (!user.value) {
    showAuthModal.value = true;
    return;
  }

  if (!state.name.trim() || !state.email.trim() || !state.content.trim()) {
    toast.error("لطفاً تمام فیلدها را پر کنید");
    return;
  }

  try {
    isSubmitting.value = true;
    const { data, error } = await $supabase
      .from("comments")
      .insert([
        {
          post_id: props.postId,
          author: state.name,
          email: state.email,
          content: state.content,
          likes: 0,
        },
      ])
      .select();

    if (error) throw error;

    if (data && data[0]) {
      comments.value.unshift(data[0]);
    }

    state.name = "";
    state.email = "";
    state.content = "";

    toast.success("نظر شما با موفقیت ثبت شد", {
      position: "bottom-right",
      timeout: 3000,
    });
  } catch {
    toast.error("خطا در ثبت نظر. لطفاً دوباره تلاش کنید", {
      position: "bottom-right",
      timeout: 2500,
    });
  } finally {
    isSubmitting.value = false;
  }
};

const likeComment = async (commentId, currentLikes) => {
  if (!user.value) {
    showAuthModal.value = true;
    return;
  }

  const isLiked = likedComments.value.includes(commentId);
  const newLikeCount = isLiked ? currentLikes - 1 : currentLikes + 1;

  updateCommentLike(commentId, newLikeCount, !isLiked);

  try {
    const { error } = await $supabase
      .from("comments")
      .update({ likes: newLikeCount })
      .eq("id", commentId);

    if (error) throw error;

    toast.success(isLiked ? "لایک حذف شد" : "لایک شد", {
      position: "bottom-right",
      timeout: 1000,
    });
  } catch {
    updateCommentLike(commentId, currentLikes, isLiked);
    toast.error("خطا در تغییر وضعیت لایک", {
      position: "bottom-right",
      timeout: 3000,
    });
  }
};

const updateCommentLike = (commentId, newCount, shouldAdd) => {
  const commentIndex = comments.value.findIndex((c) => c.id === commentId);
  if (commentIndex !== -1) {
    comments.value[commentIndex].likes = newCount;
  }

  if (shouldAdd) {
    likedComments.value.push(commentId);
  } else {
    likedComments.value = likedComments.value.filter((id) => id !== commentId);
  }

  saveLikedCommentsToStorage(likedComments.value);
};

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
  likedComments.value = getLikedCommentsFromStorage();
});
</script>

<template>
  <div class="comments-section space-y-4 sm:space-y-6">
    <div class="p-3 sm:p-4 rounded-2xl border transition-all duration-300 bg-white border-gray-200 dark:bg-[#1a1a2e] dark:border-[#ffffff15]">
      <h3 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200">
        ارسال نظر
      </h3>
      <form @submit.prevent="submitComment" class="space-y-3 sm:space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <input
              v-model="state.name"
              type="text"
              placeholder="نام *"
              :disabled="isSubmitting"
              class="w-full px-3 sm:px-4 py-2 rounded-lg border text-sm bg-gray-50 text-gray-700 border-gray-200 dark:bg-[#0f0f1d] dark:text-gray-300 dark:border-[#ffffff15]"
            />
          </div>

          <div>
            <input
              v-model="state.email"
              type="email"
              placeholder="ایمیل *"
              :disabled="isSubmitting"
              class="w-full px-3 sm:px-4 py-2 rounded-lg border text-sm bg-gray-50 text-gray-700 border-gray-200 dark:bg-[#0f0f1d] dark:text-gray-300 dark:border-[#ffffff15]"
            />
          </div>
        </div>

        <div>
          <textarea
            v-model="state.content"
            rows="4"
            placeholder="نظر خود را بنویسید... *"
            :disabled="isSubmitting"
            class="w-full px-3 sm:px-4 py-2 rounded-lg border text-sm bg-gray-50 text-gray-700 border-gray-200 dark:bg-[#0f0f1d] dark:text-gray-300 dark:border-[#ffffff15]"
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 sm:px-6 py-2 rounded-lg font-medium text-sm bg-[#7091F5] text-white dark:bg-[#578FCA]"
          >
            <span v-if="isSubmitting">در حال ارسال...</span>
            <span v-else>ارسال نظر</span>
          </button>
        </div>
      </form>
    </div>

    <div class="p-2 sm:p-3 rounded-2xl border transition-all duration-300 bg-white border-gray-200 dark:bg-[#1a1a2e] dark:border-[#ffffff15]">
      <h3 class="text-lg sm:text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
        نظرات <span class="text-sm font-normal">({{ comments.length }})</span>
      </h3>

      <div
        v-if="loading"
        class="text-center py-4 sm:py-5 text-gray-500 dark:text-gray-400 text-sm"
      >
        در حال بارگذاری نظرات...
      </div>
      <div v-else-if="comments.length === 0" class="text-center">
        <p class="text-base sm:text-lg pb-4 sm:pb-5 text-gray-500 dark:text-gray-400">
          نظری نداریم!!😀 اولین نفر باشید!
        </p>
      </div>

      <div v-else class="space-y-3 sm:space-y-4">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="p-3 sm:p-5 rounded-xl border transition-all duration-300 hover:border-opacity-50 bg-gray-50 border-gray-100 hover:bg-gray-50/80 dark:bg-[#0f0f1d] dark:border-[#ffffff10] dark:hover:bg-[#0f0f1d]/80"
        >
          <div class="flex items-start justify-between mb-3 sm:mb-4">
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold shadow-inner bg-[#7091F5]/20 text-[#7091F5] dark:bg-[#578FCA]/20 dark:text-[#578FCA]">
                {{ comment.author ? comment.author[0].toUpperCase() : "?" }}
              </div>
              <div>
                <h4 class="font-semibold text-sm sm:text-base">
                  {{ comment.author }}
                </h4>
                <p class="text-xs sm:text-sm mt-0.5 text-gray-500 dark:text-gray-400">
                  {{ formatCommentDate(comment.created_at) }}
                </p>
              </div>
            </div>
          </div>
          <p class="text-justify leading-6 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {{ comment.content }}
          </p>
          <div class="flex items-center gap-2 mt-3 sm:mt-4">
            <button
              @click="likeComment(comment.id, comment.likes)"
              class="like-btn"
              :class="likedComments.includes(comment.id) ? 'liked' : ''"
              title="لایک"
            >
              <svg
                v-if="likedComments.includes(comment.id)"
                class="like-heart"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#f43f5e"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
              <svg v-else class="like-heart" viewBox="0 0 24 24">
                <path
                  fill="#cbd5e1"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
            <span class="text-xs sm:text-sm font-bold"
              >{{ comment.likes || 0 }} لایک</span
            >
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
