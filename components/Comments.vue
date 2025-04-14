<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const { $supabase } = useNuxtApp()

const comments = ref([])
const loading = ref(true)
const submitting = ref(false)

const newComment = ref({
  author: '',
  content: ''
})

async function fetchComments() {
  try {
    loading.value = true
    const { data, error } = await $supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    comments.value = data
  } catch (error) {
    toast.error('خطا در دریافت کامنت‌ها')
    console.error('Error fetching comments:', error)
  } finally {
    loading.value = false
  }
}

async function submitComment() {
  if (!newComment.value.author || !newComment.value.content) {
    toast.warning('لطفاً نام و متن کامنت را وارد کنید')
    return
  }

  try {
    submitting.value = true
    const { data, error } = await $supabase
      .from('comments')
      .insert([
        {
          post_id: 'general',
          author: newComment.value.author,
          content: newComment.value.content
        }
      ])
      .select()

    if (error) throw error

    newComment.value = { author: '', content: '' }
    
    await fetchComments()
    
    toast.success('کامنت شما با موفقیت ثبت شد')
  } catch (error) {
    toast.error('خطا در ثبت کامنت')
    console.error('Error submitting comment:', error)
  } finally {
    submitting.value = false
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

onMounted(() => {
  fetchComments()
})
</script>

<template>
  <div class="max-w-3xl mx-auto p-4 space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-md shadow p-5">
      <h3 class="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">ارسال نظر</h3>
      <div class="mb-4">
        <input
          v-model="newComment.author"
          type="text"
          placeholder="نام شما"
          :disabled="submitting"
          class="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary focus:border-primary"
        >
      </div>
      <div class="mb-4">
        <textarea
          v-model="newComment.content"
          placeholder="نظر خود را بنویسید..."
          :disabled="submitting"
          class="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary focus:border-primary resize-y"
          rows="4"
        ></textarea>
      </div>
      <button
        @click="submitComment"
        :disabled="submitting"
        class="w-full px-5 py-2 rounded bg-primary text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ submitting ? 'در حال ارسال...' : 'ارسال نظر' }}
      </button>
    </div>

    <div>
      <h3 class="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">نظرات ({{ comments.length }})</h3>
      
      <div v-if="loading" class="text-center py-5 text-gray-500 dark:text-gray-400">
        در حال بارگذاری نظرات...
      </div>
      
      <div v-else-if="comments.length === 0" class="text-center py-5 text-gray-500 dark:text-gray-400">
        هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهید!
      </div>
      
      <template v-else>
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="bg-white dark:bg-gray-800 rounded-md shadow p-4 mb-3 border border-gray-100 dark:border-gray-700"
        >
          <div class="flex justify-between items-center text-sm mb-2">
            <span class="font-bold text-gray-900 dark:text-gray-100">{{ comment.author }}</span>
            <span class="text-gray-500 dark:text-gray-400">{{ formatDate(comment.created_at) }}</span>
          </div>
          <div class="text-gray-700 dark:text-gray-300">{{ comment.content }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style> 