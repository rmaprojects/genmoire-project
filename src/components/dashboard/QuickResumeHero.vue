<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { BookSummary } from '@/types/manifest';
import GButton from '@/components/common/GButton.vue';
import GProgressBar from '@/components/common/GProgressBar.vue';

const props = defineProps<{
  book: BookSummary;
}>();

const chapterLabel = computed(() => {
  if (props.book.id === 'chronicles-of-aethelgard') return 'Bab 1: The Whispering Citadels';
  if (props.book.id === 'the-alchemist') return 'Bab 2: Tangier & Padang Pasir';
  if (props.book.id === 'fate-stay-night-prelude') return 'Bab 2: Midnight Awakening';
  return 'Bab 1: Awal Perjalanan';
});
</script>

<template>
  <div
    class="relative overflow-hidden rounded-3xl bg-surface-secondary border border-border-subtle shadow-warm-lg transition-all duration-300 group hover:border-primary/40"
  >
    <!-- Ambient Warm Glow in Background -->
    <div
      class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none"
    />
    <div
      class="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-secondary/10 blur-3xl pointer-events-none"
    />

    <div class="p-6 sm:p-8 relative z-10">
      <!-- Top Kicker / Reading Beacon -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-border-subtle/60">
        <div class="flex items-center gap-2">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span class="text-xs font-sans font-bold uppercase tracking-wider text-primary">
            Lanjutkan Membaca
          </span>
          <span v-if="book.lastReadDate" class="text-xs text-text-muted dark:text-[#9E9385] font-sans hidden sm:inline">
            • Terakhir aktif {{ book.lastReadDate }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span
            v-if="book.isCustomAuthorMode"
            class="px-2.5 py-1 rounded-full text-xs font-sans font-bold bg-secondary/15 text-secondary border border-secondary/30 dark:border-transparent flex items-center gap-1 shadow-xs"
          >
            <span class="material-symbols-outlined text-[14px]">palette</span> Mode Penulis
          </span>
          <span class="px-3 py-1 rounded-full text-xs font-sans font-bold uppercase bg-surface-container text-text-secondary dark:text-[#C5BBAF] border border-border-subtle/50 dark:border-transparent shadow-xs">
            {{ book.genres[0] || 'GRIMOIRE' }}
          </span>
        </div>
      </div>

      <!-- Main Book Content: Thumbnail + Info -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
        <!-- Book Cover Thumbnail with 3D Spine Shadow -->
        <div class="md:col-span-4 lg:col-span-4 flex justify-center md:justify-start">
          <div class="relative w-36 sm:w-44 aspect-[2/3] rounded-2xl overflow-hidden shadow-warm-xl border border-border-subtle/70 dark:border-transparent group-hover:scale-[1.02] transition-transform duration-300">
            <img
              :src="book.coverUrl"
              :alt="book.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div class="absolute bottom-2.5 left-2.5 right-2.5 text-center">
              <span class="text-[11px] font-sans font-bold text-white/90 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 dark:border-transparent inline-block">
                {{ book.progressPercent }}% Selesai
              </span>
            </div>
          </div>
        </div>

        <!-- Book Details & Direct Actions -->
        <div class="md:col-span-8 lg:col-span-8 space-y-4">
          <div>
            <h2 class="font-reading-body text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface dark:text-[#F3EFE6] leading-snug group-hover:text-primary transition-colors">
              {{ book.title }}
            </h2>
            <p class="text-sm sm:text-base font-semibold text-text-secondary dark:text-[#C5BBAF] mt-1">
              {{ book.author }}
            </p>
          </div>

          <!-- Synopsis / Context Snippet -->
          <p class="text-xs sm:text-sm text-text-secondary dark:text-[#D8D0C3] line-clamp-2 leading-relaxed">
            {{ book.synopsis }}
          </p>

          <!-- Reading Progress Status -->
          <div class="p-3.5 sm:p-4 rounded-2xl bg-surface-container border border-border-subtle/70 dark:border-transparent space-y-2 shadow-2xs">
            <div class="flex justify-between items-center text-xs font-sans text-text-secondary dark:text-[#C5BBAF]">
              <span class="font-bold text-on-surface dark:text-[#F3EFE6] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-primary text-base">bookmark</span>
                {{ chapterLabel }}
              </span>
              <span class="font-bold text-primary">{{ book.progressPercent }}%</span>
            </div>

            <GProgressBar
              :value="book.progressPercent"
              variant="gold"
              height="sm"
            />

            <div class="flex justify-between items-center text-[11px] text-text-muted dark:text-[#9E9385] pt-0.5">
              <span>Estimasi: {{ book.estimatedReadMinutes }} mnt total</span>
              <span>ISBN: {{ book.isbn }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center gap-3 pt-1">
            <RouterLink :to="`/read/${book.id}`" class="flex-1 min-w-[170px]">
              <GButton
                variant="primary"
                size="lg"
                icon="auto_stories"
                customClass="w-full justify-center shadow-warm-sm font-bold text-sm sm:text-base py-3"
              >
                Lanjutkan Membaca
              </GButton>
            </RouterLink>

            <RouterLink :to="`/book/${book.id}`">
              <GButton
                variant="secondary"
                size="lg"
                icon="info"
                customClass="justify-center shadow-xs text-sm py-3"
              >
                Detail
              </GButton>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
