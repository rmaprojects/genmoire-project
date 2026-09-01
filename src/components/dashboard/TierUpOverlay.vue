<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from '@/stores/useProfileStore';
import GButton from '@/components/common/GButton.vue';
import { celebrationAudio, triggerGrandConfetti } from '@/utils/celebrationEffects';

const router = useRouter();
const profileStore = useProfileStore();

const onTierUpOpen = () => {
  celebrationAudio.playTierUpFanfare();
  triggerGrandConfetti('tier_up');
};

watch(() => profileStore.showTierUpOverlay, (isOpen) => {
  if (isOpen) {
    onTierUpOpen();
  }
});

onMounted(() => {
  if (profileStore.showTierUpOverlay) {
    onTierUpOpen();
  }
});

const handleViewAllTiers = () => {
  profileStore.showTierUpOverlay = false;
  router.push('/tiers');
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-600 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-400 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <div
        v-if="profileStore.showTierUpOverlay"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto"
        @click.self="profileStore.showTierUpOverlay = false"
      >
        <!-- Background Radiant Halo Burst -->
        <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div class="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/25 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Ascension Showcase Container -->
        <div class="relative max-w-lg w-full my-auto text-center p-6 sm:p-9 bg-[#1C1815] border-2 border-primary text-[#F3EFE6] rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center space-y-5">
          
          <!-- Top Subtitle Kicker -->
          <div class="flex items-center gap-2">
            <span class="animate-ping w-2 h-2 rounded-full bg-primary inline-block"></span>
            <span class="text-xs font-sans font-extrabold tracking-[0.25em] text-primary uppercase">
              ✦ Kenaikan Pangkat Pembaca ✦
            </span>
          </div>

          <!-- Crest Emblem with Rotating Halo -->
          <div class="relative w-28 h-28 my-1 flex items-center justify-center">
            <!-- Rotating Halo Ring -->
            <div class="absolute inset-0 rounded-full border-2 border-dashed border-primary/70 animate-spin" style="animation-duration: 24s;"></div>
            
            <!-- Inner Solid Shield with Glow -->
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-[#BA9248] via-[#8B6914] to-[#3E2723] border-3 border-[#ECC165] flex items-center justify-center text-white shadow-2xl">
              <span class="material-symbols-outlined text-5xl drop-shadow-lg fill">
                {{ profileStore.currentTierInfo.emblemIcon }}
              </span>
            </div>

            <!-- Tier Level Badge Pin -->
            <div class="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-primary border-2 border-[#1C1815] text-[11px] font-sans font-extrabold text-on-primary shadow-md">
              Tier {{ profileStore.currentTierInfo.tier }}
            </div>
          </div>

          <!-- Rank Title & Requirement -->
          <div class="space-y-1">
            <h2 class="font-display-lg text-2xl sm:text-4xl font-extrabold text-[#F3EFE6] tracking-tight">
              {{ profileStore.currentTierInfo.title }}
            </h2>
            <p class="text-xs font-sans font-bold text-primary">
              Pencapaian: {{ profileStore.booksCompleted }} Buku Selesai Ditamatkan
            </p>
          </div>

          <!-- Personality Quote -->
          <p class="text-sm font-serif italic text-[#D8D0C3] px-3 leading-relaxed">
            “{{ profileStore.currentTierInfo.personality }}”
          </p>

          <!-- Newly Unlocked Perks Box -->
          <div class="w-full p-4 rounded-2xl bg-[#26221E] border border-white/10 text-left space-y-2.5 shadow-inner">
            <span class="text-[11px] font-sans font-bold uppercase tracking-wider text-[#A69B8D] flex items-center gap-1.5">
              <span class="material-symbols-outlined text-amber-400 text-sm">card_giftcard</span>
              Hak Istimewa & Hadiah Baru:
            </span>
            <ul class="space-y-1.5 text-xs text-[#E8E0D8]">
              <li
                v-for="(benefit, idx) in profileStore.currentTierInfo.benefits.slice(0, 3)"
                :key="idx"
                class="flex items-start gap-2 text-[11px] leading-snug"
              >
                <span class="material-symbols-outlined text-secondary text-sm shrink-0 mt-0.5">check_circle</span>
                <span>{{ benefit }}</span>
              </li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="w-full flex flex-col sm:flex-row items-center gap-3 pt-2">
            <GButton
              variant="primary"
              size="lg"
              icon="workspace_premium"
              customClass="w-full justify-center font-bold shadow-warm-md py-3.5"
              @click="profileStore.showTierUpOverlay = false"
            >
              Klaim & Lanjutkan
            </GButton>

            <GButton
              variant="secondary"
              size="lg"
              icon="military_tech"
              customClass="w-full sm:w-auto justify-center py-3.5"
              @click="handleViewAllTiers"
            >
              Daftar Pangkat
            </GButton>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>
