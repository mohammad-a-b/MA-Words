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
  comments: "postComments",
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
  const maxVisibleTags = ref(5);
  const bookmarkedPosts = ref([]);
  const allPosts = ref([]);
  const isDarkMode = ref(null);
  const comments = ref({});

  const fetchServerBookmarks = async () => {
    try {
      if (!user.value) {
        bookmarkedPosts.value = [];
        return;
      }
      const { data, error } = await $supabase
        .from("bookmarks")
        .select("post_id")
        .eq("user_id", user.value.id);
      if (error) throw error;
      bookmarkedPosts.value = (data || []).map((row) => row.post_id);
    } catch (err) {
      console.error("Failed to fetch server bookmarks:", err);
      bookmarkedPosts.value = [];
    }
  };

  const initBookmarks = async () => {
    await fetchServerBookmarks();
  };

  const initComments = () => {
    if (process.client) {
      const savedComments = localStorage.getItem(STORAGE_KEYS.comments);
      if (savedComments) {
        comments.value = JSON.parse(savedComments);
      }
    }
  };

  const saveComments = () => {
    if (process.client) {
      localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(comments.value));
    }
  };

  const addComment = (postId, comment) => {
    if (!comments.value[postId]) {
      comments.value[postId] = [];
    }
    comments.value[postId].push({
      ...comment,
      id: Date.now(),
      date: new Date().toISOString(),
    });
    saveComments();
  };

  const deleteComment = (postId, commentId) => {
    if (comments.value[postId]) {
      comments.value[postId] = comments.value[postId].filter(
        (c) => c.id !== commentId
      );
      saveComments();
    }
  };

  const getPostComments = (postId) => {
    return comments.value[postId] || [];
  };

  const initDarkMode = (isDark) => {
    isDarkMode.value = isDark;
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
    async (newUser, oldUser) => {
      if (newUser) await fetchServerBookmarks();
      else bookmarkedPosts.value = [];
    }
  );

  const toggleShowAllTags = () => {
    showAllTags.value = !showAllTags.value;
  };

  const setViewType = (type) => {
    viewType.value = type;
  };

  const setSearchQuery = (query) => {
    searchQuery.value = query;
  };

  const setSortOption = (option) => {
    sortOption.value = option;
  };

  const toggleTag = (tag) => {
    selectedTag.value = selectedTag.value === tag ? null : tag;
  };

  const toggleCategory = (category) => {
    selectedCategory.value =
      selectedCategory.value === category ? null : category;
  };

  const resetFilters = () => {
    searchQuery.value = "";
    selectedTag.value = null;
    selectedCategory.value = null;
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
    isDarkMode,
    comments,

    filteredPosts,
    sortedFilteredPosts,
    allTags,
    allCategories,
    visibleTags,
    remainingTagsCount,

    initBookmarks,
    initComments,
    addComment,
    deleteComment,
    getPostComments,
    initDarkMode,
    setAllPosts,
    isBookmarked,
    toggleBookmark,
    toggleShowAllTags,
    setViewType,
    setSearchQuery,
    setSortOption,
    toggleTag,
    toggleCategory,
    resetFilters,
  };
});
