export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculateReadingTime = (post) => post.meta?.readingTime || 1;

export const getAllTags = (posts) => {
  if (!posts) return [];
  const tags = new Set();
  posts.forEach((post) => post.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
};

export const getAllCategories = (posts) => {
  if (!posts) return [];
  return [
    ...new Set(posts.map((post) => post.meta?.category).filter(Boolean)),
  ].sort();
};

export const getVisibleTags = (tags, showAllTags, maxVisibleTags) => {
  return showAllTags ? tags : tags?.slice(0, maxVisibleTags);
};

export const getRemainingTagsCount = (tags, maxVisibleTags) => {
  return Math.max(0, (tags?.length || 0) - maxVisibleTags);
};
