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
/* Design tokens (Electric Ocean palette) */
html.light {
  --color-primary: #6366f1; /* indigo-500 */
  --color-primary-2: #8b5cf6; /* violet-500 */
  --color-accent: #22d3ee; /* cyan-400 */

  --color-bg: #f8fafc; /* slate-50 */
  --color-card: #ffffff;
  --color-text: #0f172a; /* slate-900 */
  --color-muted: #64748b; /* slate-500 */
  --color-border: #e5e7eb; /* gray-200 */

  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #0ea5e9;

  --gradient-brand-from: #6366f1;
  --gradient-brand-to: #8b5cf6;

  --bg-gradient-light-from: #ffffff;
  --bg-gradient-light-to: #f1f5f9; /* slate-100 */
}

html.dark {
  --color-primary: #8b5cf6; /* slightly brighter in dark */
  --color-primary-2: #6366f1;
  --color-accent: #22d3ee;

  --color-bg: #060a16; /* deep blue-black */
  --color-card: #0f172a; /* slate-900 */
  --color-text: #e5e7eb; /* gray-200 */
  --color-muted: #94a3b8; /* slate-400 */
  --color-border: #1e293b; /* slate-800 */

  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #38bdf8;

  --gradient-brand-from: #8b5cf6;
  --gradient-brand-to: #6366f1;

  --bg-gradient-dark-from: #0a0f1e;
  --bg-gradient-dark-to: #111827; /* gray-900 */
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}
</style>
