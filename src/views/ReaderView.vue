<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useReaderStore } from '@/stores/useReaderStore';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useExplainStore } from '@/stores/useExplainStore';
import { useThemeStore } from '@/stores/useThemeStore';

import CgBackground from '@/components/reader/CgBackground.vue';
import TextOverlay from '@/components/reader/TextOverlay.vue';
import ReaderHud from '@/components/reader/ReaderHud.vue';
import AiExplainChip from '@/components/reader/AiExplainChip.vue';
import AiExplainDrawer from '@/components/reader/AiExplainDrawer.vue';
import ReadingHistoryDrawer from '@/components/reader/ReadingHistoryDrawer.vue';
import SettingsDrawer from '@/components/layout/SettingsDrawer.vue';
import RefinementTerminal from '@/components/terminal/RefinementTerminal.vue';
import TierUpOverlay from '@/components/dashboard/TierUpOverlay.vue';
import TraitToast from '@/components/dashboard/TraitToast.vue';

const route = useRoute();
const readerStore = useReaderStore();
const libraryStore = useLibraryStore();
const settingsStore = useSettingsStore();
const explainStore = useExplainStore();
const themeStore = useThemeStore();

const onExplainWord = (term: string) => {
  explainStore.explainTerm(term);
};

const onTextSelection = (e: MouseEvent) => {
  explainStore.handleSelection(e);
};

const onCgRefined = (newUrl: string) => {
  readerStore.closeRefinementTerminal(newUrl);
};

const onKeyDown = (e: KeyboardEvent) => {
  if (
    explainStore.isDrawerOpen ||
    settingsStore.isSettingsDrawerOpen ||
    readerStore.isRefinementTerminalOpen ||
    readerStore.isHistoryLogOpen
  ) {
    return;
  }

  if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'Enter') {
    e.preventDefault();
    readerStore.advance();
  } else if (e.code === 'ArrowLeft') {
    e.preventDefault();
    readerStore.previous();
  }
};

onMounted(() => {
  themeStore.setReaderViewLock(true);
  const bookId = (route.params.bookId as string) || 'chronicles-of-aethelgard';
  const manifest = libraryStore.getManifestByBookId(bookId);
  if (manifest) {
    readerStore.loadBook(manifest);
  }
});

onUnmounted(() => {
  readerStore.stopAudio();
  themeStore.setReaderViewLock(false);
});

// Watch for bookId route change
watch(
  () => route.params.bookId,
  (newId) => {
    if (newId) {
      const manifest = libraryStore.getManifestByBookId(newId as string);
      if (manifest) {
        readerStore.loadBook(manifest);
      }
    }
  }
);
</script>

<template>
  <div
    class="relative w-full min-h-screen bg-[#12100E] text-[#E8E0D8] overflow-x-hidden select-none focus:outline-none"
    tabindex="0"
    @keydown="onKeyDown"
  >
    <!-- Layer 1: CG Background Layer with 45% Dark Scrim -->
    <CgBackground
      :cgUrl="readerStore.currentCg?.url"
      :isPureKinetic="readerStore.isPureKineticMode"
    />

    <!-- Layer 2: Text Content Layer (Cumulative Top-to-Bottom NVL Overlay) -->
    <TextOverlay
      :renderedNodes="readerStore.renderedNodesInChapter"
      :activeNode="readerStore.currentNode"
      :displayedText="readerStore.displayedText"
      :isTypewriting="readerStore.isTypewriting"
      @advance="readerStore.advance"
      @explain="onExplainWord"
      @selection="onTextSelection"
    />

    <!-- Layer 3: Floating Action Chip (AI Explain on text highlight) -->
    <AiExplainChip />

    <!-- Layer 4: Reader HUD (Floating Top & Bottom Controls) -->
    <ReaderHud
      :bookTitle="readerStore.currentManifest?.title || 'Genmoire'"
      :chapterTitle="readerStore.currentChapter?.title || 'Bab 1'"
      :currentChapterOrder="readerStore.currentChapter?.order || 1"
      :currentNodeIndex="readerStore.currentNodeIndex"
      :totalNodesInChapter="readerStore.totalNodesInChapter"
      :progressPercent="readerStore.chapterProgressPercent"
      :isPureKinetic="readerStore.isPureKineticMode"
      :isMuted="settingsStore.isMuted"
      @advance="readerStore.advance"
      @previous="readerStore.previous"
      @togglePureKinetic="readerStore.togglePureKineticMode"
      @toggleMute="settingsStore.toggleMute"
      @reportMismatch="readerStore.triggerMismatchReport"
      @openHistory="readerStore.openHistoryLog"
    />

    <!-- Layer 5: Overlays, History Log, Settings & Drawers -->
    <ReadingHistoryDrawer />
    <AiExplainDrawer />
    <SettingsDrawer />
    <RefinementTerminal
      :modelValue="readerStore.isRefinementTerminalOpen"
      :targetPrompt="readerStore.refinementTargetPrompt"
      @update:modelValue="readerStore.isRefinementTerminalOpen = $event"
      @refined="onCgRefined"
    />
    <TierUpOverlay />
    <TraitToast />
  </div>
</template>
