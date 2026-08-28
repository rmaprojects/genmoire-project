import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { BookManifest, TextNode, CgAsset, BgmAsset } from '@/types/manifest';
import { useSettingsStore } from './useSettingsStore';
import { useProfileStore } from './useProfileStore';

export interface HistoryEntry {
  chapterTitle: string;
  speaker?: string;
  speakerTitle?: string;
  text: string;
  nodeIndex: number;
}

export const useReaderStore = defineStore('reader', () => {
  const currentManifest = ref<BookManifest | null>(null);
  const currentChapterIndex = ref<number>(0);
  const currentNodeIndex = ref<number>(0);

  // Typewriter state
  const displayedText = ref<string>('');
  const isTypewriting = ref<boolean>(false);
  let typewriterTimer: any = null;

  // Reading Backlog History
  const readingHistory = ref<HistoryEntry[]>([]);
  const isHistoryLogOpen = ref<boolean>(false);

  // Visual & Audio State
  const isPureKineticMode = ref<boolean>(false); // Anti-AI author mode
  const currentCg = ref<CgAsset | null>(null);
  const currentBgm = ref<BgmAsset | null>(null);
  const isAudioPlaying = ref<boolean>(false);
  const currentAudioElement = ref<HTMLAudioElement | null>(null);

  // Mismatch / Refinement
  const isRefinementTerminalOpen = ref<boolean>(false);
  const refinementTargetPrompt = ref<string>('');

  const settingsStore = useSettingsStore();
  const profileStore = useProfileStore();

  const currentChapter = computed(() => {
    if (!currentManifest.value) return null;
    return currentManifest.value.chapters[currentChapterIndex.value] || null;
  });

  const currentNodeId = computed(() => {
    if (!currentChapter.value) return null;
    return currentChapter.value.nodeIds[currentNodeIndex.value] || null;
  });

  const currentNode = computed<TextNode | null>(() => {
    if (!currentManifest.value || !currentNodeId.value) return null;
    return currentManifest.value.nodes[currentNodeId.value] || null;
  });

  // Array of all nodes rendered so far in the current chapter
  const renderedNodesInChapter = computed<TextNode[]>(() => {
    if (!currentChapter.value || !currentManifest.value) return [];
    const nodes: TextNode[] = [];
    for (let i = 0; i <= currentNodeIndex.value; i++) {
      const nodeId = currentChapter.value.nodeIds[i];
      if (nodeId && currentManifest.value.nodes[nodeId]) {
        nodes.push(currentManifest.value.nodes[nodeId]);
      }
    }
    return nodes;
  });

  const totalNodesInChapter = computed(() => {
    if (!currentChapter.value) return 0;
    return currentChapter.value.nodeIds.length;
  });

  const chapterProgressPercent = computed(() => {
    if (!totalNodesInChapter.value) return 0;
    return Math.round(((currentNodeIndex.value + 1) / totalNodesInChapter.value) * 100);
  });

  const isLastNodeInChapter = computed(() => {
    return currentNodeIndex.value >= totalNodesInChapter.value - 1;
  });

  const isLastChapter = computed(() => {
    if (!currentManifest.value) return false;
    return currentChapterIndex.value >= currentManifest.value.chapters.length - 1;
  });

  // Load a book manifest into reader
  const loadBook = (manifest: BookManifest, startChapterIndex = 0, startNodeIndex = 0) => {
    currentManifest.value = manifest;
    currentChapterIndex.value = startChapterIndex;
    currentNodeIndex.value = startNodeIndex;
    readingHistory.value = [];
    applyCurrentNode();
  };

  // Typewriter streaming effect
  const startTypewriter = (fullText: string) => {
    if (typewriterTimer) clearInterval(typewriterTimer);
    displayedText.value = '';
    isTypewriting.value = true;

    let charIndex = 0;
    const speed = settingsStore.typewriterSpeed || 30;

    typewriterTimer = setInterval(() => {
      if (charIndex < fullText.length) {
        displayedText.value += fullText.charAt(charIndex);
        charIndex++;
      } else {
        finishTypewriter();
      }
    }, speed);
  };

  const finishTypewriter = () => {
    if (typewriterTimer) clearInterval(typewriterTimer);
    if (currentNode.value) {
      displayedText.value = currentNode.value.text;
    }
    isTypewriting.value = false;
  };

  const applyCurrentNode = () => {
    if (!currentNode.value || !currentManifest.value) return;

    // Add to history
    readingHistory.value.push({
      chapterTitle: currentChapter.value?.title || 'Bab 1',
      speaker: currentNode.value.speaker,
      speakerTitle: currentNode.value.speakerTitle,
      text: currentNode.value.text,
      nodeIndex: currentNodeIndex.value,
    });

    // Update CG
    if (!isPureKineticMode.value) {
      const cg = currentManifest.value.cgs[currentNode.value.cgId];
      if (cg) {
        currentCg.value = cg;
      }
    } else {
      currentCg.value = null;
    }

    // Update BGM
    if (!isPureKineticMode.value && currentNode.value.bgmId) {
      const bgm = currentManifest.value.bgms[currentNode.value.bgmId];
      if (bgm && bgm.id !== currentBgm.value?.id) {
        playBgm(bgm);
      }
    }

    // Start text typewriter
    startTypewriter(currentNode.value.text);

    // Record 1 minute read time every 5 nodes
    if (currentNodeIndex.value % 5 === 0) {
      profileStore.recordReadingSession(1);
    }
  };

  const playBgm = (bgm: BgmAsset) => {
    try {
      currentBgm.value = bgm;
      if (currentAudioElement.value) {
        currentAudioElement.value.pause();
      }
      const audio = new Audio(bgm.url);
      audio.loop = bgm.loop;
      audio.volume = settingsStore.isMuted ? 0 : (settingsStore.bgmVolume / 100) * bgm.volume;
      audio.play().catch(() => {
        // Browser autoplay policy catch
      });
      currentAudioElement.value = audio;
      isAudioPlaying.value = true;
    } catch (e) {
      // Audio element fallback
    }
  };

  const stopAudio = () => {
    if (currentAudioElement.value) {
      currentAudioElement.value.pause();
      currentAudioElement.value = null;
    }
    isAudioPlaying.value = false;
  };

  const advance = () => {
    if (isTypewriting.value) {
      // If currently typewriting, instant reveal full text
      finishTypewriter();
      return;
    }

    if (!isLastNodeInChapter.value) {
      currentNodeIndex.value++;
      applyCurrentNode();
    } else if (!isLastChapter.value) {
      // Next chapter: starts fresh from top
      currentChapterIndex.value++;
      currentNodeIndex.value = 0;
      applyCurrentNode();
    } else {
      // Book finished!
      if (currentManifest.value) {
        profileStore.recordBookCompletion(
          currentManifest.value.bookId,
          currentManifest.value.title,
          currentManifest.value.estimatedReadTimeMinutes
        );
      }
    }
  };

  const previous = () => {
    if (currentNodeIndex.value > 0) {
      currentNodeIndex.value--;
      applyCurrentNode();
    }
  };

  const togglePureKineticMode = () => {
    isPureKineticMode.value = !isPureKineticMode.value;
    if (isPureKineticMode.value) {
      stopAudio();
    } else if (currentNode.value && currentManifest.value) {
      applyCurrentNode();
    }
  };

  const triggerMismatchReport = () => {
    if (currentCg.value?.prompt) {
      refinementTargetPrompt.value = currentCg.value.prompt;
    } else {
      refinementTargetPrompt.value = 'Cinematic dark fantasy library ambient lighting 8k';
    }
    isRefinementTerminalOpen.value = true;
  };

  const closeRefinementTerminal = (newCgUrl?: string) => {
    isRefinementTerminalOpen.value = false;
    if (newCgUrl && currentCg.value) {
      currentCg.value.url = newCgUrl;
    }
  };

  const openHistoryLog = () => {
    isHistoryLogOpen.value = true;
  };

  const closeHistoryLog = () => {
    isHistoryLogOpen.value = false;
  };

  return {
    currentManifest,
    currentChapterIndex,
    currentNodeIndex,
    currentChapter,
    currentNode,
    renderedNodesInChapter,
    displayedText,
    isTypewriting,
    readingHistory,
    isHistoryLogOpen,
    isPureKineticMode,
    currentCg,
    currentBgm,
    isAudioPlaying,
    totalNodesInChapter,
    chapterProgressPercent,
    isLastNodeInChapter,
    isLastChapter,
    isRefinementTerminalOpen,
    refinementTargetPrompt,
    loadBook,
    advance,
    previous,
    finishTypewriter,
    togglePureKineticMode,
    triggerMismatchReport,
    closeRefinementTerminal,
    openHistoryLog,
    closeHistoryLog,
    stopAudio,
  };
});
