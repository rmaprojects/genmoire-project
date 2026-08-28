<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
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

const categories = ['All', 'Discussions', 'Theories', 'Character Analysis', 'AI Explains Q&A'];

const newCommentText = ref<string>('');
const newThreadTitle = ref<string>('');
const newThreadCategory = ref<ForumThread['category']>('Discussions');
const newThreadContent = ref<string>('');
const isSubmitting = ref<boolean>(false);

// Helper to format consistent Tier Badges across Forum
const getTierBadgeInfo = (tierTitle?: string) => {
  const lower = (tierTitle || '').toLowerCase();
  if (lower.includes('loremaster') || lower.includes('tier 5')) {
    return {
      label: tierTitle || 'Loremaster',
      icon: 'military_tech',
      badgeClass: 'bg-[#7F1D1D] text-[#FEE2E2] border-0',
    };
  }
  if (lower.includes('lorekeeper') || lower.includes('tier 4')) {
    return {
      label: tierTitle || 'Lorekeeper',
      icon: 'auto_stories',
      badgeClass: 'bg-[#581C87] text-[#F3E8FF] border-0',
    };
  }
  if (lower.includes('scholar') || lower.includes('tier 3')) {
    return {
      label: tierTitle || 'Scholar',
      icon: 'history_edu',
      badgeClass: 'bg-[#92400E] text-[#FEF3C7] border-0',
    };
  }
  if (lower.includes('apprentice') || lower.includes('tier 2')) {
    return {
      label: tierTitle || 'Apprentice',
      icon: 'school',
      badgeClass: 'bg-[#455A64] text-[#ECEFF1] border-0',
    };
  }
  if (lower.includes('novice') || lower.includes('tier 1')) {
    return {
      label: tierTitle || 'Novice',
      icon: 'edit_note',
      badgeClass: 'bg-[#5D4037] text-[#D7CCC8] border-0',
    };
  }
  return {
    label: tierTitle || 'Pembaca Terverifikasi',
    icon: 'verified',
    badgeClass: 'bg-primary/15 text-primary border border-primary/20 dark:border-transparent',
  };
};

let ctx: gsap.Context | null = null;

onMounted(() => {
  nextTick(() => {
    ctx = gsap.context(() => {
      if (headerRef.value) {
        gsap.from(headerRef.value, {
          opacity: 0,
          y: -20,
          duration: 0.6,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        });
      }

      if (chipsRef.value) {
        gsap.from(chipsRef.value.children, {
          opacity: 0,
          x: -15,
          stagger: 0.04,
          duration: 0.45,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
        });
      }

      if (threadListRef.value) {
        gsap.from(threadListRef.value.children, {
          opacity: 0,
          y: 20,
          stagger: 0.06,
          duration: 0.5,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        });
      }

      if (activeThreadRef.value) {
        gsap.from(activeThreadRef.value, {
          opacity: 0,
          x: 25,
          duration: 0.6,
          ease: 'power3.out',
          delay: 0.1,
          clearProps: 'opacity,transform',
        });
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
  <div ref="forumContainerRef" class="max-w-container-max mx-auto px-4 sm:px-8 py-10 space-y-10">
    <!-- Header (Clean Editorial, No generic AI chip) -->
    <div ref="headerRef" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle/70">
      <div>
        <h1 class="font-display-lg text-3xl sm:text-5xl font-extrabold text-on-surface">
          Forum Diskusi Buku
        </h1>
        <p class="text-base sm:text-lg text-text-secondary mt-1">
          Bahas alur cerita, analisis karakter, dan bertukar ulasan bersama sesama pembaca.
        </p>
      </div>

      <GButton
        variant="primary"
        size="md"
        icon="edit_square"
        rounded
        @click="forumStore.isPostModalOpen = true"
      >
        Buat Diskusi Baru
      </GButton>
    </div>

    <!-- Category Filters -->
    <div ref="chipsRef" class="flex items-center gap-2 overflow-x-auto pb-2 pt-1 relative z-20">
      <GChip
        v-for="cat in categories"
        :key="cat"
        :active="forumStore.activeCategory === cat"
        @click="forumStore.activeCategory = cat"
      >
        {{ cat === 'All' ? 'Semua Kategori' : cat }}
      </GChip>
    </div>

    <!-- Main Content: Thread List & Active Thread Detail -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10 pb-16">
      
      <!-- Thread List (Left Column) -->
      <div ref="threadListRef" class="lg:col-span-5 space-y-4 relative z-10">
        <div
          v-for="thread in forumStore.filteredThreads"
          :key="thread.id"
          class="p-6 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none relative z-10"
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
            <h3 class="font-display-lg text-lg sm:text-xl font-bold text-on-surface leading-snug line-clamp-2 mb-2">
              {{ thread.title }}
            </h3>
            <p class="text-sm text-text-secondary line-clamp-2 mb-3 leading-relaxed">
              {{ thread.content }}
            </p>
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
                <span class="material-symbols-outlined text-[15px]">chat_bubble</span>
                {{ thread.comments.length }}
              </span>
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px]">favorite</span>
                {{ thread.likesCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Thread Detail (Right Column) -->
      <div v-if="forumStore.activeThread" ref="activeThreadRef" class="lg:col-span-7 bg-surface-secondary rounded-3xl p-6 sm:p-8 border border-border-subtle/60 dark:border-transparent shadow-warm-lg space-y-6">
        <!-- Thread Header -->
        <div class="space-y-3 pb-5 border-b border-border-subtle/60 dark:border-transparent">
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full text-xs font-sans font-bold uppercase bg-primary-container/20 text-primary border border-primary/30 dark:border-transparent">
              {{ forumStore.activeThread.category }}
            </span>
            <span class="text-xs font-sans text-text-muted">
              {{ forumStore.activeThread.timestamp }}
            </span>
          </div>

          <h2 class="font-display-lg text-2xl sm:text-3xl font-extrabold text-on-surface leading-tight">
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
                <p class="text-sm sm:text-base font-bold text-on-surface">{{ forumStore.activeThread.authorName }}</p>
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
        <div class="font-ui text-base text-on-surface leading-relaxed whitespace-pre-line py-2">
          {{ forumStore.activeThread.content }}
        </div>

        <!-- Like / Action Bar -->
        <div class="flex items-center justify-between py-3 border-y border-border-subtle/60 dark:border-transparent text-xs">
          <button
            type="button"
            class="px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer border shadow-2xs"
            :class="forumStore.activeThread.isLikedByUser
              ? 'bg-error/15 text-error border-error/30 dark:border-transparent'
              : 'bg-surface-container text-text-secondary border-border-subtle/60 dark:border-transparent hover:bg-surface-container-high'"
            @click="forumStore.toggleLikeThread(forumStore.activeThread.id)"
          >
            <span class="material-symbols-outlined text-[16px]" :class="{ 'fill': forumStore.activeThread.isLikedByUser }">
              favorite
            </span>
            <span class="font-bold">{{ forumStore.activeThread.likesCount }} Suka</span>
          </button>

          <span class="text-text-muted font-sans font-medium">{{ forumStore.activeThread.comments.length }} Komentar</span>
        </div>

        <!-- Comments Section -->
        <div class="space-y-4">
          <h4 class="font-display-lg text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
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
              <p class="text-sm text-text-secondary leading-relaxed pl-8">
                {{ comment.content }}
              </p>
            </div>
          </div>

          <!-- Add Comment Input Box -->
          <div class="pt-4 border-t border-border-subtle/60 dark:border-transparent flex gap-3">
            <input
              v-model="newCommentText"
              type="text"
              placeholder="Tulis tanggapan atau analisis Anda..."
              class="flex-1 bg-surface-container border border-border-subtle/60 dark:border-transparent rounded-2xl px-4 py-3 text-sm sm:text-base text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner"
              @keydown.enter="handleAddComment"
            />
            <GButton
              variant="primary"
              size="md"
              icon="send"
              rounded
              :loading="isSubmitting"
              @click="handleAddComment"
            >
              Kirim
            </GButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Thread Modal -->
    <GModal
      v-model="forumStore.isPostModalOpen"
      title="Buat Topik Diskusi Baru"
      icon="edit_square"
    >
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
            placeholder="Tuliskan gagasan, kutipan naskah, atau pertanyaan Anda..."
            class="w-full bg-surface-container border border-border-subtle/60 dark:border-transparent rounded-2xl p-4 text-base text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none shadow-inner"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <GButton variant="ghost" size="sm" rounded @click="forumStore.isPostModalOpen = false">
          Batal
        </GButton>
        <GButton
          variant="primary"
          size="sm"
          icon="check"
          rounded
          :loading="isSubmitting"
          @click="handleCreateThread"
        >
          Terbitkan Diskusi
        </GButton>
      </template>
    </GModal>
  </div>
</template>
