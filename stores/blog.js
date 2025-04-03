import { defineStore } from "pinia";
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

  const initBookmarks = () => {
    if (process.client) {
      const savedBookmarks = localStorage.getItem(STORAGE_KEYS.bookmarks);
      if (savedBookmarks) {
        bookmarkedPosts.value = JSON.parse(savedBookmarks);
      }
    }
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

  const toggleBookmark = (postOrSlug) => {
    const id = getPostIdentifier(postOrSlug);
    if (!id) return;

    const index = bookmarkedPosts.value.indexOf(id);
    if (index > -1) {
      bookmarkedPosts.value.splice(index, 1);
    } else {
      bookmarkedPosts.value.push(id);
    }

    if (process.client) {
      localStorage.setItem(
        STORAGE_KEYS.bookmarks,
        JSON.stringify(bookmarkedPosts.value)
      );
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

    filteredPosts,
    sortedFilteredPosts,
    allTags,
    allCategories,
    visibleTags,
    remainingTagsCount,

    initBookmarks,
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
