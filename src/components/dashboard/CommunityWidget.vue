<script setup lang="ts">
import { RouterLink } from 'vue-router';
import GButton from '@/components/common/GButton.vue';
</script>

<template>
  <div class="bg-gradient-to-br from-surface-secondary via-surface-container/60 to-surface-secondary rounded-3xl p-5 sm:p-6 border border-border-subtle/60 dark:border-transparent shadow-warm-md space-y-3.5 relative overflow-hidden group">
    <!-- Ambient subtle background glow -->
    <div class="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-primary/10 blur-xl pointer-events-none group-hover:bg-primary/20 transition-colors" />

    <div class="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-sans">
      <span class="material-symbols-outlined text-base">forum</span>
      Komunitas Genmoire
    </div>

    <div>
      <h3 class="font-display-lg text-base sm:text-lg font-bold text-on-surface dark:text-[#F3EFE6] leading-tight">
        Ruang Diskusi & Teori Alur
      </h3>
      <p class="text-xs text-text-secondary dark:text-[#C5BBAF] mt-1.5 leading-relaxed">
        Diskusikan misteri naskah, analisis karakter, dan bertukar catatan interpretasi bersama pembaca terverifikasi.
      </p>
    </div>

    <div class="pt-1">
      <RouterLink to="/community" class="block w-full">
        <GButton
          variant="secondary"
          size="sm"
          icon="arrow_forward"
          customClass="w-full justify-center text-xs font-bold py-2.5 shadow-xs group-hover:border-primary/40"
        >
          Masuk ke Forum Diskusi
        </GButton>
      </RouterLink>
    </div>
  </div>
</template>
