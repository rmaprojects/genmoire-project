<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLibraryStore } from '@/stores/useLibraryStore';
import type { BookSummary } from '@/types/manifest';
import GModal from '@/components/common/GModal.vue';
import GInput from '@/components/common/GInput.vue';
import GButton from '@/components/common/GButton.vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const router = useRouter();
const libraryStore = useLibraryStore();

// Modal Stages: 'search' | 'found_preview' | 'not_found_upload' | 'challenge' | 'success'
type ModalStep = 'search' | 'found_preview' | 'not_found_upload' | 'challenge' | 'success';
const currentStep = ref<ModalStep>('search');

// Step 1 State: Search
const inputIsbn = ref<string>('');
const isSearching = ref<boolean>(false);
const searchedIsbn = ref<string>('');

// Step 2 State: Book details
const matchedBook = ref<BookSummary | null>(null);

// Step 3 State: Page Challenge
const challengeAnswer = ref<string>('');
const challengeError = ref<string>('');
const isVerifyingChallenge = ref<boolean>(false);

// EPUB Upload State (for Not Found fallback)
const fileInputRef = ref<HTMLInputElement | null>(null);
const isProcessingEpub = ref<boolean>(false);
const uploadedEpubBook = ref<BookSummary | null>(null);

// Demo suggestions
const demoIsbns = [
  { label: 'Aethelgard', isbn: '978-602-03-8591-2' },
  { label: 'The Alchemist', isbn: '978-0-06-231500-7' },
  { label: 'Atomic Habits', isbn: '978-0-7352-1129-2' },
  { label: 'Fate Prelude', isbn: '978-4-04-100234-5' },
  { label: 'ISBN Acak (Demo Gagal)', isbn: '978-1-234-56789-0' },
];

const activeChallenge = computed(() => {
  if (!matchedBook.value) return null;
  return libraryStore.getPageChallenge(matchedBook.value.id);
});

// Reset state on modal open/close
const resetModal = () => {
  currentStep.value = 'search';
  inputIsbn.value = '';
  searchedIsbn.value = '';
  matchedBook.value = null;
  challengeAnswer.value = '';
  challengeError.value = '';
  uploadedEpubBook.value = null;
};

// 1. Search ISBN
const handleSearchIsbn = () => {
  if (!inputIsbn.value.trim()) return;
  isSearching.value = true;
  searchedIsbn.value = inputIsbn.value.trim();

  setTimeout(() => {
    isSearching.value = false;
    const found = libraryStore.findBookByIsbn(searchedIsbn.value);
    if (found) {
      matchedBook.value = found;
      currentStep.value = 'found_preview';
    } else {
      matchedBook.value = null;
      currentStep.value = 'not_found_upload';
    }
  }, 450);
};

const handleSelectDemoIsbn = (isbn: string) => {
  inputIsbn.value = isbn;
  handleSearchIsbn();
};

// 2. Proceed to Challenge
const proceedToChallenge = () => {
  challengeAnswer.value = '';
  challengeError.value = '';
  currentStep.value = 'challenge';
};

// 3. Verify Page Challenge
const handleVerifyChallenge = () => {
  if (!matchedBook.value || !activeChallenge.value) return;
  isVerifyingChallenge.value = true;
  challengeError.value = '';

  setTimeout(() => {
    isVerifyingChallenge.value = false;
    const isCorrect = libraryStore.verifyPageChallenge(matchedBook.value!.id, challengeAnswer.value);
    if (isCorrect) {
      currentStep.value = 'success';
    } else {
      challengeError.value = `Kata kunci tidak cocok. Pastikan memeriksa halaman ${activeChallenge.value?.pageNumber} pada buku fisik Anda!`;
    }
  }, 400);
};

// 4. Handle EPUB upload (fallback when ISBN not found)
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    processEpub(file);
  }
};

const handleDrop = async (e: DragEvent) => {
  const file = e.dataTransfer?.files[0];
  if (file) {
    processEpub(file);
  }
};

const processEpub = async (file: File) => {
  isProcessingEpub.value = true;
  const newBook = libraryStore.addCustomEpub(file.name);
  isProcessingEpub.value = false;
  uploadedEpubBook.value = newBook;
  matchedBook.value = newBook;
  currentStep.value = 'success';
};

// Navigation to Reader
const openReader = () => {
  const targetId = matchedBook.value?.id || uploadedEpubBook.value?.id;
  if (targetId) {
    emit('update:modelValue', false);
    resetModal();
    router.push(`/read/${targetId}`);
  }
};

const closeModal = () => {
  emit('update:modelValue', false);
  setTimeout(resetModal, 300);
};
</script>

<template>
  <GModal
    :modelValue="modelValue"
    title="Tambah & Buka Buku"
    icon="library_add"
    maxWidth="2xl"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <div class="space-y-6">

      <!-- ================= STEP 1: CARI ISBN ================= -->
      <div v-if="currentStep === 'search'" class="space-y-5">
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <span class="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold font-sans flex items-center justify-center">1</span>
            <h3 class="font-display-lg text-lg font-bold text-on-surface dark:text-[#F3EFE6]">
              Cari Naskah via ISBN
            </h3>
          </div>
          <p class="text-xs sm:text-sm text-text-secondary dark:text-[#C5BBAF] leading-relaxed">
            Masukkan nomor ISBN 13-digit dari sampul belakang buku fisik Anda untuk memeriksa ketersediaan naskah resmi di server Genmoire.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1">
            <GInput
              v-model="inputIsbn"
              placeholder="mis. 978-602-03-8591-2"
              icon="barcode_reader"
              clearable
              @enter="handleSearchIsbn"
            />
          </div>
          <GButton
            variant="primary"
            size="lg"
            icon="search"
            :loading="isSearching"
            customClass="shrink-0 font-bold"
            @click="handleSearchIsbn"
          >
            Cari Naskah
          </GButton>
        </div>

        <!-- Quick Demo ISBN Suggestions -->
        <div class="p-4 rounded-2xl bg-surface-container/60 border border-border-subtle/70 space-y-2.5">
          <span class="text-xs font-sans font-bold text-text-secondary dark:text-[#C5BBAF] flex items-center gap-1.5">
            <span class="material-symbols-outlined text-primary text-base">lightbulb</span>
            Pilih Cepat Contoh ISBN:
          </span>
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="item in demoIsbns"
              :key="item.isbn"
              type="button"
              class="text-xs font-sans px-3 py-1.5 rounded-xl bg-surface-secondary hover:bg-surface-container-high text-primary border border-border-subtle/80 hover:border-primary/40 transition-colors cursor-pointer flex items-center gap-1.5"
              @click="handleSelectDemoIsbn(item.isbn)"
            >
              <span>{{ item.label }}:</span>
              <span class="font-bold font-mono">{{ item.isbn }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================= STEP 2A: BUKU DITEMUKAN DI SERVER ================= -->
      <div v-else-if="currentStep === 'found_preview' && matchedBook" class="space-y-6">
        <!-- Success Alert Header -->
        <div class="p-4 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-start gap-3">
          <span class="material-symbols-outlined text-secondary text-2xl shrink-0 mt-0.5">verified</span>
          <div>
            <p class="font-bold text-secondary text-sm">
              Naskah Resmi Ditemukan di Arcanum!
            </p>
            <p class="text-xs text-text-secondary dark:text-[#C5BBAF] mt-0.5 leading-relaxed">
              ISBN <code class="font-mono font-bold">{{ matchedBook.isbn }}</code> terdaftar dalam pangkalan data resmi Genmoire.
            </p>
          </div>
        </div>

        <!-- Book Preview Card -->
        <div class="p-5 rounded-3xl bg-surface-container/70 border border-border-subtle flex flex-col sm:flex-row gap-5 items-center sm:items-start">
          <div class="w-24 sm:w-28 aspect-[2/3] rounded-2xl overflow-hidden shadow-warm-md border border-border-subtle shrink-0">
            <img :src="matchedBook.coverUrl" :alt="matchedBook.title" class="w-full h-full object-cover" />
          </div>

          <div class="flex-1 space-y-2 text-center sm:text-left min-w-0">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                {{ matchedBook.genres[0] }}
              </span>
              <span class="text-xs text-text-muted font-sans font-semibold">
                {{ matchedBook.estimatedReadMinutes }} mnt membaca
              </span>
            </div>

            <h3 class="font-reading-body text-lg sm:text-xl font-bold text-on-surface dark:text-[#F3EFE6] leading-snug">
              {{ matchedBook.title }}
            </h3>
            <p class="text-xs sm:text-sm font-semibold text-text-secondary dark:text-[#C5BBAF]">
              {{ matchedBook.author }}
            </p>
            <p class="text-xs text-text-secondary dark:text-[#D8D0C3] line-clamp-2 leading-relaxed">
              {{ matchedBook.synopsis }}
            </p>
          </div>
        </div>

        <!-- Security Instruction Notice -->
        <div class="p-4 rounded-2xl bg-surface-container/50 border border-border-subtle/70 text-xs text-text-secondary dark:text-[#C5BBAF] leading-relaxed flex items-start gap-3">
          <span class="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">security</span>
          <div>
            <strong class="text-on-surface dark:text-[#F3EFE6] block mb-0.5">Verifikasi Kepemilikan Buku Fisik:</strong>
            Untuk mengaktifkan naskah berlisensi ini, Anda akan diminta menjawab kuis kata kunci dari halaman buku fisik Anda pada langkah berikutnya.
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <GButton
            variant="ghost"
            size="md"
            icon="arrow_back"
            @click="currentStep = 'search'"
          >
            Cari ISBN Lain
          </GButton>

          <GButton
            variant="primary"
            size="lg"
            icon="quiz"
            customClass="w-full sm:w-auto font-bold shadow-warm-sm"
            @click="proceedToChallenge"
          >
            Lanjut ke Kuis Verifikasi Buku Fisik →
          </GButton>
        </div>
      </div>

      <!-- ================= STEP 2B: TIDAK DITEMUKAN -> UPLOAD EPUB (BYOB) ================= -->
      <div v-else-if="currentStep === 'not_found_upload'" class="space-y-6">
        <!-- Not Found Notice -->
        <div class="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-start gap-3">
          <span class="material-symbols-outlined text-primary text-2xl shrink-0 mt-0.5">info</span>
          <div>
            <p class="font-bold text-on-surface dark:text-[#F3EFE6] text-sm">
              ISBN "{{ searchedIsbn }}" Belum Terdaftar di Server
            </p>
            <p class="text-xs text-text-secondary dark:text-[#C5BBAF] mt-0.5 leading-relaxed">
              Naskah resmi untuk ISBN ini belum ada di Arcanum. Namun, Anda dapat membuka dan membaca naskah Anda sendiri dengan mengunggah file EPUB (<strong class="text-primary font-mono">.epub</strong>).
            </p>
          </div>
        </div>

        <!-- EPUB Dropzone -->
        <div
          class="border-2 border-dashed border-border-subtle hover:border-primary/60 rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-surface-container/40 hover:bg-surface-container/80 group"
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
            <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl">upload_file</span>
            </div>
            <div>
              <p class="text-sm sm:text-base font-bold text-on-surface dark:text-[#F3EFE6]">
                Pilih atau Tarik File <span class="text-primary font-mono">.epub</span> ke sini
              </p>
              <p class="text-xs text-text-muted dark:text-[#9E9385] mt-1">
                Genmoire akan membaca dan merender naskah secara instan
              </p>
            </div>
          </div>
        </div>

        <!-- Privacy Shield Guarantee -->
        <div class="p-3.5 rounded-2xl bg-surface-container/60 border border-border-subtle/70 flex items-center gap-3 text-xs text-text-secondary dark:text-[#C5BBAF]">
          <span class="material-symbols-outlined text-secondary text-lg shrink-0">verified_user</span>
          <span><strong>Privasi 100% Aman:</strong> File tidak diunggah ke internet dan diproses langsung di peramban Anda.</span>
        </div>

        <!-- Back Button -->
        <div class="pt-2">
          <GButton
            variant="ghost"
            size="md"
            icon="arrow_back"
            @click="currentStep = 'search'"
          >
            Kembali ke Pencarian ISBN
          </GButton>
        </div>
      </div>

      <!-- ================= STEP 3: KUIS VERIFIKASI BUKU FISIK ================= -->
      <div v-else-if="currentStep === 'challenge' && matchedBook && activeChallenge" class="space-y-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold font-sans flex items-center justify-center">2</span>
            <h3 class="font-display-lg text-lg font-bold text-on-surface dark:text-[#F3EFE6]">
              Kuis Verifikasi Kepemilikan Fisik
            </h3>
          </div>
          <p class="text-xs text-text-secondary dark:text-[#C5BBAF]">
            Verifikasi naskah: <strong class="text-on-surface dark:text-[#F3EFE6]">{{ matchedBook.title }}</strong>
          </p>
        </div>

        <!-- Challenge Box -->
        <div class="p-5 rounded-3xl bg-surface-container/70 border border-border-subtle/80 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <span class="material-symbols-outlined text-2xl">quiz</span>
            </div>
            <div>
              <span class="text-[11px] font-sans font-bold uppercase text-primary tracking-wider block mb-1">
                Tantangan Halaman Fisik
              </span>
              <p class="text-sm sm:text-base font-bold text-on-surface dark:text-[#F3EFE6] leading-relaxed">
                "{{ activeChallenge.question }}"
              </p>
            </div>
          </div>

          <div v-if="activeChallenge.hint" class="p-3 rounded-2xl bg-surface-secondary border border-border-subtle text-xs text-text-muted dark:text-[#BDB2A5] flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-base shrink-0">lightbulb</span>
            <span><em>Petunjuk:</em> {{ activeChallenge.hint }}</span>
          </div>

          <!-- Answer Input -->
          <div class="space-y-2 pt-1">
            <label class="text-xs font-bold text-on-surface dark:text-[#F3EFE6] font-sans">
              Jawaban Kata Kunci:
            </label>
            <GInput
              v-model="challengeAnswer"
              placeholder="Ketik kata kunci yang tepat..."
              icon="key"
              clearable
              @enter="handleVerifyChallenge"
            />
          </div>

          <!-- Error Alert -->
          <div
            v-if="challengeError"
            class="p-3 rounded-2xl bg-error/10 border border-error/30 text-error text-xs font-semibold flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-base">error</span>
            <span>{{ challengeError }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <GButton
            variant="ghost"
            size="md"
            icon="arrow_back"
            @click="currentStep = 'found_preview'"
          >
            Kembali
          </GButton>

          <GButton
            variant="primary"
            size="lg"
            icon="check_circle"
            :loading="isVerifyingChallenge"
            customClass="w-full sm:w-auto font-bold shadow-warm-sm"
            @click="handleVerifyChallenge"
          >
            Verifikasi & Buka Akses Naskah
          </GButton>
        </div>
      </div>

      <!-- ================= STEP 4: BERHASIL DITAMBAHKAN & DIAKSES ================= -->
      <div v-else-if="currentStep === 'success' && matchedBook" class="text-center py-4 space-y-6">
        <!-- Victory Emblem -->
        <div class="relative w-20 h-20 mx-auto">
          <div class="w-20 h-20 rounded-3xl bg-secondary/20 border-2 border-secondary text-secondary flex items-center justify-center shadow-warm-lg animate-scale-in">
            <span class="material-symbols-outlined text-5xl">verified</span>
          </div>
        </div>

        <div class="space-y-2 max-w-md mx-auto">
          <h3 class="font-display-lg text-2xl font-extrabold text-on-surface dark:text-[#F3EFE6]">
            Naskah Berhasil Diaktifkan!
          </h3>
          <p class="text-xs sm:text-sm text-text-secondary dark:text-[#C5BBAF] leading-relaxed">
            Selamat! Kepemilikan naskah <strong class="text-on-surface dark:text-[#F3EFE6]">"{{ matchedBook.title }}"</strong> telah terverifikasi. Buku kini resmi terbuka dan tersimpan di akun perpustakaan Anda.
          </p>
        </div>

        <!-- Book Card Snapshot -->
        <div class="p-4 rounded-2xl bg-surface-container/70 border border-border-subtle max-w-md mx-auto flex items-center gap-4 text-left">
          <img :src="matchedBook.coverUrl" :alt="matchedBook.title" class="w-12 h-16 object-cover rounded-xl shadow-xs border border-border-subtle shrink-0" />
          <div class="min-w-0">
            <p class="font-bold text-sm text-on-surface dark:text-[#F3EFE6] truncate">{{ matchedBook.title }}</p>
            <p class="text-xs text-text-secondary dark:text-[#C5BBAF] truncate">{{ matchedBook.author }}</p>
            <span class="text-[10px] font-sans font-bold text-secondary mt-1 inline-block">✓ Siap Dibaca</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <GButton
            variant="secondary"
            size="lg"
            customClass="w-full sm:w-auto"
            @click="closeModal"
          >
            Tutup & Lihat di Dasbor
          </GButton>

          <GButton
            variant="primary"
            size="lg"
            icon="auto_stories"
            customClass="w-full sm:w-auto font-bold shadow-warm-sm"
            @click="openReader"
          >
            Mulai Membaca Sekarang
          </GButton>
        </div>
      </div>

    </div>
  </GModal>
</template>
