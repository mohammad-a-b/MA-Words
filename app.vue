<script setup></script>
<template>
  <ClientOnly>
    <NuxtLayout>
      <DarkModeToggle />
      <NuxtPage />
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
  @apply transition-colors duration-500;
  background-color: var(--color-bg);
  color: var(--color-text);
}
</style>
