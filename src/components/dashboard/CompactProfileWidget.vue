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
  <div class="bg-surface-secondary rounded-3xl p-4 sm:p-5 border border-border-subtle/60 dark:border-transparent shadow-warm-md space-y-3.5">
    <!-- 1. User Profile Header (Horizontal Single Row) -->
    <div class="flex items-center gap-3 pb-3 border-b border-border-subtle/60 dark:border-white/5">
      <!-- Avatar Kompak -->
      <div class="relative w-12 h-12 rounded-full overflow-hidden border border-border-subtle/60 dark:border-white/10 shrink-0 shadow-xs">
        <img
          :src="authStore.currentUser.avatar"
          :alt="authStore.currentUser.name"
          class="w-full h-full object-cover"
        />
        <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-surface-secondary" />
      </div>

      <!-- Nama Pengguna & Email (Flex-1 Responsif) -->
      <div class="flex-1 min-w-0">
        <RouterLink
          to="/profile"
          class="font-display-lg text-base font-bold text-on-surface dark:text-[#F3EFE6] hover:text-primary transition-colors truncate block leading-tight"
          :title="displayName"
        >
          {{ displayName }}
        </RouterLink>
        <p class="text-xs text-text-secondary dark:text-[#C5BBAF] truncate mt-0.5 font-sans">
          {{ authStore.currentUser.email }}
        </p>
      </div>

      <!-- Ikon Settings / Gear -->
      <RouterLink
        to="/profile"
        class="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-text-muted hover:text-on-surface dark:hover:text-[#F3EFE6] border border-border-subtle/50 dark:border-white/5 transition-colors shrink-0 cursor-pointer"
        title="Pengaturan Profil"
      >
        <span class="material-symbols-outlined text-[18px]">settings</span>
      </RouterLink>
    </div>

    <!-- 2. 3 Compact Stat Pills -->
    <div class="grid grid-cols-3 gap-2">
      <div class="py-2 px-1.5 rounded-2xl bg-surface-container border border-border-subtle/40 dark:border-transparent text-center">
        <span class="text-sm font-extrabold font-display-lg text-on-surface dark:text-[#F3EFE6] block leading-tight">
          {{ profileStore.currentStreak }}d
        </span>
        <span class="text-[10px] uppercase font-sans font-bold text-primary flex items-center justify-center gap-0.5 mt-0.5">
          <span>🔥</span> Streak
        </span>
      </div>

      <div class="py-2 px-1.5 rounded-2xl bg-surface-container border border-border-subtle/40 dark:border-transparent text-center">
        <span class="text-sm font-extrabold font-display-lg text-on-surface dark:text-[#F3EFE6] block leading-tight">
          {{ profileStore.totalMinutesRead }}m
        </span>
        <span class="text-[10px] uppercase font-sans font-bold text-secondary flex items-center justify-center gap-0.5 mt-0.5">
          <span>⏱️</span> Baca
        </span>
      </div>

      <div class="py-2 px-1.5 rounded-2xl bg-surface-container border border-border-subtle/40 dark:border-transparent text-center">
        <span class="text-sm font-extrabold font-display-lg text-on-surface dark:text-[#F3EFE6] block leading-tight">
          {{ profileStore.explainCount }}
        </span>
        <span class="text-[10px] uppercase font-sans font-bold text-primary flex items-center justify-center gap-0.5 mt-0.5">
          <span>🪄</span> AI Exp
        </span>
      </div>
    </div>

    <!-- 3. Pangkat & Level Progress Section -->
    <div class="p-3 sm:p-3.5 rounded-2xl bg-surface-container border border-border-subtle/40 dark:border-transparent space-y-2.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-6 h-6 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-sm">{{ profileStore.currentTierInfo.emblemIcon }}</span>
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-on-surface dark:text-[#F3EFE6] leading-tight truncate">
              Tier {{ profileStore.currentTierInfo.tier }} • {{ profileStore.currentTierInfo.title }}
            </p>
            <p class="text-[10px] text-text-muted dark:text-[#9E9385] truncate">
              {{ profileStore.nextTierInfo ? `Sisa ${profileStore.booksRemainingToNextTier} buku lagi` : 'Pangkat Tertinggi' }}
            </p>
          </div>
        </div>

        <span class="text-xs font-bold text-primary font-sans shrink-0 ml-2">
          {{ profileStore.tierProgressPercent }}%
        </span>
      </div>

      <GProgressBar
        :value="profileStore.tierProgressPercent"
        variant="gold"
        height="sm"
      />

      <div class="flex justify-between items-center text-[10px] text-text-muted dark:text-[#9E9385] font-sans">
        <span>{{ profileStore.booksCompleted }} buku tamat</span>
        <RouterLink to="/tiers" class="text-primary font-bold hover:underline">
          Lihat Semua Pangkat →
        </RouterLink>
      </div>
    </div>
  </div>
</template>
