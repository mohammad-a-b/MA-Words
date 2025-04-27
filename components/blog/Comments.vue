<script setup>
import { ref, onMounted } from 'vue';
import { useBlogStore } from '~/stores/blog';
import { useToast } from 'vue-toastification';
import { useDark } from '@vueuse/core';

const props = defineProps({
  postId: {
    type: String,
    required: true
  }
});

const blogStore = useBlogStore();
const toast = useToast();
const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-dark",
});

const newComment = ref({
  name: '',
  email: '',
  content: ''
});

const isSubmitting = ref(false);
const formErrors = ref({});
const showDeleteModal = ref(false);
const commentToDelete = ref(null);

const validateForm = () => {
  const errors = {};
  
  if (!newComment.value.name.trim()) {
    errors.name = 'نام الزامی است';
  } else if (newComment.value.name.length < 2) {
    errors.name = 'نام باید حداقل ۲ کاراکتر باشد';
  }
  
  if (!newComment.value.email.trim()) {
    errors.email = 'ایمیل الزامی است';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newComment.value.email)) {
    errors.email = 'لطفاً یک ایمیل معتبر وارد کنید';
  }
  
  if (!newComment.value.content.trim()) {
    errors.content = 'متن نظر الزامی است';
  } else if (newComment.value.content.length < 10) {
    errors.content = 'متن نظر باید حداقل ۱۰ کاراکتر باشد';
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

const confirmDelete = () => {
  try {
    blogStore.deleteComment(props.postId, commentToDelete.value.id);
    toast.success('نظر با موفقیت حذف شد', {
      position: "bottom-right",
      timeout: 3000
    });
  } catch (error) {
    toast.error('خطا در حذف نظر', {
      position: "bottom-right",
      timeout: 3000
    });
    console.error('Error deleting comment:', error);
  } finally {
    closeDeleteModal();
  }
};

const submitComment = async () => {
  if (!validateForm()) {
    toast.error('لطفاً خطاهای فرم را برطرف کنید', {
      position: "bottom-right",
      timeout: 3000
    });
    return;
  }
  
  try {
    isSubmitting.value = true;
    
    blogStore.addComment(props.postId, {
      name: newComment.value.name,
      email: newComment.value.email,
      content: newComment.value.content
    });
    
    newComment.value = {
      name: '',
      email: '',
      content: ''
    };
    
    toast.success('نظر شما با موفقیت ثبت شد', {
      position: "bottom-right",
      timeout: 3000
    });
  } catch (error) {
    toast.error('خطا در ثبت نظر. لطفاً دوباره تلاش کنید', {
      position: "bottom-right",
      timeout: 2500
    });
    console.error('Error submitting comment:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const formatCommentDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

onMounted(() => {
  blogStore.initComments();
});
</script>

<template>
  <div class="comments-section space-y-6">
    <div
      class="p-6 rounded-2xl border transition-all duration-300"
      :class="isDark ? 'bg-[#1a1a2e] border-[#ffffff15]' : 'bg-white border-gray-200'"
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
                formErrors.name ? 'border-red-500' : ''
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
                formErrors.email ? 'border-red-500' : ''
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
              formErrors.content ? 'border-red-500' : ''
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
            :class="isDark ? 'bg-[#578FCA] text-white' : 'bg-[#7091F5] text-white'"
          >
            <span v-if="isSubmitting">در حال ارسال...</span>
            <span v-else>ارسال نظر</span>
          </button>
        </div>
      </form>
    </div>

    <div
      class="p-3 rounded-2xl border transition-all duration-300"
      :class="isDark ? 'bg-[#1a1a2e] border-[#ffffff15]' : 'bg-white border-gray-200'"
    >
      <h3 
        class=" inline text-xl font-bold mb-2"
        :class="isDark ? 'text-gray-200' : 'text-gray-800'"
      >
        نظرات
        <span class="text-sm font-normal">
          ({{ blogStore.getPostComments(postId).length }})
        </span>
      </h3>

      <div v-if="blogStore.getPostComments(postId).length === 0" class="text-center">
        <p
          class="text-lg pb-5"
          :class="isDark ? 'text-gray-400' : 'text-gray-500'"
        >
         نظری نداریم!!😀

         اولین نفر باشید!
        </p>
      </div>

      <div class="space-y-4">
        <div
          v-for="comment in blogStore.getPostComments(postId)"
          :key="comment.id"
          class="p-5 rounded-xl border transition-all duration-300 hover:border-opacity-50"
          :class="isDark ? 'bg-[#0f0f1d] border-[#ffffff10] hover:bg-[#0f0f1d]/80' : 'bg-gray-50 border-gray-100 hover:bg-gray-50/80'"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold shadow-inner"
                :class="isDark ? 'bg-[#578FCA]/20 text-[#578FCA]' : 'bg-[#7091F5]/20 text-[#7091F5]'"
              >
                {{ comment.name[0].toUpperCase() }}
              </div>
              <div>
                <h4 class="font-semibold text-base">{{ comment.name }}</h4>
                <p
                  class="text-sm mt-0.5"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                >
                  {{ formatCommentDate(comment.date) }}
                </p>
              </div>
            </div>

            <button
              @click="openDeleteModal(comment)"
              class="p-2 rounded-lg transition-all duration-300 hover:bg-red-500/10 hover:text-red-500"
              :class="isDark ? 'text-gray-400 hover:bg-red-500/20' : 'text-gray-500'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <p
            class="text-justify leading-6"
            :class="isDark ? 'text-gray-300' : 'text-gray-600'"
          >
            {{ comment.content }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div
        class="absolute inset-0 bg-black/50"
        @click="closeDeleteModal"
      ></div>
      
      <div
        class="relative rounded-2xl p-6 max-w-sm w-full shadow-xl transition-all duration-300"
        :class="isDark ? 'bg-[#1a1a2e] text-gray-200' : 'bg-white text-gray-800'"
      >
        <h4 class="text-lg font-bold mb-4">تایید حذف نظر</h4>
        <p class="mb-6 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          آیا از حذف این نظر اطمینان دارید؟ این عمل قابل بازگشت نیست.
        </p>
        
        <div class="flex justify-end gap-3">
          <button
            @click="closeDeleteModal"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            :class="isDark ? 'hover:bg-[#ffffff10] text-gray-400' : 'hover:bg-gray-100 text-gray-600'"
          >
            انصراف
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style> 