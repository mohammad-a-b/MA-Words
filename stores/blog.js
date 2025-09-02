import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import {
  getAllTags,
  getAllCategories,
  getVisibleTags,
  getRemainingTagsCount,
} from "~/utils/blog";

const SORT_METHODS = {
  newest: (a, b) => new Date(b.date) - new Date(a.date),
  oldest: (a, b) => new Date(a.date) - new Date(b.date),
  title: (a, b) => a.title.localeCompare(b.title),
  popular: (a, b) => new Date(b.date) - new Date(a.date),
};

const STORAGE_KEYS = {
  bookmarks: "bookmarkedPosts",
};

export const useBlogStore = defineStore("blog", () => {
  const config = useRuntimeConfig();
  const { $supabase } = useNuxtApp();
  const { user } = useAuth();

  const searchQuery = ref("");
  const sortOption = ref("newest");
  const viewType = ref("grid");
  const selectedTag = ref(null);
  const selectedCategory = ref(null);
  const showAllTags = ref(false);
  const maxVisibleTags = ref(4);
  const bookmarkedPosts = ref([]);
  const allPosts = ref([]);
  const bookmarksInitialized = ref(false);
  const isFetchingBookmarks = ref(false);
  const pendingToggleIds = ref(new Set());
  const lastFetchedUserId = ref(null);
  const lastFetchAtMs = ref(0);
  

  const fetchServerBookmarks = async () => {
    try {
      if (!user.value) {
        bookmarkedPosts.value = [];
        return;
      }
      if (isFetchingBookmarks.value) return;
      if (lastFetchedUserId.value === user.value.id && Date.now() - lastFetchAtMs.value < 1500) {
        return;
      }
      isFetchingBookmarks.value = true;
      const { data, error } = await $supabase
        .from("bookmarks")
        .select("post_id")
        .eq("user_id", user.value.id);
      if (error) throw error;
      bookmarkedPosts.value = (data || []).map((row) => row.post_id);
      lastFetchedUserId.value = user.value.id;
      lastFetchAtMs.value = Date.now();
    } catch (err) {
      console.error("Failed to fetch server bookmarks:", err);
      bookmarkedPosts.value = [];
    } finally {
      isFetchingBookmarks.value = false;
    }
  };

  const initBookmarks = async () => {
    if (bookmarksInitialized.value) return;
    // mark early to block concurrent callers
    bookmarksInitialized.value = true;
    await fetchServerBookmarks();
  };

  

  const getPostIdentifier = (postOrSlug) => {
    if (typeof postOrSlug === "string") return postOrSlug;

    if (postOrSlug && typeof postOrSlug === "object") {
      return (
        postOrSlug.id ||
        postOrSlug._id ||
        postOrSlug.slug ||
        postOrSlug.path?.replace(/^\/blog\//, "") ||
        postOrSlug._path?.replace(/^\/blog\//, "")
      );
    }

    console.error("Invalid post or slug provided:", postOrSlug);
    return "";
  };

  const isBookmarked = (postOrSlug) => {
    const id = getPostIdentifier(postOrSlug);
    return id ? bookmarkedPosts.value.includes(id) : false;
  };

  const toggleBookmark = async (postOrSlug) => {
    const id = getPostIdentifier(postOrSlug);
    if (!id) return;

    if (!user.value) {
      const toast = useToast();
      toast.info("برای ذخیره بوکمارک ابتدا وارد حساب شوید");
      return;
    }

    if (pendingToggleIds.value.has(id)) return;
    pendingToggleIds.value.add(id);

    const wasBookmarked = bookmarkedPosts.value.includes(id);

    if (wasBookmarked) {
      bookmarkedPosts.value = bookmarkedPosts.value.filter((x) => x !== id);
    } else {
      bookmarkedPosts.value = [...bookmarkedPosts.value, id];
    }

    try {
      if (wasBookmarked) {
        const { error } = await $supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.value.id)
          .eq("post_id", id);
        if (error) throw error;
      } else {
        const { error } = await $supabase
          .from("bookmarks")
          .upsert({ user_id: user.value.id, post_id: id });
        if (error) throw error;
      }
    } catch (err) {
      console.error("Failed to sync bookmark:", err);
      if (wasBookmarked) {
        bookmarkedPosts.value = [...bookmarkedPosts.value, id];
      } else {
        bookmarkedPosts.value = bookmarkedPosts.value.filter((x) => x !== id);
      }
    } finally {
      pendingToggleIds.value.delete(id);
    }
  };

  const filteredPosts = computed(() => {
    if (!allPosts.value) return [];

    const searchLower = searchQuery.value.toLowerCase();

    return allPosts.value.filter((post) => {
      const matchesSearch =
        !searchQuery.value ||
        post.title.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower);

      const matchesTag =
        !selectedTag.value || post.tags?.includes(selectedTag.value);

      const matchesCategory =
        !selectedCategory.value ||
        post.meta?.category === selectedCategory.value;
      const matchesBookmarked =
        sortOption.value !== "popular" || isBookmarked(post);

      return (
        matchesSearch && matchesTag && matchesCategory && matchesBookmarked
      );
    });
  });

  const sortedFilteredPosts = computed(() => {
    if (!filteredPosts.value) return [];
    return [...filteredPosts.value].sort(
      SORT_METHODS[sortOption.value] || SORT_METHODS.newest
    );
  });

  const allTags = computed(() => getAllTags(allPosts.value));
  const allCategories = computed(() => getAllCategories(allPosts.value));
  const visibleTags = computed(() =>
    getVisibleTags(allTags.value, showAllTags.value, maxVisibleTags.value)
  );
  const remainingTagsCount = computed(() =>
    getRemainingTagsCount(allTags.value, maxVisibleTags.value)
  );

  const setAllPosts = (posts) => {
    allPosts.value = posts;
  };

  watch(
    () => user.value,
    async (newUser) => {
      if (!newUser) {
        bookmarksInitialized.value = false;
        bookmarkedPosts.value = [];
        lastFetchedUserId.value = null;
        return;
      }

      if (newUser.id !== lastFetchedUserId.value) {
        bookmarksInitialized.value = false;
        await initBookmarks();
      }
    }
  );

  const toggleShowAllTags = () => {
    showAllTags.value = !showAllTags.value;
  };

  const setViewType = (type) => {
    viewType.value = type;
  };

  

  const toggleTag = (tag) => {
    selectedTag.value = selectedTag.value === tag ? null : tag;
  };

  const toggleCategory = (category) => {
    selectedCategory.value =
      selectedCategory.value === category ? null : category;
  };

  

  return {
    searchQuery,
    sortOption,
    viewType,
    selectedTag,
    selectedCategory,
    showAllTags,
    maxVisibleTags,
    bookmarkedPosts,
    allPosts,
    

    filteredPosts,
    sortedFilteredPosts,
    allTags,
    allCategories,
    visibleTags,
    remainingTagsCount,

    initBookmarks,
    setAllPosts,
    isBookmarked,
    toggleBookmark,
    toggleShowAllTags,
    setViewType,
    toggleTag,
    toggleCategory,
    
  };
});
