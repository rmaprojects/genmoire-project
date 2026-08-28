<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { gsap } from 'gsap';
import { useThemeStore } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLibraryStore } from '@/stores/useLibraryStore';
import GButton from '@/components/common/GButton.vue';

const route = useRoute();
const router = useRouter();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const libraryStore = useLibraryStore();

const headerRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const isMobileMenuOpen = ref<boolean>(false);
const isSearchFocused = ref<boolean>(false);

const searchResults = computed(() => {
  const q = libraryStore.searchQuery.trim().toLowerCase();
  if (!q) return [];
  return libraryStore.books.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.author.toLowerCase().includes(q) ||
    b.isbn.toLowerCase().includes(q) ||
    b.genres.some(g => g.toLowerCase().includes(q))
  );
});

const handleSearchSubmit = async () => {
  isSearchFocused.value = false;
  searchInputRef.value?.blur();
  
  if (route.name !== 'dashboard') {
    await router.push('/dashboard');
    setTimeout(() => {
      const el = document.getElementById('books-collection-section');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  } else {
    const el = document.getElementById('books-collection-section');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const handleSelectBook = (bookId: string) => {
  isSearchFocused.value = false;
  router.push(`/book/${bookId}`);
};

const clearSearch = () => {
  libraryStore.searchQuery = '';
  isSearchFocused.value = false;
  searchInputRef.value?.blur();
};

const handleSearchFocus = () => {
  isSearchFocused.value = true;
};

const handleSearchBlur = () => {
  window.setTimeout(() => {
    isSearchFocused.value = false;
  }, 200);
};

// Global keyboard shortcut (Cmd+K / Ctrl+K / Escape)
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (!authStore.isLoggedIn) return;
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    searchInputRef.value?.focus();
  }
  if (e.key === 'Escape') {
    clearSearch();
  }
};

let ctx: gsap.Context | null = null;

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown);
  ctx = gsap.context(() => {
    if (headerRef.value) {
      gsap.from(headerRef.value, {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
  }, headerRef.value || undefined);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown);
  if (ctx) ctx.revert();
});
</script>

<template>
  <header ref="headerRef" class="sticky top-0 left-0 right-0 h-16 bg-surface-primary/85 backdrop-blur-xl border-b border-border-subtle/70 z-40 flex items-center justify-between px-4 sm:px-8 transition-colors duration-300 gap-2 sm:gap-4">
    <!-- Left: Brand Logo & Navigation -->
    <div class="flex items-center gap-3 sm:gap-6 shrink-0">
      <!-- Mobile menu button (Only shown when not logged in) -->
      <button
        v-if="!authStore.isLoggedIn"
        type="button"
        class="md:hidden p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <span class="material-symbols-outlined text-[24px]">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
      </button>

      <!-- Logo links to /dashboard if logged in, otherwise to / -->
      <RouterLink :to="authStore.isLoggedIn ? '/dashboard' : '/'" class="flex items-center gap-2 text-primary font-bold text-xl tracking-tight group">
        <span class="material-symbols-outlined fill text-primary text-2xl group-hover:rotate-12 transition-transform duration-300">
          diamond
        </span>
        <span class="font-display-lg text-lg sm:text-xl text-on-surface font-extrabold hidden xs:inline">Genmoire</span>
      </RouterLink>

      <!-- Desktop Nav Links (Only shown when NOT logged in) -->
      <nav v-if="!authStore.isLoggedIn" class="hidden md:flex items-center gap-6">
        <RouterLink
          to="/"
          class="text-sm font-semibold transition-colors hover:text-primary"
          :class="$route.name === 'landing' ? 'text-primary font-bold border-b-2 border-primary py-1' : 'text-on-surface-variant'"
        >
          Beranda
        </RouterLink>
        <RouterLink
          to="/how-it-works"
          class="text-sm font-semibold transition-colors hover:text-primary"
          :class="$route.name === 'how-it-works' ? 'text-primary font-bold border-b-2 border-primary py-1' : 'text-on-surface-variant'"
        >
          Cara Kerja
        </RouterLink>
      </nav>
    </div>

    <!-- Middle: Centered Book Search Bar (Only shown when logged in) -->
    <div
      v-if="authStore.isLoggedIn"
      class="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl mx-2 sm:mx-4 relative z-30"
    >
      <!-- Dedicated Search Container Box with Rich Focus State -->
      <div
        class="relative flex items-center p-1 sm:p-1.5 rounded-2xl transition-all duration-300 border shadow-xs"
        :class="isSearchFocused
          ? 'bg-surface-elevated border-primary/60 ring-2 ring-primary/20 shadow-warm-md scale-[1.005]'
          : 'bg-surface-secondary/90 hover:bg-surface-secondary border-border-subtle/60 dark:border-transparent'"
      >
        <!-- Icon Badge Container -->
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200"
          :class="isSearchFocused ? 'bg-primary/15 text-primary' : 'bg-surface-container text-text-muted dark:text-[#9E9385]'"
        >
          <span
            class="material-symbols-outlined text-[19px] transition-transform duration-200"
            :class="{ 'scale-110 text-primary': isSearchFocused }"
          >
            search
          </span>
        </div>

        <!-- Input Field -->
        <input
          ref="searchInputRef"
          v-model="libraryStore.searchQuery"
          type="text"
          placeholder="Cari judul buku, penulis, genre..."
          class="w-full bg-transparent px-3 py-1 text-xs sm:text-sm text-on-surface dark:text-[#F3EFE6] placeholder:text-text-muted/80 outline-none font-medium"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
          @keydown.enter="handleSearchSubmit"
          @keydown.esc="clearSearch"
        />
        
        <!-- Actions in Container: Clear Button / Shortcut Badge -->
        <div class="flex items-center gap-1 pr-1.5 shrink-0">
          <button
            v-if="libraryStore.searchQuery"
            type="button"
            class="p-1.5 rounded-xl text-text-muted hover:text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer flex items-center justify-center"
            title="Bersihkan pencarian (Esc)"
            @click="clearSearch"
          >
            <span class="material-symbols-outlined text-base">close</span>
          </button>
          
          <!-- Shortcut Key Badge: Elevated Container, No Outline, Larger Text -->
          <kbd
            v-else
            class="hidden sm:inline-flex items-center gap-1 px-3 py-1 text-xs sm:text-sm font-mono font-bold text-text-muted dark:text-[#C5BBAF] bg-surface-container rounded-xl select-none transition-colors shadow-2xs"
            :class="{ 'bg-primary/20 text-primary': isSearchFocused }"
          >
            <span class="text-sm font-sans leading-none">⌘</span><span class="text-xs font-bold leading-none">K</span>
          </kbd>
        </div>
      </div>

      <!-- Live Search Results Dropdown (Solid Opaque Container, Never Transparent) -->
      <div
        v-if="isSearchFocused && libraryStore.searchQuery.trim()"
        class="absolute top-full mt-2.5 left-0 right-0 rounded-3xl bg-surface-elevated border border-border-subtle/60 dark:border-transparent shadow-2xl p-3 space-y-2 z-50 animate-fade-in max-h-96 overflow-y-auto"
      >
        <!-- Header inside dropdown container -->
        <div class="px-3 py-2 rounded-xl bg-surface-container border border-border-subtle/50 dark:border-transparent flex items-center justify-between shadow-2xs">
          <span class="text-xs font-sans font-bold uppercase tracking-wider text-on-surface dark:text-[#F3EFE6] flex items-center gap-1.5">
            <span class="material-symbols-outlined text-primary text-base">auto_stories</span>
            Hasil Pencarian Naskah
          </span>
          <span class="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary font-bold text-xs">
            {{ searchResults.length }} naskah
          </span>
        </div>

        <!-- Result Cards List -->
        <div v-if="searchResults.length > 0" class="space-y-1.5">
          <div
            v-for="book in searchResults"
            :key="book.id"
            class="p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-border-subtle/50 dark:border-transparent flex items-center gap-3.5 transition-all cursor-pointer group shadow-2xs"
            @mousedown="handleSelectBook(book.id)"
          >
            <img
              :src="book.coverUrl"
              :alt="book.title"
              class="w-11 h-15 object-cover rounded-lg shadow-xs shrink-0 border border-border-subtle/50 dark:border-transparent group-hover:scale-105 transition-transform"
            />
            <div class="flex-1 min-w-0">
              <p class="text-xs sm:text-sm font-bold text-on-surface dark:text-[#F3EFE6] truncate group-hover:text-primary transition-colors">
                {{ book.title }}
              </p>
              <p class="text-xs text-text-secondary dark:text-[#C5BBAF] truncate mt-0.5">
                {{ book.author }}
              </p>
              <div class="flex items-center gap-2 mt-1">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-sans font-bold bg-primary/10 text-primary border border-primary/20 dark:border-transparent">
                  {{ book.genres[0] }}
                </span>
                <span v-if="book.isUnlocked" class="text-[10px] font-sans font-semibold text-secondary flex items-center gap-0.5">
                  <span class="material-symbols-outlined text-xs">check_circle</span> Terbuka
                </span>
              </div>
            </div>
            <div class="w-8 h-8 rounded-lg bg-surface-secondary/80 group-hover:bg-primary/15 flex items-center justify-center text-text-muted group-hover:text-primary transition-colors shrink-0">
              <span class="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-6 text-center text-xs text-text-secondary dark:text-[#C5BBAF] rounded-2xl bg-surface-container border border-border-subtle/50 dark:border-transparent space-y-2">
          <span class="material-symbols-outlined text-text-muted text-3xl block mx-auto">search_off</span>
          <p class="font-medium">
            Tidak ada naskah yang cocok dengan "<strong class="text-on-surface dark:text-[#F3EFE6]">{{ libraryStore.searchQuery }}</strong>"
          </p>
        </div>

        <!-- Footer inside dropdown with direct action to scroll to collection -->
        <div class="pt-2 px-1 border-t border-border-subtle/60 dark:border-transparent flex items-center justify-between text-xs text-text-muted dark:text-[#9E9385]">
          <button
            type="button"
            class="hover:text-primary transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            @mousedown.prevent="handleSearchSubmit"
          >
            <span class="px-2 py-0.5 rounded-lg bg-surface-container text-xs font-mono font-bold text-on-surface dark:text-[#F3EFE6] shadow-2xs">↵ Enter</span>
            <span>Lompat ke list koleksi buku</span>
          </button>
          <span class="flex items-center gap-1">
            <kbd class="px-2 py-0.5 rounded-lg bg-surface-container text-xs font-mono font-bold text-on-surface dark:text-[#F3EFE6] shadow-2xs">Esc</kbd>
            <span>Tutup</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <!-- Theme Switcher with Tooltip -->
      <div class="relative group">
        <button
          type="button"
          class="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer flex items-center justify-center"
          :aria-label="themeStore.activeDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'"
          @click="themeStore.toggleTheme"
        >
          <span class="material-symbols-outlined text-[22px] text-primary transition-transform duration-300 group-hover:scale-110">
            {{ themeStore.activeDark ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>
        <!-- Hover Tooltip -->
        <div class="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-1 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap bg-surface-container-highest/95 backdrop-blur-sm text-on-surface text-[11px] font-sans font-medium px-2.5 py-1 rounded-lg shadow-warm-md border border-border-subtle flex items-center gap-1.5">
          <span class="material-symbols-outlined text-xs text-primary">{{ themeStore.activeDark ? 'light_mode' : 'dark_mode' }}</span>
          <span>{{ themeStore.activeDark ? 'Ganti ke Mode Terang (Warm Sepia)' : 'Ganti ke Mode Gelap (Warm Obsidian)' }}</span>
        </div>
      </div>

      <!-- If Logged In: Show Community and Profile IconButtons with Tooltips -->
      <template v-if="authStore.isLoggedIn">
        <!-- Community Tooltip Wrapper -->
        <div class="relative group">
          <RouterLink
            to="/community"
            class="p-2 sm:p-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer border flex items-center justify-center shadow-sm"
            :class="$route.name === 'community' ? 'bg-primary-container/20 border-primary text-primary' : 'border-border-subtle/60'"
            aria-label="Forum Komunitas"
          >
            <span class="material-symbols-outlined text-[22px] text-primary transition-transform duration-300 group-hover:scale-110">forum</span>
          </RouterLink>
          <!-- Hover Tooltip -->
          <div class="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-1 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap bg-surface-container-highest/95 backdrop-blur-sm text-on-surface text-[11px] font-sans font-medium px-2.5 py-1 rounded-lg shadow-warm-md border border-border-subtle flex items-center gap-1.5">
            <span class="material-symbols-outlined text-xs text-primary">forum</span>
            <span>Forum Komunitas</span>
          </div>
        </div>

        <!-- Profile Tooltip Wrapper -->
        <div class="relative group">
          <RouterLink
            to="/profile"
            class="p-2 sm:p-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer border flex items-center justify-center shadow-sm"
            :class="$route.name === 'profile' ? 'bg-primary-container/20 border-primary text-primary' : 'border-border-subtle/60'"
            aria-label="Profil Pembaca"
          >
            <span class="material-symbols-outlined text-[22px] text-primary transition-transform duration-300 group-hover:scale-110">person</span>
          </RouterLink>
          <!-- Hover Tooltip (Right-aligned to avoid viewport overflow) -->
          <div class="absolute top-full mt-2 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-1 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap bg-surface-container-highest/95 backdrop-blur-sm text-on-surface text-[11px] font-sans font-medium px-2.5 py-1 rounded-lg shadow-warm-md border border-border-subtle flex items-center gap-1.5">
            <span class="material-symbols-outlined text-xs text-primary">person</span>
            <span>Profil Pembaca</span>
          </div>
        </div>
      </template>

      <!-- If Guest (Not Logged In): Show larger, improved Masuk button -->
      <template v-else>
        <RouterLink to="/auth">
          <GButton size="md" variant="primary" icon="login" rounded class="px-5 font-bold shadow-warm-sm">
            Masuk
          </GButton>
        </RouterLink>
      </template>
    </div>

    <!-- Mobile Dropdown Navigation (Only for guests) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="!authStore.isLoggedIn && isMobileMenuOpen"
        class="md:hidden absolute top-16 left-0 right-0 z-50 border-t border-border-subtle bg-surface-secondary/95 backdrop-blur-xl px-4 py-3 space-y-1 shadow-warm-lg"
      >
        <RouterLink
          to="/"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-semibold"
          :class="$route.name === 'landing' ? 'bg-primary-container/20 text-primary font-bold' : 'text-on-surface hover:bg-surface-container'"
          @click="isMobileMenuOpen = false"
        >
          <span class="material-symbols-outlined text-[20px]">home</span> Beranda
        </RouterLink>
        <RouterLink
          to="/how-it-works"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-semibold"
          :class="$route.name === 'how-it-works' ? 'bg-primary-container/20 text-primary font-bold' : 'text-on-surface hover:bg-surface-container'"
          @click="isMobileMenuOpen = false"
        >
          <span class="material-symbols-outlined text-[20px]">hub</span> Cara Kerja
        </RouterLink>
        <RouterLink
          to="/auth"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-semibold text-primary hover:bg-surface-container"
          @click="isMobileMenuOpen = false"
        >
          <span class="material-symbols-outlined text-[20px]">login</span> Masuk / Daftar
        </RouterLink>
      </div>
    </Transition>
  </header>
</template>
