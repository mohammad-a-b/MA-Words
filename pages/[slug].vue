<!-- <script setup>
const route = useRoute()
const { data: post } = await useAsyncData('post', () =>
  queryContent('/').findOne()
)
</script>

<template>
  <div v-if="post">
    <h1>{{ post.title }}</h1>
    <ContentRenderer :value="post" />
  </div>
  <div v-else>Post not found</div>
</template> -->
