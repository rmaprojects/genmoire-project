---
name: warm-material-narrative
description: Stitch Warm Material Narrative design system and tokens for Genmoire (Vue + TS + Tailwind).
---

# Warm Material Narrative Design System

```yaml
name: Warm Material Narrative
colors:
  surface: '#fdf9f1'
  surface-dim: '#dddad2'
  surface-bright: '#fdf9f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3eb'
  surface-container: '#f1ede6'
  surface-container-high: '#ece8e0'
  surface-container-highest: '#e6e2da'
  on-surface: '#1c1c17'
  on-surface-variant: '#4e4637'
  inverse-surface: '#31302b'
  inverse-on-surface: '#f4f0e8'
  outline: '#807665'
  outline-variant: '#d1c5b2'
  surface-tint: '#795900'
  primary: '#6f5100'
  on-primary: '#ffffff'
  primary-container: '#8b6914'
  on-primary-container: '#fff0da'
  inverse-primary: '#ecc165'
  secondary: '#4a6729'
  on-secondary: '#ffffff'
  secondary-container: '#c8eb9e'
  on-secondary-container: '#4e6b2d'
  tertiary: '#5d5451'
  on-tertiary: '#ffffff'
  tertiary-container: '#766c69'
  on-tertiary-container: '#fdefec'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdfa0'
  primary-fixed-dim: '#ecc165'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5c4300'
  secondary-fixed: '#cbeea1'
  secondary-fixed-dim: '#afd187'
  on-secondary-fixed: '#0f2000'
  on-secondary-fixed-variant: '#334e13'
  tertiary-fixed: '#ede0dc'
  tertiary-fixed-dim: '#d0c4c0'
  on-tertiary-fixed: '#211a18'
  on-tertiary-fixed-variant: '#4d4543'
  background: '#fdf9f1'
  on-background: '#1c1c17'
  surface-variant: '#e6e2da'
  surface-primary-light: '#FAF6EE'
  surface-secondary-light: '#F0EBE1'
  surface-elevated-light: '#FFFFFF'
  surface-primary-dark: '#1B1815'
  surface-secondary-dark: '#221E1A'
  surface-elevated-dark: '#2A2520'
  text-primary-light: '#2C2523'
  text-primary-dark: '#D8D0C3'
  accent-gold-dark: '#BA9248'
  accent-sage-dark: '#749654'
  overlay-sepia: rgba(44,37,35,0.45)
  overlay-obsidian: rgba(0,0,0,0.55)
  terminal-green: '#4ADE80'
  error-light: '#B3261E'
  error-dark: '#F2B8B5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.0rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.35'
    letterSpacing: '0'
  headline-h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: '0'
  reading-body:
    fontFamily: Merriweather
    fontSize: 1.25rem
    fontWeight: '400'
    lineHeight: '1.8'
    letterSpacing: 0.01em
  reading-body-mobile:
    fontFamily: Merriweather
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.7'
    letterSpacing: 0.01em
  body-ui:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.0rem
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  overline:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: 0.08em
  terminal:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  space-1: 0.25rem
  space-2: 0.5rem
  space-3: 0.75rem
  space-4: 1.0rem
  space-6: 1.5rem
  space-8: 2.0rem
  space-12: 3.0rem
  reading-max-width: 680px
  content-max-width: 900px
  page-max-width: 1200px
```

## Brand & Style

The design system embodies an **Academic-Cinematic** personality, striking a balance between the functional rigor of a research tool and the immersive atmosphere of a visual novel. It avoids the clinical coldness of modern SaaS by embracing a "Warm Material" philosophy—utilizing organic tones, scholarly textures, and intentional pacing to create an ergonomic environment for long-form consumption.

The visual style is a hybrid of **Corporate / Modern** (Material Design 3) and **Cinematic Minimalism**. It utilizes a dual-theme strategy:
- **Warm Sepia (Light):** Evokes the feeling of premium stationery or a classic grimoire.
- **Warm Obsidian (Dark):** Provides a focused, low-strain "study" environment that preserves warmth through brown-tinctured blacks rather than cold grays.

Key emotional responses: **Focused, Scholarly, Immersive, and Magical.**

## Colors

The palette is anchored in **Warm Sepia** and **Warm Obsidian**.

### Light Mode (Warm Sepia)
Primary actions use a refined gold (`#8B6914`), while surfaces lean into cream and bone tones. This mode uses depth through warm-tinted shadows (`rgba(44, 37, 35, 0.08)`).

### Dark Mode (Warm Obsidian & Antique Leather)
Surfaces are deep, restful espresso and obsidian tones (`#141210` / `#1B1815`). Contrast is calibrated for long reading sessions using soft parchment bone text (`#D8D0C3`, WCAG AAA compliant without harsh bloom) and a muted antique leather / bronze (`#BA9248` & `#5C4114`) for gentle, low-strain interactivity. Depth is conveyed through subtle borders (`#342D26`) rather than harsh drop shadows.

### Functional Accents
- **Sage Green:** Used for secondary positive actions and "success" states.
- **Cinematic Overlays:** Scrims applied over background images (CGs) ensure the reading experience remains legible regardless of the art style behind the text.

## Typography

This system utilizes a triple-stack font strategy:
1. **Interface (Plus Jakarta Sans):** A clean, modern sans-serif that handles all navigation, metadata, and controls.
2. **Narrative (Merriweather):** A high-legibility serif designed for long-form prose. It is the heart of the "Cinematic Reader" and features generous line heights to prevent eye fatigue.
3. **Technical (JetBrains Mono):** Used for the "Refinement Terminal" to signify AI-driven or system-level processes.

**Typewriter Effect:**
- Narrative text renders at **30ms** per character.
- AI/System text renders at **15ms** per character.

## Layout & Spacing

The layout is governed by an **8-point grid** (with a 4px sub-grid for micro-adjustments).

**Reading Column:**
To ensure optimal readability, the narrative text is confined to a central column with a maximum width of **680px**. This limits character counts to the ideal 55–75 per line range.

**Adaptive Reflow:**
- **Desktop:** The Reader occupies the center, with the "AI Explain" drawer sliding in from the right (400px fixed). 
- **Tablet:** 24px margins; content scales to fit the viewport.
- **Mobile:** 16px margins; side drawers convert to full-screen overlays (100vw).

**Transitions:**
- **Snappy UI:** 300ms (Cubic-Bezier 0.4, 0, 0.2, 1).
- **Cinematic:** 800ms for background crossfades and reader scene transitions.

## Elevation & Depth

Visual hierarchy is managed through **Tonal Layering** and **Contextual Depth**:

1.  **Light Mode:** We use ambient, warm-tinted shadows. Surfaces "lift" off the page using `shadow-sm` for cards and `shadow-xl` for top-level modals.
2.  **Dark Mode:** Shadows are largely discarded in favor of **1px Subtle Borders**. This prevents "fuzzy" edges on OLED screens and maintains a crisp, scholarly feel.
3.  **Glassmorphism:** The App Header and Reader HUD use a `backdrop-filter: blur(12px)` with 90% opacity to maintain a sense of the world behind the UI without sacrificing legibility.
4.  **Z-Indexing:** The system stacks from background art → dark overlay → narrative text → HUD → drawers.

## Shapes

The shape language is "Softly Geometric." 

- **Standard (8px/0.5rem):** Used for primary buttons and input fields to feel approachable yet professional.
- **Large (16px/1rem):** Used for Cards, Modals, and the Refinement Terminal to create a distinct container identity.
- **Pill (9999px):** Reserved for Action Chips, Toggles, and Avatars, emphasizing their role as interactive, "touchable" elements.
- **Tooltips:** Use the sharpest radius (6px) to indicate their temporary, functional nature.

## Components

### GButton & GChip
Buttons use the `rounded-md` (12px) shape. The Primary Button is filled with `accent-primary`, while the Secondary Button uses a tonal container (`accent-primary-container`). Chips are always pill-shaped and utilize `Material Symbols` (Outlined for default, Filled for active).

### GInput & GDrawer
Input fields use a 1px `border-medium` that thickens to 2px `border-focus` on interaction. Drawers (GDrawer) are fixed at 400px on desktop and utilize a subtle inner-shadow in light mode to indicate their "overlay" status.

### Reader HUD & Text Overlay
The Reader HUD is a minimal, floating interface. It uses `backdrop-filter` to blend into the cinematic background. The Text Overlay includes a specific text-shadow (`0 1px 3px rgba(0,0,0,0.5)`) to ensure that white narrative text remains readable over any image.

### Refinement Terminal
A specialized container for AI interactions. It uses `JetBrains Mono`, a `surface-secondary` background, and `terminal-green` text. It features a custom typewriter animation for "system" responses.

### BookCard
The primary entry point for stories. In Light Mode, it uses `shadow-sm` and a subtle 1px border. In Dark Mode, it relies solely on the border for definition. On hover, the card scales slightly (1.02x) with a 300ms transition.
