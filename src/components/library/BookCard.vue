<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { gsap } from 'gsap';
import type { BookSummary } from '@/types/manifest';
import GButton from '@/components/common/GButton.vue';
import GProgressBar from '@/components/common/GProgressBar.vue';

defineProps<{
  book: BookSummary;
}>();

const cardRef = ref<HTMLElement | null>(null);

const onMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return;
  const rect = cardRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  
  gsap.to(cardRef.value, {
    rotationY: x * 0.03,
    rotationX: -y * 0.03,
    transformPerspective: 800,
    duration: 0.3,
    ease: 'power1.out',
  });
};

const onMouseLeave = () => {
  if (!cardRef.value) return;
  gsap.to(cardRef.value, {
    rotationY: 0,
    rotationX: 0,
    duration: 0.5,
    ease: 'power2.out',
  });
};
</script>

<template>
  <div
    ref="cardRef"
    class="bg-surface-secondary rounded-3xl border border-border-subtle/60 dark:border-transparent shadow-warm-md hover:shadow-warm-xl dark:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group relative will-change-transform"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <!-- Cover Image with Gradient Scrim -->
    <div class="relative h-64 w-full bg-cover bg-center overflow-hidden" :style="{ backgroundImage: `url(${book.coverUrl})` }">
      <div class="absolute inset-0 bg-gradient-to-t from-surface-secondary via-surface-secondary/40 to-transparent"></div>
      
      <!-- Badges on top of cover -->
      <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <span class="px-3 py-1 rounded-full text-xs font-sans font-bold uppercase bg-surface-elevated/90 backdrop-blur-md text-on-surface border border-border-subtle/50 dark:border-transparent shadow-sm">
          {{ book.genres[0] || 'NOVEL' }}
        </span>
        <span
          v-if="book.isCustomAuthorMode"
          class="px-2.5 py-1 rounded-full text-xs font-sans font-bold bg-secondary-container/90 text-on-secondary-container border border-secondary/30 dark:border-transparent flex items-center gap-1 shadow-sm"
          title="Author Official Artwork & Audio Enabled"
        >
          <span class="material-symbols-outlined text-[13px]">palette</span> Mode Penulis
        </span>
      </div>
    </div>

    <!-- Content details -->
    <div class="p-6 flex-1 flex flex-col justify-between -mt-10 relative z-20">
      <div>
        <h4 class="font-reading-body text-xl font-bold text-on-surface leading-snug group-hover:text-primary transition-colors">
          {{ book.title }}
        </h4>
        <p class="text-sm text-text-secondary mt-1 font-semibold">{{ book.author }}</p>
        <p class="text-xs text-text-muted mt-2 font-sans">ISBN: {{ book.isbn }}</p>
        <p class="text-sm text-text-secondary mt-2 line-clamp-2 leading-relaxed">{{ book.synopsis }}</p>
      </div>

      <!-- Progress & CTA -->
      <div class="mt-5 pt-4 border-t border-border-subtle/40">
        <div class="flex justify-between items-center text-xs font-sans text-text-secondary mb-2 font-semibold">
          <span>{{ book.estimatedReadMinutes }} mnt membaca</span>
          <span>{{ book.progressPercent }}%</span>
        </div>
        <GProgressBar :value="book.progressPercent" variant="gold" height="sm" class="mb-4" />

        <div class="flex items-center gap-2.5">
          <RouterLink :to="`/read/${book.id}`" class="flex-1">
            <GButton
              variant="primary"
              size="md"
              icon="auto_stories"
              customClass="w-full justify-center"
            >
              {{ book.progressPercent > 0 ? 'Lanjutkan Membaca' : 'Mulai Membaca' }}
            </GButton>
          </RouterLink>

          <RouterLink :to="`/book/${book.id}`">
            <button
              type="button"
              class="p-2.5 rounded-xl border border-border-subtle bg-surface-container/60 hover:bg-surface-container text-text-muted hover:text-on-surface transition-colors cursor-pointer"
              title="Detail Buku"
            >
              <span class="material-symbols-outlined text-[20px] text-text-muted dark:text-zinc-200">info</span>
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
