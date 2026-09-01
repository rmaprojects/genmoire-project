<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { gsap } from 'gsap';
import { useThemeStore } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLibraryStore } from '@/stores/useLibraryStore';
import GButton from '@/components/common/GButton.vue';
import GModal from '@/components/common/GModal.vue';

const route = useRoute();
const router = useRouter();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const libraryStore = useLibraryStore();

const headerRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const mobileSearchInputRef = ref<HTMLInputElement | null>(null);
const isMobileMenuOpen = ref<boolean>(false);
const isMobileSearchOpen = ref<boolean>(false);
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
  isMobileSearchOpen.value = false;
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
  isMobileSearchOpen.value = false;
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

const openMobileSearch = () => {
  isMobileSearchOpen.value = true;
  setTimeout(() => {
    mobileSearchInputRef.value?.focus();
  }, 200);
};

// Global keyboard shortcut (Cmd+K / Ctrl+K / Escape)
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (!authStore.isLoggedIn) return;
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (window.innerWidth >= 1024) {
      searchInputRef.value?.focus();
    } else {
      openMobileSearch();
    }
  }
  if (e.key === 'Escape') {
    clearSearch();
    isMobileSearchOpen.value = false;
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
  <header ref="headerRef" class="sticky top-0 left-0 right-0 h-16 bg-surface-primary/90 dark:bg-[#171513]/90 backdrop-blur-xl border-b border-border-subtle/70 dark:border-transparent z-40 flex items-center justify-between px-4 sm:px-8 transition-colors duration-300 gap-2 sm:gap-4 dark:shadow-md">
    <!-- Left: Brand Logo & Navigation -->
    <div class="flex items-center gap-3 sm:gap-6 shrink-0">
      <!-- Mobile menu button (Only shown when not logged in) -->
      <button
        v-if="!authStore.isLoggedIn"
        type="button"
        class="md:hidden w-10 h-10 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <span class="material-symbols-outlined text-[24px]">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
      </button>

      <!-- Logo links to /dashboard if logged in, otherwise to / -->
      <RouterLink :to="authStore.isLoggedIn ? '/dashboard' : '/'" class="flex items-center gap-2 text-primary font-bold text-xl tracking-tight group">
        <img src="/Genmoire.png" alt="Logo" class="w-10 h-10 rounded-xl" />
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

      <!-- Desktop Logged-in Nav Links (lg+) -->
      <nav v-if="authStore.isLoggedIn" class="hidden lg:flex items-center gap-5 ml-4">
        <RouterLink
          to="/dashboard"
          class="text-xs font-bold transition-colors hover:text-primary flex items-center gap-1 py-1"
          :class="$route.name === 'dashboard' ? 'text-primary font-extrabold' : 'text-text-secondary dark:text-[#C5BBAF]'"
        >
          <span class="material-symbols-outlined text-base">dashboard</span> Dasbor
        </RouterLink>
        <RouterLink
          to="/tiers"
          class="text-xs font-bold transition-colors hover:text-primary flex items-center gap-1 py-1"
          :class="$route.name === 'tiers' ? 'text-primary font-extrabold' : 'text-text-secondary dark:text-[#C5BBAF]'"
        >
          <span class="material-symbols-outlined text-base">military_tech</span> Pangkat
        </RouterLink>
      </nav>
    </div>

    <!-- Middle: Centered Book Search Bar (Desktop lg+) -->
    <div
      v-if="authStore.isLoggedIn"
      class="hidden lg:block flex-1 max-w-md xl:max-w-lg mx-4 relative z-30"
    >
      <div
        class="relative flex items-center p-1.5 rounded-2xl transition-all duration-300 border border-border-subtle/60 dark:border-transparent shadow-xs dark:shadow-md"
        :class="isSearchFocused
          ? 'bg-surface-elevated dark:bg-[#25201C] ring-2 ring-primary/40 scale-[1.005]'
          : 'bg-surface-secondary/90 dark:bg-[#221E1A] hover:bg-surface-secondary'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200"
          :class="isSearchFocused ? 'bg-primary/15 text-primary' : 'bg-surface-container dark:bg-[#2C2723] text-text-muted dark:text-[#9E9385]'"
        >
          <span
            class="material-symbols-outlined text-[19px] transition-transform duration-200"
            :class="{ 'scale-110 text-primary': isSearchFocused }"
          >
            search
          </span>
        </div>

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
          
          <kbd
            v-else
            class="inline-flex items-center gap-1 px-3 py-1 text-xs font-mono font-bold text-text-muted dark:text-[#C5BBAF] bg-surface-container dark:bg-[#2C2723] rounded-xl select-none transition-colors shadow-2xs"
            :class="{ 'bg-primary/20 text-primary': isSearchFocused }"
          >
            <span class="text-sm font-sans leading-none">⌘</span><span class="text-xs font-bold leading-none">K</span>
          </kbd>
        </div>
      </div>

      <!-- Live Search Results Dropdown Desktop -->
      <div
        v-if="isSearchFocused && libraryStore.searchQuery.trim()"
        class="absolute top-full mt-2.5 left-0 right-0 rounded-3xl bg-surface-elevated dark:bg-[#25201C] border border-border-subtle/60 dark:border-transparent shadow-2xl p-3 space-y-2 z-50 animate-fade-in max-h-96 overflow-y-auto"
      >
        <div class="px-3 py-2 rounded-xl bg-surface-container dark:bg-[#1E1B18] flex items-center justify-between shadow-2xs">
          <span class="text-xs font-sans font-bold uppercase tracking-wider text-on-surface dark:text-[#F3EFE6] flex items-center gap-1.5">
            <span class="material-symbols-outlined text-primary text-base">auto_stories</span>
            Hasil Pencarian Buku
          </span>
          <span class="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary font-bold text-xs">
            {{ searchResults.length }} buku
          </span>
        </div>

        <div v-if="searchResults.length > 0" class="space-y-1.5">
          <div
            v-for="book in searchResults"
            :key="book.id"
            class="p-3 rounded-2xl bg-surface-container dark:bg-[#1E1B18] hover:bg-surface-container-high dark:hover:bg-[#2C2723] flex items-center gap-3.5 transition-all cursor-pointer group shadow-2xs"
            @mousedown="handleSelectBook(book.id)"
          >
            <img
              :src="book.coverUrl"
              :alt="book.title"
              class="w-10 h-14 object-cover rounded-lg shadow-xs shrink-0 group-hover:scale-105 transition-transform"
            />
            <div class="flex-1 min-w-0">
              <p class="text-xs sm:text-sm font-bold text-on-surface dark:text-[#F3EFE6] truncate group-hover:text-primary transition-colors">
                {{ book.title }}
              </p>
              <p class="text-xs text-text-secondary dark:text-[#C5BBAF] truncate mt-0.5">
                {{ book.author }}
              </p>
              <div class="flex items-center gap-2 mt-1">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-sans font-bold bg-primary/10 text-primary">
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

        <div v-else class="p-6 text-center text-xs text-text-secondary dark:text-[#C5BBAF] rounded-2xl bg-surface-container dark:bg-[#1E1B18] space-y-2">
          <span class="material-symbols-outlined text-text-muted text-3xl block mx-auto">search_off</span>
          <p class="font-medium">
            Tidak ada buku yang cocok dengan "<strong class="text-on-surface dark:text-[#F3EFE6]">{{ libraryStore.searchQuery }}</strong>"
          </p>
        </div>
      </div>
    </div>

    <!-- Right: Actions & Mobile Search Icon -->
    <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
      <!-- Mobile Search Icon Button (< lg) -->
      <button
        v-if="authStore.isLoggedIn"
        type="button"
        class="lg:hidden w-10 h-10 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
        aria-label="Cari Buku"
        @click="openMobileSearch"
      >
        <span class="material-symbols-outlined text-[22px] text-primary">search</span>
      </button>

      <!-- Theme Switcher -->
      <button
        type="button"
        class="w-10 h-10 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
        :aria-label="themeStore.activeDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'"
        @click="themeStore.toggleTheme"
      >
        <span class="material-symbols-outlined text-[22px] text-primary transition-transform duration-300 hover:scale-110">
          {{ themeStore.activeDark ? 'light_mode' : 'dark_mode' }}
        </span>
      </button>

      <!-- If Logged In: Show Community and Profile IconButtons (lg+) -->
      <template v-if="authStore.isLoggedIn">
        <RouterLink
          v-if="$route.meta.showHeader !== true"
          to="/community"
          class="hidden sm:flex w-10 h-10 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container dark:hover:bg-white/10 transition-colors cursor-pointer items-center justify-center shadow-xs"
          :class="$route.name === 'community' ? 'bg-primary-container/20 text-primary font-bold' : ''"
          aria-label="Forum Komunitas"
        >
          <span class="material-symbols-outlined text-[22px] text-primary">forum</span>
        </RouterLink>

        <RouterLink
          to="/profile"
          class="flex items-center gap-2 p-1 sm:pr-3 rounded-full hover:bg-surface-container dark:hover:bg-white/10 transition-colors cursor-pointer"
          :class="$route.name === 'profile' ? 'ring-2 ring-primary/40' : ''"
          aria-label="Profil Pembaca"
        >
          <img
            :src="authStore.currentUser.avatar"
            :alt="authStore.currentUser.name"
            class="w-8 h-8 rounded-full object-cover border border-primary/40"
          />
          <span class="hidden md:inline text-xs font-bold text-on-surface dark:text-[#F3EFE6] max-w-[90px] truncate">
            {{ authStore.currentUser.name }}
          </span>
        </RouterLink>
      </template>

      <!-- If Guest: Show Masuk button -->
      <template v-else>
        <RouterLink to="/auth">
          <GButton size="md" variant="primary" icon="login" rounded class="px-5 font-bold shadow-warm-sm">
            Masuk
          </GButton>
        </RouterLink>
      </template>
    </div>

    <!-- Mobile Dropdown Navigation (Guest Only) -->
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
        class="md:hidden absolute top-16 left-0 right-0 z-50 border-t border-border-subtle/70 dark:border-transparent bg-surface-secondary/95 dark:bg-[#1E1B18]/95 backdrop-blur-xl px-4 py-3 space-y-1 shadow-warm-lg dark:shadow-2xl"
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

    <!-- Full-Screen / Bottom Sheet Search Modal on Mobile (< lg) -->
    <GModal
      v-model="isMobileSearchOpen"
      title="Cari Buku di Perpustakaan"
      icon="search"
      maxWidth="md"
    >
      <div class="space-y-4">
        <div class="relative flex items-center p-2 rounded-2xl bg-surface-container dark:bg-[#25201C] shadow-inner">
          <span class="material-symbols-outlined text-primary text-xl ml-2">search</span>
          <input
            ref="mobileSearchInputRef"
            v-model="libraryStore.searchQuery"
            type="text"
            placeholder="Ketik judul, penulis, atau genre..."
            class="w-full bg-transparent px-3 py-2 text-sm text-on-surface dark:text-[#F3EFE6] outline-none font-medium"
            @keydown.enter="handleSearchSubmit"
          />
          <button
            v-if="libraryStore.searchQuery"
            type="button"
            class="p-1.5 rounded-xl text-text-muted hover:text-on-surface cursor-pointer"
            @click="clearSearch"
          >
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <!-- Search Results List in Modal -->
        <div v-if="libraryStore.searchQuery.trim()" class="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
          <div
            v-for="book in searchResults"
            :key="book.id"
            class="p-3 rounded-2xl bg-surface-container/70 dark:bg-[#25201C] hover:bg-surface-container-high flex items-center gap-3.5 transition-all cursor-pointer shadow-xs"
            @click="handleSelectBook(book.id)"
          >
            <img :src="book.coverUrl" :alt="book.title" class="w-10 h-14 object-cover rounded-lg shadow-xs shrink-0" />
            <div class="flex-1 min-w-0 text-left">
              <p class="text-sm font-bold text-on-surface dark:text-[#F3EFE6] truncate">{{ book.title }}</p>
              <p class="text-xs text-text-secondary dark:text-[#C5BBAF] truncate">{{ book.author }}</p>
              <span class="text-[10px] font-sans font-bold text-primary px-2 py-0.5 rounded bg-primary/10 inline-block mt-1">
                {{ book.genres[0] }}
              </span>
            </div>
            <span class="material-symbols-outlined text-primary text-lg shrink-0">arrow_forward</span>
          </div>

          <div v-if="searchResults.length === 0" class="p-6 text-center text-xs text-text-secondary dark:text-[#C5BBAF]">
            Tidak ada buku yang cocok dengan "{{ libraryStore.searchQuery }}".
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <GButton variant="primary" size="md" icon="search" @click="handleSearchSubmit">
            Lihat Semua di Dasbor
          </GButton>
        </div>
      </div>
    </GModal>
  </header>

  <!-- Sticky/Floating Mobile Bottom Navigation Bar (< lg, Logged In Only) -->
  <nav
    v-if="authStore.isLoggedIn && $route.meta.showHeader !== false"
    class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-primary/95 dark:bg-[#171513]/95 backdrop-blur-xl border-t border-border-subtle/70 dark:border-transparent py-1.5 px-3 flex items-center justify-around shadow-2xl safe-area-bottom"
  >
    <!-- Dasbor -->
    <RouterLink
      to="/dashboard"
      class="flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all"
      :class="$route.name === 'dashboard' ? 'text-primary font-bold' : 'text-text-muted dark:text-[#9E9385] hover:text-on-surface'"
    >
      <span class="material-symbols-outlined text-[22px]" :class="{ 'fill': $route.name === 'dashboard' }">dashboard</span>
      <span class="text-[10px] font-sans font-semibold mt-0.5">Dasbor</span>
    </RouterLink>

    

    <!-- Komunitas -->
    <RouterLink
      to="/community"
      class="flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all"
      :class="$route.name === 'community' ? 'text-primary font-bold' : 'text-text-muted dark:text-[#9E9385] hover:text-on-surface'"
    >
      <span class="material-symbols-outlined text-[22px]" :class="{ 'fill': $route.name === 'community' }">forum</span>
      <span class="text-[10px] font-sans font-semibold mt-0.5">Komunitas</span>
    </RouterLink>

    <!-- Profil -->
    <RouterLink
      to="/profile"
      class="flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all"
      :class="$route.name === 'profile' ? 'text-primary font-bold' : 'text-text-muted dark:text-[#9E9385] hover:text-on-surface'"
    >
      <span class="material-symbols-outlined text-[22px]" :class="{ 'fill': $route.name === 'profile' }">person</span>
      <span class="text-[10px] font-sans font-semibold mt-0.5">Profil</span>
    </RouterLink>
  </nav>
</template>
