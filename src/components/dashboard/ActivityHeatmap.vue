<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useProfileStore } from '@/stores/useProfileStore';

const profileStore = useProfileStore();

const gridContainerRef = ref<HTMLElement | null>(null);
const totalWeeks = ref(52);

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const fullDayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

interface HeatmapDay {
  dateStr: string;
  dateFormatted: string;
  dayNumber: number;
  isToday: boolean;
  isFuture: boolean;
  minutes: number;
}

interface MonthMarker {
  name: string;
  colIndex: number;
}

// Calculate the exact number of week columns to fill 100% of the available container width
const updateColumns = () => {
  if (!gridContainerRef.value) return;
  const availableWidth = gridContainerRef.value.clientWidth - 36; // minus day labels width & gaps
  const columnWidth = 17; // 13.5px tile + 3.5px gap
  const calculated = Math.floor(availableWidth / columnWidth);
  totalWeeks.value = Math.max(16, calculated);
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  updateColumns();
  window.addEventListener('resize', updateColumns);
  if (gridContainerRef.value) {
    resizeObserver = new ResizeObserver(() => updateColumns());
    resizeObserver.observe(gridContainerRef.value);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateColumns);
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

const calendarData = computed(() => {
  const weeksCount = totalWeeks.value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  
  // Find Monday of the current week (0 = Mon, 6 = Sun)
  const dayOfWeek = (today.getDay() + 6) % 7;
  const currentWeekMonday = new Date(today);
  currentWeekMonday.setDate(today.getDate() - dayOfWeek);
  
  // Start (weeksCount - 1) weeks prior so current week is column weeksCount - 1 (far right)
  const startDate = new Date(currentWeekMonday);
  startDate.setDate(currentWeekMonday.getDate() - (weeksCount - 1) * 7);
  
  const weeks: HeatmapDay[][] = [];
  const monthMarkers: MonthMarker[] = [];
  
  let lastMonth = -1;
  const curr = new Date(startDate);
  
  for (let w = 0; w < weeksCount; w++) {
    const week: HeatmapDay[] = [];
    const currentMonth = curr.getMonth();
    
    // Add month marker when month changes (or at start)
    if (currentMonth !== lastMonth) {
      monthMarkers.push({
        name: monthNamesShort[currentMonth],
        colIndex: w,
      });
      lastMonth = currentMonth;
    }
    
    for (let d = 0; d < 7; d++) {
      const dateStr = curr.toISOString().split('T')[0];
      const isToday = dateStr === todayStr;
      const isFuture = curr.getTime() > today.getTime();
      const minutes = !isFuture ? (profileStore.dailyReadTime[dateStr] || 0) : 0;
      
      const dayName = fullDayNames[d];
      const dayNumber = curr.getDate();
      const monthName = monthNames[curr.getMonth()];
      const dateFormatted = `${dayName}, ${dayNumber} ${monthName} ${curr.getFullYear()}`;
      
      week.push({
        dateStr,
        dateFormatted,
        dayNumber,
        isToday,
        isFuture,
        minutes,
      });
      
      curr.setDate(curr.getDate() + 1);
    }
    weeks.push(week);
  }
  
  return { weeks, monthMarkers };
});

// Summary metrics across all recorded past days
const stats = computed(() => {
  const allDays = calendarData.value.weeks.flatMap(w => w).filter(d => !d.isFuture);
  const totalMinutes = allDays.reduce((acc, d) => acc + d.minutes, 0);
  const activeDays = allDays.filter(d => d.minutes > 0).length;
  const totalDays = allDays.length;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeFormatted = hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;
  const consistencyPercent = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;

  return {
    totalMinutes,
    timeFormatted,
    activeDays,
    totalDays,
    consistencyPercent,
  };
});

// Warm Material Narrative - High Contrast Academic Gold & Warm Amber Color Gradient (Border-free)
const getDayColorClass = (day: HeatmapDay) => {
  if (day.isFuture) {
    return 'bg-surface-container-low/40 dark:bg-surface-container-low/30 opacity-15 pointer-events-none';
  }
  if (day.minutes === 0) {
    return 'bg-[#E4DFD7] dark:bg-[#282420] hover:brightness-110';
  }
  if (day.minutes < 15) {
    return 'bg-[#FDE68A] dark:bg-[#57390F] hover:brightness-110';
  }
  if (day.minutes < 30) {
    return 'bg-[#F59E0B] dark:bg-[#966619] hover:brightness-110 shadow-xs';
  }
  if (day.minutes < 60) {
    return 'bg-[#D97706] dark:bg-[#D49826] text-stone-900 hover:brightness-115 shadow-sm';
  }
  // 60+ minutes (High Achievement - Radiant Champagne Gold)
  return 'bg-[#B45309] dark:bg-[#F5B838] text-stone-950 hover:brightness-120 shadow-md';
};

// Tooltip positioning helper to prevent edge cutoff
const getTooltipPositionClass = (colIndex: number) => {
  const total = totalWeeks.value;
  if (colIndex >= total - 5) {
    return 'right-0 left-auto translate-x-0';
  }
  if (colIndex <= 4) {
    return 'left-0 translate-x-0';
  }
  return 'left-1/2 -translate-x-1/2';
};

const getTooltipArrowClass = (colIndex: number) => {
  const total = totalWeeks.value;
  if (colIndex >= total - 5) {
    return 'right-3 left-auto';
  }
  if (colIndex <= 4) {
    return 'left-3';
  }
  return 'left-1/2 -translate-x-1/2';
};
</script>

<template>
  <div class="bg-surface-secondary shadow-warm-md rounded-3xl p-6 sm:p-8 border border-border-subtle space-y-6">
    
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle/80">
      <div>
        <h3 class="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface flex items-center gap-2.5">
          <span class="material-symbols-outlined text-primary text-2xl">calendar_month</span>
          Konsistensi Membaca (Activity Heatmap)
        </h3>
        <p class="text-sm sm:text-base text-text-secondary mt-1">
          Intensitas warna Warm Amber memetakan total menit membaca harian hingga hari ini (kanan). Arahkan kursor pada kotak untuk melihat rincian tanggal & durasi.
        </p>
      </div>

      <!-- Quick Status Chip -->
      <div class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold shrink-0">
        <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        <span>{{ stats.activeDays }} Hari Aktif</span>
      </div>
    </div>

    <!-- GitHub Contribution Container (Uses warm surface container background) -->
    <div
      ref="gridContainerRef"
      class="p-5 sm:p-6 pt-6 rounded-2xl bg-surface-container border border-border-subtle/70 w-full shadow-inner"
    >
      
      <div class="w-full">
        
        <!-- Top Row: Month Labels positioned proportionally across full row width -->
        <div class="relative h-5 mb-1.5 pl-7 text-[11px] font-sans text-text-muted select-none w-full">
          <span
            v-for="marker in calendarData.monthMarkers"
            :key="marker.colIndex + marker.name"
            class="absolute top-0 font-medium whitespace-nowrap"
            :style="{ left: `calc(28px + ${(marker.colIndex / totalWeeks) * (100 - (28 / (gridContainerRef?.clientWidth || 800) * 100))}%)` }"
          >
            {{ marker.name }}
          </span>
        </div>

        <div class="flex gap-2 items-start pt-2 w-full">
          
          <!-- Left Column: Sen, Rab, Jum Labels (Exact GitHub 7-row alignment with small square height) -->
          <div class="grid grid-rows-7 gap-[3px] text-[10px] font-sans text-text-muted select-none w-5 shrink-0">
            <span class="h-3.5 flex items-center leading-none">Sen</span>
            <span class="h-3.5"></span>
            <span class="h-3.5 flex items-center leading-none">Rab</span>
            <span class="h-3.5"></span>
            <span class="h-3.5 flex items-center leading-none">Jum</span>
            <span class="h-3.5"></span>
            <span class="h-3.5"></span>
          </div>

          <!-- Dynamic Week Columns Grid (Spans 100% of row width with zero right whitespace) -->
          <div class="flex-1 flex justify-between gap-[3px] w-full">
            <div
              v-for="(week, wIdx) in calendarData.weeks"
              :key="wIdx"
              class="grid grid-rows-7 gap-[3px] flex-1 min-w-0"
            >
              <div
                v-for="(day, dIdx) in week"
                :key="dIdx"
                class="relative group flex items-center justify-center w-full"
              >
                <!-- Exact GitHub Small Square Tile without borders -->
                <div
                  class="w-full aspect-square max-w-[15px] max-h-[15px] rounded-[2.5px] transition-all duration-100 cursor-pointer hover:scale-130 hover:z-30"
                  :class="[
                    getDayColorClass(day),
                    day.isToday ? 'ring-2 ring-primary shadow-xs' : ''
                  ]"
                />

                <!-- Floating Tooltip on Hover (High Z-Index & Edge-Aware Positioning) -->
                <div
                  v-if="!day.isFuture"
                  class="absolute bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:-translate-y-1 transition-all duration-150 pointer-events-none z-[100] whitespace-nowrap bg-surface-elevated text-on-surface text-xs font-sans px-3 py-1.5 rounded-xl shadow-warm-xl border border-border-subtle flex items-center gap-2"
                  :class="getTooltipPositionClass(wIdx)"
                >
                  <span
                    class="w-2 h-2 rounded-full shrink-0"
                    :class="day.minutes > 0 ? 'bg-primary ring-2 ring-primary/30' : 'bg-text-muted/40'"
                  ></span>
                  <div>
                    <p class="font-bold text-on-surface">{{ day.dateFormatted }}</p>
                    <p :class="day.minutes > 0 ? 'text-primary font-semibold' : 'text-text-muted'">
                      {{ day.minutes > 0 ? `${day.minutes} menit membaca` : 'Tidak ada aktivitas membaca' }}
                    </p>
                  </div>
                  <!-- Tooltip arrow -->
                  <div
                    class="w-2 h-2 bg-surface-elevated rotate-45 border-r border-b border-border-subtle -mb-1 absolute bottom-0"
                    :class="getTooltipArrowClass(wIdx)"
                  ></div>
                </div>

              </div>
            </div>
          </div>

        </div>

        <!-- Bottom Bar (GitHub Footer Layout): Summary on Left, Legend on Right -->
        <div class="mt-4 pt-3 border-t border-border-subtle/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm text-primary">insights</span>
            <span>
              Total: <strong class="text-on-surface">{{ stats.activeDays }} dari {{ stats.totalDays }} hari aktif</strong> ({{ stats.timeFormatted }} • {{ stats.consistencyPercent }}% konsistensi)
            </span>
          </div>

          <!-- Legend: Kurang [borderless squares in Warm Amber Gold] Banyak -->
          <div class="flex items-center gap-2 font-sans select-none">
            <span>Kurang</span>
            <div class="w-3.5 h-3.5 rounded-[2.5px] bg-[#E4DFD7] dark:bg-[#282420]" title="0 menit"></div>
            <div class="w-3.5 h-3.5 rounded-[2.5px] bg-[#FDE68A] dark:bg-[#57390F]" title="1 - 14 menit"></div>
            <div class="w-3.5 h-3.5 rounded-[2.5px] bg-[#F59E0B] dark:bg-[#966619]" title="15 - 29 menit"></div>
            <div class="w-3.5 h-3.5 rounded-[2.5px] bg-[#D97706] dark:bg-[#D49826]" title="30 - 59 menit"></div>
            <div class="w-3.5 h-3.5 rounded-[2.5px] bg-[#B45309] dark:bg-[#F5B838]" title="60+ menit"></div>
            <span>Banyak</span>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>
