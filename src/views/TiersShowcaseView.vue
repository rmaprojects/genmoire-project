<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProfileStore } from '@/stores/useProfileStore';
import GButton from '@/components/common/GButton.vue';

gsap.registerPlugin(ScrollTrigger);

const profileStore = useProfileStore();

const containerRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);
const carouselRef = ref<HTMLElement | null>(null);
const termsRef = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;

// Genmoire Tier Emblem styling configs
const tierVisuals: Record<number, {
  tierLabel: string;
  themeGradient: string;
  crestGlow: string;
  ringBorder: string;
  ribbonColor: string;
  cardBgGlow: string;
  accentText: string;
}> = {
  1: {
    tierLabel: 'Tier 1',
    themeGradient: 'from-[#8D6E63] via-[#6D4C41] to-[#3E2723]',
    crestGlow: 'shadow-[0_0_20px_rgba(141,110,99,0.35)]',
    ringBorder: 'border-[#A1887F]/40',
    ribbonColor: 'bg-[#5D4037] text-[#D7CCC8] border-0',
    cardBgGlow: 'hover:border-[#8D6E63]/60 dark:hover:border-transparent',
    accentText: 'text-[#8D6E63] dark:text-[#BCAAA4]',
  },
  2: {
    tierLabel: 'Tier 2',
    themeGradient: 'from-[#90A4AE] via-[#607D8B] to-[#37474F]',
    crestGlow: 'shadow-[0_0_20px_rgba(144,164,174,0.4)]',
    ringBorder: 'border-[#CFD8DC]/40',
    ribbonColor: 'bg-[#455A64] text-[#ECEFF1] border-0',
    cardBgGlow: 'hover:border-[#90A4AE]/60 dark:hover:border-transparent',
    accentText: 'text-[#546E7A] dark:text-[#B0BEC5]',
  },
  3: {
    tierLabel: 'Tier 3',
    themeGradient: 'from-[#F59E0B] via-[#D97706] to-[#78350F]',
    crestGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.5)]',
    ringBorder: 'border-[#FCD34D]/50',
    ribbonColor: 'bg-[#92400E] text-[#FEF3C7] border-0',
    cardBgGlow: 'hover:border-[#F59E0B]/70 dark:hover:border-transparent',
    accentText: 'text-amber-600 dark:text-amber-400',
  },
  4: {
    tierLabel: 'Tier 4',
    themeGradient: 'from-[#A855F7] via-[#7E22CE] to-[#4C1D95]',
    crestGlow: 'shadow-[0_0_25px_rgba(168,85,247,0.45)]',
    ringBorder: 'border-[#D8B4FE]/50',
    ribbonColor: 'bg-[#581C87] text-[#F3E8FF] border-0',
    cardBgGlow: 'hover:border-[#A855F7]/70 dark:hover:border-transparent',
    accentText: 'text-purple-600 dark:text-purple-400',
  },
  5: {
    tierLabel: 'Tier 5',
    themeGradient: 'from-[#EF4444] via-[#B91C1C] to-[#450A0A]',
    crestGlow: 'shadow-[0_0_30px_rgba(239,68,68,0.55)]',
    ringBorder: 'border-[#FCA5A5]/50',
    ribbonColor: 'bg-[#7F1D1D] text-[#FEE2E2] border-0',
    cardBgGlow: 'hover:border-[#EF4444]/80 dark:hover:border-transparent',
    accentText: 'text-rose-600 dark:text-rose-400',
  },
};

const getTierStatus = (tierNum: number) => {
  if (tierNum === profileStore.currentTierInfo.tier) return 'current';
  if (tierNum < profileStore.currentTierInfo.tier) return 'completed';
  return 'locked';
};

// Calculate continuous progress percentage across all 5 tiers (0% to 100%)
const getContinuousProgressPercent = () => {
  const books = profileStore.booksCompleted;
  if (books >= 50) return 100;
  if (books <= 0) return 2;
  
  if (books < 3) {
    return Math.max(2, (books / 3) * 20);
  }
  if (books < 10) {
    return 20 + ((books - 3) / 7) * 20;
  }
  if (books < 25) {
    return 40 + ((books - 10) / 15) * 20;
  }
  if (books < 50) {
    return 60 + ((books - 25) / 25) * 20;
  }
  return 100;
};

// Scroll carousel left or right smoothly
const scrollCarousel = (direction: 'left' | 'right') => {
  if (!carouselRef.value) return;
  const scrollAmount = 370;
  carouselRef.value.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
  });
};

// Jump and center specific tier card
const scrollToTier = (tierNum: number) => {
  const targetCard = document.getElementById(`tier-card-${tierNum}`);
  if (targetCard) {
    targetCard.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }
};

onMounted(() => {
  nextTick(() => {
    // 1. Auto-scroll to center current tier in middle of screen
    setTimeout(() => {
      scrollToTier(profileStore.currentTierInfo.tier);
    }, 250);

    // 2. GSAP Entrance Animations
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

      if (carouselRef.value) {
        gsap.from(carouselRef.value.children, {
          opacity: 0,
          y: 35,
          scale: 0.95,
          duration: 0.6,
          ease: 'back.out(1.4)',
          delay: 0.15,
          clearProps: 'opacity,transform',
        });
      }

      if (termsRef.value) {
        gsap.from(termsRef.value, {
          scrollTrigger: {
            trigger: termsRef.value,
            start: 'top 95%',
            once: true,
          },
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
        });
      }

      ScrollTrigger.refresh();
    }, containerRef.value || undefined);
  });
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  <div ref="containerRef" class="max-w-container-max mx-auto px-4 sm:px-8 py-10 space-y-10">
    
    <!-- Top Nav & Header -->
    <div ref="headerRef" class="flex flex-col justify-center items-center md:flex-row md:items-center gap-6 pb-6 border-b border-border-subtle/80">
      <div class="space-y-2">
        <div class="flex items-center gap-3 justify-center">
          <h1 class="font-display-lg text-center text-3xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
            Tierlist
          </h1>
        </div>
        <p class="text-base sm:text-lg text-center text-text-secondary max-w-3xl leading-relaxed">
          Tingkatkan level dedikasi membaca Anda dari <span class="text-on-surface font-semibold">BookTok Scroller</span> hingga mencapai gelar tertinggi <span class="text-primary font-bold">Loremaster</span>. Selesaikan buku untuk meraih lencana kebanggaan, kuota AI Explain bulanan, serta voucher diskon belanja buku.
        </p>
      </div>
    </div>

    <!-- HORIZONTAL CAROUSEL SHOWCASE WITH UNIFIED CONTINUOUS PROGRESS BAR -->
    <div class="space-y-4">

      <!-- Horizontal Scroll Area (Contains the Single Continuous Progress Bar & The 5 Cards) -->
      <div
        ref="carouselRef"
        class="overflow-x-auto scroll-smooth py-6 no-scrollbar"
        style="scrollbar-width: none; -ms-overflow-style: none; padding-left: max(1rem, calc(50% - 185px)); padding-right: max(1rem, calc(50% - 185px));"
      >
        <div class="flex flex-col gap-6 w-max">
          
          <!-- 1. SINGLE UNIFIED CONTINUOUS PROGRESS BAR (Unboxed, seamlessly integrated) -->
          <div class="space-y-4 px-1 w-full">
            

            <!-- Single Continuous Track Line with Live Fill & User Position Pointer -->
            <div class="relative pt-6 pb-2">
              <!-- Background Track Line -->
              <div class="h-3 w-full bg-surface-container rounded-full overflow-hidden border border-border-subtle/80 dark:border-0 dark:border-transparent relative shadow-inner">
                <!-- Active Filled Gradient Line (0% to 100% continuous) -->
                <div
                  class="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-primary rounded-full transition-all duration-700 shadow-sm"
                  :style="{ width: `${getContinuousProgressPercent()}%` }"
                ></div>
              </div>

              <!-- Floating Marker Indicator Pin pointing at exact user position -->
              <div
                class="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 z-20 flex flex-col items-center"
                :style="{ left: `${getContinuousProgressPercent()}%` }"
              >
                <!-- Marker Tooltip Label (Floats cleanly above with -translate-x-1/2) -->
                <div class="absolute -top-7 whitespace-nowrap bg-amber-500 text-stone-950 font-sans font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-md border border-amber-300/40 flex items-center gap-1 -translate-x-1/2">
                  <span class="material-symbols-outlined text-xs">navigation</span>
                  Posisi Anda ({{ profileStore.booksCompleted }} Buku)
                </div>
                <!-- Marker Dot Pin -->
                <div class="w-5 h-5 rounded-full bg-amber-500 border-2 border-white dark:border-stone-900 shadow-md flex items-center justify-center text-stone-950 ring-4 ring-amber-500/30 -translate-x-1/2">
                  <span class="material-symbols-outlined text-[11px] font-bold">person</span>
                </div>
              </div>
            </div>

            <!-- Milestone Progress Distance Summary -->
            <div class="flex items-center justify-between text-xs font-sans text-text-secondary pt-1">
              <span>0 Buku</span>
              <span class="text-primary font-bold">
                Sisa {{ Math.max(0, 50 - profileStore.booksCompleted) }} buku lagi menuju Gelar Tertinggi (Loremaster)
              </span>
              <span>50+ Buku</span>
            </div>

          </div>

          <!-- 2. THE 5 TIER CARDS (Aligned directly beneath the continuous track) -->
          <div class="flex gap-6 items-stretch">
            <div
              v-for="tier in profileStore.allTiers"
              :id="`tier-card-${tier.tier}`"
              :key="tier.tier"
              class="w-[320px] sm:w-[350px] md:w-[370px] h-[650px] shrink-0 rounded-3xl p-6 flex flex-col justify-between relative bg-surface-secondary border border-border-subtle/60 dark:border-transparent transition-all duration-300 shadow-warm-lg hover:shadow-warm-xl dark:shadow-2xl overflow-hidden"
              :class="[
                tierVisuals[tier.tier].cardBgGlow,
                getTierStatus(tier.tier) === 'current'
                  ? 'ring-2 ring-primary shadow-2xl scale-[1.01] bg-gradient-to-b from-surface-secondary to-surface-container/70'
                  : 'opacity-95'
              ]"
            >
          <!-- TOP FIXED SECTION: Shield Emblem, Tier Header & Quote Outside Container -->
          <div class="text-center relative z-10">
            <!-- Tier Badge Pill & Status -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full shadow-inner" :class="tierVisuals[tier.tier].ribbonColor">
                {{ tierVisuals[tier.tier].tierLabel }}
              </span>

              <!-- Status Tag -->
              <span
                v-if="getTierStatus(tier.tier) === 'current'"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-primary text-on-primary flex items-center gap-1 shadow-sm animate-pulse"
              >
                <span class="material-symbols-outlined text-xs">verified</span> Aktif
              </span>
              <span
                v-else-if="getTierStatus(tier.tier) === 'completed'"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-xs">check_circle</span> Dicapai
              </span>
              <span
                v-else
                class="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-surface-container text-text-muted border border-border-subtle/50 dark:border-transparent flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-xs">lock</span> Terkunci
              </span>
            </div>

            <!-- Big Circular Crest Emblem -->
            <div class="relative w-24 h-24 mx-auto my-1 flex items-center justify-center">
              <!-- Outer glowing aura ring -->
              <div
                class="absolute inset-0 rounded-full bg-gradient-to-br border-2 opacity-90 transition-transform duration-300 group-hover:scale-105"
                :class="[
                  tierVisuals[tier.tier].themeGradient,
                  tierVisuals[tier.tier].ringBorder,
                  tierVisuals[tier.tier].crestGlow
                ]"
              ></div>

              <!-- Inner shield icon -->
              <div class="relative z-10 w-20 h-20 rounded-full bg-surface-primary/40 backdrop-blur-sm border border-white/10 dark:border-transparent flex flex-col items-center justify-center text-white shadow-inner">
                <span class="material-symbols-outlined text-4xl drop-shadow-md">{{ tier.emblemIcon }}</span>
              </div>
            </div>

            <!-- Tier Title & Requirement Banner -->
            <div class="mt-2">
              <h3 class="font-display-lg text-xl font-extrabold text-on-surface leading-snug">
                {{ tier.title }}
              </h3>
              <p class="text-xs font-sans font-bold mt-0.5" :class="tierVisuals[tier.tier].accentText">
                Syarat: {{ tier.min }} – {{ tier.max === Infinity ? '50+' : tier.max }} Buku Tamat
              </p>
            </div>

            <!-- Clean Quote Outside Container (Using quotes "") -->
            <p class="text-sm sm:text-base text-on-surface/90 font-serif italic text-center my-3 px-2 leading-relaxed">
              “{{ tier.personality }}”
            </p>
          </div>

          <!-- SCROLLABLE SECTION: Starts from Rewards and Benefits -->
          <div
            class="flex-1 overflow-y-auto my-2 pr-1.5 space-y-3.5 text-left border-t border-border-subtle/50 dark:border-transparent pt-3 custom-scrollbar"
            style="scrollbar-width: thin;"
          >
            <!-- Rewards (Monthly Credits & Vouchers) -->
            <div class="space-y-2">
              <span class="text-[11px] font-sans font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                <span class="material-symbols-outlined text-amber-500 text-sm">card_giftcard</span>
                Hadiah Tiap Bulan:
              </span>

              <div class="space-y-1.5">
                <div
                  v-for="(reward, idx) in tier.rewards"
                  :key="idx"
                  class="p-2.5 rounded-xl bg-surface-container border border-border-subtle/50 dark:border-transparent flex items-start gap-2.5 shadow-2xs"
                >
                  <span class="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">{{ reward.icon }}</span>
                  <div>
                    <p class="text-xs font-bold text-on-surface leading-tight">{{ reward.label }}</p>
                    <p v-if="reward.description" class="text-[11px] text-text-secondary mt-0.5 leading-snug">
                      {{ reward.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Exclusive Reader Benefits List (Checklist style) -->
            <div class="space-y-1.5">
              <span class="text-[11px] font-sans font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                <span class="material-symbols-outlined text-secondary text-sm">verified_user</span>
                Hak Istimewa:
              </span>
              <ul class="space-y-1.5 text-xs text-text-secondary">
                <li
                  v-for="(benefit, bIdx) in tier.benefits"
                  :key="bIdx"
                  class="flex items-start gap-2 text-[11px] leading-snug"
                >
                  <span class="material-symbols-outlined text-primary text-sm shrink-0 mt-0.5">check_circle</span>
                  <span>{{ benefit }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- BOTTOM FIXED FOOTER: Status Bar or Unlock Progress -->
          <div class="pt-2 relative z-10">
            <div
              v-if="getTierStatus(tier.tier) === 'current'"
              class="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary text-xs font-sans font-bold text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <span class="material-symbols-outlined text-sm">workspace_premium</span>
              Pangkat Aktif Anda
            </div>

            <div
              v-else-if="getTierStatus(tier.tier) === 'completed'"
              class="w-full py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-sans font-bold text-center flex items-center justify-center gap-1.5"
            >
              <span class="material-symbols-outlined text-sm">check</span>
              Pangkat Telah Terlampaui
            </div>

            <div
              v-else-if="tier.tier === profileStore.currentTierInfo.tier + 1"
              class="space-y-1.5"
            >
              <div class="flex justify-between text-[11px] font-sans text-text-secondary font-semibold">
                <span>Progres Menuju Gelar Ini</span>
                <span class="text-primary font-bold">{{ profileStore.tierProgressPercent }}%</span>
              </div>
              <div class="w-full bg-surface-container rounded-full h-2 overflow-hidden border border-border-subtle dark:border-0 dark:border-transparent">
                <div
                  class="bg-gradient-to-r from-primary to-amber-400 h-full rounded-full transition-all duration-700"
                  :style="{ width: `${profileStore.tierProgressPercent}%` }"
                />
              </div>
              <p class="text-[10px] font-sans text-text-muted text-center">
                Sisa {{ tier.min - profileStore.booksCompleted }} buku lagi
              </p>
            </div>

            <div
              v-else
              class="w-full py-2 px-3 rounded-xl bg-surface-container text-text-muted text-xs font-sans font-semibold text-center flex items-center justify-center gap-1.5 border border-border-subtle"
            >
              <span class="material-symbols-outlined text-sm">lock</span>
              Butuh {{ tier.min - profileStore.booksCompleted }} Buku Lagi
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Terms and Conditions Notice (Syarat & Ketentuan Berlaku) -->
    <div
      ref="termsRef"
      class="bg-surface-container/40 rounded-2xl p-6 sm:p-8 border border-border-subtle/80 space-y-3"
    >
      <div class="flex items-center gap-2 text-on-surface font-bold text-base">
        <span class="material-symbols-outlined text-primary text-xl">gavel</span>
        <h3>Syarat dan Ketentuan Hadiah Pangkat (Terms & Conditions)</h3>
      </div>
      <ul class="space-y-2 text-xs sm:text-sm text-text-secondary leading-relaxed list-disc list-inside">
        <li>
          <strong class="text-on-surface">Validasi Penamatan Buku:</strong> Buku dihitung tamat secara sah ketika pembaca mencapai paragraf terakhir dari bab penutup dengan durasi membaca yang wajar sesuai rasio naskah.
        </li>
        <li>
          <strong class="text-on-surface">Pembaruan Kredit AI Explain:</strong> Kuota kredit bulanan diisi ulang secara otomatis setiap awal bulan kalender dan tidak dapat diakumulasikan ke bulan berikutnya.
        </li>
        <li>
          <strong class="text-on-surface">Penerbitan Voucher Diskon Buku:</strong> Kode voucher diskon akan dikirimkan otomatis ke notifikasi akun saat jumlah buku yang disyaratkan berhasil diselesaikan.
        </li>
        <li>
          <strong class="text-on-surface">Integritas Membaca:</strong> Sistem anti-eksploitasi Genmoire secara otomatis mendiskualifikasi sesi membaca cepat buatan (*rapid clickbot*).
        </li>
        <li>
          Seluruh syarat dan ketentuan program pangkat ini berlaku untuk semua pembaca terdaftar di platform Genmoire.
        </li>
      </ul>
    </div>

  </div>
</template>

<style scoped>
/* Sleek custom scrollbar for inside card scrolling */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(150, 150, 150, 0.25);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(150, 150, 150, 0.45);
}

/* Hide scrollbar for carousel container */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
