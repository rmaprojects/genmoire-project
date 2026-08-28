export interface AiExplainEntry {
  term: string;
  contextType: 'idiom' | 'syntax' | 'plot' | 'historical' | 'vocabulary';
  shortDefinition: string;
  inContextExplanation: string;
  authorNote?: string;
}

export interface TextNode {
  id: string;
  text: string;
  speaker?: string;
  speakerTitle?: string;
  cgId: string;
  bgmId?: string;
  ambientSfxId?: string;
  transition?: 'crossfade' | 'fade-to-black' | 'instant';
  speedMultiplier?: number;
  highlightedTerms?: string[];
}

export interface CgAsset {
  id: string;
  url: string;
  alt: string;
  prompt?: string;
  authorModeUrl?: string; // If author provided custom artwork
  isAiGenerated: boolean;
}

export interface BgmAsset {
  id: string;
  title: string;
  url: string;
  authorModeUrl?: string;
  loop: boolean;
  volume: number;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  nodeIds: string[];
}

export interface PageChallenge {
  question: string;
  pageNumber: number;
  lineNumber?: number;
  expectedWord: string;
  hint: string;
}

export interface BookManifest {
  manifestId: string;
  bookId: string;
  title: string;
  author: string;
  coverUrl: string;
  synopsis: string;
  genre: string[];
  tags: string[];
  isbn: string;         // e.g. 978-602-03-8591-2
  epubHash: string;      // MD5 hash for local verification
  estimatedReadTimeMinutes: number;
  totalChapters: number;
  authorControl: {
    hasCustomAssets: boolean;
    allowsAiVisuals: boolean;
    supportsPureKineticMode: boolean;
  };
  pageChallenge?: PageChallenge;
  cgs: Record<string, CgAsset>;
  bgms: Record<string, BgmAsset>;
  explains: Record<string, AiExplainEntry>;
  chapters: Chapter[];
  nodes: Record<string, TextNode>;
}

export interface BookSummary {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  synopsis: string;
  genres: string[];
  isbn: string;
  estimatedReadMinutes: number;
  isUnlocked: boolean;
  isCustomAuthorMode: boolean;
  progressPercent: number;
  currentChapterId?: string;
  lastReadDate?: string;
}
