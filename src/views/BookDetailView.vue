<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { gsap } from 'gsap';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useAuthStore } from '@/stores/useAuthStore';
import GButton from '@/components/common/GButton.vue';
import PageChallengeModal from '@/components/library/PageChallengeModal.vue';

const route = useRoute();
const libraryStore = useLibraryStore();
const authStore = useAuthStore();

const bookContainerRef = ref<HTMLElement | null>(null);
const heroBannerRef = ref<HTMLElement | null>(null);
const coverRef = ref<HTMLElement | null>(null);
const infoColRef = ref<HTMLElement | null>(null);
const chapterListRef = ref<HTMLElement | null>(null);

const bookId = computed(() => route.params.bookId as string);
const book = computed(() => libraryStore.getBookById(bookId.value));
const manifest = computed(() => libraryStore.getManifestByBookId(bookId.value));

const isChallengeModalOpen = ref<boolean>(false);
const showUnlockSuccess = ref<boolean>(false);

let ctx: gsap.Context | null = null;

onMounted(() => {
  ctx = gsap.context(() => {
    // 1. Cover 3D perspective entrance
    if (coverRef.value) {
      gsap.from(coverRef.value, {
        opacity: 0,
        scale: 0.9,
        rotationY: -15,
        duration: 0.9,
        ease: 'power3.out',
      });
    }

    // 2. Info Column elements entrance
    if (infoColRef.value) {
      gsap.from(infoColRef.value.children, {
        opacity: 0,
        x: 25,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
      });
    }

    // 3. Chapter list items stagger in
    if (chapterListRef.value) {
      gsap.from(chapterListRef.value.children, {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.3,
      });
    }
  }, bookContainerRef.value || undefined);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});

const onChallengeSuccess = () => {
  if (bookId.value) {
    libraryStore.unlockBook(bookId.value);
    showUnlockSuccess.value = true;
    setTimeout(() => {
      showUnlockSuccess.value = false;
    }, 5000);
  }
};
</script>

<template>
  <div v-if="book" ref="bookContainerRef" class="max-w-container-max mx-auto px-4 sm:px-8 py-10 space-y-10">
    <!-- Hero Banner with Book Details -->
    <div ref="heroBannerRef" class="relative rounded-3xl overflow-hidden bg-surface-secondary border border-border-subtle shadow-warm-xl p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
      <!-- Book Cover -->
      <div ref="coverRef" class="w-48 sm:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-border-subtle shrink-0 group relative">
        <img :src="book.coverUrl" :alt="book.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>

      <!-- Info Column -->
      <div ref="infoColRef" class="flex-1 space-y-4 text-center md:text-left">
        <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span
            v-for="genre in book.genres"
            :key="genre"
            class="px-3 py-1 rounded-full text-xs font-sans font-bold uppercase bg-primary-container/15 text-primary border border-primary/30"
          >
            {{ genre }}
          </span>
          <span class="px-3 py-1 rounded-full text-xs font-sans font-bold bg-surface-container text-text-secondary border border-border-subtle">
            ISBN: {{ book.isbn }}
          </span>
        </div>

        <h1 class="font-display-lg text-3xl sm:text-5xl font-extrabold text-on-surface leading-tight">
          {{ book.title }}
        </h1>

        <p class="text-base font-semibold text-text-secondary">
          Karya: <span class="text-primary font-bold">{{ book.author }}</span>
        </p>

        <p class="text-base text-text-secondary leading-relaxed max-w-2xl">
          {{ book.synopsis }}
        </p>

        <!-- Author Control Badge -->
        <div class="p-4 rounded-2xl bg-surface-container/60 border border-border-subtle/60 inline-flex items-center gap-3 text-left">
          <span class="material-symbols-outlined text-secondary text-2xl">verified_user</span>
          <div class="text-xs">
            <p class="font-bold text-on-surface text-sm">Mode Teks Murni & Pilihan Pembaca</p>
            <p class="text-text-muted mt-0.5">Tersedia opsi membaca buku polos tanpa visual atau audio.</p>
          </div>
        </div>

        <!-- Success notification if physical book unlocked -->
        <div v-if="showUnlockSuccess" class="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <span class="material-symbols-outlined text-lg">verified</span>
          <span>Buku fisik berhasil diverifikasi dan fitur eksklusif telah terbuka!</span>
        </div>

        <!-- Action CTAs -->
        <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-3">
          <RouterLink :to="authStore.isLoggedIn ? `/read/${book.id}` : `/auth`">
            <GButton size="lg" variant="primary" icon="auto_stories" rounded>
              Mulai Membaca Full-Screen
            </GButton>
          </RouterLink>

          <GButton
            v-if="manifest?.pageChallenge"
            size="lg"
            variant="outline"
            icon="quiz"
            rounded
            @click="isChallengeModalOpen = true"
          >
            Tantangan Buku Fisik
          </GButton>
        </div>
      </div>
    </div>

    <!-- Chapter List -->
    <div class="bg-surface-secondary rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-warm-md space-y-6">
      <h3 class="font-display-lg text-2xl font-bold text-on-surface flex items-center gap-2.5">
        <span class="material-symbols-outlined text-primary text-2xl">menu_book</span>
        Daftar Bab & Struktur Buku
      </h3>

      <div ref="chapterListRef" class="space-y-3">
        <div
          v-for="(chapter, idx) in manifest?.chapters || []"
          :key="chapter.id"
          class="p-5 rounded-2xl bg-surface-container/50 border border-border-subtle/50 hover:bg-surface-container transition-colors flex items-center justify-between"
        >
          <div class="flex items-center gap-4">
            <span class="w-9 h-9 rounded-full bg-primary/10 text-primary font-sans font-bold text-sm flex items-center justify-center">
              0{{ idx + 1 }}
            </span>
            <div>
              <h4 class="font-display-lg text-base sm:text-lg font-bold text-on-surface">{{ chapter.title }}</h4>
              <p class="text-xs text-text-muted font-sans">{{ chapter.nodeIds.length }} Paragraf Cerita</p>
            </div>
          </div>

          <RouterLink :to="authStore.isLoggedIn ? `/read/${book.id}` : `/auth`">
            <GButton size="sm" variant="tonal" icon="play_arrow">
              Buka Bab
            </GButton>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Page Challenge Modal -->
    <PageChallengeModal
      v-if="manifest?.pageChallenge"
      v-model="isChallengeModalOpen"
      :question="manifest.pageChallenge.question"
      :hint="manifest.pageChallenge.hint"
      :expectedWord="manifest.pageChallenge.expectedWord"
      @success="onChallengeSuccess"
    />
  </div>
  <div v-else class="max-w-container-max mx-auto px-4 py-20 text-center space-y-4">
    <p class="text-2xl font-bold text-on-surface">Buku tidak ditemukan.</p>
    <RouterLink to="/dashboard">
      <GButton variant="primary" icon="arrow_back">Kembali ke Dasbor</GButton>
    </RouterLink>
  </div>
</template>
