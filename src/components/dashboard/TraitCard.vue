<script setup lang="ts">
import type { TraitDefinition, TraitRarity } from '@/types/profile';

defineProps<{
  trait: TraitDefinition;
  isUnlocked: boolean;
}>();

const rarityColors: Record<TraitRarity, string> = {
  common: 'bg-zinc-400',
  uncommon: 'bg-secondary',
  rare: 'bg-primary',
  epic: 'bg-[#5D5451]',
  legendary: 'bg-[#5C4114]',
};

const rarityBadge: Record<TraitRarity, string> = {
  common: 'bg-surface-container text-text-secondary border border-border-subtle',
  uncommon: 'bg-[#344820]/20 text-[#4A6729] dark:text-[#749654] border border-[#344820]/30',
  rare: 'bg-[#5C4114]/20 text-[#795900] dark:text-[#BA9248] border border-[#5C4114]/30',
  epic: 'bg-[#5D5451]/25 text-[#5D5451] dark:text-[#D0C4C0] border border-[#5D5451]/30',
  legendary: 'bg-[#5C4114]/30 text-[#6F5100] dark:text-[#D8D0C3] border border-[#5C4114]/60',
};
</script>

<template>
  <div
    class="relative rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between"
    :class="[
      isUnlocked
        ? 'bg-surface-secondary border-border-subtle hover:shadow-warm-md hover:-translate-y-1'
        : 'bg-surface-container-low/60 border-border-subtle/50 opacity-85'
    ]"
  >
    <!-- Rarity indicator bar -->
    <div
      class="absolute top-0 left-6 right-6 h-1 rounded-b-full"
      :class="rarityColors[trait.rarity]"
    />

    <div>
      <div class="flex items-center justify-between mb-4">
        <div
          class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
          :class="isUnlocked ? 'bg-primary-container/20 text-primary border border-primary/40' : 'bg-surface-container text-text-muted border border-border-subtle/60'"
        >
          <span class="material-symbols-outlined text-[24px]">
            {{ isUnlocked ? trait.icon : 'lock' }}
          </span>
        </div>
        <span
          class="text-xs font-bold font-sans uppercase tracking-wider px-2.5 py-1 rounded-full"
          :class="isUnlocked ? rarityBadge[trait.rarity] : 'bg-surface-container text-text-muted border border-border-subtle/50'"
        >
          {{ isUnlocked ? trait.rarity : 'Terkunci' }}
        </span>
      </div>

      <!-- Trait Title -->
      <h4 class="font-display-lg text-lg font-bold text-on-surface mb-1.5 flex items-center gap-1.5">
        <span v-if="isUnlocked">{{ trait.title }}</span>
        <span v-else class="text-text-muted font-sans tracking-widest text-base">??? (Rahasia)</span>
      </h4>

      <!-- Trait Flavor / Secret Hint -->
      <p v-if="isUnlocked" class="text-xs sm:text-sm text-text-secondary italic leading-relaxed">
        "{{ trait.flavorText }}"
      </p>
      <div v-else class="mt-2 p-3 rounded-xl bg-surface-container/80 border border-border-subtle/60 text-xs text-text-secondary">
        <p class="font-bold text-primary text-xs uppercase mb-1 flex items-center gap-1">
          <span class="material-symbols-outlined text-sm text-primary">key</span> Cara Membuka:
        </p>
        <p class="leading-relaxed">{{ trait.secretHint }}</p>
      </div>
    </div>

    <!-- Bottom Status -->
    <div class="mt-5 pt-3 border-t border-border-subtle/40 flex items-center justify-between gap-2 text-xs font-sans">
      <span v-if="isUnlocked" class="text-secondary font-bold flex items-center gap-1 shrink-0">
        <span class="material-symbols-outlined text-base text-secondary">check_circle</span> Terbuka
      </span>
      <span v-else class="text-text-muted flex items-center gap-1 shrink-0">
        <span class="material-symbols-outlined text-base text-text-muted">lock_clock</span> Belum Terpenuhi
      </span>
      <span class="text-text-muted text-[11px] text-right truncate" :title="trait.conditionDescription">
        {{ trait.conditionDescription }}
      </span>
    </div>
  </div>
</template>
