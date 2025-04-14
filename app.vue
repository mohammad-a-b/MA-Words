<script setup></script>
<template>
  <ClientOnly>
    <NuxtLayout>
      <div class="container mx-auto px-4">
        <DarkModeToggle />
        <NuxtPage />
        
        <div class="border-t border-gray-200 dark:border-gray-700 my-10 pt-8">
          <h2 class="text-2xl font-bold mb-6 text-center">نظرات کاربران</h2>
          <Comments />
        </div>
      </div>
    </NuxtLayout>
  </ClientOnly>
</template>

<style>
html.light {
  --color-primary: #7c3aed;
  --color-secondary: #00ff87;
  --color-bg: #ffffff;
  --color-card: #f8f9fa;
  --color-text: #1a1a1a;
}

html.dark {
  --color-primary: #00ff87;
  --color-secondary: #7c3aed;
  --color-bg: #0a0a12;
  --color-card: #0f0f1d;
  --color-text: #f8f9fa;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}
</style>
