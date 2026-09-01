<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from '@/stores/useProfileStore';
import { celebrationAudio, triggerGrandConfetti } from '@/utils/celebrationEffects';

const router = useRouter();
const profileStore = useProfileStore();

const onTraitOpen = () => {
  celebrationAudio.playAchievementSparkle();
  triggerGrandConfetti('achievement');
};

watch(() => profileStore.pendingTraitToast, (val) => {
  if (val) {
    onTraitOpen();
  }
});

onMounted(() => {
  if (profileStore.pendingTraitToast) {
    onTraitOpen();
  }
});

const handleViewAchievements = () => {
  profileStore.pendingTraitToast = null;
  router.push('/profile');
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
      enter-from-class="opacity-0 translate-y-12 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-12 scale-90"
    >
      <div
        v-if="profileStore.pendingTraitToast"
        class="fixed bottom-20 lg:bottom-8 right-4 sm:right-8 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] sm:w-full bg-[#1C1815] border-2 border-primary/80 shadow-2xl rounded-3xl p-4 sm:p-5 flex items-start gap-4 text-[#F3EFE6] overflow-hidden"
      >
        <!-- Ambient Corner Glow -->
        <div class="absolute -top-10 -right-10 w-24 h-24 bg-primary/25 rounded-full blur-xl pointer-events-none"></div>

        <!-- Trophy/Badge Icon -->
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-[#4E3708] border border-[#ECC165] flex items-center justify-center text-white shrink-0 shadow-warm-md animate-bounce">
          <span class="material-symbols-outlined text-2xl fill">{{ profileStore.pendingTraitToast.icon || 'military_tech' }}</span>
        </div>

        <div class="flex-1 min-w-0 space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
              Pencapaian Terbuka!
            </span>
            <span class="text-[10px] text-[#A69B8D] font-mono">✦ NEW LORE</span>
          </div>

          <h4 class="font-display-lg text-base font-extrabold text-[#F3EFE6] truncate">
            {{ profileStore.pendingTraitToast.title }}
          </h4>

          <p class="text-xs text-[#D8D0C3] italic leading-relaxed line-clamp-2">
            "{{ profileStore.pendingTraitToast.flavorText }}"
          </p>

          <div class="pt-1 flex items-center gap-3">
            <button
              type="button"
              class="text-xs font-sans font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              @click="handleViewAchievements"
            >
              Lihat di Profil <span class="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          class="text-[#A69B8D] hover:text-[#F3EFE6] p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          aria-label="Tutup"
          @click="profileStore.pendingTraitToast = null"
        >
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
