<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useProfileStore } from '@/stores/useProfileStore';

const profileStore = useProfileStore();

const containerRef = ref<HTMLElement | null>(null);
const totalWeeks = ref(16);

// Dynamically compute number of columns that fit nicely in sidebar
const updateColumns = () => {
  if (!containerRef.value) return;
  const availableWidth = containerRef.value.clientWidth - 28;
  const colWidth = 14; // 11px tile + 3px gap
  totalWeeks.value = Math.max(12, Math.min(22, Math.floor(availableWidth / colWidth)));
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  updateColumns();
  window.addEventListener('resize', updateColumns);
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => updateColumns());
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateColumns);
  if (resizeObserver) resizeObserver.disconnect();
});

interface HeatmapDay {
  dateStr: string;
  dateFormatted: string;
  isToday: boolean;
  isFuture: boolean;
  minutes: number;
}

const calendarData = computed(() => {
  const weeksCount = totalWeeks.value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const dayOfWeek = (today.getDay() + 6) % 7;
  const currentWeekMonday = new Date(today);
  currentWeekMonday.setDate(today.getDate() - dayOfWeek);

  const startDate = new Date(currentWeekMonday);
  startDate.setDate(startDate.getDate() - (weeksCount - 1) * 7);

  const weeks: HeatmapDay[][] = [];
  const curr = new Date(startDate);

  for (let w = 0; w < weeksCount; w++) {
    const days: HeatmapDay[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = curr.toISOString().split('T')[0];
      const isFuture = curr.getTime() > today.getTime();
      const minutes = isFuture ? 0 : (profileStore.dailyReadTime[dateStr] || 0);

      days.push({
        dateStr,
        dateFormatted: curr.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        isToday: dateStr === todayStr,
        isFuture,
        minutes,
      });

      curr.setDate(curr.getDate() + 1);
    }
    weeks.push(days);
  }

  return weeks;
});

// Color logic according to Warm Material theme (no borders)
const getTileClass = (day: HeatmapDay) => {
  if (day.isFuture) return 'opacity-20 cursor-default bg-surface-container/50';
  if (day.minutes === 0) return 'bg-surface-container/80 dark:bg-[#342D26]/70';
  if (day.minutes < 15) return 'bg-[#8F6A34]/50 dark:bg-[#684C1C]';
  if (day.minutes < 30) return 'bg-[#B88741]/75 dark:bg-[#9B722C]';
  if (day.minutes < 45) return 'bg-[#DC9B34] dark:bg-[#C98A29]';
  return 'bg-[#F2AC38] dark:bg-[#EAA532] shadow-xs';
};

// Hover tooltip state
const activeHover = ref<HeatmapDay | null>(null);
const tooltipPos = ref({ x: 0, y: 0 });

const handleTileMouseEnter = (e: MouseEvent, day: HeatmapDay) => {
  if (day.isFuture) return;
  activeHover.value = day;
  const rect = (e.target as HTMLElement).getBoundingClientRect();
  tooltipPos.value = {
    x: rect.left + rect.width / 2,
    y: rect.top - 8,
  };
};

const handleTileMouseLeave = () => {
  activeHover.value = null;
};
</script>

<template>
  <div
    ref="containerRef"
    class="bg-surface-secondary rounded-3xl p-5 sm:p-6 border border-border-subtle/60 dark:border-transparent shadow-warm-md space-y-4 relative"
  >
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-primary text-xl">calendar_month</span>
        <h3 class="font-display-lg text-sm sm:text-base font-bold text-on-surface dark:text-[#F3EFE6]">
          Aktivitas Membaca
        </h3>
      </div>
      <span class="text-[11px] font-sans font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 dark:border-transparent">
        {{ profileStore.currentStreak }} Hari Aktif
      </span>
    </div>

    <!-- Mini Calendar Matrix -->
    <div class="overflow-x-auto pb-1">
      <div class="flex gap-1 items-center justify-start min-w-max">
        <div
          v-for="(week, wIdx) in calendarData"
          :key="wIdx"
          class="flex flex-col gap-1"
        >
          <div
            v-for="(day, dIdx) in week"
            :key="dIdx"
            class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs transition-all duration-150 cursor-pointer"
            :class="[getTileClass(day), day.isToday ? 'ring-1.5 ring-primary ring-offset-1 ring-offset-surface-secondary' : '']"
            @mouseenter="handleTileMouseEnter($event, day)"
            @mouseleave="handleTileMouseLeave"
          />
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-between text-[10px] text-text-muted dark:text-[#9E9385] font-sans pt-1 border-t border-border-subtle/50">
      <span>{{ totalWeeks }} minggu terakhir</span>
      <div class="flex items-center gap-1">
        <span>Kurang</span>
        <span class="w-2 h-2 rounded-xs bg-surface-container/80 dark:bg-[#342D26]" />
        <span class="w-2 h-2 rounded-xs bg-[#8F6A34]/50 dark:bg-[#684C1C]" />
        <span class="w-2 h-2 rounded-xs bg-[#DC9B34] dark:bg-[#C98A29]" />
        <span class="w-2 h-2 rounded-xs bg-[#F2AC38] dark:bg-[#EAA532]" />
        <span>Sering</span>
      </div>
    </div>

    <!-- Floating Tooltip (Teleported for no clipping) -->
    <Teleport to="body">
      <div
        v-if="activeHover"
        class="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-xl bg-surface-elevated/95 dark:bg-[#1F1914]/95 text-on-surface dark:text-[#F3EFE6] text-xs shadow-warm-xl border border-border-subtle backdrop-blur-md transition-all font-sans whitespace-nowrap"
        :style="{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }"
      >
        <p class="font-bold">{{ activeHover.dateFormatted }}: <span class="text-primary">{{ activeHover.minutes }} menit</span></p>
      </div>
    </Teleport>
  </div>
</template>
