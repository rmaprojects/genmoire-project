<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { gsap } from 'gsap';
import { useForumStore } from '@/stores/useForumStore';
import type { ForumThread } from '@/types/forum';
import GButton from '@/components/common/GButton.vue';
import GChip from '@/components/common/GChip.vue';
import GModal from '@/components/common/GModal.vue';
import GInput from '@/components/common/GInput.vue';

const forumStore = useForumStore();

const forumContainerRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);
const chipsRef = ref<HTMLElement | null>(null);
const threadListRef = ref<HTMLElement | null>(null);
const activeThreadRef = ref<HTMLElement | null>(null);
const commentListRef = ref<HTMLElement | null>(null);

const categories = ['All', 'Discussions', 'Theories', 'Character Analysis', 'AI Explains Q&A'];

const newCommentText = ref<string>('');
const newThreadTitle = ref<string>('');
const newThreadCategory = ref<ForumThread['category']>('Discussions');
const newThreadContent = ref<string>('');
const isSubmitting = ref<boolean>(false);

// Mobile: track whether detail view is open (< lg)
const isMobileDetailOpen = ref<boolean>(false);

const openThreadMobile = (threadId: string) => {
  forumStore.selectThread(threadId);
  isMobileDetailOpen.value = true;
  nextTick(() => {
    if (activeThreadRef.value) {
      activeThreadRef.value.scrollTop = 0;
    }
  });
};

const closeMobileDetail = () => {
  isMobileDetailOpen.value = false;
  nextTick(() => {
    if (threadListRef.value) {
      gsap.fromTo(
        threadListRef.value.children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.04, duration: 0.3, ease: 'power2.out', clearProps: 'opacity,transform' }
      );
    }
  });
};

// Helper to format consistent Tier Badges across Forum
const getTierBadgeInfo = (tierTitle?: string) => {
  const lower = (tierTitle || '').toLowerCase();
  if (lower.includes('loremaster') || lower.includes('tier 5')) {
    return { label: tierTitle || 'Loremaster', icon: 'military_tech', badgeClass: 'bg-[#7F1D1D] text-[#FEE2E2] border-0' };
  }
  if (lower.includes('lorekeeper') || lower.includes('tier 4')) {
    return { label: tierTitle || 'Lorekeeper', icon: 'auto_stories', badgeClass: 'bg-[#581C87] text-[#F3E8FF] border-0' };
  }
  if (lower.includes('scholar') || lower.includes('tier 3')) {
    return { label: tierTitle || 'Scholar', icon: 'history_edu', badgeClass: 'bg-[#92400E] text-[#FEF3C7] border-0' };
  }
  if (lower.includes('apprentice') || lower.includes('tier 2')) {
    return { label: tierTitle || 'Apprentice', icon: 'school', badgeClass: 'bg-[#455A64] text-[#ECEFF1] border-0' };
  }
  if (lower.includes('novice') || lower.includes('tier 1')) {
    return { label: tierTitle || 'Novice', icon: 'edit_note', badgeClass: 'bg-[#5D4037] text-[#D7CCC8] border-0' };
  }
  return { label: tierTitle || 'Pembaca Terverifikasi', icon: 'verified', badgeClass: 'bg-primary/15 text-primary border border-primary/20 dark:border-transparent' };
};

let ctx: gsap.Context | null = null;

onMounted(() => {
  nextTick(() => {
    ctx = gsap.context(() => {
      if (headerRef.value) {
        gsap.from(headerRef.value, { opacity: 0, y: -20, duration: 0.6, ease: 'power3.out', clearProps: 'opacity,transform' });
      }
      if (chipsRef.value) {
        gsap.from(chipsRef.value.children, { opacity: 0, x: -15, stagger: 0.04, duration: 0.45, ease: 'power2.out', clearProps: 'opacity,transform' });
      }
      if (threadListRef.value) {
        gsap.from(threadListRef.value.children, { opacity: 0, y: 20, stagger: 0.06, duration: 0.5, ease: 'power3.out', clearProps: 'opacity,transform' });
      }
      if (activeThreadRef.value) {
        gsap.from(activeThreadRef.value, { opacity: 0, x: 25, duration: 0.6, ease: 'power3.out', delay: 0.1, clearProps: 'opacity,transform' });
      }
    }, forumContainerRef.value || undefined);
  });
});

watch(
  () => forumStore.activeThreadId,
  () => {
    nextTick(() => {
      if (activeThreadRef.value) {
        gsap.fromTo(
          activeThreadRef.value,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'opacity,transform' }
        );
      }
    });
  }
);

watch(
  () => forumStore.activeCategory,
  () => {
    nextTick(() => {
      if (threadListRef.value) {
        gsap.fromTo(
          threadListRef.value.children,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, stagger: 0.04, duration: 0.3, ease: 'power2.out', clearProps: 'opacity,transform' }
        );
      }
    });
  }
);

onUnmounted(() => {
  if (ctx) ctx.revert();
});

const handleAddComment = () => {
  if (!newCommentText.value.trim() || !forumStore.activeThread) return;
  isSubmitting.value = true;
  setTimeout(() => {
    forumStore.addComment(forumStore.activeThread!.id, newCommentText.value);
    newCommentText.value = '';
    isSubmitting.value = false;
    // Scroll to bottom of comments after adding
    nextTick(() => {
      if (commentListRef.value) {
        commentListRef.value.scrollTop = commentListRef.value.scrollHeight;
      }
    });
  }, 300);
};

const handleCreateThread = () => {
  if (!newThreadTitle.value.trim() || !newThreadContent.value.trim()) return;
  isSubmitting.value = true;
  setTimeout(() => {
    forumStore.addThread({
      title: newThreadTitle.value,
      category: newThreadCategory.value,
      content: newThreadContent.value,
      bookTitle: 'Chronicles of Aethelgard',
    });
    newThreadTitle.value = '';
    newThreadContent.value = '';
    forumStore.isPostModalOpen = false;
    isSubmitting.value = false;
  }, 400);
};
</script>

<template>
  <div ref="forumContainerRef" class="max-w-container-max mx-auto pb-28 lg:pb-16">

    <!-- =============================================
         MOBILE VIEW: Feed List (< lg) 
         ============================================= -->
    <div
      :class="isMobileDetailOpen ? 'hidden' : 'block'"
      class="lg:hidden"
    >
      <!-- Mobile Header (compact) -->
      <div ref="headerRef" class="px-4 pt-6 pb-4 flex items-center justify-between gap-3 border-b border-border-subtle/70 sticky top-0 z-20 bg-surface-primary/95 backdrop-blur-md">
        <div class="min-w-0">
          <h1 class="font-display-lg text-xl font-extrabold text-on-surface leading-tight truncate">Forum Diskusi Buku</h1>
          <p class="text-xs text-text-secondary mt-0.5 leading-snug truncate">Bahas cerita, teori, dan analisis karakter.</p>
        </div>
      </div>

      <!-- Mobile Horizontal Filter Chips (no-scrollbar) -->
      <div
        ref="chipsRef"
        class="flex items-center gap-2 overflow-x-auto px-4 py-3 border-b border-border-subtle/60 sticky top-[4.25rem] z-10 bg-surface-primary/90 backdrop-blur-sm"
        style="-webkit-overflow-scrolling: touch; scrollbar-width: none;"
      >
        <GChip
          v-for="cat in categories"
          :key="cat"
          :active="forumStore.activeCategory === cat"
          class="shrink-0"
          @click="forumStore.activeCategory = cat"
        >
          {{ cat === 'All' ? 'Semua' : cat }}
        </GChip>
      </div>

      <!-- Mobile Thread Feed List -->
      <div ref="threadListRef" class="divide-y divide-border-subtle/40">
        <div
          v-for="thread in forumStore.filteredThreads"
          :key="thread.id"
          class="flex items-start gap-3.5 px-4 py-4 cursor-pointer hover:bg-surface-container/60 active:bg-surface-container transition-colors"
          role="button"
          :aria-label="`Buka diskusi: ${thread.title}`"
          @click="openThreadMobile(thread.id)"
        >
          <!-- Author Avatar -->
          <img
            :src="thread.authorAvatar"
            :alt="thread.authorName"
            class="w-11 h-11 rounded-full object-cover shrink-0 border border-primary/20 dark:border-transparent mt-0.5"
          />

          <!-- Thread Content -->
          <div class="flex-1 min-w-0 space-y-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-primary/10 text-primary border border-primary/20 dark:border-transparent leading-none">
                {{ thread.category }}
              </span>
              <span class="text-[10px] font-sans text-text-muted">{{ thread.timestamp }}</span>
            </div>

            <h3 class="text-base font-bold text-on-surface leading-snug line-clamp-2">
              {{ thread.title }}
            </h3>

            <p class="text-sm text-text-secondary line-clamp-2 leading-snug">{{ thread.content }}</p>

            <div class="flex items-center justify-between text-xs text-text-muted pt-1">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="font-semibold text-on-surface truncate">{{ thread.authorName }}</span>
                <span
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold leading-none shrink-0"
                  :class="getTierBadgeInfo(thread.authorTier).badgeClass"
                >
                  <span class="material-symbols-outlined text-[11px]">{{ getTierBadgeInfo(thread.authorTier).icon }}</span>
                </span>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">chat_bubble</span>
                  {{ thread.comments.length }}
                </span>
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">favorite</span>
                  {{ thread.likesCount }}
                </span>
                <span class="material-symbols-outlined text-[16px] text-text-muted">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile FAB: Buat Diskusi Baru -->
      <button
        type="button"
        class="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-primary text-on-primary shadow-2xl flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
        aria-label="Buat Diskusi Baru"
        @click="forumStore.isPostModalOpen = true"
      >
        <span class="material-symbols-outlined text-2xl">edit_square</span>
      </button>
    </div>


    <!-- =============================================
         MOBILE VIEW: Thread Detail Full Screen (< lg)
         ============================================= -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-250 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-if="isMobileDetailOpen && forumStore.activeThread"
        class="fixed inset-0 z-30 lg:hidden bg-surface-primary flex flex-col"
      >
        <!-- Sticky Header Bar with Back Button -->
        <div class="flex items-center gap-3 px-4 py-3 border-b border-border-subtle/70 bg-surface-primary/95 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <button
            type="button"
            class="min-w-[44px] h-11 flex items-center justify-center rounded-xl text-on-surface hover:bg-surface-container active:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="Kembali ke daftar diskusi"
            @click="closeMobileDetail"
          >
            <span class="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-text-secondary uppercase tracking-wider leading-none mb-0.5">
              {{ forumStore.activeThread.category }}
            </p>
            <p class="text-sm font-bold text-on-surface truncate leading-snug">
              {{ forumStore.activeThread.title }}
            </p>
          </div>
        </div>

        <!-- Scrollable Thread Content (with bottom padding for sticky bar) -->
        <div ref="activeThreadRef" class="flex-1 pb-28">
          <div class="px-4 py-5 space-y-5">
            <!-- Thread Meta: Author row -->
            <div class="flex items-center gap-3">
              <img
                :src="forumStore.activeThread.authorAvatar"
                :alt="forumStore.activeThread.authorName"
                class="w-11 h-11 rounded-full object-cover border-2 border-primary/30 dark:border-transparent shadow-xs shrink-0"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="text-sm font-bold text-on-surface">{{ forumStore.activeThread.authorName }}</p>
                  <span
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    :class="getTierBadgeInfo(forumStore.activeThread.authorTier).badgeClass"
                  >
                    <span class="material-symbols-outlined text-[11px]">{{ getTierBadgeInfo(forumStore.activeThread.authorTier).icon }}</span>
                    {{ getTierBadgeInfo(forumStore.activeThread.authorTier).label }}
                  </span>
                </div>
                <p class="text-xs text-text-muted mt-0.5">{{ forumStore.activeThread.timestamp }}</p>
              </div>
            </div>

            <!-- Thread Title -->
            <h2 class="text-lg font-extrabold text-on-surface leading-tight">
              {{ forumStore.activeThread.title }}
            </h2>

            <!-- Thread Content -->
            <div class="text-sm text-on-surface leading-relaxed whitespace-pre-line">
              {{ forumStore.activeThread.content }}
            </div>

            <!-- Like / Stats Bar -->
            <div class="flex items-center gap-3 py-2.5 border-y border-border-subtle/60 dark:border-transparent">
              <button
                type="button"
                class="h-11 px-4 rounded-full flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer border"
                :class="forumStore.activeThread.isLikedByUser
                  ? 'bg-error/15 text-error border-error/30'
                  : 'bg-surface-container text-text-secondary border-border-subtle/60 dark:border-transparent hover:bg-surface-container-high'"
                @click="forumStore.toggleLikeThread(forumStore.activeThread.id)"
              >
                <span class="material-symbols-outlined text-[18px]" :class="{ 'fill': forumStore.activeThread.isLikedByUser }">favorite</span>
                {{ forumStore.activeThread.likesCount }} Suka
              </button>
              <span class="text-xs text-text-muted ml-auto">{{ forumStore.activeThread.comments.length }} Komentar</span>
            </div>

            <!-- Comments List -->
            <div class="space-y-3">
              <h4 class="text-sm font-bold text-on-surface flex items-center gap-1.5">
                <span class="material-symbols-outlined text-primary text-lg">forum</span>
                Diskusi Pembaca
              </h4>

              <div
                v-for="comment in forumStore.activeThread.comments"
                :key="comment.id"
                class="p-3.5 rounded-2xl bg-surface-container border border-border-subtle/50 dark:border-transparent space-y-2"
              >
                <div class="flex items-center gap-2 text-xs">
                  <img :src="comment.authorAvatar" :alt="comment.authorName" class="w-7 h-7 rounded-full object-cover border border-primary/20 dark:border-transparent shrink-0" />
                  <span class="font-bold text-on-surface">{{ comment.authorName }}</span>
                  <span
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold"
                    :class="getTierBadgeInfo(comment.authorTier).badgeClass"
                  >
                    <span class="material-symbols-outlined text-[11px]">{{ getTierBadgeInfo(comment.authorTier).icon }}</span>
                  </span>
                  <span class="text-text-muted ml-auto font-sans">{{ comment.timestamp }}</span>
                </div>
                <p class="text-sm text-text-secondary leading-relaxed pl-9">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Bottom Comment Input Bar -->
        <div class="fixed bottom-0 left-0 right-0 px-3 py-3 bg-surface-primary/95 backdrop-blur-md border-t border-border-subtle/70 z-20 flex items-center gap-2.5">
          <input
            v-model="newCommentText"
            type="text"
            placeholder="Tulis tanggapan..."
            class="flex-1 bg-surface-container border border-border-subtle/60 dark:border-transparent rounded-2xl px-4 py-3 text-sm text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            @keydown.enter="handleAddComment"
          />
          <button
            type="button"
            class="h-11 w-11 rounded-full bg-primary text-on-primary flex items-center justify-center transition-transform active:scale-95 shrink-0 cursor-pointer disabled:opacity-50"
            :disabled="!newCommentText.trim() || isSubmitting"
            @click="handleAddComment"
          >
            <span class="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </div>
    </Transition>


    <!-- =============================================
         DESKTOP VIEW: 2-Column Layout (lg+)
         ============================================= -->
    <div class="hidden lg:block px-8 py-10 space-y-8">
      <!-- Desktop Header -->
      <div ref="headerRef" class="flex items-center justify-between gap-4 pb-6 border-b border-border-subtle/70">
        <div>
          <h1 class="font-display-lg text-4xl xl:text-5xl font-extrabold text-on-surface">Forum Diskusi Buku</h1>
          <p class="text-base text-text-secondary mt-1">Bahas alur cerita, analisis karakter, dan bertukar ulasan bersama sesama pembaca.</p>
        </div>
        <GButton variant="primary" size="md" icon="edit_square" rounded @click="forumStore.isPostModalOpen = true">
          Buat Diskusi Baru
        </GButton>
      </div>

      <!-- Desktop Category Filter Chips -->
      <div ref="chipsRef" class="flex items-center gap-2 overflow-x-auto pb-1">
        <GChip
          v-for="cat in categories"
          :key="cat"
          :active="forumStore.activeCategory === cat"
          @click="forumStore.activeCategory = cat"
        >
          {{ cat === 'All' ? 'Semua Kategori' : cat }}
        </GChip>
      </div>

      <!-- Desktop 2-Column Grid -->
      <div class="grid grid-cols-12 gap-8 items-start pb-10">

        <!-- Left: Thread List -->
        <div ref="threadListRef" class="col-span-5 space-y-3.5">
          <div
            v-for="thread in forumStore.filteredThreads"
            :key="thread.id"
            class="p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none"
            :class="forumStore.activeThreadId === thread.id
              ? 'bg-surface-secondary border-primary shadow-warm-md ring-1 ring-primary/40'
              : 'bg-surface-container hover:bg-surface-container-high border-border-subtle/60 dark:border-transparent shadow-2xs'"
            @click="forumStore.selectThread(thread.id)"
          >
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-sans font-bold bg-primary/10 text-primary border border-primary/20 dark:border-transparent">
                  {{ thread.category }}
                </span>
                <span class="text-xs font-sans text-text-muted">{{ thread.timestamp }}</span>
              </div>
              <h3 class="font-display-lg text-base xl:text-lg font-bold text-on-surface leading-snug line-clamp-2 mb-2">{{ thread.title }}</h3>
              <p class="text-sm text-text-secondary line-clamp-2 mb-3 leading-relaxed">{{ thread.content }}</p>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-border-subtle/50 dark:border-transparent text-xs text-text-muted gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <img :src="thread.authorAvatar" :alt="thread.authorName" class="w-6 h-6 rounded-full object-cover shrink-0 border border-primary/20 dark:border-transparent" />
                <span class="font-medium text-on-surface truncate">{{ thread.authorName }}</span>
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-bold shrink-0 shadow-2xs"
                  :class="getTierBadgeInfo(thread.authorTier).badgeClass"
                >
                  <span class="material-symbols-outlined text-[12px]">{{ getTierBadgeInfo(thread.authorTier).icon }}</span>
                  {{ getTierBadgeInfo(thread.authorTier).label }}
                </span>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[15px]">chat_bubble</span>{{ thread.comments.length }}
                </span>
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[15px]">favorite</span>{{ thread.likesCount }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Active Thread Detail -->
        <div
          v-if="forumStore.activeThread"
          ref="activeThreadRef"
          class="col-span-7 bg-surface-secondary rounded-3xl p-7 xl:p-9 border border-border-subtle/60 dark:border-transparent shadow-warm-lg space-y-5 sticky top-24"
          style="max-height: calc(100vh - 8rem); overflow-y: auto;"
        >
          <!-- Thread Header -->
          <div class="space-y-3 pb-4 border-b border-border-subtle/60 dark:border-transparent">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-full text-xs font-sans font-bold uppercase bg-primary-container/20 text-primary border border-primary/30 dark:border-transparent">
                {{ forumStore.activeThread.category }}
              </span>
              <span class="text-xs font-sans text-text-muted">{{ forumStore.activeThread.timestamp }}</span>
            </div>

            <h2 class="font-display-lg text-2xl font-extrabold text-on-surface leading-tight">
              {{ forumStore.activeThread.title }}
            </h2>

            <div class="flex items-center gap-3 pt-1">
              <img
                :src="forumStore.activeThread.authorAvatar"
                :alt="forumStore.activeThread.authorName"
                class="w-11 h-11 rounded-full object-cover border-2 border-primary/30 dark:border-transparent shadow-xs"
              />
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="text-sm font-bold text-on-surface">{{ forumStore.activeThread.authorName }}</p>
                  <span
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold shadow-inner"
                    :class="getTierBadgeInfo(forumStore.activeThread.authorTier).badgeClass"
                  >
                    <span class="material-symbols-outlined text-[13px]">{{ getTierBadgeInfo(forumStore.activeThread.authorTier).icon }}</span>
                    {{ getTierBadgeInfo(forumStore.activeThread.authorTier).label }}
                  </span>
                </div>
                <p class="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                  <span class="material-symbols-outlined text-[14px] text-emerald-500">verified</span>
                  Pembaca Terverifikasi
                </p>
              </div>
            </div>
          </div>

          <!-- Thread Content -->
          <div class="font-ui text-base text-on-surface leading-relaxed whitespace-pre-line py-1">
            {{ forumStore.activeThread.content }}
          </div>

          <!-- Like / Action Bar -->
          <div class="flex items-center justify-between py-3 border-y border-border-subtle/60 dark:border-transparent text-xs">
            <button
              type="button"
              class="h-9 px-4 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer border shadow-2xs"
              :class="forumStore.activeThread.isLikedByUser
                ? 'bg-error/15 text-error border-error/30 dark:border-transparent'
                : 'bg-surface-container text-text-secondary border-border-subtle/60 dark:border-transparent hover:bg-surface-container-high'"
              @click="forumStore.toggleLikeThread(forumStore.activeThread.id)"
            >
              <span class="material-symbols-outlined text-[16px]" :class="{ 'fill': forumStore.activeThread.isLikedByUser }">favorite</span>
              <span class="font-bold">{{ forumStore.activeThread.likesCount }} Suka</span>
            </button>
            <span class="text-text-muted font-sans font-medium">{{ forumStore.activeThread.comments.length }} Komentar</span>
          </div>

          <!-- Comments Section -->
          <div class="space-y-4">
            <h4 class="font-display-lg text-sm xl:text-base font-bold text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-xl">forum</span>
              Diskusi Pembaca
            </h4>

            <div class="space-y-3">
              <div
                v-for="comment in forumStore.activeThread.comments"
                :key="comment.id"
                class="p-4 rounded-2xl bg-surface-container border border-border-subtle/50 dark:border-transparent space-y-2 shadow-2xs"
              >
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2 flex-wrap">
                    <img :src="comment.authorAvatar" :alt="comment.authorName" class="w-6 h-6 rounded-full object-cover border border-primary/20 dark:border-transparent" />
                    <span class="font-bold text-on-surface">{{ comment.authorName }}</span>
                    <span
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-sans font-bold shadow-2xs"
                      :class="getTierBadgeInfo(comment.authorTier).badgeClass"
                    >
                      <span class="material-symbols-outlined text-[11px]">{{ getTierBadgeInfo(comment.authorTier).icon }}</span>
                      {{ getTierBadgeInfo(comment.authorTier).label }}
                    </span>
                  </div>
                  <span class="text-text-muted font-sans">{{ comment.timestamp }}</span>
                </div>
                <p class="text-sm text-text-secondary leading-relaxed pl-8">{{ comment.content }}</p>
              </div>
            </div>

            <!-- Desktop: Inline Comment Input -->
            <div class="pt-3 border-t border-border-subtle/60 dark:border-transparent flex gap-3">
              <input
                v-model="newCommentText"
                type="text"
                placeholder="Tulis tanggapan atau analisis Anda..."
                class="flex-1 bg-surface-container border border-border-subtle/60 dark:border-transparent rounded-2xl px-4 py-3 text-sm text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner"
                @keydown.enter="handleAddComment"
              />
              <GButton variant="primary" size="md" icon="send" rounded :loading="isSubmitting" @click="handleAddComment">
                Kirim
              </GButton>
            </div>
          </div>
        </div>

        <!-- Right: Empty State -->
        <div v-else class="col-span-7 flex flex-col items-center justify-center py-24 text-center text-text-secondary space-y-3">
          <span class="material-symbols-outlined text-5xl text-primary/40">forum</span>
          <p class="text-base font-semibold text-on-surface">Pilih Topik Diskusi</p>
          <p class="text-sm">Klik salah satu thread di sisi kiri untuk mulai membaca dan berkomentar.</p>
        </div>
      </div>
    </div>

    <!-- =============================================
         Create Thread Modal (shared mobile & desktop)
         ============================================= -->
    <GModal v-model="forumStore.isPostModalOpen" title="Buat Topik Diskusi Baru" icon="edit_square">
      <div class="space-y-4">
        <GInput
          v-model="newThreadTitle"
          label="Judul Diskusi"
          placeholder="mis. Analisis Simbol Obsidian pada Bab 1..."
          icon="title"
        />

        <div class="space-y-1.5">
          <label class="text-xs font-bold uppercase tracking-wider text-text-secondary">Kategori</label>
          <select
            v-model="newThreadCategory"
            class="w-full bg-surface-container border border-border-subtle/60 dark:border-transparent rounded-2xl px-4 py-3 text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-2xs"
          >
            <option value="Discussions">Discussions</option>
            <option value="Theories">Theories</option>
            <option value="Character Analysis">Character Analysis</option>
            <option value="AI Explains Q&A">AI Explains Q&A</option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold uppercase tracking-wider text-text-secondary">Isi Diskusi</label>
          <textarea
            v-model="newThreadContent"
            rows="5"
            placeholder="Tuliskan gagasan, kutipan buku, atau pertanyaan Anda..."
            class="w-full bg-surface-container border border-border-subtle/60 dark:border-transparent rounded-2xl p-4 text-base text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none shadow-inner"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <GButton variant="ghost" size="sm" rounded @click="forumStore.isPostModalOpen = false">Batal</GButton>
        <GButton variant="primary" size="sm" icon="check" rounded :loading="isSubmitting" @click="handleCreateThread">
          Terbitkan Diskusi
        </GButton>
      </template>
    </GModal>

  </div>
</template>
