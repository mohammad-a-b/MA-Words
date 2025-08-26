<script setup>
import { useBlogStore } from '~/stores/blog';

const blogStore = useBlogStore();



const handleCategoryClick = (category) => {
  blogStore.toggleCategory(category);
};

const handleTagClick = (tag) => {
  blogStore.toggleTag(tag);
};

const handleViewTypeClick = (type) => {
  blogStore.setViewType(type);
};

const handleShowAllTagsClick = () => {
  blogStore.toggleShowAllTags();
};
</script>

<template>
  <section class="mb-6 sm:mb-8 md:mb-10">
    <div class="flex flex-col gap-4 sm:gap-5 md:gap-6">
      <div
        class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between"
      >
        <div class="w-full sm:w-80 md:w-96 lg:w-[420px]">
          <div class="relative">
            <input
              v-model="blogStore.searchQuery"
              type="text"
              placeholder="جستجو در مطالب..."
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-full focus:outline-none transition-all duration-300 pr-10 text-sm sm:text-base blog-input bg-white text-gray-800 border-[#00000020] focus:border-[#7091F5] dark:bg-[#0f0f1d] dark:text-white dark:border-[#ffffff20] dark:focus:border-[#578FCA]"
            />
            <LucideSearch
              class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400"
            />
          </div>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="relative w-full sm:w-auto">
            <select
              v-model="blogStore.sortOption"
              class="appearance-none w-full sm:w-auto px-3 py-2 border rounded-full focus:outline-none transition-all duration-300 pr-8 text-sm cursor-pointer blog-select bg-white text-gray-800 border-[#00000020] focus:border-[#7091F5] dark:bg-[#0f0f1d] dark:text-white dark:border-[#ffffff20] dark:focus:border-[#578FCA]"
            >
              <option value="newest">جدیدترین</option>
              <option value="oldest">قدیمی‌ترین</option>
              <option value="title">بر اساس عنوان      </option>
              <option value="popular">نشان‌شده‌ها</option>
            </select>
            <div
              class="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <LucideChevronDown class="w-4 h-4 transform rotate-90 text-gray-500 dark:text-gray-400" />
            </div>
          </div>

          <div class="flex border rounded-full overflow-hidden border-gray-200 dark:border-[#ffffff20]">
            <button 
              @click="handleViewTypeClick('grid')" 
              class="p-2 transition-colors duration-300"
              :class="blogStore.viewType === 'grid' ? 'bg-[#578FCA] dark:bg-[#7091F5]' : 'hover:bg-gray-100 dark:hover:bg-[#ffffff10]'">
              <LucideGrid2x2 class="w-4 h-4" :class="blogStore.viewType === 'grid' ? 'text-white' : 'text-gray-600 dark:text-gray-400'" />
            </button>
            <button 
              @click="handleViewTypeClick('list')" 
              class="p-2 transition-colors duration-300"
              :class="blogStore.viewType === 'list' ? 'bg-[#578FCA] dark:bg-[#7091F5]' : 'hover:bg-gray-100 dark:hover:bg-[#ffffff10]'">
              <LucideList class="w-4 h-4" :class="blogStore.viewType === 'list' ? 'text-white' : 'text-gray-600 dark:text-gray-400'" />
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:gap-4">
        <div class="flex items-center gap-2">
          <LucideGrid2x2 class="w-4 h-4 sm:w-5 sm:h-5 text-[#7091F5] dark:text-[#578FCA]"
          />
          <h3
            class="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300"
          >
            دسته‌بندی‌ها
          </h3>
        </div>
        <div class="flex flex-wrap gap-2 md:gap-3 blog-tag-wrap">
          <BlogTag
            v-for="category in blogStore.allCategories"
            :key="category"
            :text="category"
            :active="blogStore.selectedCategory === category"
            :show-icon="false"
            @click="handleCategoryClick(category)"
          />
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:gap-4">
        <div class="flex items-center gap-2">
          <LucideTag class="w-4 h-4 sm:w-5 sm:h-5 text-[#7091F5] dark:text-[#578FCA]"
          />
          <h3
            class="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300"
          >
            برچسب‌ها
          </h3>
        </div>
        <div class="flex flex-wrap gap-2 md:gap-3 blog-tag-wrap">
          <BlogTag
            v-for="tag in blogStore.visibleTags"
            :key="tag"
            :text="tag"
            :active="blogStore.selectedTag === tag"
            @click="handleTagClick(tag)"
          />
          <BlogTag
            v-if="blogStore.remainingTagsCount > 0"
            :text="blogStore.showAllTags ? 'نمایش کمتر' : `+${blogStore.remainingTagsCount} بیشتر`"
            @click="handleShowAllTagsClick"
          />
        </div>
      </div>
    </div>
  </section>
</template> 