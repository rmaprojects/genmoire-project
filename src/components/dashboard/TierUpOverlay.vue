<script setup lang="ts">
import { useProfileStore } from '@/stores/useProfileStore';
import GButton from '@/components/common/GButton.vue';

const profileStore = useProfileStore();
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="profileStore.showTierUpOverlay"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        @click.self="profileStore.showTierUpOverlay = false"
      >
        <div class="relative max-w-md w-full text-center p-8 bg-surface-secondary border-2 border-primary rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center">
          <!-- Glow animation -->
          <div class="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Emblem Icon -->
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-fixed to-primary-container border-2 border-primary flex items-center justify-center text-on-primary shadow-warm-lg mb-4 animate-bounce">
            <span class="material-symbols-outlined text-4xl fill">workspace_premium</span>
          </div>

          <span class="text-xs font-sans font-bold tracking-widest text-primary uppercase mb-1">
            Pangkat Pembaca Meningkat
          </span>

          <h2 class="font-display-lg text-3xl font-extrabold text-on-surface mb-2">
            {{ profileStore.currentTierInfo.title }}
          </h2>

          <p class="text-base text-text-secondary mb-6 leading-relaxed">
            {{ profileStore.currentTierInfo.description }}
          </p>

          <GButton
            variant="primary"
            size="lg"
            rounded
            icon="auto_awesome"
            @click="profileStore.showTierUpOverlay = false"
          >
            Lanjutkan Membaca
          </GButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
