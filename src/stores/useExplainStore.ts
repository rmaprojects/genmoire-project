import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AiExplainEntry } from '@/types/manifest';
import { useProfileStore } from './useProfileStore';
import { useReaderStore } from './useReaderStore';

export const useExplainStore = defineStore('explain', () => {
  const isDrawerOpen = ref<boolean>(false);
  const selectedText = ref<string>('');
  const activeExplanation = ref<AiExplainEntry | null>(null);

  // Floating Action Chip Coordinates
  const isChipVisible = ref<boolean>(false);
  const chipPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });

  // Streamed breakdown text
  const streamedDefinition = ref<string>('');
  const streamedContext = ref<string>('');
  const isStreaming = ref<boolean>(false);
  let streamTimer: any = null;

  const profileStore = useProfileStore();
  const readerStore = useReaderStore();

  const handleSelection = (e: MouseEvent) => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 1 && text.length < 50) {
      selectedText.value = text;
      chipPosition.value = {
        x: Math.min(window.innerWidth - 120, Math.max(20, e.clientX - 40)),
        y: Math.max(20, e.clientY - 45),
      };
      isChipVisible.value = true;
    } else {
      isChipVisible.value = false;
    }
  };

  const hideChip = () => {
    isChipVisible.value = false;
  };

  const explainTerm = (term: string) => {
    hideChip();
    selectedText.value = term;
    isDrawerOpen.value = true;

    // Search term in current manifest explains
    const manifest = readerStore.currentManifest;
    let foundEntry: AiExplainEntry | null = null;

    if (manifest && manifest.explains) {
      // Direct key match
      if (manifest.explains[term]) {
        foundEntry = manifest.explains[term];
      } else {
        // Case-insensitive substring match
        const lower = term.toLowerCase();
        for (const [key, entry] of Object.entries(manifest.explains)) {
          if (key.toLowerCase().includes(lower) || lower.includes(key.toLowerCase())) {
            foundEntry = entry;
            break;
          }
        }
      }
    }

    if (!foundEntry) {
      // Fallback contextual generation
      foundEntry = {
        term: term,
        contextType: 'vocabulary',
        shortDefinition: `Istilah kontekstual dalam ${manifest?.title || 'naskah ini'}.`,
        inContextExplanation: `Frasa "${term}" membawa bobot tematik mengenai perjalanan karakter dan atmosfer sastra yang dibangun oleh sang penulis pada bab ini.`,
        authorNote: 'Penjelasan diolah secara kontekstual berbasis leksikon semesta narasi.',
      };
    }

    activeExplanation.value = foundEntry;
    startStream(foundEntry);
    profileStore.recordExplainUsage();
  };

  const startStream = (entry: AiExplainEntry) => {
    if (streamTimer) clearInterval(streamTimer);
    streamedDefinition.value = '';
    streamedContext.value = '';
    isStreaming.value = true;

    const fullDef = entry.shortDefinition;
    const fullCtx = entry.inContextExplanation;
    let i = 0;

    streamTimer = setInterval(() => {
      if (i < fullDef.length) {
        streamedDefinition.value += fullDef.charAt(i);
        i++;
      } else if (i - fullDef.length < fullCtx.length) {
        const ctxIdx = i - fullDef.length;
        streamedContext.value += fullCtx.charAt(ctxIdx);
        i++;
      } else {
        clearInterval(streamTimer);
        isStreaming.value = false;
      }
    }, 15); // Fast 15ms AI typewriter
  };

  const closeDrawer = () => {
    isDrawerOpen.value = false;
    if (streamTimer) clearInterval(streamTimer);
  };

  return {
    isDrawerOpen,
    selectedText,
    activeExplanation,
    isChipVisible,
    chipPosition,
    streamedDefinition,
    streamedContext,
    isStreaming,
    handleSelection,
    hideChip,
    explainTerm,
    closeDrawer,
  };
});
