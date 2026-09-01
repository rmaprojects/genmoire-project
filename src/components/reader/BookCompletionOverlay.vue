<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from '@/stores/useProfileStore';
import { useReaderStore } from '@/stores/useReaderStore';
import GButton from '@/components/common/GButton.vue';
import GProgressBar from '@/components/common/GProgressBar.vue';
import { celebrationAudio, triggerGrandConfetti } from '@/utils/celebrationEffects';

const props = defineProps<{
  modelValue: boolean;
  bookTitle: string;
  bookAuthor?: string;
  coverUrl?: string;
  totalChapters?: number;
  durationMinutes?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'restart'): void;
}>();

const router = useRouter();
const profileStore = useProfileStore();
const readerStore = useReaderStore();

const completionDateFormatted = computed(() => {
  const d = new Date();
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});

const onOverlayOpen = () => {
  celebrationAudio.playBookCompletionChime();
  triggerGrandConfetti('book_completed');
};

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    onOverlayOpen();
  }
});

onMounted(() => {
  if (props.modelValue) {
    onOverlayOpen();
  }
});

const handleBackToDashboard = () => {
  emit('update:modelValue', false);
  router.push('/dashboard');
};

const handleGoToCommunity = () => {
  emit('update:modelValue', false);
  router.push('/community');
};

const handleRestart = () => {
  emit('update:modelValue', false);
  emit('restart');
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-600 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-400 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
      >
        <!-- Background Radiant Aura -->
        <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div class="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-secondary/15 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Main Celebration Card: Royal Certificate of Grimoire Completion -->
        <div class="relative max-w-xl w-full my-auto rounded-3xl bg-[#1C1815] border-2 border-primary/50 text-[#F3EFE6] p-6 sm:p-9 shadow-2xl overflow-hidden text-center space-y-6">
          
          <!-- Ornate Corner Emblems -->
          <span class="absolute top-4 left-4 text-primary/40 font-mono text-xs select-none">✦ ARCHIVE SEAL</span>
          <span class="absolute top-4 right-4 text-primary/40 font-mono text-xs select-none">GENMOIRE ✦</span>

          <!-- Top Seal Badge with Halo -->
          <div class="relative w-24 h-24 mx-auto mt-2 flex items-center justify-center">
            <!-- Rotating Golden Aura Ring -->
            <div class="absolute inset-0 rounded-full border-2 border-dashed border-primary/60 animate-spin" style="animation-duration: 20s;"></div>
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-[#BA9248] via-[#8B6914] to-[#4E3708] border-2 border-[#ECC165] flex items-center justify-center shadow-warm-xl">
              <span class="material-symbols-outlined text-4xl text-white drop-shadow-md">auto_stories</span>
            </div>
            <!-- Little Star Badge -->
            <div class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-secondary border-2 border-[#1C1815] flex items-center justify-center text-white text-xs shadow-md">
              <span class="material-symbols-outlined text-sm font-bold">check</span>
            </div>
          </div>

          <!-- Certificate Header -->
          <div class="space-y-1.5">
            <span class="text-xs font-sans font-bold uppercase tracking-[0.2em] text-primary">
              ✦ Buku Berhasil Ditamatkan ✦
            </span>
            <h2 class="font-reading-body text-2xl sm:text-3xl font-extrabold text-[#F3EFE6] leading-tight">
              {{ bookTitle }}
            </h2>
            <p v-if="bookAuthor" class="text-xs sm:text-sm font-semibold text-[#C5BBAF]">
              Karya {{ bookAuthor }}
            </p>
          </div>

          <!-- Rewards & Achievements Unlocked Strip -->
          <div class="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-[#26221E] border border-white/10 shadow-inner">
            <div class="space-y-1">
              <div class="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center mx-auto">
                <span class="material-symbols-outlined text-lg">military_tech</span>
              </div>
              <p class="text-xs font-bold text-[#F3EFE6]">+1 Buku</p>
              <p class="text-[10px] text-[#A69B8D]">Koleksi Tamat</p>
            </div>

            <div class="space-y-1">
              <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <span class="material-symbols-outlined text-lg">local_fire_department</span>
              </div>
              <p class="text-xs font-bold text-[#F3EFE6]">{{ profileStore.currentStreak }} Hari</p>
              <p class="text-[10px] text-[#A69B8D]">Streak Aktif</p>
            </div>

            <div class="space-y-1">
              <div class="w-8 h-8 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center mx-auto">
                <span class="material-symbols-outlined text-lg">psychology</span>
              </div>
              <p class="text-xs font-bold text-[#F3EFE6]">+50 Glif</p>
              <p class="text-[10px] text-[#A69B8D]">AI Exp</p>
            </div>
          </div>

          <!-- Reader Tier Progress Indicator -->
          <div class="p-4 rounded-2xl bg-[#221E1A] border border-white/10 text-left space-y-2">
            <div class="flex justify-between items-center text-xs font-sans">
              <span class="font-bold text-[#F3EFE6] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-primary text-base">workspace_premium</span>
                Pangkat: {{ profileStore.currentTierInfo.title }}
              </span>
              <span class="text-primary font-bold">{{ profileStore.tierProgressPercent }}%</span>
            </div>

            <GProgressBar
              :value="profileStore.tierProgressPercent"
              variant="gold"
              height="sm"
            />

            <p class="text-[11px] text-[#A69B8D] text-center pt-0.5">
              Tamat pada <span class="text-[#F3EFE6] font-semibold">{{ completionDateFormatted }}</span> • Estimasi baca {{ durationMinutes || 35 }} menit
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2.5 pt-2">
            <div class="flex flex-col sm:flex-row items-center gap-3">
              <GButton
                variant="primary"
                size="lg"
                icon="dashboard"
                customClass="w-full justify-center font-bold shadow-warm-md py-3.5"
                @click="handleBackToDashboard"
              >
                Simpan & Kembali ke Dasbor
              </GButton>

              <GButton
                variant="secondary"
                size="lg"
                icon="forum"
                customClass="w-full sm:w-auto justify-center py-3.5"
                @click="handleGoToCommunity"
              >
                Diskusi Komunitas
              </GButton>
            </div>

            <button
              type="button"
              class="text-xs text-[#A69B8D] hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto py-1 cursor-pointer"
              @click="handleRestart"
            >
              <span class="material-symbols-outlined text-sm">replay</span>
              Baca Ulang dari Bab 1
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>
