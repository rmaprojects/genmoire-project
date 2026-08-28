<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useSettingsStore } from '@/stores/useSettingsStore';

defineProps<{
  bookTitle: string;
  chapterTitle: string;
  currentChapterOrder: number;
  currentNodeIndex: number;
  totalNodesInChapter: number;
  progressPercent: number;
  isPureKinetic: boolean;
  isMuted: boolean;
}>();

defineEmits<{
  (e: 'advance'): void;
  (e: 'previous'): void;
  (e: 'togglePureKinetic'): void;
  (e: 'toggleMute'): void;
  (e: 'reportMismatch'): void;
  (e: 'openHistory'): void;
}>();

const settingsStore = useSettingsStore();
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6 transition-opacity duration-300">
    <!-- Top HUD Bar -->
    <div class="w-full flex items-center justify-between pointer-events-auto bg-[#141210]/85 backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-3 shadow-2xl text-[#E8E0D8]">
      <!-- Left: Exit to Dashboard & Title -->
      <div class="flex items-center gap-3">
        <RouterLink
          to="/dashboard"
          class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
          title="Kembali ke Dasbor Perpustakaan"
        >
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          <span class="hidden sm:inline">Dasbor</span>
        </RouterLink>

        <div class="border-l border-white/15 pl-3">
          <h2 class="text-sm font-bold text-white line-clamp-1">
            {{ bookTitle }}
          </h2>
          <p class="text-xs font-sans text-primary-fixed-dim line-clamp-1">
            {{ chapterTitle }}
          </p>
        </div>
      </div>

      <!-- Right: Action Controls -->
      <div class="flex items-center gap-2">
        <!-- History Bacaan / Backlog Button -->
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#E8E0D8] border border-white/15 text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Buka Log Riwayat Bacaan"
          @click="$emit('openHistory')"
        >
          <span class="material-symbols-outlined text-[17px] text-primary">history_edu</span>
          <span class="hidden sm:inline">History Bacaan</span>
        </button>

        <!-- Pure Kinetic / Anti-AI Toggle -->
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-sans font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border"
          :class="isPureKinetic ? 'bg-secondary/40 text-secondary border-secondary' : 'bg-white/10 text-zinc-300 hover:text-white border-white/15'"
          :title="isPureKinetic ? 'Mode Pure Kinetic Aktif (Tanpa Visual AI)' : 'Aktifkan Mode Pure Kinetic'"
          @click="$emit('togglePureKinetic')"
        >
          <span class="material-symbols-outlined text-[16px]">
            {{ isPureKinetic ? 'verified_user' : 'auto_fix_normal' }}
          </span>
          <span class="hidden md:inline">{{ isPureKinetic ? 'Pure Kinetic' : 'Sinematik' }}</span>
        </button>

        <!-- Audio Mute Toggle -->
        <button
          v-if="!isPureKinetic"
          type="button"
          class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          :title="isMuted ? 'Nyalakan Audio' : 'Bisukan Audio'"
          @click="$emit('toggleMute')"
        >
          <span class="material-symbols-outlined text-[18px]">
            {{ isMuted ? 'volume_off' : 'volume_up' }}
          </span>
        </button>

        <!-- Refinement Terminal (Crowdsource Feedback) -->
        <button
          v-if="!isPureKinetic"
          type="button"
          class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-primary transition-colors cursor-pointer"
          title="Laporkan ketidakcocokan CG / Regenerate Prompt"
          @click="$emit('reportMismatch')"
        >
          <span class="material-symbols-outlined text-[18px]">flag</span>
        </button>

        <!-- Settings Drawer trigger (Novel Reading Settings) -->
        <button
          type="button"
          class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          title="Pengaturan Tampilan & Audio"
          @click="settingsStore.openSettings"
        >
          <span class="material-symbols-outlined text-[18px]">tune</span>
        </button>
      </div>
    </div>

    <!-- Bottom HUD Bar: Chapter Progress -->
    <div class="w-full max-w-2xl mx-auto pointer-events-auto bg-[#141210]/85 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 shadow-2xl flex flex-col gap-2 text-[#D8D0C3]">
      <div class="flex items-center justify-between text-xs font-sans text-zinc-300">
        <span>Paragraf {{ currentNodeIndex + 1 }} / {{ totalNodesInChapter }}</span>
        <span class="text-primary font-bold">Bab {{ currentChapterOrder }} • {{ progressPercent }}% Selesai</span>
      </div>

      <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div
          class="bg-gradient-to-r from-[#5C4114] to-[#BA9248] h-full rounded-full transition-all duration-300"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>

      <!-- Navigation Arrows -->
      <div class="flex items-center justify-between pt-1">
        <button
          type="button"
          class="text-xs font-sans text-zinc-300 hover:text-white flex items-center gap-1 cursor-pointer disabled:opacity-30"
          :disabled="currentNodeIndex === 0"
          @click="$emit('previous')"
        >
          <span class="material-symbols-outlined text-sm">navigate_before</span> Sebelumnya
        </button>
        <span class="text-xs text-zinc-400">Klik / Spasi untuk memuat paragraf</span>
        <button
          type="button"
          class="text-xs font-sans text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
          @click="$emit('advance')"
        >
          Berikutnya <span class="material-symbols-outlined text-sm">navigate_next</span>
        </button>
      </div>
    </div>
  </div>
</template>
