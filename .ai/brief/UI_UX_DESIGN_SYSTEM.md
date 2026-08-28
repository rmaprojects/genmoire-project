# Genmoire — UI/UX Design System

> **Version:** 1.3.0  
> **Last Updated:** 2026-08-12  
> **Companion Documents:** PRD.md, ARCHITECTURE_AND_SIMULATION.md  
> **Design Philosophy:** Warm Material Design meets Visual Novel Cinematics

---

## 1. Design Philosophy

### 1.1 Core Design Pillars

| Pillar | Description | Implementation |
|---|---|---|
| **Warmth** | Every surface, shadow, and color carries warm undertones. No clinical blues or cold grays. | Sepia-based palette, warm shadows, amber accents |
| **Cinematics** | The reading experience should feel like a visual novel — immersive, full-screen, atmospheric. | Full-bleed CGs, 45% dark overlay, typewriter text, crossfade transitions |
| **Clarity** | Typography-first design. Text is always the hero. UI chrome is minimal and recedes. | High contrast ratios, generous line height, clean sans-serif UI |
| **Craft** | Every interaction feels intentional. Motion is purposeful, not decorative. | Material easing, consistent durations, meaningful transitions |
| **Respect** | Respect the reader's eyes (warm tones), the author's wishes (Anti-AI mode), and the user's time (zero friction). | Dark/light modes, Pure Kinetic mode, 3-click max paths |

### 1.2 Design Language Summary

Genmoire's design language is a hybrid of:

- **Material Design 3** — For structural components (chips, drawers, buttons, inputs). Provides familiarity and accessibility.
- **Visual Novel Aesthetics** — For the reading engine (full-screen CGs, NVL text overlay, typewriter animation). Provides immersion and novelty.
- **Warm Sepia Ergonomics** — For color and typography. Provides comfort for extended reading sessions.

The key tension to navigate: **Material Design is functional and structured, while Visual Novel UI is cinematic and atmospheric.** Genmoire resolves this by using Material components for *everything outside the reader* and cinematic styling for *everything inside the reader*.

---

## 2. Color System

### 2.1 Design Tokens (CSS Custom Properties)

```css
/* tokens.css */

/* ═══════════════════════════════════════════
   LIGHT THEME — "Warm Sepia"
   ═══════════════════════════════════════════ */
:root,
[data-theme="light"] {
  /* Surfaces */
  --gm-surface-primary:    #FAF6EE;   /* Main background */
  --gm-surface-secondary:  #F0EBE1;   /* Cards, sidebar backgrounds */
  --gm-surface-elevated:   #FFFFFF;   /* Elevated cards, modals */
  --gm-surface-inverse:    #2C2523;   /* Inverse containers */
  --gm-surface-scrim:      rgba(44, 37, 35, 0.32); /* Modal backdrop */

  /* Text */
  --gm-text-primary:       #2C2523;   /* Primary body text */
  --gm-text-secondary:     #6B5E56;   /* Secondary/support text */
  --gm-text-muted:         #9C8E84;   /* Placeholder, disabled text */
  --gm-text-inverse:       #FAF6EE;   /* Text on dark surfaces */
  --gm-text-on-accent:     #FFFFFF;   /* Text on accent backgrounds */

  /* Accents */
  --gm-accent-primary:     #8B6914;   /* Primary action: gold/amber */
  --gm-accent-primary-hover: #A37D18; /* Hover state */
  --gm-accent-primary-container: #F5E6C4; /* Light accent background */
  --gm-accent-secondary:   #5C7A3A;   /* Secondary action: sage green */
  --gm-accent-secondary-hover: #6E8F48;

  /* Borders */
  --gm-border-subtle:      #E0D8CE;   /* Card borders, dividers */
  --gm-border-medium:      #C8BEB2;   /* Input borders */
  --gm-border-strong:      #A89888;   /* Active borders */
  --gm-border-focus:       #8B6914;   /* Focus ring color */

  /* Semantic */
  --gm-error:              #B3261E;
  --gm-error-container:    #F9DEDC;
  --gm-success:            #1E6B3A;
  --gm-success-container:  #D4EDDA;
  --gm-warning:            #E6A817;
  --gm-warning-container:  #FFF3CD;
  --gm-info:               #4A6FA5;
  --gm-info-container:     #D6E4F0;

  /* Reader-specific */
  --gm-overlay-dark:       rgba(44, 37, 35, 0.45);  /* CG overlay */
  --gm-reader-text:        #F0EBE1;   /* Text on CG overlay */
  --gm-reader-text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);

  /* Shadows (warm-tinted) */
  --gm-shadow-sm:  0 1px 2px rgba(44, 37, 35, 0.06), 0 1px 3px rgba(44, 37, 35, 0.10);
  --gm-shadow-md:  0 4px 6px rgba(44, 37, 35, 0.07), 0 2px 4px rgba(44, 37, 35, 0.06);
  --gm-shadow-lg:  0 10px 15px rgba(44, 37, 35, 0.10), 0 4px 6px rgba(44, 37, 35, 0.05);
  --gm-shadow-xl:  0 20px 25px rgba(44, 37, 35, 0.10), 0 8px 10px rgba(44, 37, 35, 0.04);
}

/* ═══════════════════════════════════════════
   DARK THEME — "Warm Obsidian"
   ═══════════════════════════════════════════ */
[data-theme="dark"] {
  /* Surfaces */
  --gm-surface-primary:    #1A1816;   /* Main background */
  --gm-surface-secondary:  #242120;   /* Cards, sidebar backgrounds */
  --gm-surface-elevated:   #2C2926;   /* Elevated cards, modals */
  --gm-surface-inverse:    #E8E0D8;   /* Inverse containers */
  --gm-surface-scrim:      rgba(0, 0, 0, 0.48);

  /* Text */
  --gm-text-primary:       #E8E0D8;
  --gm-text-secondary:     #A89888;
  --gm-text-muted:         #7A6E64;
  --gm-text-inverse:       #1A1816;
  --gm-text-on-accent:     #1A1816;

  /* Accents */
  --gm-accent-primary:     #D4A843;
  --gm-accent-primary-hover: #E0B94F;
  --gm-accent-primary-container: #3D3220;
  --gm-accent-secondary:   #8BB85E;
  --gm-accent-secondary-hover: #9EC86E;

  /* Borders */
  --gm-border-subtle:      #3A3632;
  --gm-border-medium:      #4A4540;
  --gm-border-strong:      #5A5450;
  --gm-border-focus:       #D4A843;

  /* Semantic */
  --gm-error:              #F2B8B5;
  --gm-error-container:    #8C1D18;
  --gm-success:            #A8D5BA;
  --gm-success-container:  #1B4332;
  --gm-warning:            #FFD666;
  --gm-warning-container:  #5C4A10;
  --gm-info:               #A3C4E9;
  --gm-info-container:     #2A3F5F;

  /* Reader-specific */
  --gm-overlay-dark:       rgba(0, 0, 0, 0.55);
  --gm-reader-text:        #E8E0D8;
  --gm-reader-text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);

  /* Shadows → borders in dark mode */
  --gm-shadow-sm:  0 0 0 1px var(--gm-border-subtle);
  --gm-shadow-md:  0 0 0 1px var(--gm-border-subtle);
  --gm-shadow-lg:  0 0 0 1px var(--gm-border-medium);
  --gm-shadow-xl:  0 0 0 1px var(--gm-border-medium);
}
```

### 2.2 Color Usage Rules

| Context | Token | Rationale |
|---|---|---|
| Page background | `--gm-surface-primary` | Warm base, never pure white or black |
| Card background | `--gm-surface-elevated` | Subtle lift from base |
| Body text | `--gm-text-primary` | Maximum readability |
| Supporting text | `--gm-text-secondary` | De-emphasize without hiding |
| Placeholder / disabled | `--gm-text-muted` | Clearly inactive |
| CTA buttons | `--gm-accent-primary` | Gold/amber draws attention |
| Reader text on CG | `--gm-reader-text` | Light text on dark overlay |
| Focus rings | `--gm-border-focus` | 2px solid, always visible |
| Error states | `--gm-error` | Red, but warm-toned |

### 2.3 Contrast Ratios (WCAG AA Compliance)

| Pair | Light Mode Ratio | Dark Mode Ratio | Pass? |
|---|---|---|---|
| `text-primary` on `surface-primary` | 12.4:1 | 11.8:1 | ✅ AAA |
| `text-secondary` on `surface-primary` | 5.2:1 | 4.8:1 | ✅ AA |
| `text-muted` on `surface-primary` | 3.1:1 | 3.0:1 | ⚠️ AA Large only |
| `reader-text` on `overlay-dark` | 9.5:1 | 9.2:1 | ✅ AAA |
| `text-on-accent` on `accent-primary` | 5.8:1 | 5.5:1 | ✅ AA |

---

## 3. Typography System

### 3.1 Font Stack

```css
/* typography.css */

/* Google Fonts imports */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap');

:root {
  --gm-font-ui:      'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --gm-font-reading:  'Merriweather', 'Georgia', 'Times New Roman', serif;
  --gm-font-mono:     'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}
```

### 3.2 Type Scale

```css
:root {
  /* Display — Hero sections, landing page */
  --gm-text-display:        2.5rem;    /* 40px */
  --gm-leading-display:     1.2;
  --gm-tracking-display:    -0.02em;
  --gm-weight-display:      700;

  /* Heading 1 — Page titles */
  --gm-text-h1:             2rem;      /* 32px */
  --gm-leading-h1:          1.3;
  --gm-tracking-h1:         -0.01em;
  --gm-weight-h1:           600;

  /* Heading 2 — Section titles */
  --gm-text-h2:             1.5rem;    /* 24px */
  --gm-leading-h2:          1.35;
  --gm-tracking-h2:         0;
  --gm-weight-h2:           600;

  /* Heading 3 — Subsections, card titles */
  --gm-text-h3:             1.25rem;   /* 20px */
  --gm-leading-h3:          1.4;
  --gm-tracking-h3:         0;
  --gm-weight-h3:           500;

  /* Body Reading — Kinetic Reading Engine text */
  --gm-text-reading:        1.25rem;   /* 20px */
  --gm-leading-reading:     1.8;
  --gm-tracking-reading:    0.01em;
  --gm-weight-reading:      400;

  /* Body UI — Interface text */
  --gm-text-body:           1rem;      /* 16px */
  --gm-leading-body:        1.5;
  --gm-tracking-body:       0;
  --gm-weight-body:         400;

  /* Caption — Metadata, timestamps */
  --gm-text-caption:        0.875rem;  /* 14px */
  --gm-leading-caption:     1.4;
  --gm-tracking-caption:    0.01em;
  --gm-weight-caption:      400;

  /* Overline — Labels, categories */
  --gm-text-overline:       0.75rem;   /* 12px */
  --gm-leading-overline:    1.5;
  --gm-tracking-overline:   0.08em;
  --gm-weight-overline:     500;

  /* Terminal — Refinement terminal */
  --gm-text-terminal:       0.875rem;  /* 14px */
  --gm-leading-terminal:    1.6;
  --gm-weight-terminal:     400;
}
```

### 3.3 Typography Usage

| Context | Font Family | Scale Token | Notes |
|---|---|---|---|
| All UI text | `--gm-font-ui` | body, h1–h3, caption, overline | Plus Jakarta Sans |
| Reader text (NVL overlay) | `--gm-font-reading` | reading | Merriweather, maximum legibility on CG |
| AI Explain drawer body | `--gm-font-reading` | reading (slightly smaller) | Matches reading context |
| Terminal simulation | `--gm-font-mono` | terminal | Monospace for authenticity |
| Code / manifest codes | `--gm-font-mono` | caption | Clearly different from prose |
| Book card titles | `--gm-font-ui` | h3 | Card hierarchy |
| Button labels | `--gm-font-ui` | body, weight 500 | Slightly bolder for CTAs |

### 3.4 Text Sizing Preferences

Users can adjust reading text size via settings. Three presets:

| Preset | Reading Size | UI Scale Factor |
|---|---|---|
| Small | `1.125rem` (18px) | 0.9 |
| Medium (Default) | `1.25rem` (20px) | 1.0 |
| Large | `1.5rem` (24px) | 1.1 |

---

## 4. Spacing & Layout

### 4.1 Spacing Scale (8-Point Grid)

```css
:root {
  --gm-space-0:   0;
  --gm-space-1:   0.25rem;   /*  4px */
  --gm-space-2:   0.5rem;    /*  8px */
  --gm-space-3:   0.75rem;   /* 12px */
  --gm-space-4:   1rem;      /* 16px */
  --gm-space-5:   1.25rem;   /* 20px */
  --gm-space-6:   1.5rem;    /* 24px */
  --gm-space-8:   2rem;      /* 32px */
  --gm-space-10:  2.5rem;    /* 40px */
  --gm-space-12:  3rem;      /* 48px */
  --gm-space-16:  4rem;      /* 64px */
  --gm-space-20:  5rem;      /* 80px */
  --gm-space-24:  6rem;      /* 96px */
}
```

### 4.2 Layout Constraints

```css
:root {
  --gm-max-w-reading:    680px;   /* Reading column max width */
  --gm-max-w-content:    900px;   /* Content sections */
  --gm-max-w-page:       1200px;  /* Page container max width */
  --gm-max-w-wide:       1440px;  /* Wide layouts */
  --gm-drawer-width:     400px;   /* Side drawers */
  --gm-header-height:    64px;    /* App header height */
  --gm-hud-padding:      var(--gm-space-4); /* Reader HUD edge padding */
}
```

### 4.3 Border Radius

```css
:root {
  --gm-radius-sm:    6px;
  --gm-radius-md:    12px;
  --gm-radius-lg:    16px;
  --gm-radius-xl:    24px;
  --gm-radius-full:  9999px;  /* Pills, avatars */
}
```

### 4.4 Z-Index Scale

```css
:root {
  --gm-z-base:       0;
  --gm-z-elevated:   10;     /* Cards with hover state */
  --gm-z-sticky:     100;    /* Header, sticky elements */
  --gm-z-hud:        200;    /* Reader HUD overlay */
  --gm-z-chip:       300;    /* Floating action chip */
  --gm-z-drawer:     400;    /* Side drawers */
  --gm-z-modal:      500;    /* Modals, dialogs */
  --gm-z-terminal:   600;    /* Refinement terminal overlay */
  --gm-z-tooltip:    700;    /* Tooltips, popovers */
  --gm-z-toast:      800;    /* Toast notifications */
}
```

---

## 5. Motion & Animation

### 5.1 Easing Curves

```css
:root {
  --gm-ease-standard:    cubic-bezier(0.4, 0.0, 0.2, 1.0);   /* Most transitions */
  --gm-ease-decelerate:  cubic-bezier(0.0, 0.0, 0.2, 1.0);   /* Elements entering */
  --gm-ease-accelerate:  cubic-bezier(0.4, 0.0, 1.0, 1.0);   /* Elements leaving */
  --gm-ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1.0); /* Bouncy, playful */
}
```

### 5.2 Duration Tokens

```css
:root {
  --gm-duration-instant:    0ms;
  --gm-duration-fast:       150ms;   /* Hover, focus, micro-interactions */
  --gm-duration-normal:     300ms;   /* Standard UI transitions */
  --gm-duration-slow:       500ms;   /* Drawer open/close, page transitions */
  --gm-duration-cinematic:  800ms;   /* CG crossfade, reading transitions */
  --gm-duration-dramatic:   1200ms;  /* Terminal animations, hero entrance */
}
```

### 5.3 Keyframe Animations

```css
/* animations.css */

/* Typewriter cursor blink */
@keyframes gm-cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Advance indicator pulse */
@keyframes gm-advance-pulse {
  0%, 100% { opacity: 0.4; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(4px); }
}

/* Fade in from below */
@keyframes gm-fade-in-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Fade out downward */
@keyframes gm-fade-out-down {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(8px); }
}

/* Shake (error feedback) */
@keyframes gm-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

/* Scale pop (success feedback) */
@keyframes gm-scale-pop {
  0% { transform: scale(0.95); opacity: 0; }
  60% { transform: scale(1.02); }
  100% { transform: scale(1); opacity: 1; }
}

/* Thinking dots */
@keyframes gm-thinking-dot {
  0%, 20% { opacity: 0.3; }
  50% { opacity: 1; }
  80%, 100% { opacity: 0.3; }
}

/* Terminal text reveal */
@keyframes gm-terminal-type {
  from { width: 0; }
  to { width: 100%; }
}

/* Subtle float (for hero elements) */
@keyframes gm-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}

/* Progress bar fill */
@keyframes gm-progress-fill {
  from { width: 0%; }
}

/* Drawer slide in from right */
@keyframes gm-slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Drawer slide out to right */
@keyframes gm-slide-out-right {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}

/* CG dissolve crossfade (applied to both layers) */
@keyframes gm-cg-dissolve-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes gm-cg-dissolve-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 5.4 Motion Principles

| Principle | Rule |
|---|---|
| **Enter > Exit** | Enter animations are slightly slower than exits (e.g., 300ms in, 200ms out). |
| **Reader = Cinematic** | All reading engine transitions use `cinematic` duration (800ms). |
| **UI = Snappy** | All interface transitions use `normal` duration (300ms). |
| **Respect Preferences** | Honor `prefers-reduced-motion: reduce` — disable all non-essential animations. |
| **No Jank** | Only animate `opacity` and `transform`. Never animate `width`, `height`, `top`, `left`. |
| **Purpose Over Decoration** | Every animation must communicate a state change. No animation for animation's sake. |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Component Specifications

### 6.1 Primitive Components

#### 6.1.1 `GButton`

**Variants:** `primary`, `secondary`, `ghost`, `danger`  
**Sizes:** `sm`, `md`, `lg`

```
┌─────────────────────────────┐
│  ┌─ icon (optional)         │
│  │                          │
│  │   [ Icon ]  Label Text   │
│  │                          │
│  └──────────────────────────│
│         ↑ padding: 12px 24px│
└─────────────────────────────┘
```

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| `primary` | `--accent-primary` | `--text-on-accent` | none | `--accent-primary-hover` |
| `secondary` | transparent | `--accent-primary` | 1px `--accent-primary` | bg `--accent-primary-container` |
| `ghost` | transparent | `--text-secondary` | none | bg `--surface-secondary` |
| `danger` | `--error` | white | none | darken 10% |

**States:** default, hover, focus (2px ring), active (scale 0.98), disabled (opacity 0.5)  
**Border Radius:** `--gm-radius-md` (12px)  
**Font:** `--gm-font-ui`, weight 500, size `body` (md) / `caption` (sm) / `h3` (lg)

---

#### 6.1.2 `GChip`

**Variants:** `default`, `active`, `action`  
**Used for:** Book tags, author mode badges, AI Explain action chip

```
┌──────────────────┐
│  ✦ Explain       │   ← Action chip (elevated, clickable)
└──────────────────┘

┌─────────┐ ┌───────────┐
│   AI   │ │  Fiction  │   ← Tag chip group
└─────────┘ └───────────┘
  default    default
```

| Variant | Background | Text | Border |
|---|---|---|---|
| `default` | transparent | `--text-secondary` | 1px `--border-subtle` |
| `active` | `--accent-primary` | `--text-on-accent` | none |
| `action` | `--surface-elevated` | `--accent-primary` | none, shadow-md |

**Border Radius:** `--gm-radius-full` (pill shape)  
**Padding:** `4px 12px` (sm), `6px 16px` (md)  
**Font:** `--gm-font-ui`, weight 500, size `caption`

---

#### 6.1.3 `GInput`

**Variants:** `default`, `code` (monospace), `search`

```
┌────────────────────────────────────────┐
│  Label (optional)                      │
│  ┌──────────────────────────────────┐  │
│  │ 🔍  Placeholder text...         │  │
│  └──────────────────────────────────┘  │
│  Helper text or error message          │
└────────────────────────────────────────┘
```

**States:** default, focus (accent border + ring), error (error border), disabled  
**Border:** 1px `--border-medium`, on focus: 2px `--border-focus`  
**Border Radius:** `--gm-radius-md`  
**Background:** `--surface-elevated`  
**Padding:** `12px 16px`  
**Font:** `--gm-font-ui` (default) / `--gm-font-mono` (code variant)

---

#### 6.1.4 `GDrawer`

**Variants:** `right` (default), `bottom` (mobile sheet)

```
Desktop:                           Mobile:
┌────────────┬──────────┐          ┌──────────────┐
│            │          │          │              │
│  Content   │  Drawer  │          │   Content    │
│  (dimmed)  │  400px   │          │   (dimmed)   │
│            │          │          ├──────────────┤
│            │  ──────  │          │              │
│            │  Close ✕ │          │   Drawer     │
│            │          │          │   (sheet)    │
│            │  Content │          │              │
│            │          │          │   ────────   │
└────────────┴──────────┘          └──────────────┘
```

**Width:** `--gm-drawer-width` (400px) on desktop, 100% on mobile  
**Background:** `--surface-elevated`  
**Border:** Left border 1px `--border-subtle` (desktop), top `--border-subtle` (mobile sheet)  
**Animation:** `gm-slide-in-right` 300ms ease-decelerate  
**Scrim:** `--surface-scrim` overlay on content area  
**Close:** Click scrim, Escape key, or close button  
**Z-Index:** `--gm-z-drawer` (400)

---

#### 6.1.5 `GModal`

```
┌─────────────────────────────┐
│        Modal Title          │
│  ─────────────────────────  │
│                             │
│   Content area. Supports    │
│   forms, text, or custom    │
│   content.                  │
│                             │
│  ─────────────────────────  │
│         [ Cancel ] [ OK ]   │
└─────────────────────────────┘
```

**Max Width:** 480px (sm), 640px (md)  
**Border Radius:** `--gm-radius-lg`  
**Shadow:** `--gm-shadow-xl`  
**Animation:** `gm-scale-pop` 300ms  
**Z-Index:** `--gm-z-modal` (500)

---

#### 6.1.6 `GProgressBar`

**Variants:** `linear` (default), `chapter` (segmented for reader HUD)

```
Linear:
┌────────────────────────────────────┐
│ ████████████████░░░░░░░░░░░░░░░░░ │  65%
└────────────────────────────────────┘

Chapter (segmented):
┌────┬────┬────┬────┬────┬────┬────┐
│ ██ │ ██ │ ██ │ ██ │ ░░ │ ░░ │ ░░ │  4/7 nodes
└────┴────┴────┴────┴────┴────┴────┘
```

**Height:** 4px (linear), 6px (chapter)  
**Border Radius:** `--gm-radius-full`  
**Fill Color:** `--accent-primary`  
**Track Color:** `--border-subtle`  
**Animation:** Fill width transitions with `ease-standard` 300ms

---

#### 6.1.7 `GToggle` (Theme Switch)

```
Light:    ┌───[○]───────┐   ☀️
Dark:     ┌───────[○]───┐   🌙
```

**Track:** 48px × 28px, `--gm-radius-full`  
**Thumb:** 20px × 20px circle  
**Animation:** Thumb slides 20px with `ease-spring` 300ms  
**States:** Off (track: `--border-medium`), On (track: `--accent-primary`)

---

#### 6.1.8 `GTooltip`

**Position:** Above (default), below, left, right  
**Background:** `--surface-inverse`  
**Text:** `--text-inverse`, `caption` size  
**Border Radius:** `--gm-radius-sm`  
**Padding:** `4px 8px`  
**Delay:** Show after 500ms hover  
**Animation:** `gm-fade-in-up` 150ms  
**Max Width:** 240px

---

### 6.2 Reader Components

#### 6.2.1 `CgBackground`

The full-screen cinematic background layer.

```
┌──────────────────────────────────┐
│                                  │
│   ┌──────────────────────────┐   │
│   │                          │   │
│   │   CG Image               │   │  ← Layer 1: <img> object-fit: cover
│   │   (position: fixed)     │   │
│   │                          │   │
│   └──────────────────────────┘   │
│                                  │
│   ┌──────────────────────────┐   │
│   │                          │   │
│   │   Dark Overlay           │   │  ← Layer 2: 45% opacity overlay
│   │   (position: fixed)     │   │
│   │                          │   │
│   └──────────────────────────┘   │
│                                  │
└──────────────────────────────────┘
```

**Implementation Notes:**
- Two `<img>` elements stacked (current + next) for crossfade transitions
- Overlay: `background: var(--gm-overlay-dark)` applied via `::after` pseudo-element
- `object-fit: cover` ensures CG fills viewport without distortion
- `will-change: opacity` for GPU-accelerated crossfade
- Pure Kinetic mode: Replace with `background: linear-gradient(135deg, var(--gm-surface-primary), var(--gm-surface-secondary))`

---

#### 6.2.2 `TextOverlay`

The NVL text content that renders over the CG background.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│                                                  │
│         ┌──────────────────────────┐             │
│         │                          │             │
│         │  He departed from his    │             │  ← max-width: 680px
│         │  childhood home on a     │             │     centered vertically
│         │  frigid morning, carrying│             │     Merriweather font
│         │  nothing but a weathered │             │     text-shadow for readability
│         │  satchel and a heart     │             │
│         │  heavy with unspoken     │             │
│         │  farewells.              │             │
│         │                       ▼  │             │  ← Advance indicator
│         └──────────────────────────┘             │
│                                                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

**CSS:**
```css
.text-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gm-space-8);
  z-index: var(--gm-z-elevated);
  cursor: pointer;
  user-select: text; /* Allow text selection for AI Explain */
}

.text-overlay__content {
  max-width: var(--gm-max-w-reading);
  font-family: var(--gm-font-reading);
  font-size: var(--gm-text-reading);
  line-height: var(--gm-leading-reading);
  letter-spacing: var(--gm-tracking-reading);
  color: var(--gm-reader-text);
  text-shadow: var(--gm-reader-text-shadow);
}
```

---

#### 6.2.3 `AdvanceIndicator`

```
                                         ▼    ← Blinking, pulsing chevron
```

**Size:** 16px  
**Color:** `--gm-reader-text` at 60% opacity  
**Animation:** `gm-advance-pulse` 1.5s infinite ease-in-out  
**Position:** Inline after last character, or bottom-right of text block  
**Visibility:** Only shown when typewriter is complete (not during streaming)

---

#### 6.2.4 `ReaderHud`

The semi-transparent control overlay in the reader.

```
┌──────────────────────────────────────────────────┐
│  ← Back    Chapter: The Departure        ⚑  ⚙   │  ← Top bar
│                                                  │
│                                                  │
│                                                  │
│                         (reading content)        │
│                                                  │
│                                                  │
│                                                  │
│                                    🔊  ━━━━━━━━━━━   │  ← Bottom bar
│  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░  40%  │  ← Progress
└──────────────────────────────────────────────────┘
```

**Behavior:**
- HUD auto-hides after 3 seconds of inactivity
- Reappears on mouse movement / tap
- Semi-transparent background: `rgba(0,0,0,0.3)` with `backdrop-filter: blur(8px)`
- Z-Index: `--gm-z-hud` (200)

**Top Bar Elements:**
- Back button (← icon + "Library")
- Chapter title (truncated with ellipsis)
- Report mismatch icon (⚑)
- Settings gear icon (⚙)

**Bottom Bar Elements:**
- Volume/mute toggle (🔊)
- Chapter progress bar (segmented)

---

#### 6.2.5 `AiExplainChip`

Floating contextual action chip that appears on text selection.

```
                 ┌───────────────┐
 selected text   │  ✦ Explain    │  ← Floating chip
                 └───────────────┘
```

**Position:** Absolute, anchored to selection rect (centered above)  
**Background:** `--surface-elevated`  
**Shadow:** `--gm-shadow-lg`  
**Border Radius:** `--gm-radius-full`  
**Padding:** `6px 16px`  
**Icon:** ✦ (or Material Symbol `auto_awesome`)  
**Font:** `--gm-font-ui`, weight 500, `caption` size  
**Animation:** `gm-scale-pop` 200ms on appear, `gm-fade-out-down` 150ms on dismiss  
**Auto-dismiss:** 5 seconds timeout  
**Z-Index:** `--gm-z-chip` (300)

---

#### 6.2.6 `AiExplainDrawer`

Right-side drawer showing contextual word explanations.

```
┌──────────────────────────────────────────┐
│  ✕  AI Explain                           │  ← Header with close button
│  ─────────────────────────────────────── │
│                                          │
│  "unspoken farewells"                    │  ← Selected phrase (h2, accent)
│                                          │
│  ── Contextual Meaning ──               │  ← Section label (overline)
│                                          │
│  The phrase 'unspoken farewells'          │  ← Streamed text (typewriter)
│  means goodbyes that were felt            │
│  but never said aloud.|                   │  ← Blinking cursor during stream
│                                          │
│  ── Idiom & Syntax ──                    │
│                                          │
│  ●●●                                    │  ← Thinking dots (waiting)
│                                          │
│  ── Plot Context ──                      │
│                                          │
│  (not yet rendered)                      │
│                                          │
│  ── Etymology ──                         │
│                                          │
│  (not yet rendered)                      │
│                                          │
└──────────────────────────────────────────┘
```

**Sections render sequentially** — each section streams via typewriter *after* the previous completes. This creates a satisfying cascade effect that simulates "AI thinking."

**Section Styling:**
- **Word Header:** `--gm-font-ui`, h2, `--accent-primary` color
- **Section Labels:** `overline` style, `--text-muted` color, uppercase
- **Body Text:** `--gm-font-reading`, `body` size, `--text-primary`
- **Thinking Dots:** Three dots with staggered `gm-thinking-dot` animation (delays: 0s, 0.15s, 0.3s)

---

### 6.3 Library Components

#### 6.3.1 `BookCard`

```
┌──────────────────────┐
│  ┌────────────────┐  │
│  │                │  │
│  │   Cover Image  │  │  ← aspect-ratio: 3/4
│  │                │  │
│  │                │  │
│  └────────────────┘  │
│                      │
│  The Wanderer's      │  ← h3, font-ui
│  Lament              │
│                      │
│  A. Demo Author      │  ← caption, text-secondary
│                      │
│  [AI] [Fiction]    │  ← Chip tags
│                      │
│  ━━━━━━━░░░  70%     │  ← Reading progress (if started)
└──────────────────────┘
```

**Background:** `--surface-elevated`  
**Border:** 1px `--border-subtle`  
**Border Radius:** `--gm-radius-lg`  
**Shadow:** `--gm-shadow-sm`, hover: `--gm-shadow-md`  
**Hover:** `translateY(-4px)` lift effect, 200ms  
**Image:** `object-fit: cover`, `aspect-ratio: 3/4`  
**Grid:** `repeat(auto-fill, minmax(240px, 1fr))` with `--gm-space-6` gap

---

#### 6.3.2 `ManifestCodeInput`

```
┌───────────────────────────────────────────────┐
│                                               │
│   Enter your Grimoire Code                    │  ← Label
│                                               │
│   ┌──────────────────────────────────┬─────┐  │
│   │  #VN-ATOMIC-01                   │  →  │  │  ← Monospace input + submit
│   └──────────────────────────────────┴─────┘  │
│                                               │
│   Type a code to unlock a new reading         │  ← Helper text
│   experience                                  │
│                                               │
└───────────────────────────────────────────────┘
```

**Input:** `GInput` with `code` variant (monospace font)  
**Submit Button:** Inline icon button (→ arrow)  
**Success Animation:** `gm-scale-pop` + green border flash  
**Error Animation:** `gm-shake` + red border + error message below  
**Autocomplete:** Off

---

#### 6.3.3 `PageChallengeModal`

```
┌─────────────────────────────────────┐
│  📖 Verify Your Book                │
│  ───────────────────────────────    │
│                                     │
│  What is the 3rd word on            │
│  page 47 of your copy?             │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  Attempts remaining: 2/3            │  ← caption, text-muted
│                                     │
│  ───────────────────────────────    │
│         [ Cancel ] [ Verify ]       │
└─────────────────────────────────────┘
```

**Uses:** `GModal` base  
**Input:** Case-insensitive text input  
**Feedback:** Correct → success animation + unlock. Wrong → shake + decrement attempts.  
**Cooldown:** After 3 failures, 30-second cooldown with countdown timer.

---

### 6.4 Terminal Component

#### 6.4.1 `RefinementTerminal`

Full-screen overlay with simulated terminal output.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   ┌──────────────────────────────────────────┐   │
│   │                                          │   │
│   │  [✦ ARCANUM REFINEMENT ENGINE v3.1]     │   │
│   │  ─────────────────────────────────────   │   │
│   │                                          │   │
│   │  > Aggregating community feedback...     │   │  ← Green monospace text
│   │  > Cross-referencing passage context...  │   │
│   │  > Analyzing semantic alignment...       │   │
│   │  > Refining generation prompt..._        │   │  ← Blinking cursor
│   │                                          │   │
│   │  ████████████████████░░░░░░░░  85%       │   │  ← Progress bar
│   │                                          │   │
│   └──────────────────────────────────────────┘   │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Background:** `rgba(0, 0, 0, 0.92)` — near-black overlay  
**Terminal Box:** `--surface-secondary` (dark), 1px `--border-subtle` border, `--gm-radius-lg`  
**Text Color:** `#4ADE80` (green-400) for terminal lines, `--text-muted` for frame  
**Font:** `--gm-font-mono`, `terminal` size  
**Cursor:** `|` character with `gm-cursor-blink` animation  
**Progress Bar:** `GProgressBar` with green fill  
**Z-Index:** `--gm-z-terminal` (600)  
**Close:** Auto-closes after completion + 1 second delay

---

### 6.5 Layout Components

#### 6.5.1 `AppHeader`

```
┌────────────────────────────────────────────────┐
│  ◆ Genmoire                   Dashboard  ☀️/🌙  ⚙ │
└────────────────────────────────────────────────┘
```

**Height:** `--gm-header-height` (64px)  
**Background:** `--surface-primary` with `backdrop-filter: blur(12px)` and 90% opacity  
**Border Bottom:** 1px `--border-subtle`  
**Position:** `sticky`, top 0  
**Z-Index:** `--gm-z-sticky` (100)  
**Hidden:** When inside the Reader view (`meta.showHeader: false`)

**Logo:** "◆ Genmoire" — `h3` weight, `--accent-primary` color for ◆  
**Nav Links:** `body` weight, `--text-secondary`, hover `--text-primary`. Items: "Dashboard"  
**Right Actions:** Theme toggle, settings gear

---

### 6.6 Gamification Components

#### 6.6.1 `TierBadge`

Displays the user's current tier emblem and title.

```
┌───────────────────────────┐
│                           │
│       ◆ ◆ ◆              │  ← Tier emblem (stylized)
│                           │
│    Imperial Scholar       │  ← Tier title (h3, accent)
│    Tier 3                 │  ← Tier number (caption, muted)
│                           │
└───────────────────────────┘
```

**Emblem:** CSS-only decorative badge using `border`, `gradient`, and `box-shadow`  
**Colors per tier:** Bronze (#CD7F32) → Silver (#C0C0C0) → Gold (#FFD700) → Amethyst (#9966CC) → Obsidian/Gold  
**Animation:** Subtle `gm-shimmer` animation on the emblem (gradient sweep)

#### 6.6.2 `TierProgressBar`

```
┌──────────────────────────────────────┐
│  7 / 10 books to Lorekeeper           │  ← Progress text
│  ██████████████████░░░░░░░░░░  70%  │  ← GProgressBar
└──────────────────────────────────────┘
```

**Text:** "X / Y books to [Next Tier Title]"  
**Bar:** Uses `GProgressBar` with tier-colored fill  
**At max tier:** Text reads "You have ascended", bar is full with shimmer

#### 6.6.3 `TraitCard`

```
┌──────────────────┐     ┌──────────────────┐
│  🌙              │     │  🔒              │
│                  │     │                  │
│  Night Owl       │     │  ???             │
│  "The grimoire   │     │  "Keep reading   │
│   glows at       │     │   to discover"   │
│   midnight"      │     │                  │
└──────────────────┘     └──────────────────┘
   UNLOCKED                  LOCKED
```

**Unlocked State:**  
- Background: `--surface-elevated`  
- Icon: Material Symbol, `--accent-primary` color, 32px  
- Title: `--gm-font-ui`, h4, `--text-primary`  
- Flavor: `--gm-font-ui`, caption, `--text-muted`, italic  
- Border: 1px `--border-subtle`  
- Hover: `translateY(-2px)` lift, shadow increase

**Locked State:**  
- Background: `--surface-secondary` with `opacity: 0.5`  
- Icon: Lock icon (🔒), `--text-muted`  
- Title: "???"  
- Flavor: "Keep reading to discover"  
- Filter: `grayscale(1)` on entire card

**Rarity Border Accent:**  
- Common: none  
- Uncommon: 2px left border `--accent-primary`  
- Rare: 2px left border `#FFD700` (gold)  
- Epic: 2px left border `#9966CC` (amethyst)  
- Legendary: 2px left border with `gm-shimmer` gradient animation

#### 6.6.4 `TraitsGrid`

**Layout:** `grid`, `repeat(auto-fill, minmax(180px, 1fr))`, `--gm-space-4` gap  
**Mobile:** 2 columns minimum  
**Order:** Unlocked traits first (sorted by rarity: legendary → common), locked traits after

#### 6.6.5 `TierUpOverlay`

Full-screen celebration when the user reaches a new tier.

```
┌──────────────────────────────────────────┐
│                                          │
│                                          │
│             ◆ ◆ ◆                        │  ← Tier emblem (scale-pop)
│                                          │
│          TIER UP!                        │  ← Display font, accent
│                                          │
│       Imperial Scholar                   │  ← New tier title
│       "Knowledge is your weapon"         │  ← Tier flavor text
│                                          │
│            [Continue]                    │  ← GButton
│                                          │
└──────────────────────────────────────────┘
```

**Background:** `rgba(0,0,0,0.85)` with `backdrop-filter: blur(12px)`  
**Animation Sequence:**  
1. Background fades in (300ms)  
2. Emblem scales in (`gm-scale-pop`, 400ms, with 200ms delay)  
3. "TIER UP!" fades in (200ms, with 500ms delay)  
4. Title + flavor slide up (`gm-slide-up`, 300ms, with 700ms delay)  
5. Button fades in (200ms, with 1000ms delay)  

**Z-Index:** `--gm-z-modal` (500)  
**Auto-dismiss:** Closes on button click or after 5 seconds

#### 6.6.6 `TraitToast`

Subtle toast notification when a hidden trait is unlocked.

```
┌───────────────────────────────────┐
│  ✦ Trait Unlocked!                    │
│  🌙 Night Owl                        │  ← Icon + title
│  "The grimoire glows at midnight"    │  ← Flavor text
└───────────────────────────────────┘
```

**Position:** Fixed, bottom-right (`bottom: 24px`, `right: 24px`)  
**Background:** `--surface-elevated` with `--gm-shadow-lg`  
**Border:** 1px `--accent-primary`  
**Animation:** `gm-slide-up` 300ms on enter, `gm-fade-out-down` 200ms on dismiss  
**Auto-dismiss:** 4 seconds  
**Z-Index:** `--gm-z-toast` (400)

#### 6.6.7 `ReadingStats`

```
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│    12       │  │    7 🔥     │  │    3 / 7    │  │    42       │
│   Books     │  │  Streak     │  │  Traits    │  │  Explains  │
│  Completed  │  │  (best: 14) │  │  Unlocked  │  │  Used      │
└────────────┘  └────────────┘  └────────────┘  └────────────┘
```

**Layout:** Horizontal flex, 4 stat cards  
**Number:** `h2`, `--text-primary`  
**Label:** `caption`, `--text-muted`  
**Sub-label:** `overline`, `--text-secondary`  
**Card:** `--surface-elevated`, `--gm-radius-md`, `--gm-shadow-sm`  
**Mobile:** 2×2 grid

#### 6.6.8 `ActivityHeatmap`

GitHub-style contribution calendar visualizing reading consistency.

```
┌──────────────────────────────────────────────┐
│  Reading Consistency                         │
│                                              │
│  S M T W T F S                               │
│  ░ ░ ░ ░ ▒ ▓ █  ← Weeks (rows or columns)    │
│  ░ ░ ▒ ▒ ▓ ▓ █                               │
│  ...                                         │
│                                              │
│  Less [░] [▒] [▓] [█] More                   │
└──────────────────────────────────────────────┘
```

**Color Scheme:** Monochrome based on `--accent-primary` (e.g., Warm Amber).  
**Opacity Levels:** 
- `░` (0 mins): `--surface-secondary`
- `▒` (1-15 mins): `--accent-primary` at 30% opacity
- `▓` (15-45 mins): `--accent-primary` at 60% opacity
- `█` (>45 mins): `--accent-primary` at 100% opacity  
**Tooltips:** Hovering over a cell shows "X minutes on [Date]" using `GTooltip`.

#### 6.5.2 `SettingsDrawer`

```
┌──────────────────────────────────────────┐
│  ⚙ Settings                        ✕    │
│  ─────────────────────────────────────── │
│                                          │
│  APPEARANCE                              │  ← Section label (overline)
│                                          │
│  Theme          ┌───[○]───────┐  Light   │
│                                          │
│  Text Size      [ S ] [ M ] [ L ]        │
│                                          │
│  READING                                 │
│                                          │
│  Volume         ━━━━━━━━━━━░░░  75%      │
│                                          │
│  Animation      ━━━━━━━━░░░░░░  Normal   │
│  Speed                                   │
│                                          │
│  ─────────────────────────────────────── │
│                                          │
│  ABOUT                                   │
│                                          │
│  Genmoire v1.0.0                         │
│  PNBWDC IntechFest 2026                  │
│  Built with ♡ for readers                │
│                                          │
└──────────────────────────────────────────┘
```

**Uses:** `GDrawer` base  
**Sections:** Grouped by category with `overline` labels  
**Controls:** `GToggle`, `GChip` toggle groups, range sliders  
**Persistence:** All changes save to `localStorage` immediately

---

## 7. Page Layouts

### 7.1 Landing Page

```
┌──────────────────────────────────────────────────┐
│                    HEADER                         │
├──────────────────────────────────────────────────┤
│                                                  │
│                                                  │
│            ◆                                     │
│                                                  │
│   Transforming Dead EPUBs                        │  ← Display font
│   into Living Interactive                        │
│   Grimoires.                                     │
│                                                  │
│   [Enter a Grimoire Code]            [Explore →] │  ← CTA row
│                                                  │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│   FEATURED GRIMOIRES                             │  ← Section
│                                                  │
│   ┌────────┐  ┌────────┐  ┌────────┐            │
│   │ Book 1 │  │ Book 2 │  │ Book 3 │            │  ← Book cards grid
│   └────────┘  └────────┘  └────────┘            │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│   HOW IT WORKS                                   │  ← Feature showcase
│   1. Enter Code → 2. Choose Level → 3. Read     │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Hero:** Full viewport height, centered content, optional subtle background animation (gradient shift or particle effect)  
**Featured Grid:** 3 columns on desktop, 1 column on mobile  
**Feature Showcase:** Horizontal step cards with icons

---

### 7.2 Reader Page (Full-Screen)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│                  [CG BACKGROUND]                 │  ← Layer 1: Full-bleed image
│                                                  │
│            ┌── [DARK OVERLAY 45%] ──┐            │  ← Layer 2: Semi-transparent
│            │                        │            │
│            │                        │            │
│            │   "He departed from    │            │  ← Layer 3: Text content
│            │    his childhood home  │            │
│            │    on a frigid         │            │
│            │    morning..."      ▼  │            │
│            │                        │            │
│            └────────────────────────┘            │
│                                                  │
│  ← Back        The Departure            ⚑  ⚙   │  ← Layer 4: HUD (auto-hide)
│                                    🔊 ━━━━━━━━━  │
│  ████████████░░░░░░░░░░░░░░░  40%               │
└──────────────────────────────────────────────────┘
```

**No header, no navigation chrome.** Full immersion.  
**Layers stack via z-index:** CG (base) → Overlay → Text → HUD  
**Click/tap anywhere on text layer to advance**  
**Escape key or back button to exit**

---

### 7.3 Dashboard & Library

```
┌────────────────────────────────────────────────┐
│                    HEADER                         │
├────────────────────────────────────────────────┤
│                                                  │
│          ◆ ◆ ◆                                    │  ← TierBadge
│       Imperial Scholar                            │
│          Tier 3                                   │
│                                                  │
│   7 / 10 books to Lorekeeper                     │  ← TierProgressBar
│   ██████████████████░░░░░░░░░░  70%             │
│                                                  │
├────────────────────────────────────────────────┤
│                                                  │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  │
│  │   12   │  │  7 🔥  │  │  3/7   │  │  42    │  │  ← ReadingStats
│  │ Books  │  │Streak │  │Traits │  │Explains│  │
│  └────────┘  └────────┘  └────────┘  └────────┘  │
│                                                  │
├────────────────────────────────────────────────┤
│                                                  │
│  READING CONSISTENCY                             │
│                                                  │
│  S M T W T F S                                   │
│  ░ ░ ░ ░ ▒ ▓ █   (ActivityHeatmap)               │
│  ░ ░ ▒ ▒ ▓ ▓ █                                   │
│                                                  │
├────────────────────────────────────────────────┤
│                                                  │
│  HIDDEN TRAITS                                   │  ← Section header
│                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │🌙 Night │  │⚡ Speed │  │🔒 ???  │  │🔒 ???  │ │  ← TraitsGrid
│  │  Owl   │  │  Reader│  │         │  │         │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
│                                                  │
├────────────────────────────────────────────────┤
│                                                  │
│  MY GRIMOIRES (LIBRARY)                          │  ← Library section
│                                                  │
│  ┌────────┐  ┌────────┐  ┌────────┐            │
│  │ Book 1 │  │ Book 2 │  │ Book 3 │            │  ← BookCards
│  └────────┘  └────────┘  └────────┘            │
│                                                  │
└────────────────────────────────────────────────┘
```

**Layout:** Single-column centered (`max-width: 960px` for library grid accommodate)  
**Sections:** TierBadge → TierProgressBar → ReadingStats → ActivityHeatmap → TraitsGrid → Personal Library  
**Background:** `--surface-primary`  
**Spacing:** `--gm-space-8` between sections

---

## 8. Responsive Design

### 8.1 Breakpoints

| Name | Width | Layout Changes |
|---|---|---|
| `mobile` | < 640px | Single column, bottom sheets instead of drawers, stacked HUD |
| `tablet` | 640–1023px | Two-column grid, side drawer at 320px |
| `desktop` | 1024–1279px | Full layout, 400px drawers |
| `wide` | ≥ 1280px | Max-width container centered, comfortable spacing |

### 8.2 Mobile-Specific Adaptations

| Component | Desktop | Mobile |
|---|---|---|
| `AiExplainDrawer` | 400px right drawer | Full-screen bottom sheet |
| `SettingsDrawer` | 400px right drawer | Full-screen bottom sheet |
| `ReaderHud` | Top bar + bottom bar | Compact bottom-only bar, swipe up for more |
| `BookCard` grid | 3–4 columns | 1–2 columns |
| `TextOverlay` | `padding: 32px` | `padding: 16px` |

| `ManifestCodeInput` | Inline with button | Full-width, button below |
| `RefinementTerminal` | Centered panel | Full-width panel |

### 8.3 Touch Considerations

- Minimum touch target: **44×44px** (WCAG)
- Increase button padding on mobile
- Reader: Tap left 25% to go back (optional), tap anywhere else to advance
- Swipe gestures: Left-to-right to open settings (optional)
- Long press on reader text to trigger selection (works with native selection)

---

## 9. Accessibility

### 9.1 Requirements (WCAG 2.1 AA)

| Criterion | Implementation |
|---|---|
| **Color Contrast** | All text pairs meet 4.5:1 (AA) minimum. Reader text on overlay exceeds 7:1 (AAA). |
| **Keyboard Navigation** | All interactive elements are focusable. Tab order follows visual order. |
| **Focus Indicators** | 2px `--border-focus` ring on all focusable elements. Never `outline: none` without replacement. |
| **Screen Reader** | Semantic HTML (`<main>`, `<nav>`, `<article>`). `aria-labels` on icon-only buttons. |
| **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` disables all non-essential animations. |
| **Text Resize** | UI responds to browser font size settings. All sizing in `rem`. |
| **Alt Text** | CG images have descriptive `alt` attributes from manifest metadata. |

### 9.2 Reader-Specific Accessibility

| Feature | Implementation |
|---|---|
| **Typewriter Text** | `aria-live="polite"` on text container. Screen readers announce full text immediately. |
| **Advance Indicator** | `aria-hidden="true"` (decorative). Advance is triggered by click/Enter/Space. |

| **Keyboard Advance** | Space, Enter, or Right Arrow advances text. Left Arrow goes back. |
| **HUD Toggle** | Press `H` to toggle HUD visibility. |
| **Escape** | Closes any open drawer/modal. If none open, prompts to exit reader. |

---

## 10. Icon System

### 10.1 Material Symbols (Variable Font)

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..200" />
```

### 10.2 Icon Usage Map

| Context | Icon Name | Filled? | Size |
|---|---|---|---|
| Back navigation | `arrow_back` | No | 24px |
| Settings | `settings` | No | 24px |
| Close drawer/modal | `close` | No | 24px |
| Volume on | `volume_up` | No | 24px |
| Volume mute | `volume_off` | No | 24px |
| Report mismatch | `flag` | No | 20px |
| AI Explain | `auto_awesome` | Yes | 18px |
| Theme: Light | `light_mode` | Yes | 20px |
| Theme: Dark | `dark_mode` | Yes | 20px |
| Upload EPUB | `upload_file` | No | 24px |
| Success/checkmark | `check_circle` | Yes | 24px |
| Error | `error` | Yes | 24px |
| Book | `menu_book` | No | 24px |
| Play/resume | `play_arrow` | Yes | 24px |
| Code input | `tag` | No | 20px |
| Page challenge | `lock` | No | 24px |
| Unlocked | `lock_open` | No | 24px |

### 10.3 Icon Styling

```css
.material-symbols-rounded {
  font-variation-settings:
    'FILL' 0,      /* Default: outlined */
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  color: var(--gm-text-secondary);
  font-size: 24px;
  vertical-align: middle;
  user-select: none;
}

/* Filled variant */
.material-symbols-rounded.filled {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
```

---

## 11. Tailwind CSS v4 Configuration

### 11.1 Theme Extension

```javascript
// tailwind.config.js (conceptual — to be adapted after Project Stitch analysis)
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        gm: {
          surface: {
            primary: 'var(--gm-surface-primary)',
            secondary: 'var(--gm-surface-secondary)',
            elevated: 'var(--gm-surface-elevated)',
          },
          text: {
            primary: 'var(--gm-text-primary)',
            secondary: 'var(--gm-text-secondary)',
            muted: 'var(--gm-text-muted)',
          },
          accent: {
            primary: 'var(--gm-accent-primary)',
            secondary: 'var(--gm-accent-secondary)',
          },
          border: {
            subtle: 'var(--gm-border-subtle)',
            medium: 'var(--gm-border-medium)',
          },
        },
      },
      fontFamily: {
        ui: ['Plus Jakarta Sans', 'sans-serif'],
        reading: ['Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        display: ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        reading: ['1.25rem', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        terminal: ['0.875rem', { lineHeight: '1.6' }],
      },
      borderRadius: {
        gm: {
          sm: '6px',
          md: '12px',
          lg: '16px',
          xl: '24px',
        },
      },
      maxWidth: {
        reading: '680px',
        content: '900px',
        page: '1200px',
      },
      spacing: {
        header: '64px',
        drawer: '400px',
      },
      transitionTimingFunction: {
        'gm-standard': 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
        'gm-decelerate': 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
        'gm-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1.0)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        cinematic: '800ms',
        dramatic: '1200ms',
      },
      zIndex: {
        hud: '200',
        chip: '300',
        drawer: '400',
        modal: '500',
        terminal: '600',
        tooltip: '700',
        toast: '800',
      },
      boxShadow: {
        'gm-sm': 'var(--gm-shadow-sm)',
        'gm-md': 'var(--gm-shadow-md)',
        'gm-lg': 'var(--gm-shadow-lg)',
        'gm-xl': 'var(--gm-shadow-xl)',
      },
    },
  },
};
```

---

## 12. Design Checklist (Pre-Development)

Before writing any component code, verify:

- [ ] **Tokens:** All CSS custom properties defined in `tokens.css`
- [ ] **Fonts:** Google Fonts loaded with `display=swap` for performance
- [ ] **Theme Toggle:** `data-theme` attribute switches on `<html>` element
- [ ] **Reduced Motion:** `@media` query wraps all animation/transition declarations
- [ ] **Focus Styles:** Global focus ring styles defined
- [ ] **Touch Targets:** All interactive elements meet 44×44px minimum
- [ ] **Color Contrast:** Every text/background pair verified against WCAG AA
- [ ] **Component Props:** Each component has typed props/variants documented
- [ ] **Responsive:** Every component has mobile and desktop specifications
- [ ] **Animation:** Every animated element has defined duration, easing, and keyframes

---

## 13. Design Handoff Notes

> [!IMPORTANT]
> **This document is a specification, not the final code.** The actual component implementations will be adapted from **Project Stitch** patterns after STEP 3 of the execution pipeline. The Tailwind configuration, component API style (props, slots, emits), and file naming conventions will be determined by Project Stitch's architecture.

> [!TIP]
> **Priority order for implementation:**
> 1. `tokens.css` + `globals.css` + `typography.css` (Foundation)
> 2. `GButton`, `GChip`, `GInput` (Primitives)
> 3. `CgBackground`, `TextOverlay`, `AdvanceIndicator` (Reader core)
> 4. `ReaderHud` (Reader controls)
> 5. `AiExplainChip`, `AiExplainDrawer` (AI Explain)
> 6. `BookCard`, `ManifestCodeInput` (Library)
> 7. `GDrawer`, `GModal`, `SettingsDrawer` (Overlays)
> 8. `RefinementTerminal` (Terminal)
> 9. `TierBadge`, `TraitCard`, `TierUpOverlay`, `ReadingStats`, `ActivityHeatmap` (Dashboard/Gamification)
> 10. Landing page + Dashboard layouts (Polish)
