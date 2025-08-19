<script setup>
import { useDark } from '@vueuse/core'
import { useBlogStore } from '~/stores/blog'
import { useToast } from 'vue-toastification'

definePageMeta({ alias: ['/me', '/account'] })

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'vueuse-dark',
})

const toast = useToast()
const { user, logout } = useAuth()
const blogStore = useBlogStore()
const { $supabase } = useNuxtApp()

const { data: allPosts } = await useAsyncData('profile-posts', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
watch(allPosts, (posts) => posts && blogStore.setAllPosts(posts), { immediate: true })

onMounted(() => {
  blogStore.initBookmarks()
  blogStore.initDarkMode(isDark.value)
})

const bookmarkedPosts = computed(() =>
  blogStore.allPosts?.filter((p) => blogStore.isBookmarked(p)) || []
)

const removeBookmark = (post) => {
  blogStore.toggleBookmark(post)
  toast.success('از نشان‌ها حذف شد')
}

const loadingComments = ref(false)
const comments = ref([])

const fetchMyComments = async () => {
  if (!user.value?.email) {
    comments.value = []
    return
  }
  loadingComments.value = true
  try {
    const { data, error } = await $supabase
      .from('comments')
      .select('*')
      .eq('email', user.value.email)
      .order('created_at', { ascending: false })
    if (error) throw error
    comments.value = data || []
  } catch (e) {
    comments.value = []
  } finally {
    loadingComments.value = false
  }
}

watch(() => user.value?.email, fetchMyComments, { immediate: true })

const formatDate = (d) => new Intl.DateTimeFormat('fa-IR', {
  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
}).format(new Date(d))
</script>

<template>
  <main class="min-h-screen py-10 sm:py-14">
    <div class="container mx-auto max-w-6xl px-4">
      <div class="mb-6 flex items-center justify-between">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors"
          :class="isDark ? 'border-[#ffffff15] text-gray-200 hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
        >
          <LucideArrowLeft class="w-4 h-4" />
          <span>بازگشت</span>
        </NuxtLink>

        <button
          v-if="user"
          @click="logout()"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors"
          :class="isDark ? 'border-[#ffffff15] text-gray-200 hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
        >
          <LucideLogOut class="w-4 h-4" />
          <span>خروج</span>
        </button>
      </div>

      <section class="rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-xl shadow-xl ring-1"
               :class="isDark ? 'bg-[#0f0f1d]/70 ring-white/5' : 'bg-white/70 ring-black/5'">
        <div class="flex items-center gap-4 sm:gap-6">
          <div class="p-[2px] rounded-full bg-gradient-to-br from-[var(--gradient-brand-from)] to-[var(--gradient-brand-to)]">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
                 :class="isDark ? 'bg-white/5' : 'bg-gray-100'">
              <LucideUser class="w-7 h-7" :class="isDark ? 'text-gray-300' : 'text-gray-600'" />
            </div>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-extrabold" :class="isDark ? 'text-gray-100' : 'text-gray-800'">پروفایل</h1>
            <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">{{ user?.email }}</p>
            <div class="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-[var(--gradient-brand-from)] to-[var(--gradient-brand-to)]"></div>
          </div>
        </div>
      </section>

      <section class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg sm:text-xl font-bold" :class="isDark ? 'text-gray-100' : 'text-gray-800'">
            نشان‌های من
          </h2>
          <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ bookmarkedPosts.length }} مورد</div>
        </div>

        <div v-if="bookmarkedPosts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <article v-for="post in bookmarkedPosts" :key="post._path"
                   class="group overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                   :class="isDark ? 'bg-[#0f0f1d] border-[#ffffff12] hover:border-[#7091F5]/40' : 'bg-white border-gray-200 hover:border-[#7091F5]'">
            <NuxtLink :to="post.path" class="block">
              <div class="relative h-40 rounded-xl overflow-hidden">
                <img v-if="post.meta?.image" :src="post.meta.image" :alt="post.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div class="p-3.5">
                <h3 class="font-bold line-clamp-2 mb-2 transition-colors"
                    :class="isDark ? 'text-gray-100 group-hover:text-[var(--gradient-brand-to)]' : 'text-gray-800 group-hover:text-[var(--gradient-brand-from)]'">
                  {{ post.title }}
                </h3>
                <div class="flex items-center justify-between text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  <div class="flex items-center gap-2">
                    <LucideCalendar class="w-4 h-4" />
                    <span>{{ post.date }}</span>
                  </div>
                  <button type="button" @click.prevent="removeBookmark(post)"
                          class="inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition-colors"
                          :class="isDark ? 'border-[#ffffff20] hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'">
                    <LucideBookmark class="w-4 h-4" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            </NuxtLink>
          </article>
        </div>

        <div v-else class="flex flex-col items-center justify-center p-10 rounded-2xl border backdrop-blur"
             :class="isDark ? 'bg-[#0f0f1d]/60 border-[#ffffff10] text-gray-400' : 'bg-white/70 border-gray-200 text-gray-500'">
          <LucideBookmark class="w-10 h-10 mb-2" />
          هیچ پستی نشان نشده است
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg sm:text-xl font-bold" :class="isDark ? 'text-gray-100' : 'text-gray-800'">نظرهای من</h2>
          <div class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ comments.length }} نظر</div>
        </div>

        <div v-if="loadingComments" class="text-center py-8" :class="isDark ? 'text-gray-400' : 'text-gray-500'">در حال بارگذاری...</div>

        <div v-else-if="comments.length" class="space-y-3">
          <div v-for="c in comments" :key="c.id" class="relative p-4 rounded-xl border transition-colors"
               :class="isDark ? 'bg-[#0f0f1d] border-[#ffffff12]' : 'bg-white border-gray-200'">
            <div class="absolute right-3 top-0 bottom-0 border-r-2" :class="isDark ? 'border-[var(--gradient-brand-to)]/30' : 'border-[var(--gradient-brand-from)]/30'"></div>
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2 text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                <LucideCalendar class="w-4 h-4" />
                <span class="px-2 py-0.5 rounded-full" :class="isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'">{{ formatDate(c.created_at) }}</span>
              </div>
              <div class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">پست: {{ c.post_id }}</div>
            </div>
            <p class="pr-5 leading-7" :class="isDark ? 'text-gray-300' : 'text-gray-700'">{{ c.content }}</p>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center p-10 rounded-2xl border backdrop-blur"
             :class="isDark ? 'bg-[#0f0f1d]/60 border-[#ffffff10] text-gray-400' : 'bg-white/70 border-gray-200 text-gray-500'">
          <LucideMessageSquare class="w-10 h-10 mb-2" />
          نظری ثبت نکرده‌اید
        </div>
      </section>
    </div>
  </main>
</template>

 