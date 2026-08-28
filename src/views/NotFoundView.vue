<script setup lang="ts">
import { RouterLink } from 'vue-router';
import GButton from '@/components/common/GButton.vue';
</script>

<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <div class="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-4xl mb-4 border border-primary/30">
      <span class="material-symbols-outlined text-4xl">auto_stories</span>
    </div>
    <h1 class="font-display-lg text-4xl sm:text-5xl font-bold text-on-surface mb-3">
      404 — Halaman Tidak Ditemukan
    </h1>
    <p class="text-base sm:text-lg text-text-secondary max-w-md mb-8">
      Halaman atau buku yang Anda cari tidak ditemukan atau telah dipindahkan.
    </p>
    <RouterLink to="/">
      <GButton variant="primary" icon="home" rounded size="lg">
        Kembali ke Beranda
      </GButton>
    </RouterLink>
  </div>
</template>
