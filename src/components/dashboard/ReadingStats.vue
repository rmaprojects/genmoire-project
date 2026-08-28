<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';
import { gsap } from 'gsap';
import { useProfileStore } from '@/stores/useProfileStore';

const profileStore = useProfileStore();

const containerRef = ref<HTMLElement | null>(null);
const streakCircleRef = ref<SVGElement | null>(null);

const animatedStats = reactive({
  streak: 0,
  booksCompleted: 0,
  explainCount: 0,
});

const recentWeekDays = computed(() => {
  const labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  return labels.map((label, idx) => ({
    label,
    active: idx < (profileStore.currentStreak % 7 || 7),
  }));
});

let ctx: gsap.Context | null = null;

onMounted(() => {
  ctx = gsap.context(() => {
    // 1. Animate numerical counters
    gsap.to(animatedStats, {
      streak: profileStore.currentStreak,
      booksCompleted: profileStore.booksCompleted,
      explainCount: profileStore.explainCount,
      duration: 1.4,
      ease: 'power2.out',
      roundProps: 'streak,booksCompleted,explainCount',
    });

    // 2. Animate SVG streak circle fill
    if (streakCircleRef.value) {
      const targetOffset = 276.46 - (276.46 * (profileStore.currentStreak / 30));
      gsap.fromTo(
        streakCircleRef.value,
        { strokeDashoffset: 276.46 },
        { strokeDashoffset: targetOffset, duration: 1.5, ease: 'power2.out' }
      );
    }

    // 3. Stagger day check badges
    gsap.from('.streak-day-badge', {
      scale: 0,
      opacity: 0,
      stagger: 0.06,
      duration: 0.5,
      ease: 'back.out(2)',
      delay: 0.2,
    });
  }, containerRef.value || undefined);
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>

<template>
  <div ref="containerRef" class="bg-surface-secondary shadow-warm-lg rounded-3xl p-6 sm:p-8 border border-border-subtle flex flex-col justify-between h-full">
    <div class="flex flex-col sm:flex-row items-center gap-8">
      <!-- Circular Progress Visualizer for Streak -->
      <div class="relative w-32 h-32 shrink-0">
        <svg class="w-full h-full -rotate-90 text-primary-fixed-dim" viewBox="0 0 100 100">
          <circle class="opacity-20 text-border-subtle" cx="50" cy="50" fill="none" r="44" stroke="currentColor" stroke-width="6" />
          <circle
            ref="streakCircleRef"
            class="text-primary drop-shadow-md"
            cx="50"
            cy="50"
            fill="none"
            r="44"
            stroke="currentColor"
            stroke-dasharray="276.46"
            stroke-dashoffset="276.46"
            stroke-width="6"
            stroke-linecap="round"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-3xl font-extrabold font-display-lg text-on-surface leading-none">
            {{ animatedStats.streak }}
          </span>
          <span class="text-xs uppercase font-sans text-text-secondary mt-1 font-bold">Hari Streak</span>
        </div>
      </div>

      <!-- Streak Day Markers -->
      <div class="flex-1 w-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-display-lg text-xl sm:text-2xl font-bold text-on-surface flex items-center gap-2">
            <span class="text-error text-2xl">🔥</span> Streak Aktif Membaca
          </h3>
          <span class="text-xs font-sans text-text-muted">Terpanjang: {{ profileStore.longestStreak }} hari</span>
        </div>

        <div class="grid grid-cols-7 gap-2 py-3 border-t border-border-subtle/50">
          <div
            v-for="(day, idx) in recentWeekDays"
            :key="idx"
            class="streak-day-badge flex flex-col items-center gap-1.5"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans font-bold transition-all"
              :class="day.active ? 'bg-primary text-on-primary shadow-sm' : 'border border-border-subtle text-text-muted bg-surface-container/50'"
            >
              <span v-if="day.active" class="material-symbols-outlined text-[16px]">check</span>
              <span v-else>{{ day.label[0] }}</span>
            </div>
            <span class="text-xs font-sans text-text-secondary">{{ day.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mini KPI Stat Row -->
    <div class="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-border-subtle/50 text-center">
      <div class="p-3.5 rounded-2xl bg-surface-container/50 border border-border-subtle/30">
        <p class="text-2xl font-extrabold font-display-lg text-primary">{{ animatedStats.booksCompleted }}</p>
        <p class="text-xs font-bold text-text-secondary uppercase mt-0.5">Buku Selesai</p>
      </div>
      <div class="p-3.5 rounded-2xl bg-surface-container/50 border border-border-subtle/30">
        <p class="text-2xl font-extrabold font-display-lg text-secondary">{{ profileStore.unlockedTraits.length }} / {{ profileStore.allTraits.length }}</p>
        <p class="text-xs font-bold text-text-secondary uppercase mt-0.5">Pencapaian</p>
      </div>
      <div class="p-3.5 rounded-2xl bg-surface-container/50 border border-border-subtle/30">
        <p class="text-2xl font-extrabold font-display-lg text-on-surface">{{ animatedStats.explainCount }}</p>
        <p class="text-xs font-bold text-text-secondary uppercase mt-0.5">Arti Kata Dilihat</p>
      </div>
    </div>
  </div>
</template>
