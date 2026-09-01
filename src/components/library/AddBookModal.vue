<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useLibraryStore } from '@/stores/useLibraryStore';
import type { BookSummary } from '@/types/manifest';
import GModal from '@/components/common/GModal.vue';
import GInput from '@/components/common/GInput.vue';
import GButton from '@/components/common/GButton.vue';
import confetti from 'canvas-confetti';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const router = useRouter();
const libraryStore = useLibraryStore();

// Modal Stages:
// 'search' (Input ISBN)
// 'found_choose_method' (Buku Ada di server -> Pilih verifikasi EPUB / Fisik)
// 'verify_physical' (Kuis Buku Fisik)
// 'verify_epub' (Unggah EPUB untuk verifikasi buku ada)
// 'not_found_upload' (Buku Tidak Ada -> Unggah EPUB untuk pengajuan 7x24 jam)
// 'submitted_review' (Layar konfirmasi pengajuan 7x24 jam)
// 'success_unlocked' (Layar selebrasi buku berhasil dibuka)
type ModalStage =
  | 'search'
  | 'found_choose_method'
  | 'verify_physical'
  | 'verify_epub'
  | 'not_found_upload'
  | 'submitted_review'
  | 'success_unlocked';

const modalStage = ref<ModalStage>('search');

// Search State
const searchInput = ref<string>('');
const isSearching = ref<boolean>(false);
const searchedQuery = ref<string>('');
const matchedBook = ref<BookSummary | null>(null);

// Quick Demo ISBNs / Codes
const demoCodes = [
  { label: 'Atomic Habits (Terkunci)', code: '#VN-ATOMIC-03' },
  { label: 'The Alchemist', code: '#VN-ALCHEM-02' },
  { label: 'Fate Prelude', code: '#VN-FATE-04' },
  { label: 'ISBN Belum Ada (Demo 7x24 Jam)', code: '978-1-234-56789-0' },
];

// Physical Page Challenge State
const challengeAnswer = ref<string>('');
const challengeError = ref<string>('');
const isVerifyingChallenge = ref<boolean>(false);
const attemptsRemaining = ref<number>(3);

const activeChallenge = computed(() => {
  if (!matchedBook.value) return null;
  return libraryStore.getPageChallenge(matchedBook.value.id);
});

// EPUB Upload State (For Verification or 7x24h Submission)
const fileInputRef = ref<HTMLInputElement | null>(null);
const isProcessingEpub = ref<boolean>(false);
const epubProcessingStep = ref<string>('');
const epubFile = ref<{ name: string; size: string } | null>(null);
const submissionForm = ref({
  title: '',
  author: '',
  synopsis: '',
});

// Reset when modal opens/closes
const resetModal = () => {
  modalStage.value = 'search';
  searchInput.value = '';
  searchedQuery.value = '';
  matchedBook.value = null;
  challengeAnswer.value = '';
  challengeError.value = '';
  attemptsRemaining.value = 3;
  epubFile.value = null;
  epubProcessingStep.value = '';
  submissionForm.value = { title: '', author: '', synopsis: '' };
};

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    resetModal();
  }
});

const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#BA9248', '#5C4114', '#749654', '#D8D0C3'],
    });
  } catch (e) {
    // fallback
  }
};

// ================= 1. SEARCH ISBN DI SERVER =================
const handleSearch = () => {
  if (!searchInput.value.trim()) return;
  isSearching.value = true;
  searchedQuery.value = searchInput.value.trim();
  matchedBook.value = null;

  setTimeout(() => {
    isSearching.value = false;
    const res = libraryStore.findBookByCodeOrIsbn(searchedQuery.value);
    if (res.book) {
      matchedBook.value = res.book;
      if (res.book.isUnlocked) {
        modalStage.value = 'success_unlocked';
      } else {
        modalStage.value = 'found_choose_method';
      }
    } else {
      matchedBook.value = null;
      modalStage.value = 'not_found_upload';
      submissionForm.value.title = '';
      submissionForm.value.author = '';
      submissionForm.value.synopsis = '';
    }
  }, 400);
};

const handleSelectDemoCode = (code: string) => {
  searchInput.value = code;
  handleSearch();
};

// ================= 2. VERIFIKASI BUKU FISIK =================
const startPhysicalChallenge = () => {
  challengeAnswer.value = '';
  challengeError.value = '';
  attemptsRemaining.value = 3;
  modalStage.value = 'verify_physical';
};

const handleVerifyPhysicalChallenge = () => {
  if (!matchedBook.value || !activeChallenge.value) return;
  isVerifyingChallenge.value = true;
  challengeError.value = '';

  setTimeout(() => {
    isVerifyingChallenge.value = false;
    const isCorrect = libraryStore.verifyPageChallenge(matchedBook.value!.id, challengeAnswer.value);
    if (isCorrect) {
      modalStage.value = 'success_unlocked';
      triggerConfetti();
    } else {
      attemptsRemaining.value -= 1;
      if (attemptsRemaining.value > 0) {
        challengeError.value = `Kata kunci tidak cocok. Sisa ${attemptsRemaining.value} kali percobaan. Pastikan memeriksa halaman ${activeChallenge.value?.pageNumber}!`;
      } else {
        challengeError.value = `Batas percobaan habis. Silakan periksa kembali buku fisik Anda dan coba lagi beberapa saat lagi.`;
      }
    }
  }, 450);
};

// ================= 3. VERIFIKASI VIA FILE EPUB LOKAL =================
const startEpubVerification = () => {
  epubFile.value = null;
  modalStage.value = 'verify_epub';
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (e: Event, isVerification: boolean) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    if (isVerification) {
      processEpubForVerification(file);
    } else {
      processEpubForSubmission(file);
    }
  }
};

const handleDrop = (e: DragEvent, isVerification: boolean) => {
  const file = e.dataTransfer?.files[0];
  if (file) {
    if (isVerification) {
      processEpubForVerification(file);
    } else {
      processEpubForSubmission(file);
    }
  }
};

const processEpubForVerification = (file: File) => {
  isProcessingEpub.value = true;
  epubProcessingStep.value = 'Membaca byte ArrayBuffer lokal...';
  const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
  epubFile.value = { name: file.name, size: `${sizeMb} MB` };

  setTimeout(() => {
    epubProcessingStep.value = 'Mencocokkan MD5 Hash dengan database server...';
    setTimeout(() => {
      isProcessingEpub.value = false;
      epubProcessingStep.value = '';
      if (matchedBook.value) {
        libraryStore.verifyByEpubFile(matchedBook.value.id, file.name);
        modalStage.value = 'success_unlocked';
        triggerConfetti();
      }
    }, 450);
  }, 400);
};

const processEpubForSubmission = (file: File) => {
  isProcessingEpub.value = true;
  epubProcessingStep.value = 'Membaca file EPUB...';
  const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
  epubFile.value = { name: file.name, size: `${sizeMb} MB` };

  const rawTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  submissionForm.value.title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
  submissionForm.value.author = 'Pengunggah Buku';
  submissionForm.value.synopsis = `Pengajuan adaptasi buku "${submissionForm.value.title}" dari file EPUB lokal.`;

  setTimeout(() => {
    isProcessingEpub.value = false;
    epubProcessingStep.value = '';
  }, 400);
};

// ================= 4. PENGAJUAN BUKU BARU (7x24 JAM) =================
const handleSubmitBookForReview = () => {
  if (!epubFile.value || !submissionForm.value.title.trim()) return;

  const newBook = libraryStore.submitEpubForReview(epubFile.value.name, {
    isbn: searchedQuery.value,
    title: submissionForm.value.title.trim(),
    author: submissionForm.value.author.trim() || 'Penulis / Pengunggah',
    synopsis: submissionForm.value.synopsis.trim(),
  });

  matchedBook.value = newBook;
  modalStage.value = 'submitted_review';
};

// ================= NAVIGATION =================
const openReader = () => {
  if (matchedBook.value?.id) {
    emit('update:modelValue', false);
    resetModal();
    router.push(`/read/${matchedBook.value.id}`);
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
    title="Tambah Buku Baru"
    icon="library_add"
    maxWidth="2xl"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <div class="space-y-6">

      <!-- ================= 1. INPUT ISBN & CARI DI SERVER ================= -->
      <div v-if="modalStage === 'search'" class="space-y-5">
        <div>
          <h3 class="font-display-lg text-lg sm:text-xl font-bold text-on-surface dark:text-[#F3EFE6]">
            Cari Buku di Database Server
          </h3>
          <p class="text-xs sm:text-sm text-text-secondary dark:text-[#C5BBAF] mt-1 leading-relaxed">
            Masukkan nomor ISBN 13-digit atau Kode Buku (misal: <code class="text-primary font-mono font-bold">#VN-ATOMIC-03</code>) untuk memeriksa ketersediaan buku resmi di server Genmoire.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1">
            <GInput
              v-model="searchInput"
              placeholder="mis. 978-0-7352-1129-2 atau #VN-ATOMIC-03"
              icon="barcode_reader"
              clearable
              @enter="handleSearch"
            />
          </div>
          <GButton
            variant="primary"
            size="lg"
            icon="search"
            :loading="isSearching"
            customClass="shrink-0 font-bold"
            @click="handleSearch"
          >
            Cari di Server
          </GButton>
        </div>

        <!-- Quick Demo Suggestions -->
        <div class="p-4 rounded-2xl bg-surface-container/60 border border-border-subtle/70 dark:border-transparent dark:shadow-md space-y-2.5">
          <span class="text-xs font-sans font-bold text-text-secondary dark:text-[#C5BBAF] flex items-center gap-1.5">
            <span class="material-symbols-outlined text-primary text-base">lightbulb</span>
            Pilih Cepat Contoh ISBN:
          </span>
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="item in demoCodes"
              :key="item.code"
              type="button"
              class="text-xs font-sans px-3 py-1.5 rounded-xl bg-surface-secondary dark:bg-[#25201C] hover:bg-surface-container-high text-primary border border-border-subtle/80 dark:border-transparent shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              @click="handleSelectDemoCode(item.code)"
            >
              <span>{{ item.label }}:</span>
              <span class="font-bold font-mono">{{ item.code }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================= 2A. BUKU ADA DI SERVER -> PILIH VERIFIKASI ================= -->
      <div v-else-if="modalStage === 'found_choose_method' && matchedBook" class="space-y-6">
        <!-- Found Header Alert -->
        <div class="p-4 rounded-2xl bg-secondary/15 dark:bg-[#1E2B16] flex items-start gap-3 shadow-xs">
          <span class="material-symbols-outlined text-secondary text-2xl shrink-0 mt-0.5">verified</span>
          <div>
            <p class="font-bold text-secondary dark:text-emerald-400 text-sm">
              Buku Resmi Ditemukan di Database Server!
            </p>
            <p class="text-xs text-text-secondary dark:text-[#C5BBAF] mt-0.5 leading-relaxed">
              Silakan pilih salah satu metode di bawah untuk memverifikasi kepemilikan buku Anda dan membuka buku visual interaktif.
            </p>
          </div>
        </div>

        <!-- Book Preview Card -->
        <div class="p-5 rounded-3xl bg-surface-container/70 dark:bg-[#24201C] border border-border-subtle/60 dark:border-transparent dark:shadow-lg flex flex-col sm:flex-row gap-5 items-center sm:items-start">
          <div class="w-24 sm:w-28 aspect-[2/3] rounded-2xl overflow-hidden shadow-warm-md shrink-0">
            <img :src="matchedBook.coverUrl" :alt="matchedBook.title" class="w-full h-full object-cover" />
          </div>

          <div class="flex-1 space-y-1.5 text-center sm:text-left min-w-0">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase bg-primary/10 text-primary">
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

        <!-- Verification Choices (2 Cards) -->
        <div class="space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-[#C5BBAF]">
            Pilih Salah Satu Metode Verifikasi:
          </label>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Option 1: EPUB Local File Verification -->
            <div
              class="p-5 rounded-3xl bg-surface-container/60 dark:bg-[#25201C] hover:bg-surface-container-high border border-border-subtle/80 dark:border-transparent shadow-xs hover:shadow-warm-md transition-all cursor-pointer space-y-3 group text-left"
              @click="startEpubVerification"
            >
              <div class="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <span class="material-symbols-outlined text-2xl">upload_file</span>
              </div>
              <div>
                <h4 class="text-sm font-bold text-on-surface dark:text-[#F3EFE6] group-hover:text-primary transition-colors">
                  1. Verifikasi File EPUB
                </h4>
                <p class="text-xs text-text-secondary dark:text-[#C5BBAF] mt-1 leading-relaxed">
                  Unggah file <code class="text-primary font-mono font-bold">.epub</code> dari perangkat Anda untuk verifikasi instan secara lokal.
                </p>
              </div>
              <span class="text-xs font-sans font-bold text-primary flex items-center gap-1">
                Pilih File EPUB <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>

            <!-- Option 2: Physical Page Challenge -->
            <div
              class="p-5 rounded-3xl bg-surface-container/60 dark:bg-[#25201C] hover:bg-surface-container-high border border-border-subtle/80 dark:border-transparent shadow-xs hover:shadow-warm-md transition-all cursor-pointer space-y-3 group text-left"
              @click="startPhysicalChallenge"
            >
              <div class="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                <span class="material-symbols-outlined text-2xl">menu_book</span>
              </div>
              <div>
                <h4 class="text-sm font-bold text-on-surface dark:text-[#F3EFE6] group-hover:text-secondary transition-colors">
                  2. Verifikasi Buku Fisik
                </h4>
                <p class="text-xs text-text-secondary dark:text-[#C5BBAF] mt-1 leading-relaxed">
                  Jawab pertanyaan kata/kalimat di halaman tertentu dari buku fisik yang ada di rak Anda.
                </p>
              </div>
              <span class="text-xs font-sans font-bold text-secondary flex items-center gap-1">
                Jawab Kuis Halaman <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Back Action -->
        <div class="pt-2">
          <GButton variant="ghost" size="sm" icon="arrow_back" @click="modalStage = 'search'">
            Cari ISBN Lain
          </GButton>
        </div>
      </div>

      <!-- ================= 2A1. VERIFIKASI VIA BUKU FISIK (KUIS HALAMAN) ================= -->
      <div v-else-if="modalStage === 'verify_physical' && matchedBook && activeChallenge" class="space-y-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-6 h-6 rounded-full bg-secondary/15 text-secondary text-xs font-bold font-sans flex items-center justify-center">✓</span>
            <h3 class="font-display-lg text-lg font-bold text-on-surface dark:text-[#F3EFE6]">
              Verifikasi via Buku Fisik
            </h3>
          </div>
          <p class="text-xs text-text-secondary dark:text-[#C5BBAF]">
            Buku: <strong class="text-on-surface dark:text-[#F3EFE6]">{{ matchedBook.title }}</strong>
          </p>
        </div>

        <!-- Challenge Box -->
        <div class="p-5 rounded-3xl bg-surface-container/70 dark:bg-[#25201C] border border-border-subtle/80 dark:border-transparent dark:shadow-md space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <span class="material-symbols-outlined text-2xl">quiz</span>
            </div>
            <div>
              <span class="text-[11px] font-sans font-bold uppercase text-primary tracking-wider block mb-1">
                Tantangan Halaman Buku Fisik
              </span>
              <p class="text-sm sm:text-base font-bold text-on-surface dark:text-[#F3EFE6] leading-relaxed">
                "{{ activeChallenge.question }}"
              </p>
            </div>
          </div>

          <div v-if="activeChallenge.hint" class="p-3 rounded-2xl bg-surface-secondary dark:bg-[#1E1B18] text-xs text-text-muted dark:text-[#BDB2A5] flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-base shrink-0">lightbulb</span>
            <span><em>Petunjuk:</em> {{ activeChallenge.hint }}</span>
          </div>

          <!-- Answer Input -->
          <div class="space-y-2 pt-1">
            <label class="text-xs font-bold text-on-surface dark:text-[#F3EFE6] font-sans">
              Jawaban Kata Kunci / Kalimat:
            </label>
            <GInput
              v-model="challengeAnswer"
              placeholder="Ketik kata kunci yang tepat..."
              icon="key"
              clearable
              @enter="handleVerifyPhysicalChallenge"
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
            @click="modalStage = 'found_choose_method'"
          >
            Kembali
          </GButton>

          <GButton
            variant="primary"
            size="lg"
            icon="check_circle"
            :loading="isVerifyingChallenge"
            customClass="w-full sm:w-auto font-bold shadow-warm-sm"
            @click="handleVerifyPhysicalChallenge"
          >
            Verifikasi & Buka Buku
          </GButton>
        </div>
      </div>

      <!-- ================= 2A2. VERIFIKASI VIA EPUB LOKAL ================= -->
      <div v-else-if="modalStage === 'verify_epub' && matchedBook" class="space-y-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold font-sans flex items-center justify-center">✓</span>
            <h3 class="font-display-lg text-lg font-bold text-on-surface dark:text-[#F3EFE6]">
              Verifikasi via File EPUB Lokal
            </h3>
          </div>
          <p class="text-xs text-text-secondary dark:text-[#C5BBAF]">
            Verifikasi kepemilikan buku: <strong class="text-on-surface dark:text-[#F3EFE6]">{{ matchedBook.title }}</strong>
          </p>
        </div>

        <!-- Processing State -->
        <div v-if="isProcessingEpub" class="p-8 rounded-3xl bg-surface-container dark:bg-[#25201C] text-center space-y-4 shadow-inner">
          <div class="w-12 h-12 rounded-full border-3 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p class="text-sm font-bold text-primary font-mono animate-pulse">
            {{ epubProcessingStep }}
          </p>
        </div>

        <!-- Dropzone -->
        <div
          v-else
          class="border-2 border-dashed border-border-subtle/80 dark:border-white/20 hover:border-primary/60 rounded-3xl p-8 text-center cursor-pointer transition-all bg-surface-container/40 dark:bg-[#221E1A] hover:bg-surface-container/80 group"
          @click="triggerFileInput"
          @dragover.prevent
          @drop.prevent="handleDrop($event, true)"
        >
          <input
            ref="fileInputRef"
            type="file"
            accept=".epub,.txt,.pdf"
            class="hidden"
            @change="handleFileChange($event, true)"
          />
          <div class="flex flex-col items-center gap-3">
            <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl">upload_file</span>
            </div>
            <div>
              <p class="text-base font-bold text-on-surface dark:text-[#F3EFE6]">
                Pilih atau Tarik File <span class="text-primary font-mono font-bold">.epub</span> ke sini
              </p>
              <p class="text-xs text-text-muted dark:text-[#9E9385] mt-1">
                Format: EPUB / TXT dari perangkat Anda (100% diproses lokal)
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <GButton
            variant="ghost"
            size="md"
            icon="arrow_back"
            @click="modalStage = 'found_choose_method'"
          >
            Kembali
          </GButton>
        </div>
      </div>

      <!-- ================= 2B. BUKU TIDAK ADA DI SERVER -> UNGGAH EPUB (7x24 JAM) ================= -->
      <div v-else-if="modalStage === 'not_found_upload'" class="space-y-5">
        <!-- Not Found Notice -->
        <div class="p-4 rounded-2xl bg-primary/10 dark:bg-[#2A2319] border border-primary/30 dark:border-transparent flex items-start gap-3 shadow-xs">
          <span class="material-symbols-outlined text-primary text-2xl shrink-0 mt-0.5">info</span>
          <div>
            <p class="font-bold text-on-surface dark:text-[#F3EFE6] text-sm">
              Buku "{{ searchedQuery }}" Belum Ada di Server
            </p>
            <p class="text-xs text-text-secondary dark:text-[#C5BBAF] mt-0.5 leading-relaxed">
              Buku dengan ISBN ini belum terdaftar di katalog resmi Genmoire. Silakan unggah file EPUB Anda untuk diajukan ke kurator kami.
            </p>
          </div>
        </div>

        <!-- Processing State -->
        <div v-if="isProcessingEpub" class="p-8 rounded-3xl bg-surface-container dark:bg-[#25201C] text-center space-y-4 shadow-inner">
          <div class="w-12 h-12 rounded-full border-3 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p class="text-sm font-bold text-primary font-mono animate-pulse">
            {{ epubProcessingStep }}
          </p>
        </div>

        <!-- Dropzone (When no file) -->
        <div
          v-else-if="!epubFile"
          class="border-2 border-dashed border-border-subtle/80 dark:border-white/20 hover:border-primary/60 rounded-3xl p-8 text-center cursor-pointer transition-all bg-surface-container/40 dark:bg-[#221E1A] hover:bg-surface-container/80 group"
          @click="triggerFileInput"
          @dragover.prevent
          @drop.prevent="handleDrop($event, false)"
        >
          <input
            ref="fileInputRef"
            type="file"
            accept=".epub,.txt,.pdf"
            class="hidden"
            @change="handleFileChange($event, false)"
          />
          <div class="flex flex-col items-center gap-3">
            <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl">upload_file</span>
            </div>
            <div>
              <p class="text-base font-bold text-on-surface dark:text-[#F3EFE6]">
                Unggah File <span class="text-primary font-mono font-bold">.epub</span> Buku Anda
              </p>
              <p class="text-xs text-text-muted dark:text-[#9E9385] mt-1">
                File akan diproses dan diadaptasi oleh server (Persetujuan maks. 7x24 jam)
              </p>
            </div>
          </div>
        </div>

        <!-- Form Details after file selected -->
        <div v-else class="space-y-4 p-5 rounded-3xl bg-surface-container/70 dark:bg-[#25201C] border border-border-subtle/70 dark:border-transparent dark:shadow-md">
          <div class="flex items-center justify-between pb-3 border-b border-border-subtle/60 dark:border-transparent">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-secondary text-2xl">check_circle</span>
              <div>
                <p class="text-xs font-bold text-on-surface dark:text-[#F3EFE6]">{{ epubFile.name }}</p>
                <p class="text-[11px] text-text-muted">{{ epubFile.size }} • Siap diajukan ke server</p>
              </div>
            </div>
            <button
              type="button"
              class="text-xs font-sans text-text-muted hover:text-error cursor-pointer"
              @click="epubFile = null"
            >
              Ganti File
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block text-xs font-bold text-on-surface dark:text-[#F3EFE6] mb-1">Judul Buku *:</label>
              <GInput v-model="submissionForm.title" placeholder="Judul Buku..." />
            </div>
            <div>
              <label class="block text-xs font-bold text-on-surface dark:text-[#F3EFE6] mb-1">Nama Pengarang:</label>
              <GInput v-model="submissionForm.author" placeholder="Nama Penulis..." />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-on-surface dark:text-[#F3EFE6] mb-1">Sinopsis Singkat:</label>
            <textarea
              v-model="submissionForm.synopsis"
              rows="2"
              class="w-full bg-surface-container dark:bg-[#1E1B18] border border-border-subtle/60 dark:border-transparent rounded-xl p-3 text-xs font-sans text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none shadow-inner"
              placeholder="Tulis ringkasan buku..."
            />
          </div>

          <!-- 7x24 Hours SLA Notice -->
          <div class="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5 leading-relaxed">
            <span class="material-symbols-outlined text-base shrink-0 mt-0.5">schedule</span>
            <span><strong>Waktu Persetujuan:</strong> File EPUB akan diperiksa oleh tim kurator server Genmoire. Estimasi persetujuan dan pembuatan aset visual novel kinetik adalah <strong>maksimal 7x24 jam</strong>.</span>
          </div>

          <div class="flex items-center justify-between pt-2">
            <GButton variant="ghost" size="sm" icon="arrow_back" @click="modalStage = 'search'">
              Batal
            </GButton>
            <GButton
              variant="primary"
              size="md"
              icon="send"
              :disabled="!submissionForm.title.trim()"
              @click="handleSubmitBookForReview"
            >
              Ajukan Buku ke Server
            </GButton>
          </div>
        </div>

        <div v-if="!epubFile" class="pt-2">
          <GButton variant="ghost" size="sm" icon="arrow_back" @click="modalStage = 'search'">
            Cari ISBN Lain
          </GButton>
        </div>
      </div>

      <!-- ================= 2B1. LAYAR KONFIRMASI PENGAJUAN (7x24 JAM) ================= -->
      <div v-else-if="modalStage === 'submitted_review' && matchedBook" class="text-center py-4 space-y-6">
        <div class="w-20 h-20 rounded-3xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-warm-lg">
          <span class="material-symbols-outlined text-5xl">hourglass_top</span>
        </div>

        <div class="space-y-2 max-w-md mx-auto">
          <h3 class="font-display-lg text-2xl font-extrabold text-on-surface dark:text-[#F3EFE6]">
            Buku Berhasil Diajukan!
          </h3>
          <p class="text-xs sm:text-sm text-text-secondary dark:text-[#C5BBAF] leading-relaxed">
            Buku <strong class="text-on-surface dark:text-[#F3EFE6]">"{{ matchedBook.title }}"</strong> telah dikirimkan ke server Genmoire untuk proses kurasi dan adaptasi visual novel.
          </p>
        </div>

        <!-- Status Card -->
        <div class="p-4 rounded-2xl bg-surface-container/70 dark:bg-[#24201C] border border-border-subtle/60 dark:border-transparent max-w-md mx-auto flex items-center gap-4 text-left shadow-xs">
          <img :src="matchedBook.coverUrl" :alt="matchedBook.title" class="w-12 h-16 object-cover rounded-xl shadow-xs shrink-0" />
          <div class="min-w-0">
            <p class="font-bold text-sm text-on-surface dark:text-[#F3EFE6] truncate">{{ matchedBook.title }}</p>
            <p class="text-xs text-text-secondary dark:text-[#C5BBAF] truncate">{{ matchedBook.author }}</p>
            <span class="text-[11px] font-sans font-bold text-amber-600 dark:text-amber-400 mt-1 inline-flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">schedule</span> Menunggu Approval (Maks. 7x24 Jam)
            </span>
          </div>
        </div>

        <div class="pt-2">
          <GButton
            variant="primary"
            size="lg"
            customClass="font-bold shadow-warm-sm"
            @click="closeModal"
          >
            Tutup & Lihat di Dasbor
          </GButton>
        </div>
      </div>

      <!-- ================= 3. LAYAR SELEBRASI BUKU TERBUKA ================= -->
      <div v-else-if="modalStage === 'success_unlocked' && matchedBook" class="text-center py-4 space-y-6">
        <div class="w-20 h-20 rounded-3xl bg-secondary/20 border-2 border-secondary text-secondary flex items-center justify-center mx-auto shadow-warm-lg">
          <span class="material-symbols-outlined text-5xl">verified</span>
        </div>

        <div class="space-y-2 max-w-md mx-auto">
          <h3 class="font-display-lg text-2xl font-extrabold text-on-surface dark:text-[#F3EFE6]">
            Buku Berhasil Terbuka!
          </h3>
          <p class="text-xs sm:text-sm text-text-secondary dark:text-[#C5BBAF] leading-relaxed">
            Selamat! Kepemilikan buku <strong class="text-on-surface dark:text-[#F3EFE6]">"{{ matchedBook.title }}"</strong> telah terverifikasi dan kini aktif di perpustakaan Anda.
          </p>
        </div>

        <!-- Book Card Snapshot -->
        <div class="p-4 rounded-2xl bg-surface-container/70 dark:bg-[#24201C] border border-border-subtle/60 dark:border-transparent max-w-md mx-auto flex items-center gap-4 text-left shadow-xs">
          <img :src="matchedBook.coverUrl" :alt="matchedBook.title" class="w-12 h-16 object-cover rounded-xl shadow-xs shrink-0" />
          <div class="min-w-0">
            <p class="font-bold text-sm text-on-surface dark:text-[#F3EFE6] truncate">{{ matchedBook.title }}</p>
            <p class="text-xs text-text-secondary dark:text-[#C5BBAF] truncate">{{ matchedBook.author }}</p>
            <span class="text-[10px] font-sans font-bold text-secondary mt-1 inline-block">✓ Siap Dibaca Kinetik</span>
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
