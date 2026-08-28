<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { gsap } from 'gsap';
import { useProfileStore } from '@/stores/useProfileStore';
import type { TierDefinition } from '@/types/profile';

const props = defineProps<{
  tierInfo?: TierDefinition;
  progressToNext?: number;
  hideExploreButton?: boolean;
}>();

const profileStore = useProfileStore();

const containerRef = ref<HTMLElement | null>(null);
const progressBarRef = ref<HTMLElement | null>(null);
const emblemRef = ref<HTMLElement | null>(null);
const ctaBtnRef = ref<HTMLElement | null>(null);

const activeTier = props.tierInfo || profileStore.currentTierInfo;
const activeProgress = props.progressToNext !== undefined ? props.progressToNext : profileStore.tierProgressPercent;

// Visual theme configurations per tier level
const tierVisuals: Record<number, {
  tierLabel: string;
  themeGradient: string;
  crestGlow: string;
  ringBorder: string;
  ribbonColor: string;
  accentText: string;
}> = {
  1: {
    tierLabel: 'Tier 1: Novice',
    themeGradient: 'from-[#8D6E63] via-[#6D4C41] to-[#3E2723]',
    crestGlow: 'shadow-[0_0_20px_rgba(141,110,99,0.35)]',
    ringBorder: 'border-[#A1887F]/40',
    ribbonColor: 'bg-[#5D4037] text-[#D7CCC8] border-0',
    accentText: 'text-[#8D6E63] dark:text-[#BCAAA4]',
  },
  2: {
    tierLabel: 'Tier 2: Apprentice',
    themeGradient: 'from-[#90A4AE] via-[#607D8B] to-[#37474F]',
    crestGlow: 'shadow-[0_0_20px_rgba(144,164,174,0.4)]',
    ringBorder: 'border-[#CFD8DC]/40',
    ribbonColor: 'bg-[#455A64] text-[#ECEFF1] border-0',
    accentText: 'text-[#546E7A] dark:text-[#B0BEC5]',
  },
  3: {
    tierLabel: 'Tier 3: Scholar',
    themeGradient: 'from-[#F59E0B] via-[#D97706] to-[#78350F]',
    crestGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.5)]',
    ringBorder: 'border-[#FCD34D]/50',
    ribbonColor: 'bg-[#92400E] text-[#FEF3C7] border-0',
    accentText: 'text-amber-600 dark:text-amber-400',
  },
  4: {
    tierLabel: 'Tier 4: Lorekeeper',
    themeGradient: 'from-[#A855F7] via-[#7E22CE] to-[#4C1D95]',
    crestGlow: 'shadow-[0_0_25px_rgba(168,85,247,0.45)]',
    ringBorder: 'border-[#D8B4FE]/50',
    ribbonColor: 'bg-[#581C87] text-[#F3E8FF] border-0',
    accentText: 'text-purple-600 dark:text-purple-400',
  },
  5: {
    tierLabel: 'Tier 5: Loremaster',
    themeGradient: 'from-[#EF4444] via-[#B91C1C] to-[#450A0A]',
    crestGlow: 'shadow-[0_0_30px_rgba(239,68,68,0.55)]',
    ringBorder: 'border-[#FCA5A5]/50',
    ribbonColor: 'bg-[#7F1D1D] text-[#FEE2E2] border-0',
    accentText: 'text-rose-600 dark:text-rose-400',
  },
};

const currentVisual = tierVisuals[activeTier.tier] || tierVisuals[1];

let ctx: gsap.Context | null = null;

onMounted(() => {
  ctx = gsap.context(() => {
    // 1. Emblem bounce in
    if (emblemRef.value) {
      gsap.from(emblemRef.value, {
        scale: 0.7,
        opacity: 0,
        rotation: -10,
        duration: 0.7,
        ease: 'back.out(2)',
      });
    }

    // 2. Progress bar fill
    if (progressBarRef.value) {
      gsap.fromTo(
        progressBarRef.value,
        { width: '0%' },
        { width: `${activeProgress}%`, duration: 1.2, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, containerRef.value || undefined);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  <div
    ref="containerRef"
    class="bg-surface-secondary shadow-warm-md rounded-3xl p-6 sm:p-8 border border-border-subtle/60 dark:border-transparent flex flex-col justify-between space-y-6"
  >
    <!-- Top Header & Emblem Banner -->
    <div>
      <div class="flex items-center justify-between gap-2 mb-3">
        <span class="text-[11px] font-sans font-bold px-3 py-1 rounded-full shadow-inner" :class="currentVisual.ribbonColor">
          {{ currentVisual.tierLabel }}
        </span>

        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-primary text-on-primary flex items-center gap-1 shadow-sm">
          <span class="material-symbols-outlined text-xs">verified</span> Pangkat Aktif
        </span>
      </div>

      <!-- Main Emblem & Tier Title -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 my-3">
        <!-- Glowing Shield Crest Emblem -->
        <div ref="emblemRef" class="relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
          <div
            class="absolute inset-0 rounded-2xl bg-gradient-to-br border-2 opacity-90"
            :class="[
              currentVisual.themeGradient,
              currentVisual.ringBorder,
              currentVisual.crestGlow
            ]"
          ></div>
          <div class="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-surface-primary/40 backdrop-blur-sm border border-white/10 dark:border-transparent flex items-center justify-center text-white shadow-inner">
            <span class="material-symbols-outlined text-3xl sm:text-4xl drop-shadow-md">{{ activeTier.emblemIcon }}</span>
          </div>
        </div>

        <div class="space-y-1">
          <h2 class="font-display-lg text-2xl sm:text-3xl font-extrabold text-on-surface dark:text-[#F3EFE6] leading-tight">
            {{ activeTier.title }}
          </h2>
          <p class="text-xs font-sans font-bold" :class="currentVisual.accentText">
            Syarat: {{ activeTier.min }} – {{ activeTier.max === Infinity ? '50+' : activeTier.max }} Buku Tamat
          </p>
          <p v-if="activeTier.personality" class="text-xs sm:text-sm text-text-secondary dark:text-[#C5BBAF] font-serif italic leading-relaxed pt-0.5">
            “{{ activeTier.personality }}”
          </p>
        </div>
      </div>

      <!-- Complete Rewards Section (Lengkap Semua Hadiah & Hak Istimewa) -->
      <div class="mt-5 pt-4 border-t border-border-subtle/60 dark:border-transparent space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-[#D8D0C3] flex items-center gap-1.5 font-sans">
            <span class="material-symbols-outlined text-amber-500 text-base">card_giftcard</span>
            Hadiah Tiap Bulan:
          </span>
        </div>

        <!-- Monthly Rewards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div
            v-for="(reward, rIdx) in activeTier.rewards"
            :key="rIdx"
            class="p-3.5 rounded-2xl bg-surface-container border border-border-subtle/50 dark:border-transparent flex items-start gap-3 shadow-2xs"
          >
            <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <span class="material-symbols-outlined text-lg">{{ reward.icon }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs sm:text-sm font-bold text-on-surface dark:text-[#F3EFE6] leading-snug">
                {{ reward.label }}
              </p>
              <p v-if="reward.description" class="text-[11px] text-text-secondary dark:text-[#BDB2A5] mt-0.5 leading-relaxed">
                {{ reward.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Exclusive Privileges Checklist -->
        <div v-if="activeTier.benefits && activeTier.benefits.length > 0" class="pt-2 space-y-2">
          <span class="text-[11px] font-sans font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
            <span class="material-symbols-outlined text-secondary text-sm">verified_user</span>
            Hak Istimewa:
          </span>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-text-secondary dark:text-[#C5BBAF]">
            <li
              v-for="(benefit, bIdx) in activeTier.benefits"
              :key="bIdx"
              class="flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-secondary text-base shrink-0">check_circle</span>
              <span class="leading-tight">{{ benefit }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Step Progress Bar & Milestone Section -->
    <div class="flex flex-col gap-3 pt-3 border-t border-border-subtle/60 dark:border-transparent">
      <div class="flex justify-between items-center text-xs font-sans text-text-secondary dark:text-[#C5BBAF]">
        <span v-if="profileStore.nextTierInfo" class="flex items-center gap-1.5 font-semibold text-on-surface dark:text-[#F3EFE6]">
          <span class="material-symbols-outlined text-primary text-sm">flag</span>
          Langkah ke-{{ profileStore.booksCompleted }} dari {{ profileStore.nextTierInfo.min }} buku tamat
        </span>
        <span v-else class="text-primary font-bold">
          Pangkat Tertinggi Tercapai (Loremaster)
        </span>

        <span class="font-bold text-primary">
          {{ profileStore.nextTierInfo ? `Sisa ${profileStore.booksRemainingToNextTier} buku lagi` : '100%' }}
        </span>
      </div>

      <!-- Main Animated Progress Bar -->
      <div class="w-full bg-surface-container rounded-full h-3.5 overflow-hidden border border-border-subtle/50 dark:border-0 dark:border-transparent p-[2px] dark:p-0 shadow-2xs">
        <div
          ref="progressBarRef"
          class="bg-gradient-to-r from-primary to-primary-fixed-dim h-full rounded-full shadow-sm transition-all duration-700"
          :style="{ width: `${activeProgress}%` }"
        />
      </div>

      <!-- Mini Milestone Step Track -->
      <div class="flex justify-between items-center text-[10px] font-sans text-text-muted dark:text-[#9E9385] pt-0.5 px-1">
        <span :class="activeTier.tier >= 1 ? 'font-bold text-primary' : ''">0 (T1: Novice)</span>
        <span :class="activeTier.tier >= 2 ? 'font-bold text-primary' : ''">3 (T2: Apprentice)</span>
        <span :class="activeTier.tier >= 3 ? 'font-bold text-primary' : ''">10 (T3: Scholar)</span>
        <span :class="activeTier.tier >= 4 ? 'font-bold text-primary' : ''">25 (T4: Lorekeeper)</span>
        <span :class="activeTier.tier >= 5 ? 'font-bold text-primary' : ''">50+ (T5: Loremaster)</span>
      </div>

      <!-- Clear Guidance Box (High Contrast & Clear in Dark Mode) -->
      <div class="p-4 rounded-2xl bg-surface-container border border-border-subtle/50 dark:border-transparent text-xs sm:text-sm text-text-secondary dark:text-[#D8D0C3] leading-relaxed flex items-start gap-3 mt-1.5 shadow-2xs">
        <span class="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">insights</span>
        <div>
          <p class="font-bold text-on-surface dark:text-[#F3EFE6] mb-0.5">
            {{ profileStore.nextTierInfo ? `Menuju Pangkat ${profileStore.nextTierInfo.title}:` : 'Puncak Pangkat Pembaca:' }}
          </p>
          <p v-if="profileStore.nextTierInfo">
            Selesaikan <strong class="text-primary">{{ profileStore.booksRemainingToNextTier }} buku lagi</strong> untuk naik ke <strong>{{ profileStore.nextTierInfo.title }}</strong> dan membuka lebih banyak kredit AI serta keuntungan eksklusif.
          </p>
          <p v-else>
            Selamat! Anda telah mencapai pangkat pembaca tertinggi dengan seluruh hak istimewa dan kredit maksimal.
          </p>
        </div>
      </div>

      <!-- Action Button to Showcase Page -->
      <div v-if="!hideExploreButton" class="pt-2">
        <RouterLink to="/tiers" class="block w-full">
          <button
            ref="ctaBtnRef"
            type="button"
            class="w-full py-3 px-4 rounded-2xl border border-primary/30 dark:border-transparent bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-xs group active:scale-[0.99]"
          >
            <span class="material-symbols-outlined text-base">military_tech</span>
            <span>Lihat Semua Tingkatan & Hadiah</span>
            <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
