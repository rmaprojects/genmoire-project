<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
</script>

<template>
  <div class="min-h-screen bg-surface-primary text-text-primary flex flex-col font-ui transition-colors duration-300">
    <!-- Header (hidden in Reader immersive mode) -->
    <AppHeader v-if="$route.meta.showHeader !== false" />

    <!-- Main View Viewport -->
    <main class="flex-1 w-full flex flex-col">
      <RouterView />
    </main>
  </div>
</template>
