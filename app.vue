<script setup></script>
<template>
  <ClientOnly>
    <NuxtLayout>
      <div class="container mx-auto px-2 sm:px-4">
        <div class="fixed top-4 right-4 z-[9999] flex items-center gap-3">
          <DarkModeToggle />
          <UserMenu />
          <LoginButton />
        </div>
        <NuxtPage />
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
