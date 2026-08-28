/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Stitch Warm Material Narrative Tokens with Dynamic Dark-Mode Luminosity
        primary: "var(--color-primary, #795900)",
        "primary-container": "var(--color-primary-container, #8b6914)",
        "primary-fixed": "#ffdfa0",
        "primary-fixed-dim": "#ecc165",
        "on-primary": "#ffffff",
        "on-primary-container": "#fff0da",
        "on-primary-fixed": "#261a00",
        "on-primary-fixed-variant": "#5c4300",
        "inverse-primary": "#ecc165",

        secondary: "var(--color-secondary, #3D5A1E)",
        "secondary-container": "var(--color-secondary-container, #4E6B2D)",
        "secondary-fixed": "#cbeea1",
        "secondary-fixed-dim": "#afd187",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#4e6b2d",
        "on-secondary-fixed": "#0f2000",
        "on-secondary-fixed-variant": "#334e13",

        tertiary: "#5d5451",
        "tertiary-container": "#766c69",
        "tertiary-fixed": "#ede0dc",
        "tertiary-fixed-dim": "#d0c4c0",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fdefec",

        background: "var(--color-background, #fdf9f1)",
        surface: "var(--color-surface, #fdf9f1)",
        "surface-dim": "var(--color-surface-dim, #dddad2)",
        "surface-bright": "var(--color-surface-bright, #fdf9f1)",
        "surface-container": "var(--color-surface-container, #f1ede6)",
        "surface-container-low": "var(--color-surface-container-low, #f7f3eb)",
        "surface-container-lowest": "var(--color-surface-container-lowest, #ffffff)",
        "surface-container-high": "var(--color-surface-container-high, #ece8e0)",
        "surface-container-highest": "var(--color-surface-container-highest, #e6e2da)",
        
        "surface-primary": "var(--color-surface-primary, #FAF6EE)",
        "surface-secondary": "var(--color-surface-secondary, #F0EBE1)",
        "surface-elevated": "var(--color-surface-elevated, #FFFFFF)",
        
        "surface-primary-light": "#FAF6EE",
        "surface-secondary-light": "#F0EBE1",
        "surface-elevated-light": "#FFFFFF",
        "surface-primary-dark": "#1A1816",
        "surface-secondary-dark": "#242120",
        "surface-elevated-dark": "#2C2926",

        "on-surface": "var(--color-on-surface, #1c1c17)",
        "on-surface-variant": "var(--color-on-surface-variant, #4e4637)",
        "on-background": "var(--color-on-background, #1c1c17)",
        "inverse-surface": "#31302b",
        "inverse-on-surface": "#f4f0e8",

        "text-primary": "var(--color-text-primary, #2C2523)",
        "text-secondary": "var(--color-text-secondary, #6B5E56)",
        "text-muted": "var(--color-text-muted, #8C7E74)",
        "text-primary-light": "#2C2523",
        "text-primary-dark": "#E8E0D8",

        "accent-gold": "#8B6914",
        "accent-gold-dark": "#D4A843",
        "accent-sage": "#4A6729",
        "accent-sage-dark": "#8BB85E",
        "terminal-green": "#4ADE80",

        "border-subtle": "var(--color-border-subtle, #E0D8CE)",
        outline: "#807665",
        "outline-variant": "#d1c5b2",

        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "error-light": "#B3261E",
        "error-dark": "#F2B8B5",

        "overlay-sepia": "rgba(44, 37, 35, 0.45)",
        "overlay-obsidian": "rgba(0, 0, 0, 0.55)",
      },
      fontFamily: {
        'display-lg': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-h1': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-h2': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-h3': ['Plus Jakarta Sans', 'sans-serif'],
        'reading-body': ['Merriweather', 'serif'],
        'reading-body-mobile': ['Merriweather', 'serif'],
        'ui-body': ['Plus Jakarta Sans', 'sans-serif'],
        'label-md': ['Plus Jakarta Sans', 'sans-serif'],
        'caption': ['Plus Jakarta Sans', 'sans-serif'],
        'overline': ['Plus Jakarta Sans', 'sans-serif'],
        'terminal': ['Plus Jakarta Sans', 'sans-serif'],
        'code-sm': ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Plus Jakarta Sans', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      spacing: {
        'container-max': '1200px',
        'reading-max-width': '680px',
        'content-max-width': '900px',
        'page-max-width': '1200px',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1.0rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(44, 37, 35, 0.06)',
        'warm-md': '0 4px 16px rgba(0, 0, 0, 0.28), 0 2px 4px rgba(44, 37, 35, 0.06)',
        'warm-lg': '0 12px 32px rgba(0, 0, 0, 0.38), 0 4px 8px rgba(44, 37, 35, 0.08)',
        'warm-xl': '0 20px 48px rgba(0, 0, 0, 0.48), 0 8px 16px rgba(44, 37, 35, 0.1)',
      },
      animation: {
        'typewriter-cursor': 'blink 1s infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
