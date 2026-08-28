<script setup lang="ts">
import { useProfileStore } from '@/stores/useProfileStore';

const profileStore = useProfileStore();
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-400 ease-out"
      enter-from-class="opacity-0 translate-y-8 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-8 scale-90"
    >
      <div
        v-if="profileStore.pendingTraitToast"
        class="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-surface-elevated border-2 border-primary shadow-2xl rounded-2xl p-4 flex items-start gap-3.5"
      >
        <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
          <span class="material-symbols-outlined text-2xl fill">{{ profileStore.pendingTraitToast.icon }}</span>
        </div>
        <div class="flex-1">
          <span class="text-xs font-sans font-bold uppercase text-primary tracking-wider">
            Pencapaian Baru Terbuka!
          </span>
          <h4 class="font-display-lg text-base font-bold text-on-surface">
            {{ profileStore.pendingTraitToast.title }}
          </h4>
          <p class="text-xs sm:text-sm text-text-secondary italic mt-0.5">
            "{{ profileStore.pendingTraitToast.flavorText }}"
          </p>
        </div>
        <button
          type="button"
          class="text-text-muted hover:text-on-surface p-1 cursor-pointer"
          @click="profileStore.pendingTraitToast = null"
        >
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
