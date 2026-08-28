<script setup lang="ts">
import { useExplainStore } from '@/stores/useExplainStore';

const explainStore = useExplainStore();
</script>

<template>
  <div
    v-if="explainStore.isChipVisible"
    class="fixed z-40 transform -translate-x-1/2 select-none animate-bounce"
    :style="{
      left: `${explainStore.chipPosition.x}px`,
      top: `${explainStore.chipPosition.y}px`
    }"
  >
    <button
      type="button"
      class="px-4 py-2 rounded-full bg-primary-container text-on-primary font-ui text-xs font-bold shadow-2xl border border-primary flex items-center gap-1.5 hover:bg-primary transition-all cursor-pointer"
      @click.stop="explainStore.explainTerm(explainStore.selectedText)"
    >
      <span class="material-symbols-outlined text-[17px] fill">auto_awesome</span>
      <span>AI Explain</span>
    </button>
  </div>
</template>
