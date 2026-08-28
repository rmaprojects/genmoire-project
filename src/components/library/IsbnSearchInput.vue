<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLibraryStore } from '@/stores/useLibraryStore';
import GInput from '@/components/common/GInput.vue';
import GButton from '@/components/common/GButton.vue';

const router = useRouter();
const libraryStore = useLibraryStore();

const inputIsbn = ref<string>('');
const isLoading = ref<boolean>(false);
const feedbackMessage = ref<string>('');
const feedbackSuccess = ref<boolean>(false);

const demoIsbns = [
  { label: 'Aethelgard', isbn: '978-602-03-8591-2' },
  { label: 'The Alchemist', isbn: '978-0-06-231500-7' },
  { label: 'Atomic Habits', isbn: '978-0-7352-1129-2' },
  { label: 'Fate Prelude', isbn: '978-4-04-100234-5' },
];

const submitIsbn = () => {
  if (!inputIsbn.value.trim()) return;
  isLoading.value = true;
  feedbackMessage.value = '';

  setTimeout(() => {
    const res = libraryStore.verifyIsbn(inputIsbn.value);
    isLoading.value = false;
    feedbackSuccess.value = res.success;
    feedbackMessage.value = res.message;

    if (res.success && res.book) {
      setTimeout(() => {
        router.push(`/book/${res.book?.id}`);
      }, 600);
    }
  }, 400);
};
</script>

<template>
  <div class="bg-surface-secondary p-6 sm:p-8 rounded-3xl border border-border-subtle/80 shadow-warm-lg text-left">
    <div class="flex items-center gap-2.5 mb-2">
      <span class="material-symbols-outlined text-primary text-2xl">menu_book</span>
      <h3 class="font-display-lg text-lg sm:text-xl font-bold text-on-surface tracking-tight">
        Buka Buku Menggunakan ISBN
      </h3>
    </div>
    <p class="font-ui-body text-xs sm:text-sm text-text-secondary mb-5 leading-relaxed max-w-[55ch]">
      Masukkan nomor ISBN 13-digit dari sampul belakang buku fisik Anda untuk memuat versi interaktifnya.
    </p>

    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1">
        <GInput
          v-model="inputIsbn"
          placeholder="mis. 978-602-03-8591-2"
          icon="barcode_reader"
          clearable
          @enter="submitIsbn"
        />
      </div>
      <GButton
        variant="primary"
        size="lg"
        icon="search"
        :loading="isLoading"
        @click="submitIsbn"
        customClass="shrink-0"
      >
        Cari & Buka Buku
      </GButton>
    </div>

    <!-- Quick Suggestions -->
    <div class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border-subtle/40">
      <span class="text-xs font-sans font-semibold text-text-muted">Contoh ISBN:</span>
      <button
        v-for="item in demoIsbns"
        :key="item.isbn"
        type="button"
        class="text-xs font-sans px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary border border-border-subtle/60 transition-colors cursor-pointer"
        @click="inputIsbn = item.isbn; submitIsbn()"
      >
        {{ item.label }}: <span class="font-bold">{{ item.isbn }}</span>
      </button>
    </div>

    <!-- Feedback Message -->
    <p
      v-if="feedbackMessage"
      class="mt-3 text-sm font-semibold flex items-center gap-1.5"
      :class="feedbackSuccess ? 'text-secondary' : 'text-error'"
    >
      <span class="material-symbols-outlined text-base">{{ feedbackSuccess ? 'check_circle' : 'error' }}</span>
      {{ feedbackMessage }}
    </p>
  </div>
</template>
