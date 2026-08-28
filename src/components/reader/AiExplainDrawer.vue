<script setup lang="ts">
import GDrawer from '@/components/common/GDrawer.vue';
import GButton from '@/components/common/GButton.vue';
import { useExplainStore } from '@/stores/useExplainStore';

const explainStore = useExplainStore();

const categoryBadgeClass: Record<string, string> = {
  idiom: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700',
  syntax: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700',
  plot: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-700',
  historical: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700',
  vocabulary: 'bg-zinc-200 text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700',
};
</script>

<template>
  <GDrawer
    :modelValue="explainStore.isDrawerOpen"
    title="Context-Aware AI Explain"
    icon="psychology_alt"
    @update:modelValue="explainStore.closeDrawer"
  >
    <div v-if="explainStore.activeExplanation" class="space-y-6">
      <!-- Term & Context Badge -->
      <div class="p-5 rounded-2xl bg-surface-container/70 border border-border-subtle/80">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-sans font-bold uppercase tracking-wider text-text-muted">
            Frasa Terpilih
          </span>
          <span
            class="px-3 py-0.5 rounded-full text-xs font-sans font-bold uppercase border"
            :class="categoryBadgeClass[explainStore.activeExplanation.contextType]"
          >
            {{ explainStore.activeExplanation.contextType }}
          </span>
        </div>
        <h3 class="font-reading-body text-2xl font-bold text-on-surface">
          {{ explainStore.activeExplanation.term }}
        </h3>
      </div>

      <!-- Definition Section -->
      <div>
        <h4 class="text-xs font-sans font-bold uppercase text-primary mb-2 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px] text-primary">menu_book</span> Makna Kontekstual
        </h4>
        <div class="p-4 rounded-2xl bg-surface-container/50 border border-border-subtle text-base text-on-surface leading-relaxed">
          <p class="whitespace-pre-line">{{ explainStore.streamedDefinition }}</p>
          <span v-if="explainStore.isStreaming && !explainStore.streamedContext" class="inline-block w-2 h-4 bg-primary align-middle ml-1 animate-typewriter-cursor"></span>
        </div>
      </div>

      <!-- In-Context Deep Breakdown -->
      <div>
        <h4 class="text-xs font-sans font-bold uppercase text-secondary mb-2 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px] text-secondary">hub</span> Analisis Alur & Sintaks Sastra
        </h4>
        <div class="p-4 rounded-2xl bg-surface-container/50 border border-border-subtle text-base text-text-secondary leading-relaxed font-ui">
          <p class="whitespace-pre-line">{{ explainStore.streamedContext }}</p>
          <span v-if="explainStore.isStreaming && explainStore.streamedContext" class="inline-block w-2 h-4 bg-secondary align-middle ml-1 animate-typewriter-cursor"></span>
        </div>
      </div>

      <!-- Author Note (if available) -->
      <div v-if="explainStore.activeExplanation.authorNote && !explainStore.isStreaming" class="p-4 rounded-2xl bg-primary-container/15 border border-primary/30 text-xs text-on-surface">
        <p class="font-bold text-primary text-xs uppercase mb-1.5 flex items-center gap-1">
          <span class="material-symbols-outlined text-base text-primary">edit_note</span> Catatan Pengarang (Author Annotation)
        </p>
        <p class="italic text-text-secondary text-sm leading-relaxed">"{{ explainStore.activeExplanation.authorNote }}"</p>
      </div>
    </div>

    <template #footer>
      <div class="w-full flex items-center justify-between">
        <span class="text-xs font-sans text-text-muted">
          RAG Simulation • 15ms Latency
        </span>
        <GButton variant="primary" size="md" @click="explainStore.closeDrawer">
          Tutup
        </GButton>
      </div>
    </template>
  </GDrawer>
</template>
