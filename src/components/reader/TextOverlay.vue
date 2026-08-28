<script setup lang="ts">
import { computed, watch, nextTick, ref } from 'vue';
import type { TextNode } from '@/types/manifest';
import { useSettingsStore } from '@/stores/useSettingsStore';

const props = defineProps<{
  renderedNodes: TextNode[];
  activeNode: TextNode | null;
  displayedText: string;
  isTypewriting: boolean;
}>();

const emit = defineEmits<{
  (e: 'advance'): void;
  (e: 'explain', term: string): void;
  (e: 'selection', ev: MouseEvent): void;
}>();

const settingsStore = useSettingsStore();
const activeParagraphRef = ref<HTMLElement | null>(null);

const fontSizeClass = computed(() => {
  if (settingsStore.fontSize === 'small') return 'text-lg sm:text-xl leading-[1.8]';
  if (settingsStore.fontSize === 'large') return 'text-2xl sm:text-3xl leading-[1.8]';
  return 'text-xl sm:text-2xl leading-[1.8]';
});

// Auto-scroll into view when new node is added or typewritten
watch(
  () => props.displayedText,
  () => {
    nextTick(() => {
      if (activeParagraphRef.value) {
        activeParagraphRef.value.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
);

const onTextMouseUp = (e: MouseEvent) => {
  emit('selection', e);
};

const onClickContainer = (e: MouseEvent) => {
  // If user is highlighting text, do not advance
  const sel = window.getSelection()?.toString().trim();
  if (sel && sel.length > 0) return;
  emit('advance');
};
</script>

<template>
  <div
    class="relative z-10 w-full min-h-screen flex flex-col justify-start items-center px-4 sm:px-8 pt-24 pb-48 select-text cursor-pointer"
    @mouseup="onTextMouseUp"
    @click="onClickContainer"
  >
    <div class="w-full max-w-3xl text-left space-y-8 relative">
      
      <!-- List of Completed Paragraphs in the current chapter -->
      <div
        v-for="(node, idx) in renderedNodes.slice(0, -1)"
        :key="node.id || idx"
        class="space-y-3 opacity-85 hover:opacity-100 transition-opacity"
        :class="fontSizeClass"
      >
        <!-- Speaker Tag (if specified) -->
        <div v-if="node.speaker" class="inline-flex items-center gap-2">
          <span class="px-3 py-0.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider bg-primary-container/60 text-amber-200 border border-primary/40">
            {{ node.speaker }}
          </span>
          <span v-if="node.speakerTitle" class="text-xs font-sans text-zinc-400">
            • {{ node.speakerTitle }}
          </span>
        </div>

        <!-- Paragraph text -->
        <p class="font-reading-body text-zinc-100 leading-[1.8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {{ node.text }}
        </p>

        <!-- Glif terms -->
        <div v-if="node.highlightedTerms && node.highlightedTerms.length > 0" class="flex flex-wrap items-center gap-2 pt-1 select-none">
          <button
            v-for="term in node.highlightedTerms"
            :key="term"
            type="button"
            class="px-2.5 py-0.5 rounded-full text-xs font-ui font-medium bg-primary/20 hover:bg-primary/40 text-amber-200 border border-primary/40 transition-colors flex items-center gap-1 cursor-pointer"
            @click.stop="$emit('explain', term)"
          >
            <span>{{ term }}</span>
            <span class="material-symbols-outlined text-[12px]">info</span>
          </button>
        </div>
      </div>

      <!-- Active Paragraph currently being typed/rendered -->
      <div
        v-if="activeNode"
        ref="activeParagraphRef"
        class="space-y-3 relative p-4 rounded-2xl bg-black/25 backdrop-blur-[2px] border border-white/5 shadow-2xl transition-all duration-300"
        :class="fontSizeClass"
      >
        <!-- Speaker Tag -->
        <div v-if="activeNode.speaker" class="inline-flex items-center gap-2">
          <span class="px-3.5 py-1 rounded-full text-xs font-sans font-bold uppercase tracking-wider bg-primary-container text-white border border-primary/60 shadow-md">
            {{ activeNode.speaker }}
          </span>
          <span v-if="activeNode.speakerTitle" class="text-xs font-sans text-amber-300">
            • {{ activeNode.speakerTitle }}
          </span>
        </div>

        <!-- Narrative Text with Typewriter Stream -->
        <p class="font-reading-body text-[#FFFBF5] leading-[1.8] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] relative">
          <span class="whitespace-pre-line">{{ displayedText }}</span>

          <!-- Blinking Typewriter Cursor or Advance Indicator -->
          <span
            v-if="isTypewriting"
            class="inline-block w-2.5 h-5 ml-1 bg-amber-400 align-middle animate-typewriter-cursor"
          />
          <span
            v-else
            class="inline-block ml-2 text-primary-fixed-dim animate-bounce align-middle select-none font-sans text-base"
            title="Klik untuk memuat paragraf berikutnya"
          >
            ▼
          </span>
        </p>

        <!-- Highlighted terms quick explain chips -->
        <div v-if="activeNode.highlightedTerms && activeNode.highlightedTerms.length > 0 && !isTypewriting" class="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-white/10 select-none">
          <span class="text-xs font-sans text-amber-300 flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">auto_awesome</span> Glif Istilah:
          </span>
          <button
            v-for="term in activeNode.highlightedTerms"
            :key="term"
            type="button"
            class="px-3 py-1 rounded-full text-xs font-ui font-semibold bg-primary/30 hover:bg-primary/50 text-white border border-primary/50 transition-colors flex items-center gap-1 cursor-pointer"
            @click.stop="$emit('explain', term)"
          >
            <span>{{ term }}</span>
            <span class="material-symbols-outlined text-[13px]">info</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
