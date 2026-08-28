# Genmoire — Product Requirements Document (PRD)

> **Version:** 1.3.0  
> **Last Updated:** 2026-08-12  
> **Status:** Draft — Awaiting Team Review  
> **Competition:** PNBWDC IntechFest 2026 — Web Design Category  
> **Platform Tagline:** _"Transforming Dead EPUBs into Living Interactive Grimoires."_

---

## 1. Executive Summary

**Genmoire** (portmanteau of _Generated_ + _Grimoire_) is a next-generation kinetic reading platform that reimagines how digital books are experienced on the web. Rather than rendering static paginated text, Genmoire transforms EPUB content into a cinematic, full-screen, visual novel–style reading experience — complete with contextual CG backgrounds, ambient crossfading audio, and progressive typewriter text rendering.

The platform is purpose-built for the **PNBWDC IntechFest 2026 Web Design Competition**. Per competition rules, **all architecture is 100% frontend** — no backend, no database, no server-side logic. All "AI" interactions are simulated using pre-mapped JSON manifests and deterministic client-side state machines ("Wizard of Oz" pattern).

### 1.1 Why Genmoire Exists

| Problem                                             | Genmoire's Answer                                                  |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| EPUBs are static, boring "digital paper"            | Kinetic, cinematic full-screen reading with CGs and audio          |
| Dictionary lookups cause split-attention            | In-context AI Explain drawer with zero navigation                  |
| Idioms and cultural context confuse L2 readers      | AI Explain covers idioms, syntax, and plot context in-situ         |
| AI-generated visuals anger creators                 | Author Control panel with Anti-AI "Pure Kinetic" mode              |
| Readers can't access content without uploads        | BYOB: hash verification + manifest codes, zero server upload       |
| Reading apps lack engagement beyond the text        | Gamified progression tiers + hidden behavioral achievements        |
| Hard to distinguish real readers from FOMO hoarders | Activity Heatmap based on read time, streaks, and completion rates |

---

## 2. Target Users & Personas

### 2.1 Primary Personas

| Persona                                | Description                                                            | Key Need                                                                    |
| -------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Lena, 22** — University EFL Student  | Reads graded readers for English practice. Uses phone at night.        | Warm sepia mode, contextual AI Explain for idioms and syntax                |
| **Rizky, 28** — Indie Author           | Publishes on KDP. Wary of AI art. Wants to control how his book looks. | Author Control panel, custom CG/BGM upload, Anti-AI mode                    |
| **Sari, 35** — Literature Teacher      | Assigns novels to her class. Needs students to prove they read.        | Page-Challenge quiz, smart manifest codes, reading progress                 |
| **Andi, 19** — Visual Novel Enthusiast | Loves Fate/stay night. Wants novels to feel cinematic.                 | Full-screen CG, typewriter text, ambient BGM, tier progression              |
| **Bima, 20** — FOMO BookToker          | Hoards trendy books to look cool but rarely finishes them.             | Quick cataloging, Tsundoku trait (unlocked when many books are left unread) |
| **Citra, 24** — The Completionist      | A true reader who finishes every book she starts.                      | Activity Heatmap showing deep engagement, high tiers, Completionist trait   |

### 2.2 Competition Judges (Meta-Persona)

The PNBWDC judges evaluate: **visual design quality, UX innovation, frontend craftsmanship, and presentation polish**. Backend yields zero points. Every architectural decision must maximize visible, demonstrable frontend impact.

---

## 3. Product Scope & Constraints

### 3.1 Hard Constraints

| Constraint                   | Rationale                                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| **Zero Backend**             | Competition rules: backend yields no extra points. All logic is client-side.                   |
| **No Database**              | State is managed via `localStorage`, `sessionStorage`, and in-memory stores (Pinia/Zustand).   |
| **No Real AI**               | All "AI" features use pre-authored JSON responses with simulated streaming (typewriter delay). |
| **No File Upload to Server** | EPUB verification uses local `FileReader` + client-side MD5 hashing only.                      |
| **SPA Architecture**         | Single Page Application. No SSR, no API routes, no server functions.                           |
| **Browser Target**           | Modern Chromium (Chrome/Edge 120+), Firefox 120+, Safari 17+. No IE support.                   |

### 3.2 Technology Stack

| Layer                | Technology                           | Rationale                                                  |
| -------------------- | ------------------------------------ | ---------------------------------------------------------- |
| **Framework**        | Vue 3 (Composition API) or React 18+ | TBD after Project Stitch analysis                          |
| **Styling**          | Tailwind CSS v4                      | Utility-first, rapid prototyping, design token control     |
| **State Management** | Pinia (Vue) or Zustand (React)       | Lightweight, no boilerplate, perfect for client-only state |
| **Animation**        | GSAP + CSS Transitions               | Industry-standard for cinematic sequencing                 |
| **Audio**            | Howler.js                            | HTML5 Audio wrapper with crossfade support                 |
| **EPUB Parsing**     | epub.js (client-side)                | Extract text/metadata from EPUB in-browser                 |
| **Hashing**          | spark-md5                            | Fast client-side MD5 for EPUB verification                 |
| **Build Tool**       | Vite                                 | Native ESM, HMR, optimized for competition demo speed      |
| **Routing**          | Vue Router / React Router            | Client-side SPA routing                                    |
| **Icons**            | Material Symbols (variable font)     | Consistent with Material Design language                   |

---

## 4. Feature Specifications

### 4.1 F1 — Kinetic Reading Engine (The Core)

> **Priority:** P0 (Must Have)  
> **Epic:** Reading Experience

This is the centerpiece of Genmoire. Every other feature supports or extends this engine.

> **Design Philosophy — Honoring the Author's Voice:**  
> Genmoire deliberately presents the author's original text _exactly as written_. We do not paraphrase, simplify, or offer vocabulary-swapped alternatives. Every word an author chose is intentional — a reflection of their voice, their rhythm, their universe. Genmoire's role is to _illuminate_ those words through contextual AI Explain, not to _replace_ them. This is a core product value.

#### 4.1.1 Full-Screen NVL Text Overlay

- **Layout:** Text renders over the entire viewport (100vw × 100vh). No traditional bottom dialog box.
- **Background:** Full-bleed CG image (cover or contextual illustration) with a **45% dark overlay** (`background: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(...)`) for typographic contrast.
- **Text Positioning:** Content is positioned in a centered column (`max-width: 680px`, vertically centered with flexbox), ensuring comfortable line length (55–75 characters per line).
- **Typography:** Merriweather or Lora at `1.25rem` / `1.8` line height for body text. Plus Jakarta Sans for UI chrome.
- **Scroll Behavior:** No scroll. Each "page" is a discrete block of text that fits within the viewport. Overflow is handled by pagination (click-to-advance).

#### 4.1.2 Click-to-Advance Mechanism

- **Trigger:** Click/tap anywhere on the reading viewport (except interactive UI elements).
- **Typewriter Effect:** Text characters render progressively at 30ms per character (configurable). Uses `requestAnimationFrame` for smooth rendering.
- **Skip:** Clicking during typewriter animation instantly completes the current text block.
- **End-of-Block Indicator:** A subtle blinking triangle (`▼`) or chevron animates at the bottom-right of the last rendered line. Uses CSS `@keyframes` with `opacity` pulse.
- **State:** Each text block is a discrete state node in the reading manifest. Advancing increments the `currentNodeIndex` in the store.
- **Transition:** Between blocks, a 300ms fade transition on both text and (optionally) the background CG.

#### 4.1.3 Cinematic CG Integration

- **CG Assets:** Full-screen background images (16:9 or 9:16 for mobile, with CSS `object-fit: cover`).
- **CG Mapping:** Each text node in the JSON manifest has an optional `cg` field pointing to an image URL or local asset path.
- **Transition Types:**
  - `dissolve` — CSS `opacity` crossfade (default, 800ms)
  - `slide-left` — CSS `transform: translateX()` slide transition
  - `fade-to-black` — Opacity → 0 → swap → Opacity → 1
- **Fallback:** If no CG is mapped, use a solid warm gradient background matching the current theme.
- **Preloading:** Next CG is preloaded into a hidden `<img>` tag to prevent visible loading latency.

#### 4.1.4 Ambient HTML5 Audio (BGM)

- **Engine:** Howler.js manages all audio playback.
- **Crossfade:** When BGM changes between text nodes, the outgoing track fades out over 2s while the incoming track fades in over 2s (overlap crossfade).
- **Volume Control:** Global volume slider in the settings drawer (0–100%, stored in `localStorage`).
- **Autoplay Policy:** On first user interaction (click), initialize the AudioContext. Show a subtle "🔊 Tap to enable audio" prompt if autoplay is blocked.
- **Mute Toggle:** Accessible from the reading HUD overlay.
- **Tracks:** Defined per-node in the manifest JSON (`bgm` field with `src`, `volume`, `loop` properties).

---

### 4.2 F2 — Context-Aware "AI Explain" (RAG Simulation)

> **Priority:** P0 (Must Have)  
> **Epic:** Comprehension Assistance
>
> This is the **absolute core pedagogical feature** of Genmoire. It replaces standard dictionaries to eliminate the "Split-Attention Effect" — where a reader loses focus by switching between the text and a separate reference tool.

#### 4.2.1 Text Selection Trigger

- **Mechanism:** Listen for `mouseup` / `touchend` events on the reading viewport.
- **Selection Detection:** Use `window.getSelection()` to capture the selected text string.
- **Minimum Selection:** Ignore selections shorter than 2 characters.
- **Action Chip:** A Material Design–styled action chip ("✦ Explain") appears floating near the selection point (positioned using `Range.getBoundingClientRect()`).
- **Dismissal:** Chip disappears on click-away, scroll, or after 5 seconds of inactivity.

#### 4.2.2 Explanation Drawer

- **Layout:** A side drawer (400px width on desktop, full-screen sheet on mobile) slides in from the right.
- **Content Sections:**
  1. **Word/Phrase Header** — The selected text displayed prominently.
  2. **Contextual Meaning** — A paragraph explaining the word/phrase _in the context of the current passage_ (not a generic dictionary definition). This is the core value.
  3. **Idiom & Syntax Breakdown** — If the selection is an idiom, phrasal verb, or complex grammatical structure, explain its pattern and usage in context.
  4. **Plot Context** — How this word/phrase connects to the narrative, character motivation, or thematic element of the current scene.
  5. **Etymology / Cultural Note** (optional) — A short linguistic or cultural insight that enriches understanding.
- **Simulated Streaming:** Text renders character-by-character (typewriter) at 15ms per character to simulate "AI generating a response." A subtle pulsing dot indicator precedes the stream.
- **Data Source:** Pre-authored JSON keyed by `nodeId + selectedText`. Fallback: generic contextual response.
- **Close:** Drawer closes on overlay tap, close button, or Escape key.

#### 4.2.3 Design Principles

- **Honor the Author's Words.** AI Explain _illuminates_ the original text — it never rewrites, paraphrases, or substitutes simpler vocabulary. The author's chosen words are sacred.
- **No Avatars or Mascots.** The interface is purely typographic and professional.
- **No Split-Attention.** The explanation appears _beside_ the reading content, not in a new tab or popup that obscures the text.
- **Minimal Friction.** Select → Chip → Drawer. Three interactions maximum.

---

### 4.3 F3 — Warm Material Design Ergonomics

> **Priority:** P0 (Must Have)  
> **Epic:** Design System

#### 4.3.1 Theme Tokens

| Token                 | Light ("Warm Sepia")  | Dark ("Warm Obsidian") |
| --------------------- | --------------------- | ---------------------- |
| `--surface-primary`   | `#FAF6EE`             | `#1A1816`              |
| `--surface-secondary` | `#F0EBE1`             | `#242120`              |
| `--surface-elevated`  | `#FFFFFF`             | `#2C2926`              |
| `--text-primary`      | `#2C2523`             | `#E8E0D8`              |
| `--text-secondary`    | `#6B5E56`             | `#A89888`              |
| `--text-muted`        | `#9C8E84`             | `#7A6E64`              |
| `--accent-primary`    | `#8B6914`             | `#D4A843`              |
| `--accent-secondary`  | `#5C7A3A`             | `#8BB85E`              |
| `--border-subtle`     | `#E0D8CE`             | `#3A3632`              |
| `--overlay-dark`      | `rgba(44,37,35,0.45)` | `rgba(0,0,0,0.55)`     |
| `--error`             | `#B3261E`             | `#F2B8B5`              |
| `--success`           | `#1E6B3A`             | `#A8D5BA`              |

#### 4.3.2 Typography Scale

| Role           | Font              | Weight | Size     | Line Height |
| -------------- | ----------------- | ------ | -------- | ----------- |
| Display        | Plus Jakarta Sans | 700    | 2.5rem   | 1.2         |
| Heading 1      | Plus Jakarta Sans | 600    | 2rem     | 1.3         |
| Heading 2      | Plus Jakarta Sans | 600    | 1.5rem   | 1.35        |
| Heading 3      | Plus Jakarta Sans | 500    | 1.25rem  | 1.4         |
| Body (Reading) | Merriweather      | 400    | 1.25rem  | 1.8         |
| Body (UI)      | Plus Jakarta Sans | 400    | 1rem     | 1.5         |
| Caption        | Plus Jakarta Sans | 400    | 0.875rem | 1.4         |
| Overline       | Plus Jakarta Sans | 500    | 0.75rem  | 1.5         |

#### 4.3.3 Spacing & Layout

- **Base Unit:** 4px (`0.25rem`). All spacing is multiples of 4.
- **Content Max Width:** 680px (reading), 1200px (dashboard/library).
- **Border Radius:** `sm: 6px`, `md: 12px`, `lg: 16px`, `xl: 24px`, `full: 9999px`.
- **Elevation (Light):** `shadow-sm`, `shadow-md`, `shadow-lg` using warm-tinted shadows (`rgba(44,37,35, 0.08)`).
- **Elevation (Dark):** Borders instead of shadows for layering.

#### 4.3.4 Motion

- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard).
- **Duration:** `fast: 150ms`, `normal: 300ms`, `slow: 500ms`, `cinematic: 800ms`.
- **Principles:** Enter animations are slightly slower than exit. Reading transitions are `cinematic`. UI transitions are `normal`.

---

### 4.4 F4 — Author Control & Anti-AI Options

> **Priority:** P1 (Should Have)  
> **Epic:** Creator Agency

#### 4.4.1 Author Mode Flag

Each book manifest includes an `authorMode` field:

```json
{
  "bookId": "atomic-habits-001",
  "authorMode": "custom | ai | pure-kinetic",
  "authorAssets": {
    "cg": { "scene-001": "/author-cg/scene-001.webp" },
    "bgm": { "main-theme": "/author-bgm/main.mp3" }
  }
}
```

#### 4.4.2 Mode Behaviors

| Mode           | CG Backgrounds                    | BGM Audio                | AI Explain |
| -------------- | --------------------------------- | ------------------------ | ---------- |
| `ai` (Default) | AI-mapped CGs from manifest       | AI-selected BGM          | Enabled    |
| `custom`       | Author-provided CGs only          | Author-provided BGM only | Enabled    |
| `pure-kinetic` | Disabled (solid theme background) | Disabled (silence)       | Enabled    |

#### 4.4.3 UI Indicator

- When in `pure-kinetic` mode, a subtle badge appears in the reading HUD: **"✦ Pure Reading Mode — Visuals disabled per author preference"**.
- The reading experience gracefully degrades: full-screen warm gradient background, centered kinetic text, no CGs, no BGM.

---

### 4.5 F5 — Smart Codes & BYOB Ecosystem

> **Priority:** P0 (Must Have)  
> **Epic:** Content Access

#### 4.5.1 Manifest Code Entry

- **UI:** A prominent input field on the library/home screen with placeholder: `Enter Grimoire Code (e.g., #VN-ATOMIC-01)`.
- **Validation:** Regex pattern: `^#[A-Z]{2,4}-[A-Z]+-\d{2,4}$`.
- **Lookup:** Codes map to entries in a local `manifests.json` registry file.
- **Success:** Smooth transition to the book detail view with a "Grimoire Unlocked" animation.
- **Failure:** Shake animation on the input + error chip: "Invalid code. Check your grimoire scroll."

#### 4.5.2 EPUB Hash Verification (Zero-Upload)

- **Flow:**
  1. User selects an `.epub` file via `<input type="file" accept=".epub">`.
  2. `FileReader.readAsArrayBuffer()` reads the file **locally**.
  3. `spark-md5` computes the MD5 hash of the ArrayBuffer.
  4. Hash is compared against a list of known hashes in the local manifest.
  5. Match → Unlock the corresponding reading experience.
  6. No match → "This book isn't in our grimoire collection yet."
- **Performance Target:** Hash computation completes in <200ms for files up to 10MB.
- **Privacy:** File never leaves the browser. No network request is made.

#### 4.5.3 Page-Challenge Security Quiz

- **Purpose:** Verify physical book ownership without requiring a digital file.
- **Flow:**
  1. User selects a book that supports page-challenge.
  2. System presents: "What is the **3rd word** on **page 47** of your copy?"
  3. User types the word (case-insensitive comparison).
  4. Match → Unlock. Mismatch → Allow 3 attempts, then cooldown.
- **Data:** Challenge questions are stored in the book manifest:
  ```json
  {
    "pageChallenge": {
      "page": 47,
      "position": 3,
      "answer": "wandering"
    }
  }
  ```

---

### 4.6 F6 — Crowdsourced AI Refinement Loop

> **Priority:** P2 (Nice to Have)  
> **Epic:** Community Feedback

#### 4.6.1 Report Mismatch UI

- **Trigger:** A subtle "⚑ Report" icon in the reading HUD.
- **Modal:** Opens a minimal form:
  - **Issue Type:** Dropdown — "CG doesn't match scene" | "BGM feels wrong" | "Text has errors" | "Other"
  - **Details:** Optional textarea (max 280 chars).
  - **Submit:** "Send to the Arcanum" button.

#### 4.6.2 Simulated Refinement Terminal

- **On Submit:** A fullscreen overlay appears with a terminal-style animation:
  ```
  [✦ ARCANUM REFINEMENT ENGINE v3.1]
  ─────────────────────────────────────
  > Aggregating community feedback...    ██████░░░░  60%
  > Cross-referencing passage context... ████████░░  80%
  > Refining generation prompt...        █████████░  90%
  > Rendering with Imagen 3...           ██████████ 100%
  ─────────────────────────────────────
  ✓ Refinement complete. Grimoire updated.
  ```
- **Result:** After the animation (3–5 seconds), the background CG crossfades to an alternate pre-loaded image from the manifest's `altCg` array.
- **Storage:** Report data is saved to `localStorage` (simulating persistence). The alternate CG index is tracked per node.

---

### 4.7 F7 — Gamification & Progression (The Reader's Journey)

> **Priority:** P1 (Should Have)  
> **Epic:** Engagement & Retention

A motivational layer that transforms reading into a journey of mastery. All data is tracked client-side via `localStorage` — no backend required. Progress is deterministic and verifiable from local reading history.

#### 4.7.1 Reader Tier System

A 5-tier progression system displayed on the user's profile, explicitly based on the number of books completed.

| Tier | Title                | Books Required | Personality               | Visual Treatment                   |
| ---- | -------------------- | -------------- | ------------------------- | ---------------------------------- |
| 1    | **BookTok Scroller** | 0–2            | Casual / trendy discovery | Warm bronze badge, playful icon    |
| 2    | **Genmoire Reader**  | 3–9            | Aesthetic curation        | Silver badge, collector motif      |
| 3    | **Imperial Scholar** | 10–24          | Academic authority        | Gold badge, scholarly crest        |
| 4    | **Lorekeeper**       | 25–49          | Deep lore devotion        | Amethyst badge, arcane sigil       |
| 5    | **Loremaster**       | 50+            | Legendary status          | Obsidian & gold badge, crown motif |

**Mechanics:**

- Tier is recalculated on every book completion event.
- A book counts as "completed" when the reader reaches the final node of the last chapter.
- Tier-up triggers a celebratory animation overlay: tier badge scales in with `gm-scale-pop`, accompanied by a brief congratulatory message.
- Current tier and progress-to-next are displayed on the profile page.
- **Anti-Exploitation:** A book must have been open for at least `estimatedReadTime * 0.3` to count as a legitimate completion. Rapid-clicking through a 30-minute book in 2 minutes does not count.

#### 4.7.2 Hidden Traits (Behavioral Achievements)

Traits are unlocked dynamically based on simulated user behavior patterns. They are **never shown as objectives** — they appear as surprises, encouraging organic reading habits rather than gamified grinding.

| Trait                                               | Condition                                          | Icon Vibe                  |
| --------------------------------------------------- | -------------------------------------------------- | -------------------------- |
| **Tsundoku** • _"Buying books is a lifestyle"_      | Collection ≥ 20 books, >75% unfinished             | Stack of unread books      |
| **Night Owl** • _"The grimoire glows at midnight"_  | ≥5 books completed between 22:00–05:00             | Crescent moon & candle     |
| **Speed Reader** • _"Words blur past your eyes"_    | ≥3 books finished within `estimatedReadTime * 1.5` | Lightning bolt             |
| **Completionist** • _"No book left behind"_         | 100% finish rate (min. 5 books started)            | Checkmark crown            |
| **Curious Mind** • _"Knowledge is the real magic"_  | AI Explain used ≥50 times total                    | Magnifying glass & sparkle |
| **Marathon Reader** • _"30 days of unbroken focus"_ | 30-day consecutive reading streak                  | Flame streak               |
| **Bibliophile** • _"A living library"_              | 300+ books completed                               | Infinite bookshelf         |

**Mechanics:**

- Traits are evaluated on every relevant event (book completion, explain usage, session timestamps).
- Unlock triggers a subtle toast notification with the trait icon + title + flavor text.
- Unlocked traits are displayed as badges on the profile page.
- Trait evaluation uses data from `localStorage` (reading history, timestamps, explain count).
- **Clock Source:** `new Date()` for session timestamps. For the demo, traits can be pre-seeded in localStorage to showcase the UI.

#### 4.7.3 Profile Page

- **Route:** `/profile`
- **Content:**
  - Reader avatar area (decorative, no upload — uses tier-based generated emblem)
  - Current tier badge + title + progress bar to next tier
  - Total books completed / total books in library
  - Reading streak counter (current + longest)
  - Unlocked traits grid (with locked/unlocked states)
  - Recently completed books list
- **Data Source:** All from `localStorage` — `gm-profile`, `gm-history`, `gm-traits`.

---

### 4.8 F8 — User Dashboard & Library (Post-Login View)

> **Priority:** P1 (Should Have)  
> **Epic:** Core Navigation & Engagement

Serves as the primary landing hub immediately after a user signs in. It merges the user's gamified profile elements with their personal library, providing immediate visual feedback on their reading habits to distinguish true readers from FOMO hoarders.

#### 4.8.1 Dashboard Stats

- Visually prominent display of the user's current **Reading Streak**, active **Tier/Rank**, and **Unlocked Hidden Traits**.
- Motivates users to maintain their daily reading habits.

#### 4.8.2 Activity Heatmap (GitHub-Style)

- A contribution calendar visualizing reading consistency.
- **Color Mapping:** Instead of GitHub's green, it uses the app's primary accent color (e.g., Warm Amber).
- **Opacity Logic:** The opacity/intensity of the daily block is dynamically mapped to the total time spent reading that day (e.g., `< 10m` is light, `> 1h` is dark).
- Effectively highlights users who are truly engaged vs. those who just log in to hoard books.

#### 4.8.3 Personal Library

- Positioned below the dashboard widgets.
- Displays the user's collected Grimoires (books) ready to be read.
- Replaces the standalone Library screen, making the user's collection feel tied to their reading identity.

---

## 5. Information Architecture & Navigation

### 5.1 Screen Map

```
┌─────────────────────────────────────────────┐
│                 GENMOIRE                     │
├─────────────────────────────────────────────┤
│                                             │
│  [1] LANDING / HOME                         │
│   ├── Hero Section (Tagline + CTA)          │
│   ├── Manifest Code Input                   │
│   └── Featured Grimoires Grid               │
│                                             │
│  [2] DASHBOARD & LIBRARY                    │
│   ├── User Stats (Tier, Streak, Traits)     │
│   ├── Activity Heatmap (Time-based opacity) │
│   ├── Book Cards Grid (Personal Library)    │
│   ├── BYOB Section (Upload / Hash)          │
│   ├── Manifest Code Input                   │
│   └── Filters (Genre, Author Mode)          │
│                                             │
│  [3] BOOK DETAIL                            │
│   ├── Cover + Metadata                      │
│   ├── Author Mode Indicator                 │
│   ├── Page Challenge (if applicable)        │
│   ├── Chapter List                          │
│   └── "Begin Reading" CTA                   │
│                                             │
│  [4] READER (Full-Screen Kinetic Engine)    │
│   ├── CG Background Layer                   │
│   ├── Dark Overlay Layer                    │
│   ├── Text Content Layer                    │
│   ├── HUD Overlay                           │
│   │   ├── Settings Gear                     │
│   │   ├── Chapter Progress Bar              │
│   │   ├── Mute Toggle                       │
│   │   └── Report Mismatch                   │
│   ├── AI Explain Action Chip (contextual)   │
│   └── AI Explain Side Drawer                │
│                                             │
│  [5] SETTINGS DRAWER (Global)               │
│   ├── Theme Toggle (Light/Dark)             │
│   ├── Volume Slider                         │
│   ├── Text Size Adjustment                  │
│   ├── Animation Speed                       │
│   └── About / Credits                       │
│                                             │
└─────────────────────────────────────────────┘
```

### 5.2 Navigation Behavior

- **Landing → Dashboard:** Primary CTA or nav link after login.
- **Dashboard → Book Detail:** Click on book card.
- **Book Detail → Reader:** "Begin Reading" button (after verification if required).
- **Reader → Dashboard:** Back button in HUD (with "Exit Reading?" confirmation).
- **Settings:** Accessible from any screen via gear icon in the top bar.
- **Theme Toggle:** Instant swap, no page reload. CSS custom properties transition over 300ms.

---

## 6. Non-Functional Requirements

| Category               | Requirement                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| **Performance**        | First Contentful Paint < 1.5s. Time to Interactive < 3s.                                        |
| **Accessibility**      | WCAG 2.1 AA. Keyboard navigation for all interactive elements. `aria-live` for typewriter text. |
| **Responsiveness**     | Mobile-first. Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`.                |
| **Offline Capability** | Service Worker caches static assets. Reading can continue offline if manifest is loaded.        |
| **Bundle Size**        | Total JS < 300KB gzipped (excluding audio/image assets).                                        |
| **Browser Support**    | Chrome 120+, Firefox 120+, Safari 17+, Edge 120+.                                               |

---

## 7. Success Metrics (Competition Context)

| Metric                  | Target                              | How We Demonstrate                                          |
| ----------------------- | ----------------------------------- | ----------------------------------------------------------- |
| **Visual Impact**       | "Wow" factor in first 5 seconds     | Cinematic landing page with animated hero                   |
| **UX Innovation**       | Novel interaction paradigm          | Kinetic reading engine unlike any existing reader           |
| **Technical Craft**     | Clean, modern frontend architecture | Component composition, state management, animation          |
| **Accessibility**       | Inclusive design                    | Theme modes, AI Explain, keyboard navigation                |
| **Engagement**          | Replay value beyond reading         | Tier progression, hidden traits, profile page               |
| **Presentation Polish** | Demo-ready                          | Smooth transitions, zero loading jank, curated demo content |

---

## 8. Demo Content Requirements

For the competition demo, we need **one fully mapped book** with:

- [ ] **Minimum 10 text nodes** across 2 chapters
- [ ] **5+ unique CG backgrounds** (can be AI-generated or stock)
- [ ] **3 BGM tracks** with crossfade points mapped
- [ ] **8+ AI Explain entries** (contextual meanings, idiom breakdowns, plot context)
- [ ] **1 Page Challenge question** configured
- [ ] **1 Manifest Code** (`#VN-DEMO-01`) registered
- [ ] **Pre-seeded profile** with Tier 3 progress + 2–3 unlocked traits for demo showcase

---

## 9. Milestones & Phases

| Phase       | Deliverable                                       | Status         |
| ----------- | ------------------------------------------------- | -------------- |
| **Phase 0** | PRD + Architecture + Design System docs           | 🟡 In Progress |
| **Phase 1** | Project Stitch analysis + scaffolding             | ⬜ Not Started |
| **Phase 2** | Design system implementation (tokens, components) | ⬜ Not Started |
| **Phase 3** | Kinetic Reading Engine (core)                     | ⬜ Not Started |
| **Phase 4** | AI Explain + BYOB features                        | ⬜ Not Started |
| **Phase 5** | Author Control + Refinement Loop                  | ⬜ Not Started |
| **Phase 6** | Gamification: Traits, Tiers, Heatmap              | ⬜ Not Started |
| **Phase 7** | Dashboard & Library Integration                   | ⬜ Not Started |
| **Phase 8** | Demo content creation + polish                    | ⬜ Not Started |
| **Phase 9** | Competition submission + presentation prep        | ⬜ Not Started |

---

## 10. Glossary

| Term                  | Definition                                                                              |
| --------------------- | --------------------------------------------------------------------------------------- |
| **NVL**               | Novel-style text overlay (from visual novel terminology) — text fills the entire screen |
| **CG**                | Computer Graphics — full-screen illustration used as background                         |
| **BGM**               | Background Music — ambient audio track                                                  |
| **BYOB**              | Bring Your Own Book — user-provided content verification system                         |
| **Manifest**          | JSON data structure defining the reading experience (text, CGs, BGM, metadata)          |
| **Kinetic**           | A visual novel subgenre with no player choices — purely linear, cinematic storytelling  |
| **Grimoire**          | A textbook of magic — used metaphorically for "enchanted book"                          |
| **Wizard of Oz**      | UX research technique where a human (or pre-authored data) simulates AI responses       |
| **RAG**               | Retrieval-Augmented Generation — simulated via pre-mapped JSON lookups                  |
| **Pure Kinetic Mode** | Anti-AI reading mode with no generated visuals or audio                                 |
| **Tsundoku**          | Japanese term (積ん読く) — acquiring books and letting them pile up unread              |
| **Trait**             | A hidden behavioral achievement unlocked by organic reading patterns                    |
