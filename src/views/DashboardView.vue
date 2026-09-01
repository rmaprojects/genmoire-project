<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLibraryStore } from '@/stores/useLibraryStore';
import QuickResumeHero from '@/components/dashboard/QuickResumeHero.vue';
import CompactProfileWidget from '@/components/dashboard/CompactProfileWidget.vue';
import CompactHeatmapWidget from '@/components/dashboard/CompactHeatmapWidget.vue';
import CommunityWidget from '@/components/dashboard/CommunityWidget.vue';
import BookCard from '@/components/library/BookCard.vue';
import AddBookModal from '@/components/library/AddBookModal.vue';
import GChip from '@/components/common/GChip.vue';
import GButton from '@/components/common/GButton.vue';
import TierUpOverlay from '@/components/dashboard/TierUpOverlay.vue';
import TraitToast from '@/components/dashboard/TraitToast.vue';

gsap.registerPlugin(ScrollTrigger);

const libraryStore = useLibraryStore();

const activeFilter = ref<string>('All');
const isAddBookModalOpen = ref<boolean>(false);

const dashboardContainerRef = ref<HTMLElement | null>(null);
const heroSectionRef = ref<HTMLElement | null>(null);
const booksGridRef = ref<HTMLElement | null>(null);
const sidebarRef = ref<HTMLElement | null>(null);

const filteredBooks = computed(() => {
  let list = libraryStore.books;
  if (activeFilter.value !== 'All') {
    list = list.filter(b => b.genres.includes(activeFilter.value));
  }
  if (libraryStore.searchQuery.trim()) {
    const q = libraryStore.searchQuery.trim().toLowerCase();
    list = list.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q) ||
      b.genres.some(g => g.toLowerCase().includes(q))
    );
  }
  return list;
});

let ctx: gsap.Context | null = null;

onMounted(() => {
  nextTick(() => {
    ctx = gsap.context(() => {
      // 1. Hero & Main content entrance
      if (heroSectionRef.value) {
        gsap.from(heroSectionRef.value, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        });
      }

      // 2. Sidebar Widgets Stagger Reveal
      if (sidebarRef.value) {
        gsap.from(sidebarRef.value.children, {
          opacity: 0,
          x: 20,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        });
      }

      // 3. Books Grid Stagger Reveal
      if (booksGridRef.value) {
        gsap.from(booksGridRef.value.children, {
          opacity: 0,
          y: 25,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
        });
      }

      ScrollTrigger.refresh();
    }, dashboardContainerRef.value || undefined);
  });
});

watch([activeFilter, () => libraryStore.searchQuery], () => {
  nextTick(() => {
    if (booksGridRef.value) {
      gsap.fromTo(
        booksGridRef.value.children,
        { opacity: 0, y: 15, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
      );
    }
  });
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  <div ref="dashboardContainerRef" class="max-w-container-max mx-auto px-4 sm:px-8 py-6 sm:py-8 lg:py-10 pb-24 lg:pb-10 space-y-8 sm:space-y-10">
    
    <!-- 2-Column Responsive Layout (Main 70% / Sidebar 30%) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- ================= LEFT / MAIN CONTENT AREA (~70% Width) ================= -->
      <main class="lg:col-span-8 space-y-8 min-w-0">
        
        <!-- 1. Top Hero: Quick Resume (Lanjutkan Membaca) -->
        <section ref="heroSectionRef" aria-label="Lanjutkan Membaca">
          <QuickResumeHero :book="libraryStore.recentlyReadBook" />
        </section>

        <!-- 2. Section: Koleksi Buku Saya -->
        <section id="books-collection-section" class="space-y-6 scroll-mt-24" aria-label="Koleksi Buku Saya">
          <!-- Section Header with Title & Action Button -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle/70 dark:border-transparent">
            <div>
              <div class="flex items-center gap-2.5">
                <h2 class="font-display-lg text-2xl sm:text-3xl font-extrabold text-on-surface dark:text-[#F3EFE6]">
                  Koleksi Buku Saya
                </h2>
                <span class="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 dark:border-transparent">
                  {{ filteredBooks.length }} Buku
                </span>
              </div>
              <p class="text-xs sm:text-sm text-text-secondary dark:text-[#C5BBAF] mt-1">
                Koleksi buku digital interaktif yang siap Anda baca kapan saja di peramban.
              </p>
            </div>

            <!-- Primary Action: [+ Tambah Buku Baru] -->
            <GButton
              variant="primary"
              size="md"
              icon="library_add"
              rounded
              class="font-bold shadow-warm-sm shrink-0 self-start sm:self-auto"
              @click="isAddBookModalOpen = true"
            >
              Tambah Buku Baru
            </GButton>
          </div>

          <!-- Active Search Filter Pill (If searching) -->
          <div
            v-if="libraryStore.searchQuery.trim()"
            class="p-3 rounded-2xl bg-primary/10 border border-primary/30 dark:border-transparent flex items-center justify-between gap-3 text-xs"
          >
            <div class="flex items-center gap-2 text-on-surface dark:text-[#F3EFE6]">
              <span class="material-symbols-outlined text-primary text-base">search</span>
              <span>Menampilkan hasil pencarian untuk: <strong class="text-primary font-bold">"{{ libraryStore.searchQuery }}"</strong></span>
            </div>
            <button
              type="button"
              class="text-xs font-sans font-bold text-text-muted hover:text-on-surface flex items-center gap-1 cursor-pointer"
              @click="libraryStore.searchQuery = ''"
            >
              <span>Bersihkan</span>
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <!-- Category Filter Chips (Horizontal scrollable with smooth scrollbar) -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <GChip
              :active="activeFilter === 'All'"
              @click="activeFilter = 'All'"
            >
              Semua
            </GChip>
            <GChip
              :active="activeFilter === 'Dark Fantasy'"
              @click="activeFilter = 'Dark Fantasy'"
            >
              Dark Fantasy
            </GChip>
            <GChip
              :active="activeFilter === 'Philosophical'"
              @click="activeFilter = 'Philosophical'"
            >
              Classics & Alkimia
            </GChip>
            <GChip
              :active="activeFilter === 'Self Improvement'"
              @click="activeFilter = 'Self Improvement'"
            >
              Non-Fiksi
            </GChip>
            <GChip
              :active="activeFilter === 'Visual Novel'"
              @click="activeFilter = 'Visual Novel'"
            >
              Visual Novel
            </GChip>
          </div>

          <!-- Book Grid (1 col on mobile, 2 cols on md+) -->
          <div
            v-if="filteredBooks.length > 0"
            ref="booksGridRef"
            class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          >
            <BookCard
              v-for="book in filteredBooks"
              :key="book.id"
              :book="book"
            />
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="p-10 rounded-3xl bg-surface-secondary dark:bg-[#221E1A] border border-border-subtle dark:border-transparent text-center space-y-4 shadow-warm-sm"
          >
            <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <span class="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            <div>
              <h3 class="font-display-lg text-lg font-bold text-on-surface dark:text-[#F3EFE6]">
                Tidak ada buku dalam kategori ini
              </h3>
              <p class="text-xs sm:text-sm text-text-secondary dark:text-[#C5BBAF] mt-1 max-w-md mx-auto">
                Silakan pilih kategori lain atau cari buku di database server Genmoire.
              </p>
            </div>
            <GButton
              variant="secondary"
              size="sm"
              icon="library_add"
              @click="isAddBookModalOpen = true"
            >
              Tambah Buku Sekarang
            </GButton>
          </div>
        </section>
      </main>

      <!-- ================= RIGHT / SIDEBAR AREA (~30% Width) ================= -->
      <aside ref="sidebarRef" class="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
        
        <!-- 1. Widget Profil & Gamifikasi Kompak -->
        <CompactProfileWidget />

        <!-- 2. Widget Aktivitas Membaca Kompak (Heatmap) -->
        <CompactHeatmapWidget />

        <!-- 3. Widget Komunitas (Ruang Diskusi & Teori) -->
        <CommunityWidget />
      </aside>
    </div>

    <!-- ================= MODAL TAMBAH BUKU BARU ================= -->
    <AddBookModal v-model="isAddBookModalOpen" />

    <!-- Overlays -->
    <TierUpOverlay />
    <TraitToast />
  </div>
</template>
