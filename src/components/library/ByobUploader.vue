<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useLibraryStore } from '@/stores/useLibraryStore';
import GButton from '@/components/common/GButton.vue';

const libraryStore = useLibraryStore();
const fileInputRef = ref<HTMLInputElement | null>(null);

const verificationResult = ref<{ fileName: string; hash: string; matchedBook?: any } | null>(null);

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    processFile(file);
  }
};

const handleDrop = async (e: DragEvent) => {
  const file = e.dataTransfer?.files[0];
  if (file) {
    processFile(file);
  }
};

const processFile = async (file: File) => {
  const res = await libraryStore.simulateByobVerification(file.name);
  verificationResult.value = {
    fileName: file.name,
    hash: res.hash,
    matchedBook: res.matchedBook,
  };
};
</script>

<template>
  <div class="p-6 sm:p-8 rounded-3xl bg-surface-secondary border border-border-subtle shadow-warm-lg">
    <div class="flex items-center gap-2.5 mb-2">
      <span class="material-symbols-outlined text-secondary text-2xl">upload_file</span>
      <h3 class="font-display-lg text-xl sm:text-2xl font-bold text-on-surface">Buka File EPUB Pribadi (.epub)</h3>
    </div>
    <p class="text-sm sm:text-base text-text-secondary mb-5 leading-relaxed">
      Pilih file e-book (.epub) dari perangkat Anda. Genmoire membaca file secara aman langsung di dalam peramban Anda tanpa mengunggah file ke internet.
    </p>

    <div
      class="border-2 border-dashed border-border-subtle hover:border-primary/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-surface-container/30 hover:bg-surface-container/60"
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept=".epub,.pdf,.txt"
        class="hidden"
        @change="handleFileChange"
      />
      <div class="flex flex-col items-center gap-3">
        <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <span class="material-symbols-outlined text-3xl">book_2</span>
        </div>
        <p class="text-base font-bold text-on-surface">
          Klik untuk memilih file <span class="font-sans text-primary">.epub</span> dari perangkat
        </p>
        <p class="text-xs text-text-muted">
          Privasi 100% aman: Tidak ada data buku yang dikirim ke server luar.
        </p>
      </div>
    </div>

    <!-- Verification Result Badge -->
    <div v-if="verificationResult" class="mt-4 p-4 rounded-2xl bg-surface-container border border-border-subtle text-xs flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-secondary text-2xl">verified</span>
        <div>
          <p class="font-bold text-on-surface text-sm">{{ verificationResult.fileName }} berhasil dimuat!</p>
          <p class="text-xs font-sans text-text-muted">Status: Siap dibaca di peramban</p>
        </div>
      </div>
      <RouterLink v-if="verificationResult.matchedBook" :to="`/read/${verificationResult.matchedBook.id}`">
        <GButton size="sm" variant="primary">Mulai Membaca</GButton>
      </RouterLink>
    </div>
  </div>
</template>
