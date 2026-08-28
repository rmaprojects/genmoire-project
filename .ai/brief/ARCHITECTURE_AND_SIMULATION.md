# Genmoire — Frontend Architecture & "Wizard of Oz" Simulation Guide

> **Version:** 1.3.0  
> **Last Updated:** 2026-08-12  
> **Companion Document:** PRD.md  
> **Architecture Philosophy:** 100% client-side. Zero backend. Every "AI" interaction is a deterministic state machine with pre-authored data.

---

## 1. Architecture Overview

### 1.1 High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                             │
│                                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐    │
│  │   ROUTER    │  │  VIEWS /     │  │   COMPONENT LAYER       │    │
│  │ (SPA Hash)  │──│  PAGES       │──│   (Presentation)        │    │
│  └─────────────┘  └──────┬───────┘  └─────────────────────────┘    │
│                          │                                          │
│                   ┌──────▼───────┐                                  │
│                   │  STATE LAYER │                                  │
│                   │  (Pinia /    │                                  │
│                   │   Zustand)   │                                  │
│                   └──────┬───────┘                                  │
│                          │                                          │
│         ┌────────────────┼────────────────┐                        │
│         │                │                │                        │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐               │
│  │ SIMULATION  │  │ PERSISTENCE │  │  SERVICES   │               │
│  │ ENGINE      │  │ LAYER       │  │  LAYER      │               │
│  │             │  │             │  │             │               │
│  │ • WizardOf  │  │ • localStorage│ │ • AudioMgr │               │
│  │   OzEngine  │  │ • sessionStor│  │ • TypeWriter│               │
│  │ • AISimulate│  │ • In-Memory  │  │ • CGPreload│               │
│  │ • Terminal  │  │              │  │ • HashUtil │               │
│  │   Animator  │  │              │  │ • Selection│               │
│  └─────────────┘  └─────────────┘  └────────────┘               │
│                          │                                          │
│                   ┌──────▼───────┐                                  │
│                   │  STATIC DATA │                                  │
│                   │  (JSON)      │                                  │
│                   │              │                                  │
│                   │ • manifests/ │                                  │
│                   │ • explains/  │                                  │
│                   │ • registry   │                                  │
│                   └──────────────┘                                  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    ASSET LAYER                                │   │
│  │  /public/assets/cg/   /public/assets/bgm/   /public/assets/  │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Core Architectural Principles

| Principle | Implementation |
|---|---|
| **No Backend** | All data is static JSON imported at build time or fetched from `/public/`. No API calls. |
| **Wizard of Oz** | All "AI" features use pre-authored responses with simulated latency to appear dynamic. |
| **Deterministic** | Given the same manifest + user input, the system produces the same output every time. |
| **Layered** | Clear separation: Views → State → Services → Data. No view directly accesses JSON. |
| **Reactive** | State changes drive UI updates. No imperative DOM manipulation (except GSAP animations). |
| **Offline-First** | All assets are local. No CDN dependency for demo. Service Worker caches everything. |

---

## 2. Directory Structure

```
genmoire/
├── public/
│   ├── assets/
│   │   ├── cg/                          # CG background images
│   │   │   ├── demo-book/
│   │   │   │   ├── scene-001.webp
│   │   │   │   ├── scene-001-alt.webp   # Alternate CG for refinement
│   │   │   │   ├── scene-002.webp
│   │   │   │   └── ...
│   │   │   └── placeholder/
│   │   │       └── gradient-warm.webp
│   │   ├── bgm/                          # Background music tracks
│   │   │   ├── demo-book/
│   │   │   │   ├── peaceful.mp3
│   │   │   │   ├── tension.mp3
│   │   │   │   └── melancholy.mp3
│   │   │   └── ui/
│   │   │       └── page-turn.mp3
│   │   ├── covers/                       # Book cover thumbnails
│   │   │   └── demo-book-cover.webp
│   │   └── icons/
│   │       └── genmoire-logo.svg
│   └── favicon.svg
│
├── src/
│   ├── main.js                           # App entry point
│   ├── App.vue / App.jsx                 # Root component
│   ├── router/
│   │   └── index.js                      # SPA route definitions
│   │
│   ├── views/                            # Page-level components (1 per route)
│   │   ├── LandingView.vue
│   │   ├── DashboardView.vue             # Unified Dashboard (Stats, Heatmap, Library)
│   │   ├── BookDetailView.vue
│   │   ├── ReaderView.vue                # The Kinetic Reading Engine
│   │   └── NotFoundView.vue
│   │
│   ├── components/                       # Reusable UI components
│   │   ├── common/                       # Shared primitives
│   │   │   ├── GButton.vue
│   │   │   ├── GChip.vue
│   │   │   ├── GDrawer.vue
│   │   │   ├── GModal.vue
│   │   │   ├── GInput.vue
│   │   │   ├── GToggle.vue
│   │   │   ├── GTooltip.vue
│   │   │   └── GProgressBar.vue
│   │   │
│   │   ├── reader/                       # Kinetic Reading Engine components
│   │   │   ├── CgBackground.vue          # Full-screen CG with overlay
│   │   │   ├── TextOverlay.vue           # NVL text with typewriter
│   │   │   ├── AdvanceIndicator.vue      # Blinking ▼ chevron
│   │   │   ├── ReaderHud.vue             # HUD: settings, progress, controls
│   │   │   ├── AiExplainChip.vue         # Floating "Explain" action chip
│   │   │   ├── AiExplainDrawer.vue       # Side drawer with explanation
│   │   │   ├── AudioController.vue       # BGM controls + mute toggle
│   │   │   └── ReportMismatchModal.vue   # Crowdsource feedback modal
│   │   │
│   │   ├── library/                      # Library/catalog components
│   │   │   ├── BookCard.vue
│   │   │   ├── ManifestCodeInput.vue
│   │   │   ├── ByobUploader.vue
│   │   │   ├── PageChallengeModal.vue
│   │   │   └── BookFilters.vue
│   │   │
│   │   ├── landing/                      # Landing page sections
│   │   │   ├── HeroSection.vue
│   │   │   ├── FeatureShowcase.vue
│   │   │   └── DemoCallout.vue
│   │   │
│   │   ├── terminal/                     # Refinement terminal
│   │   │   └── RefinementTerminal.vue    # Simulated terminal overlay
│   │   │
│   │   ├── profile/                      # Gamification components
│   │   │   ├── TierBadge.vue             # Tier emblem + title display
│   │   │   ├── TierProgressBar.vue       # Progress to next tier
│   │   │   ├── TraitCard.vue             # Individual trait badge (locked/unlocked)
│   │   │   ├── TraitsGrid.vue            # Grid of all traits
│   │   │   ├── ReadingStats.vue          # Stats summary (books, streak)
│   │   │   ├── ActivityHeatmap.vue       # GitHub-style reading consistency calendar
│   │   │   ├── TierUpOverlay.vue         # Celebratory tier-up animation
│   │   │   └── TraitToast.vue            # Toast notification for new trait
│   │   │
│   │   └── layout/                       # Layout primitives
│   │       ├── AppHeader.vue
│   │       ├── SettingsDrawer.vue
│   │       └── ThemeProvider.vue
│   │
│   ├── stores/                           # State management (Pinia / Zustand)
│   │   ├── useReaderStore.js             # Reading engine state
│   │   ├── useLibraryStore.js            # Book catalog + unlocked books
│   │   ├── useThemeStore.js              # Theme (light/dark) + preferences
│   │   ├── useAudioStore.js              # BGM playback state
│   │   ├── useExplainStore.js            # AI Explain selection + drawer state
│   │   ├── useProfileStore.js            # Tiers, traits, reading history
│   │   └── useSettingsStore.js           # Global settings (volume, text size, etc.)
│   │
│   ├── services/                         # Non-reactive utility modules
│   │   ├── typewriterEngine.js           # Character-by-character renderer
│   │   ├── audioManager.js               # Howler.js wrapper with crossfade
│   │   ├── cgPreloader.js                # Image preloading utility
│   │   ├── hashVerifier.js               # spark-md5 EPUB verification
│   │   ├── selectionHandler.js           # window.getSelection() logic
│   │   └── terminalAnimator.js           # Step-by-step terminal simulation
│   │
│   ├── simulation/                       # "Wizard of Oz" engines
│   │   ├── wizardOfOzEngine.js           # Orchestrator for all simulated AI
│   │   ├── explainSimulator.js           # RAG simulation (lookup + stream)
│   │   └── refinementSimulator.js        # CG swap simulation
│   │
│   ├── data/                             # Static JSON data (the "database")
│   │   ├── registry.json                 # Master list of available books
│   │   ├── manifests/
│   │   │   └── demo-book.json            # Full reading manifest for demo book
│   │   ├── explains/
│   │   │   └── demo-book-explains.json   # Pre-authored AI explanations
│   │   └── hashes.json                   # Known EPUB MD5 hashes
│   │
│   ├── composables/                      # Reusable composition functions
│   │   ├── useTypewriter.js              # Typewriter effect hook
│   │   ├── useTextSelection.js           # Text selection detection hook
│   │   ├── useKeyboardNav.js             # Keyboard navigation hook
│   │   └── useThemeTransition.js         # Theme crossfade hook
│   │
│   └── styles/
│       ├── tokens.css                    # CSS custom property definitions
│       ├── globals.css                   # Reset + base styles
│       ├── typography.css                # Font imports + type scale
│       └── animations.css               # Shared keyframe animations
│
├── .ai/                                  # AI / planning documents
│   └── brief/
│       ├── PRD.md
│       ├── ARCHITECTURE_AND_SIMULATION.md
│       └── UI_UX_DESIGN_SYSTEM.md
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 3. State Management Architecture

### 3.1 Store Overview

All state is managed via **Pinia** (Vue) or **Zustand** (React). No Redux, no Vuex. Stores are small, focused, and composable.

```
┌─────────────────────────────────────────────────────────┐
│                    STATE ARCHITECTURE                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  useThemeStore          useSettingsStore                 │
│  ├── mode: 'light'|'dark'   ├── volume: 0-100          │
│  └── transition()           ├── textSize: 'sm'|'md'|'lg'│
│                             ├── animSpeed: number       │
│                             └── persist → localStorage  │
│                                                         │
│  useLibraryStore        useReaderStore                  │
│  ├── books: Book[]      ├── manifest: Manifest | null   │
│  ├── unlocked: Set<id>  ├── currentChapter: number     │
│  ├── manifestCodes      ├── currentNode: number        │
│  ├── lookupCode()       ├── isTypewriting: boolean     │
│  ├── verifyHash()       ├── activeCgUrl: string        │
│  └── persist → lS       ├── activeBgmId: string        │
│                          ├── advance()                  │
│                          └── skipTypewriter()           │
│                                                         │
│  useAudioStore          useExplainStore                 │
│  ├── currentTrack       ├── selectedText: string       │
│  ├── isPlaying          ├── chipPosition: {x,y}        │
│  ├── isMuted            ├── isChipVisible: bool        │
│  ├── volume             ├── isDrawerOpen: bool         │
│  ├── play()             ├── explanation: Object        │
│  ├── crossfadeTo()      ├── isStreaming: bool          │
│  └── mute()             └── fetchExplanation()         │
│                                                         │
│  useProfileStore                                        │
│  ├── currentTier: 1-5                                  │
│  ├── tierTitle: string                                 │
│  ├── booksCompleted: number                            │
│  ├── readingStreak: { current, longest }                │
│  ├── unlockedTraits: Set<traitId>                       │
│  ├── readingHistory: HistoryEntry[]                     │
│  ├── dailyReadTime: Record<date, mins>                 │
│  ├── explainCount: number                              │
│  ├── recordCompletion()                                │
│  ├── recordDailyReadTime(mins)                         │
│  ├── evaluateTraits()                                  │
│  └── persist → localStorage                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Persistence Strategy

| Data | Storage | Lifetime |
|---|---|---|
| Theme preference | `localStorage` (`gm-theme`) | Permanent |
| Volume + settings | `localStorage` (`gm-settings`) | Permanent |
| Unlocked books | `localStorage` (`gm-unlocked`) | Permanent |
| Reading progress | `localStorage` (`gm-progress-{bookId}`) | Per book, permanent |
| Mismatch reports | `localStorage` (`gm-reports`) | Permanent |
| Alt CG selections | `localStorage` (`gm-alt-cg`) | Per node, permanent |
| Profile & tier data | `localStorage` (`gm-profile`) | Permanent |
| Reading history | `localStorage` (`gm-history`) | Permanent |
| Unlocked traits | `localStorage` (`gm-traits`) | Permanent |
| AI Explain usage count | `localStorage` (`gm-explain-count`) | Permanent |
| Current reading session | `sessionStorage` (`gm-session`) | Tab lifetime |
| Manifest data | In-memory (store) | Session lifetime |
| Audio playback state | In-memory (store) | Session lifetime |

### 3.3 Store: `useReaderStore` — Detailed Specification

This is the most complex store, powering the Kinetic Reading Engine.

```javascript
// useReaderStore.js — Pseudocode / Interface Definition

export const useReaderStore = defineStore('reader', {
  state: () => ({
    // Manifest data
    manifest: null,           // Full book manifest object
    bookId: null,             // Current book ID

    // Navigation
    currentChapterIndex: 0,   // Index in manifest.chapters[]
    currentNodeIndex: 0,      // Index in chapter.nodes[]

    // Typewriter state
    isTypewriting: false,     // Is typewriter animation in progress?
    displayedText: '',        // Currently visible text (partial during typewriter)
    typewriterSpeed: 30,      // ms per character

    // Visual state
    activeCgUrl: null,        // Current CG image URL
    nextCgUrl: null,          // Preloaded next CG URL
    cgTransition: 'dissolve', // 'dissolve' | 'slide-left' | 'fade-to-black'
    isTransitioning: false,   // Is CG transitioning?

    // Audio state reference
    activeBgmId: null,        // Current BGM track identifier

    // Author mode
    authorMode: 'ai',         // 'ai' | 'custom' | 'pure-kinetic'

    // Progress
    totalNodes: 0,            // Total nodes in current chapter
    globalProgress: 0,        // 0-100% across entire book
  }),

  getters: {
    currentChapter: (state) => state.manifest?.chapters?.[state.currentChapterIndex],
    currentNode: (state) => /* derive from chapter + nodeIndex */,
    currentText: (state) => /* derive from currentNode.text (string) */,
    hasNextNode: (state) => /* check bounds */,
    hasPrevNode: (state) => /* check bounds */,
    chapterProgress: (state) => /* (currentNodeIndex / totalNodes) * 100 */,
    isPureKinetic: (state) => state.authorMode === 'pure-kinetic',
  },

  actions: {
    // Load a book manifest and initialize state
    loadManifest(bookId) {
      // 1. Import manifest JSON from /data/manifests/{bookId}.json
      // 2. Set this.manifest, this.bookId
      // 3. Set this.authorMode from manifest
      // 4. Initialize chapter/node indices (check localStorage for saved progress)
      // 5. Preload first CG
      // 6. Trigger first BGM
    },

    // Advance to next text node
    advance() {
      // 1. If typewriting → skip to completion (instant render)
      // 2. If not typewriting → advance to next node:
      //    a. Increment currentNodeIndex
      //    b. If end of chapter → increment chapterIndex, reset nodeIndex
      //    c. If end of book → show completion screen
      //    d. Update activeCgUrl if new node has different CG
      //    e. Trigger crossfade if BGM changes
      //    f. Start typewriter for new text
      //    g. Save progress to localStorage
    },

    // Start typewriter animation for current node
    startTypewriter() {
      // 1. Set isTypewriting = true
      // 2. Clear displayedText
      // 3. Call typewriterEngine.start() with callback
      // 4. On complete: isTypewriting = false, show advance indicator
    },

    // Skip typewriter — instantly complete
    skipTypewriter() {
      // 1. Set displayedText = full currentText
      // 2. Set isTypewriting = false
      // 3. Cancel typewriterEngine
    },

    // Preload upcoming CG
    preloadNextCg() {
      // Look ahead to next node's CG and load into hidden <img>
    },
  },
});
```

---

## 4. Wizard of Oz Simulation Layer

### 4.1 Philosophy

The "Wizard of Oz" pattern means: **the user sees what appears to be AI-generated real-time content, but behind the curtain, everything is pre-authored JSON with simulated latency.** The illusion is maintained through:

1. **Typewriter streaming** — Characters appear one-by-one, simulating "AI typing."
2. **Randomized micro-delays** — 15–45ms jitter per character to feel organic.
3. **Loading indicators** — Pulsing dots, progress bars, terminal animations.
4. **Pre-authored variety** — Multiple response variants per key to avoid repetition.

### 4.2 AI Explain Simulation (`explainSimulator.js`)

#### Data Structure

```json
// /data/explains/demo-book-explains.json
{
  "bookId": "demo-book",
  "entries": {
    "node-001": {
      "departed": {
        "contextualMeaning": "Here, 'departed' carries a heavier emotional weight than simply 'left.' The author chose it to imply a permanent, sorrowful leaving — closer to 'abandoning' than 'stepping out.' It sets the tone for the character's irreversible journey.",
        "idiomSyntax": null,
        "plotContext": "This is the opening action of the story. The departure is not just physical — it represents the character severing ties with his past. Every subsequent scene builds on this foundational loss.",
        "etymology": "From Old French 'departir' (to divide, separate). The word literally means 'to part from' — a splitting of self from place."
      },
      "unspoken farewells": {
        "contextualMeaning": "The phrase 'unspoken farewells' means goodbyes that were felt but never said aloud. The author uses this to show the character's emotional repression — he left without closure.",
        "idiomSyntax": "This is a noun phrase where 'unspoken' (adjective from past participle) modifies 'farewells.' The construction implies something deliberately withheld, not simply forgotten.",
        "plotContext": "The unspoken farewells become a source of guilt that haunts the character throughout the journey. This detail is what separates his wandering from mere travel — it is an escape.",
        "etymology": "'Farewell' is a contraction of 'fare well' — literally 'may you journey well.' Ironically, the character cannot fare well precisely because the farewells were never spoken."
      }
    },
    "node-002": {
      "clawed at the pewter sky": {
        "contextualMeaning": "The author personifies the tree branches as 'clawing' — giving them aggressive, desperate agency. 'Pewter sky' describes a heavy, metallic gray overcast. Together, the image conveys nature mirroring the character's internal anguish.",
        "idiomSyntax": "This is a metaphor combined with personification. 'Clawed' gives the inanimate branches animal-like action. 'Pewter' is a sensory adjective transferring a metallic quality to the sky.",
        "plotContext": "The hostile landscape reflects the character's psychological state — pathetic fallacy. As his emotional journey darkens, so does the world around him.",
        "etymology": "'Pewter' — a tin alloy — has been used metaphorically for dull gray since the 16th century. Its heaviness as a metal reinforces the oppressive mood."
      }
    }
  },
  "fallback": {
    "contextualMeaning": "This word is used here to enhance the emotional texture of the passage. In context, it carries a nuanced meaning shaped by the scene's atmosphere and the author's deliberate stylistic choices.",
    "idiomSyntax": null,
    "plotContext": "Consider how this word or phrase connects to the character's emotional arc and the thematic undercurrents of the current scene.",
    "etymology": "This word has interesting roots that connect to its modern usage."
  }
}
```

#### Simulation Flow

```
User selects "melancholy" in node-003
         │
         ▼
┌─────────────────────────────┐
│  selectionHandler.js        │
│  • Capture getSelection()   │
│  • Compute chip position    │
│  • Dispatch to explainStore │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  useExplainStore            │
│  • Set selectedText         │
│  • Set chipPosition         │
│  • Show chip                │
└──────────────┬──────────────┘
               │ User clicks "✦ Explain" chip
               ▼
┌─────────────────────────────┐
│  explainSimulator.js        │
│  1. Lookup: explains[nodeId]│
│     [selectedText]          │
│  2. If found → use entry    │
│  3. If not → use fallback   │
│  4. Add 500ms "thinking"    │
│     delay (pulsing dots)    │
│  5. Return explanation obj  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  AiExplainDrawer.vue        │
│  • Open drawer              │
│  • Show "thinking" dots     │
│  • After 500ms delay:       │
│    stream each section via  │
│    typewriterEngine at      │
│    15ms/char                │
│  • Render sections:         │
│    1. Header (instant)      │
│    2. Contextual Meaning    │
│    3. Idiom & Syntax        │
│    4. Plot Context          │
│    5. Etymology (if exists) │
└─────────────────────────────┘
```

#### Typewriter Streaming Implementation

```javascript
// typewriterEngine.js

export class TypewriterEngine {
  constructor() {
    this.isRunning = false;
    this.rafId = null;
    this.resolve = null;
  }

  /**
   * Stream text character by character.
   * @param {string} text - Full text to stream
   * @param {function} onChar - Callback(partialText) called per character
   * @param {object} options - { speed: 30, jitter: 15 }
   * @returns {Promise} Resolves when complete
   */
  start(text, onChar, options = {}) {
    const { speed = 30, jitter = 15 } = options;
    this.isRunning = true;
    let index = 0;

    return new Promise((resolve) => {
      this.resolve = resolve;

      const tick = () => {
        if (!this.isRunning || index >= text.length) {
          this.isRunning = false;
          onChar(text); // Ensure full text is shown
          resolve();
          return;
        }

        index++;
        onChar(text.substring(0, index));

        // Randomized delay for organic feel
        const delay = speed + (Math.random() * jitter * 2 - jitter);
        setTimeout(() => {
          this.rafId = requestAnimationFrame(tick);
        }, delay);
      };

      this.rafId = requestAnimationFrame(tick);
    });
  }

  /**
   * Instantly complete the current stream.
   */
  skip() {
    this.isRunning = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.resolve) this.resolve();
  }

  /**
   * Cancel without completing.
   */
  cancel() {
    this.isRunning = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
```

### 4.3 CG Refinement Simulation (`refinementSimulator.js`)

#### Terminal Animation Sequence

```javascript
// terminalAnimator.js

const TERMINAL_STEPS = [
  {
    text: '> Aggregating community feedback...',
    progress: 30,
    duration: 800,
  },
  {
    text: '> Cross-referencing passage context...',
    progress: 55,
    duration: 1000,
  },
  {
    text: '> Analyzing semantic alignment...',
    progress: 70,
    duration: 700,
  },
  {
    text: '> Refining generation prompt...',
    progress: 85,
    duration: 900,
  },
  {
    text: '> Rendering with Imagen 3...',
    progress: 100,
    duration: 1200,
  },
];

export async function runTerminalAnimation(onStep, onComplete) {
  for (const step of TERMINAL_STEPS) {
    await delay(step.duration);
    onStep({
      text: step.text,
      progress: step.progress,
    });
  }
  await delay(500);
  onComplete();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

#### CG Swap Logic

```javascript
// refinementSimulator.js

export function getAlternateCg(manifest, nodeId, currentAltIndex = 0) {
  const node = findNode(manifest, nodeId);
  if (!node?.altCg || node.altCg.length === 0) {
    return null; // No alternates available
  }

  // Cycle through alternate CGs
  const nextIndex = (currentAltIndex + 1) % node.altCg.length;
  return {
    url: node.altCg[nextIndex],
    index: nextIndex,
  };
}
```

#### Manifest Node with Alternates

```json
{
  "id": "node-003",
  "text": {
    "A1": "...",
    "B1": "...",
    "C1": "..."
  },
  "cg": "/assets/cg/demo-book/scene-003.webp",
  "altCg": [
    "/assets/cg/demo-book/scene-003-alt1.webp",
    "/assets/cg/demo-book/scene-003-alt2.webp"
  ],
  "bgm": {
    "src": "/assets/bgm/demo-book/tension.mp3",
    "volume": 0.7,
    "loop": true
  },
  "transition": "dissolve"
}
```

---

## 5. Service Layer Specifications

### 5.1 Audio Manager (`audioManager.js`)

Wraps Howler.js with crossfade logic, volume persistence, and autoplay policy handling.

```javascript
// audioManager.js — Interface Definition

import { Howl, Howler } from 'howler';

class AudioManager {
  constructor() {
    this.currentHowl = null;
    this.nextHowl = null;
    this.isMuted = false;
    this.globalVolume = 0.7; // Default 70%
  }

  /**
   * Play a new BGM track. If a track is already playing, crossfade.
   * @param {object} bgmConfig - { src, volume, loop }
   * @param {number} fadeDuration - Crossfade duration in ms (default 2000)
   */
  async play(bgmConfig, fadeDuration = 2000) {
    const newHowl = new Howl({
      src: [bgmConfig.src],
      volume: 0,
      loop: bgmConfig.loop ?? true,
      html5: true, // Required for long audio files
    });

    // Start new track at volume 0
    newHowl.play();

    // Crossfade: fade out current, fade in new
    if (this.currentHowl) {
      this.currentHowl.fade(
        this.currentHowl.volume(),
        0,
        fadeDuration
      );
      const oldHowl = this.currentHowl;
      setTimeout(() => oldHowl.unload(), fadeDuration + 100);
    }

    newHowl.fade(0, bgmConfig.volume * this.globalVolume, fadeDuration);
    this.currentHowl = newHowl;
  }

  setVolume(level) {
    // level: 0 to 1
    this.globalVolume = level;
    if (this.currentHowl) {
      this.currentHowl.volume(level);
    }
    localStorage.setItem('gm-volume', String(level));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
    return this.isMuted;
  }

  stop() {
    if (this.currentHowl) {
      this.currentHowl.fade(this.currentHowl.volume(), 0, 500);
      setTimeout(() => this.currentHowl?.unload(), 600);
    }
  }

  /**
   * Handle browser autoplay policy.
   * Call this on first user interaction.
   */
  unlockAudioContext() {
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }
  }
}

export const audioManager = new AudioManager();
```

### 5.2 CG Preloader (`cgPreloader.js`)

```javascript
// cgPreloader.js

const preloadCache = new Map();

/**
 * Preload an image into the browser cache.
 * @param {string} url - Image URL to preload
 * @returns {Promise<HTMLImageElement>}
 */
export function preloadImage(url) {
  if (preloadCache.has(url)) {
    return preloadCache.get(url);
  }

  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

  preloadCache.set(url, promise);
  return promise;
}

/**
 * Preload the next N CGs from the manifest.
 * @param {Array} nodes - Array of manifest nodes
 * @param {number} currentIndex - Current node index
 * @param {number} lookahead - How many to preload (default 2)
 */
export function preloadAhead(nodes, currentIndex, lookahead = 2) {
  for (let i = 1; i <= lookahead; i++) {
    const nextNode = nodes[currentIndex + i];
    if (nextNode?.cg) {
      preloadImage(nextNode.cg);
    }
  }
}
```

### 5.3 Hash Verifier (`hashVerifier.js`)

```javascript
// hashVerifier.js

import SparkMD5 from 'spark-md5';

/**
 * Compute MD5 hash of a File object using chunked reading.
 * @param {File} file - The file to hash
 * @param {function} onProgress - Callback(percent) for progress
 * @returns {Promise<string>} MD5 hex string
 */
export function computeFileHash(file, onProgress) {
  return new Promise((resolve, reject) => {
    const chunkSize = 2 * 1024 * 1024; // 2MB chunks
    const spark = new SparkMD5.ArrayBuffer();
    const reader = new FileReader();
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;

    reader.onload = (e) => {
      spark.append(e.target.result);
      currentChunk++;

      if (onProgress) {
        onProgress(Math.round((currentChunk / chunks) * 100));
      }

      if (currentChunk < chunks) {
        loadNext();
      } else {
        resolve(spark.end());
      }
    };

    reader.onerror = reject;

    function loadNext() {
      const start = currentChunk * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      reader.readAsArrayBuffer(file.slice(start, end));
    }

    loadNext();
  });
}

/**
 * Verify a file's hash against known hashes.
 * @param {File} file - EPUB file
 * @param {Object} hashRegistry - { hash: bookId } mapping
 * @returns {Promise<{ matched: boolean, bookId?: string }>}
 */
export async function verifyEpub(file, hashRegistry) {
  const hash = await computeFileHash(file);
  const bookId = hashRegistry[hash];
  return {
    matched: !!bookId,
    bookId: bookId || null,
    hash,
  };
}
```

### 5.4 Selection Handler (`selectionHandler.js`)

```javascript
// selectionHandler.js

/**
 * Extract selection text and position from a mouseup/touchend event.
 * @returns {{ text: string, rect: DOMRect } | null}
 */
export function getSelectionData() {
  const selection = window.getSelection();

  if (!selection || selection.isCollapsed || !selection.toString().trim()) {
    return null;
  }

  const text = selection.toString().trim();

  // Minimum 2 characters
  if (text.length < 2) return null;

  // Get position for the action chip
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  return {
    text,
    rect: {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
    },
  };
}

/**
 * Calculate optimal chip position based on selection rect.
 * @param {DOMRect} rect - Selection bounding rect
 * @returns {{ x: number, y: number }}
 */
export function calculateChipPosition(rect) {
  return {
    x: rect.left + rect.width / 2, // Center horizontally
    y: rect.top - 8, // 8px above selection
  };
}
```

---

## 6. Data Schema: Book Manifest

### 6.1 Complete Manifest Schema

```json
{
  "$schema": "genmoire-manifest-v1",
  "bookId": "demo-book",
  "manifestCode": "#VN-DEMO-01",

  "metadata": {
    "title": "The Wanderer's Lament",
    "author": "A. Demo Author",
    "genre": "Literary Fiction",
    "language": "en",
    "coverImage": "/assets/covers/demo-book-cover.webp",
    "description": "A short literary piece about loss, wandering, and finding meaning in transience.",
    "totalNodes": 12,
    "estimatedReadTime": "8 min"
  },

  "authorMode": "ai",
  "authorAssets": null,

  "verification": {
    "type": "manifest-code",
    "epubHash": "a1b2c3d4e5f6g7h8i9j0",
    "pageChallenge": {
      "page": 47,
      "position": 3,
      "answer": "wandering"
    }
  },

  "chapters": [
    {
      "id": "chapter-1",
      "title": "The Departure",
      "nodes": [
        {
          "id": "node-001",
          "text": "He departed from his childhood home on a frigid morning, carrying nothing but a weathered satchel and a heart heavy with unspoken farewells.",
          "cg": "/assets/cg/demo-book/scene-001.webp",
          "altCg": [
            "/assets/cg/demo-book/scene-001-alt1.webp"
          ],
          "bgm": {
            "src": "/assets/bgm/demo-book/melancholy.mp3",
            "volume": 0.6,
            "loop": true
          },
          "transition": "fade-to-black"
        },
        {
          "id": "node-002",
          "text": "The road stretched endlessly before him, flanked by skeletal birch trees whose bare branches clawed at the pewter sky.",
          "cg": "/assets/cg/demo-book/scene-002.webp",
          "altCg": [],
          "bgm": null,
          "transition": "dissolve"
        }
      ]
    },
    {
      "id": "chapter-2",
      "title": "The Encounter",
      "nodes": []
    }
  ],

  "defaultBgm": {
    "src": "/assets/bgm/demo-book/peaceful.mp3",
    "volume": 0.4,
    "loop": true
  }
}
```

### 6.2 Registry Schema

```json
// /data/registry.json
{
  "books": [
    {
      "bookId": "demo-book",
      "manifestCode": "#VN-DEMO-01",
      "manifestPath": "/data/manifests/demo-book.json",
      "title": "The Wanderer's Lament",
      "author": "A. Demo Author",
      "coverImage": "/assets/covers/demo-book-cover.webp",
      "genre": "Literary Fiction",
      "authorMode": "ai",
      "featured": true
    }
  ],
  "codes": {
    "#VN-DEMO-01": "demo-book"
  },
  "hashes": {
    "a1b2c3d4e5f6g7h8i9j0": "demo-book"
  }
}
```

---

## 7. Routing Architecture

### 7.1 Route Definitions

```javascript
// router/index.js

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/LandingView.vue'),
    meta: { showHeader: true, title: 'Genmoire — Living Interactive Grimoires' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { showHeader: true, title: 'Dashboard — Genmoire' },
  },
  {
    path: '/book/:bookId',
    name: 'book-detail',
    component: () => import('@/views/BookDetailView.vue'),
    meta: { showHeader: true, title: 'Book — Genmoire' },
    props: true,
  },
  {
    path: '/read/:bookId',
    name: 'reader',
    component: () => import('@/views/ReaderView.vue'),
    meta: {
      showHeader: false,  // Full-screen immersive mode
      title: 'Reading — Genmoire',
    },
    props: true,
    beforeEnter: (to, from, next) => {
      // Guard: Check if book is unlocked
      const libraryStore = useLibraryStore();
      if (libraryStore.isUnlocked(to.params.bookId)) {
        next();
      } else {
        next({ name: 'book-detail', params: { bookId: to.params.bookId } });
      }
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { showHeader: true, title: '404 — Genmoire' },
  },
  },
];
```

### 7.2 Navigation Guards

- **Reader Route Guard:** Prevents accessing the reader for locked books. Redirects to book detail for verification.
- **Title Updates:** `router.afterEach()` updates `document.title` from `meta.title`.
- **Scroll Reset:** `scrollBehavior: () => ({ top: 0 })` resets scroll on navigation.

---

## 8. Gamification Engine

### 8.1 Store: `useProfileStore` — Specification

```javascript
// useProfileStore.js — Pseudocode / Interface Definition

const TIER_THRESHOLDS = [
  { tier: 1, title: 'BookTok Scroller', min: 0, max: 2 },
  { tier: 2, title: 'Bookstagram Collector', min: 3, max: 9 },
  { tier: 3, title: 'Imperial Scholar', min: 10, max: 24 },
  { tier: 4, title: 'Lorekeeper', min: 25, max: 49 },
  { tier: 5, title: 'Loremaster', min: 50, max: Infinity },
];

export const useProfileStore = defineStore('profile', {
  state: () => ({
    // Tier
    booksCompleted: 0,
    currentTier: 1,
    tierTitle: 'BookTok Scroller',

    // Streaks
    currentStreak: 0,
    longestStreak: 0,
    lastReadDate: null,        // ISO date string

    // Traits
    unlockedTraits: [],        // Array of trait IDs
    pendingTraitToast: null,   // Trait to show as toast

    // History & Heatmap
    readingHistory: [],        // [{ bookId, completedAt, duration, sessionHour }]
    dailyReadTime: {},         // { 'YYYY-MM-DD': minutesRead }
    explainCount: 0,           // Total AI Explain uses
  }),

  getters: {
    tierProgress: (state) => {
      // Returns { current, needed, percent } for progress bar
      const tier = TIER_THRESHOLDS.find(t => t.tier === state.currentTier);
      const nextTier = TIER_THRESHOLDS.find(t => t.tier === state.currentTier + 1);
      if (!nextTier) return { current: state.booksCompleted, needed: 0, percent: 100 };
      const inTier = state.booksCompleted - tier.min;
      const tierSpan = nextTier.min - tier.min;
      return { current: inTier, needed: tierSpan, percent: (inTier / tierSpan) * 100 };
    },
    isTraitUnlocked: (state) => (traitId) => state.unlockedTraits.includes(traitId),
    booksStarted: (state) => /* count from library store */,
    finishRate: (state) => /* booksCompleted / booksStarted */,
  },

  actions: {
    /**
     * Called when a book is completed.
     * @param {Object} params - { bookId, estimatedReadTime, actualDuration }
     */
    recordCompletion({ bookId, estimatedReadTime, actualDuration }) {
      // 1. Anti-exploitation check: actualDuration >= estimatedReadTime * 0.3
      // 2. If valid: increment booksCompleted, add to readingHistory
      // 3. Record timestamp + session hour for trait evaluation
      // 4. Update streak (check if lastReadDate is yesterday)
      // 5. Recalculate tier
      // 6. If tier changed: trigger tier-up overlay
      // 7. Evaluate traits
      // 8. Persist to localStorage
    },

    /**
     * Records time spent reading to populate the Activity Heatmap.
     * Called periodically during a reading session.
     * @param {number} minutes - Minutes to add to today's total
     */
    recordDailyReadTime(minutes) {
      const today = new Date().toISOString().split('T')[0];
      if (!this.dailyReadTime[today]) {
        this.dailyReadTime[today] = 0;
      }
      this.dailyReadTime[today] += minutes;
      // Trigger trait evaluation for active readers
      this.evaluateTraits();
      // Persist
    },

    /**
     * Increment AI Explain usage counter.
     * Called from useExplainStore on each explanation request.
     */
    incrementExplainCount() {
      this.explainCount++;
      this.evaluateTraits();
      // Persist
    },

    /**
     * Evaluate all trait conditions against current state.
     */
    evaluateTraits() {
      const newlyUnlocked = [];

      // Tsundoku: ≥20 books in library, >75% unfinished
      if (booksInLibrary >= 20 && this.finishRate < 0.25) {
        if (!this.isTraitUnlocked('tsundoku')) newlyUnlocked.push('tsundoku');
      }

      // Night Owl: ≥5 completions between 22:00-05:00
      const nightCompletions = this.readingHistory
        .filter(h => h.sessionHour >= 22 || h.sessionHour < 5).length;
      if (nightCompletions >= 5) {
        if (!this.isTraitUnlocked('night-owl')) newlyUnlocked.push('night-owl');
      }

      // Speed Reader: ≥3 books within estimatedReadTime * 1.5
      const speedReads = this.readingHistory
        .filter(h => h.actualDuration <= h.estimatedReadTime * 1.5).length;
      if (speedReads >= 3) {
        if (!this.isTraitUnlocked('speed-reader')) newlyUnlocked.push('speed-reader');
      }

      // Completionist: 100% finish rate, min 5 started
      if (this.booksStarted >= 5 && this.finishRate === 1.0) {
        if (!this.isTraitUnlocked('completionist')) newlyUnlocked.push('completionist');
      }

      // Curious Mind: explainCount >= 50
      if (this.explainCount >= 50) {
        if (!this.isTraitUnlocked('curious-mind')) newlyUnlocked.push('curious-mind');
      }

      // Marathon Reader: 30-day streak
      if (this.currentStreak >= 30) {
        if (!this.isTraitUnlocked('marathon-reader')) newlyUnlocked.push('marathon-reader');
      }

      // Bibliophile: 300+ books
      if (this.booksCompleted >= 300) {
        if (!this.isTraitUnlocked('bibliophile')) newlyUnlocked.push('bibliophile');
      }

      // Trigger toasts for newly unlocked traits
      for (const traitId of newlyUnlocked) {
        this.unlockedTraits.push(traitId);
        this.pendingTraitToast = traitId; // UI watches this
      }
    },

    /**
     * Recalculate tier from booksCompleted.
     * @returns {boolean} True if tier changed.
     */
    recalculateTier() {
      const newTier = TIER_THRESHOLDS
        .find(t => this.booksCompleted >= t.min && this.booksCompleted <= t.max);
      if (newTier && newTier.tier !== this.currentTier) {
        this.currentTier = newTier.tier;
        this.tierTitle = newTier.title;
        return true; // Trigger tier-up animation
      }
      return false;
    },
  },
});
```

### 8.2 Trait Definitions Schema

```json
// /data/traits.json
{
  "traits": [
    {
      "id": "tsundoku",
      "title": "Tsundoku",
      "flavor": "Buying books is a lifestyle",
      "icon": "stacked_books",
      "rarity": "common"
    },
    {
      "id": "night-owl",
      "title": "Night Owl",
      "flavor": "The grimoire glows at midnight",
      "icon": "dark_mode",
      "rarity": "uncommon"
    },
    {
      "id": "speed-reader",
      "title": "Speed Reader",
      "flavor": "Words blur past your eyes",
      "icon": "bolt",
      "rarity": "uncommon"
    },
    {
      "id": "completionist",
      "title": "Completionist",
      "flavor": "No book left behind",
      "icon": "verified",
      "rarity": "rare"
    },
    {
      "id": "curious-mind",
      "title": "Curious Mind",
      "flavor": "Knowledge is the real magic",
      "icon": "auto_awesome",
      "rarity": "common"
    },
    {
      "id": "marathon-reader",
      "title": "Marathon Reader",
      "flavor": "30 days of unbroken focus",
      "icon": "local_fire_department",
      "rarity": "epic"
    },
    {
      "id": "bibliophile",
      "title": "Bibliophile",
      "flavor": "A living library",
      "icon": "menu_book",
      "rarity": "legendary"
    }
  ]
}
```

### 8.3 Reading History Entry Schema

```json
// Single entry in gm-history localStorage array
{
  "bookId": "demo-book",
  "completedAt": "2026-08-11T23:45:00.000Z",
  "sessionHour": 23,
  "estimatedReadTime": 480,
  "actualDuration": 520,
  "nodeCount": 12
}
```

---

## 9. Event Flow Diagrams

### 9.1 Reading Session Lifecycle

```
User clicks "Begin Reading"
         │
         ▼
┌────────────────────────┐
│ Router navigates to    │
│ /read/:bookId          │
│ (guard checks unlock)  │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────┐
│ ReaderView.onMounted() │
│ 1. readerStore.load()  │
│ 2. Load manifest JSON  │
│ 3. Restore progress    │
│ 4. Preload first CG    │
│ 5. Start first BGM     │
│ 6. Unlock AudioContext │
│ 7. Begin typewriter    │
└──────────┬─────────────┘
           │
           ▼
┌────────────────────────────────┐
│        READING LOOP            │
│                                │
│  ┌──── User clicks screen ──┐ │
│  │                           │ │
│  │  Is typewriting?          │ │
│  │  ├── YES → skipTypewriter │ │
│  │  └── NO  → advance()     │ │
│  │       ├── Has next node?  │ │
│  │       │   ├── YES:        │ │
│  │       │   │  1. Fade text │ │
│  │       │   │  2. Swap CG   │ │
│  │       │   │  3. Crossfade │ │
│  │       │   │     BGM       │ │
│  │       │   │  4. Preload   │ │
│  │       │   │     next CG   │ │
│  │       │   │  5. Start     │ │
│  │       │   │     typewriter│ │
│  │       │   │  6. Save      │ │
│  │       │   │     progress  │ │
│  │       │   └── NO:         │ │
│  │       │      → Show end   │ │
│  │       │        screen     │ │
│  │       └───────────────────│ │
│  └───────────────────────────┘ │
└────────────────────────────────┘
```

### 9.2 BYOB Verification Flow

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  METHOD 1:       │      │  METHOD 2:       │      │  METHOD 3:       │
│  Manifest Code   │      │  EPUB Hash       │      │  Page Challenge  │
│                  │      │                  │      │                  │
│  Input: #CODE    │      │  Input: .epub    │      │  Input: word     │
│         │        │      │  file            │      │  from page       │
│         ▼        │      │         │        │      │         │        │
│  Regex validate  │      │  FileReader      │      │  Case-insensitive│
│         │        │      │  readAsArray()   │      │  string compare  │
│         ▼        │      │         │        │      │         │        │
│  Lookup in       │      │  spark-md5       │      │  Match against   │
│  registry.codes  │      │  compute hash    │      │  manifest answer │
│         │        │      │         │        │      │         │        │
│         ▼        │      │  Lookup in       │      │  ≤3 attempts     │
│  Found?          │      │  registry.hashes │      │  then cooldown   │
│  ├─ Y → Unlock   │      │         │        │      │         │        │
│  └─ N → Error    │      │  Found?          │      │  Match?          │
│                  │      │  ├─ Y → Unlock   │      │  ├─ Y → Unlock   │
│                  │      │  └─ N → Error    │      │  └─ N → Retry/   │
│                  │      │                  │      │        Cooldown   │
└──────────────────┘      └──────────────────┘      └──────────────────┘
           │                       │                        │
           └───────────┬───────────┘────────────────────────┘
                       ▼
              libraryStore.unlock(bookId)
              localStorage persist
              Navigate to /read/:bookId
```

---

## 10. Performance Considerations

### 10.1 Asset Loading Strategy

| Asset Type | Strategy | Priority |
|---|---|---|
| CG Images | Preload N+1 and N+2 (2 nodes ahead) | High |
| BGM Audio | Lazy load on demand, HTML5 streaming | Medium |
| Cover Images | Lazy load with `loading="lazy"` | Low |
| Font Files | Preload critical fonts via `<link rel="preload">` | Critical |
| JSON Manifests | Dynamic import on book selection | High |

### 10.2 Image Optimization

- All CG images should be **WebP format**, max **1920×1080** resolution.
- Provide **srcset** for responsive loading: `800w`, `1200w`, `1920w`.
- Use `will-change: opacity` on CG layers for GPU-accelerated transitions.
- Mobile: Load `800w` variant to save bandwidth.

### 10.3 Animation Performance

- All CG transitions use `opacity` and `transform` only (no layout-triggering properties).
- Typewriter uses `requestAnimationFrame` — never `setInterval`.
- Terminal animation uses CSS transforms for progress bar — no reflows.
- Use `content-visibility: auto` for off-screen library cards.

---

## 11. Error Handling & Edge Cases

| Scenario | Handling |
|---|---|
| CG image fails to load | Show gradient fallback background |
| BGM file fails to load | Silently continue without audio |
| Manifest code not found | Shake animation + error chip |
| EPUB hash not in registry | Friendly error message |
| User navigates during typewriter | Cancel typewriter, save progress |
| Browser blocks autoplay | Show "Tap to enable audio" prompt |
| localStorage is full | Gracefully degrade — warn user, continue without persistence |
| User opens in unsupported browser | Show compatibility banner |
| Selection on non-text elements | Ignore selection, no chip shown |
| User rapidly clicks advance | Debounce at 100ms, queue transitions |

---

## 12. Security & Privacy Notes

Even though this is a competition project with no real backend:

- **EPUB files never leave the browser.** Hash computation is local only.
- **No analytics, no tracking, no cookies.** Only `localStorage` for preferences.
- **No network requests** during reading (all assets are bundled/local).
- **Manifest codes are not secrets** — they're convenience access codes, not DRM.
- **Page-challenge answers are plaintext in manifest JSON** — acceptable for demo. In production, these would be hashed server-side.
