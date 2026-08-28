<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useProfileStore } from '@/stores/useProfileStore';
import GProgressBar from '@/components/common/GProgressBar.vue';

const authStore = useAuthStore();
const profileStore = useProfileStore();

const displayName = computed(() => {
  const baseName = authStore.currentUser.name || 'Pembaca';
  const featuredId = authStore.currentUser.featuredTraitId;
  if (!featuredId) return baseName;

  const trait = profileStore.allTraits.find(t => t.id === featuredId);
  if (!trait) return baseName;

  return `${baseName} the ${trait.title.replace(/^The\s+/i, '')}`;
});
</script>

<template>
  <div class="bg-surface-secondary rounded-3xl p-5 sm:p-6 border border-border-subtle/60 dark:border-transparent shadow-warm-md space-y-5">
    <!-- User Profile Header -->
    <div class="flex items-center gap-3.5 pb-4 border-b border-border-subtle/70">
      <div class="relative w-13 h-13 rounded-2xl overflow-hidden border border-border-subtle/60 dark:border-transparent shrink-0 shadow-xs">
        <img
          :src="authStore.currentUser.avatar"
          :alt="authStore.currentUser.name"
          class="w-full h-full object-cover"
        />
        <div class="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface-secondary" />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-1">
          <RouterLink
            to="/profile"
            class="font-display-lg text-base font-bold text-on-surface dark:text-[#F3EFE6] hover:text-primary transition-colors truncate block"
          >
            {{ displayName }}
          </RouterLink>
        </div>
        <p class="text-xs text-text-secondary dark:text-[#C5BBAF] truncate">
          {{ authStore.currentUser.email }}
        </p>
      </div>

      <RouterLink
        to="/profile"
        class="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-text-muted hover:text-primary border border-border-subtle/60 dark:border-transparent transition-colors"
        title="Buka Pengaturan Profil"
      >
        <span class="material-symbols-outlined text-lg">settings</span>
      </RouterLink>
    </div>

    <!-- 3 Compact Stat Pills -->
    <div class="grid grid-cols-3 gap-2">
      <div class="p-2.5 rounded-2xl bg-surface-container border border-border-subtle/60 dark:border-transparent text-center shadow-2xs">
        <span class="text-sm font-extrabold font-display-lg text-on-surface dark:text-[#F3EFE6] block leading-tight">
          {{ profileStore.currentStreak }}d
        </span>
        <span class="text-[10px] uppercase font-sans font-bold text-primary flex items-center justify-center gap-0.5 mt-0.5">
          <span>🔥</span> Streak
        </span>
      </div>

      <div class="p-2.5 rounded-2xl bg-surface-container border border-border-subtle/60 dark:border-transparent text-center shadow-2xs">
        <span class="text-sm font-extrabold font-display-lg text-on-surface dark:text-[#F3EFE6] block leading-tight">
          {{ profileStore.totalMinutesRead }}m
        </span>
        <span class="text-[10px] uppercase font-sans font-bold text-secondary flex items-center justify-center gap-0.5 mt-0.5">
          <span>⏱️</span> Baca
        </span>
      </div>

      <div class="p-2.5 rounded-2xl bg-surface-container border border-border-subtle/60 dark:border-transparent text-center shadow-2xs">
        <span class="text-sm font-extrabold font-display-lg text-on-surface dark:text-[#F3EFE6] block leading-tight">
          {{ profileStore.explainCount }}
        </span>
        <span class="text-[10px] uppercase font-sans font-bold text-primary flex items-center justify-center gap-0.5 mt-0.5">
          <span>🪄</span> AI Exp
        </span>
      </div>
    </div>

    <!-- Pangkat & Progress Section -->
    <div class="p-4 rounded-2xl bg-surface-container border border-border-subtle/60 dark:border-transparent space-y-3 shadow-2xs">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-base">{{ profileStore.currentTierInfo.emblemIcon }}</span>
          </div>
          <div>
            <p class="text-xs font-bold text-on-surface dark:text-[#F3EFE6] leading-tight">
              Tier {{ profileStore.currentTierInfo.tier }} • {{ profileStore.currentTierInfo.title }}
            </p>
            <p class="text-[11px] text-text-muted dark:text-[#9E9385]">
              {{ profileStore.nextTierInfo ? `Sisa ${profileStore.booksRemainingToNextTier} buku lagi` : 'Pangkat Tertinggi' }}
            </p>
          </div>
        </div>

        <span class="text-xs font-bold text-primary font-sans">
          {{ profileStore.tierProgressPercent }}%
        </span>
      </div>

      <GProgressBar
        :value="profileStore.tierProgressPercent"
        variant="gold"
        height="sm"
      />

      <div class="flex justify-between items-center text-[10px] text-text-muted dark:text-[#9E9385] font-sans pt-0.5">
        <span>{{ profileStore.booksCompleted }} buku tamat</span>
        <RouterLink to="/tiers" class="text-primary font-bold hover:underline">
          Lihat Semua Pangkat →
        </RouterLink>
      </div>
    </div>
  </div>
</template>
