# Portable UI Styling Rules & Design System Specification for AI Agents

> **Usage Note**: Copy this file as `.agents/AGENTS.md` (or include it in your project's AI instructions / system prompts) in any new repository to immediately enforce this modern glassmorphism design system across AI-generated UI components.

---

## 1. Design System Overview & Technology Stack

### Core Aesthetic Guidelines
- **Visual Style**: High-contrast, minimalist monochrome glassmorphism with adaptive light/dark mode support, rounded geometric elements (`rounded-xl` / `rounded-2xl`), subtle borders, and smooth transitions.
- **Color Philosophy**:
  - **Base Neutral Tone**: Deep dark background (`neutral-950`) in Dark Mode, light background (`neutral-50`) in Light Mode.
  - **Inverted Dynamic Fills**: Primary actions and active tabs flip between solid `neutral-900` (Light Mode) and `neutral-100` (Dark Mode).
  - **Semantic Accents Only**: Colors like emerald, rose, and blue are restricted to translucent status badges or alerts (`bg-emerald-500/10`, `text-emerald-600 dark:text-emerald-400`).

### Technology Stack
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Tailwind Engine**: Tailwind CSS v4 (`@import "tailwindcss";`)
- **Iconography**: `lucide-react`
- **Typography**: Google Fonts: `Outfit` (headings/display) & `Inter` (sans-serif body/ui)

---

## 2. Core CSS Setup (`app/globals.css`)

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-outfit: 'Outfit', sans-serif;
}

/* Glassmorphism Custom Utilities */
@utility glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.08);

  .dark & {
    background: rgba(10, 10, 10, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
}

@utility glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.08);

  .dark & {
    background: rgba(10, 10, 10, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
}

@utility glass-input {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.15);
  color: #0f172a;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  .dark & {
    background: rgba(10, 10, 10, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #f8fafc;
  }

  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);

    .dark & {
      border-color: #ffffff;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.05);
    }
  }
}
```

---

## 3. Directives for AI Coding Agents

1. **Strict Dark Mode Parity**: Every structural component MUST declare dark mode counterparts (`dark:...`) for background colors, text colors, border colors, and hover/focus effects.
2. **Typography Hierarchy**:
   - Headers, title titles, card titles, numeric badges: `font-outfit`
   - Form inputs, buttons, body text, subtext: `font-sans` (`Inter`)
3. **Monochrome First**: Avoid generic primary colors like solid `bg-blue-600` or `bg-purple-600`. Use theme-inverting neutrals (`bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950`) as primary action elements.
4. **Border Radii**:
   - Inputs, buttons, nav pill items: `rounded-xl`
   - Main cards, outer form containers: `rounded-2xl`
   - Micro badges: `rounded-lg` or `rounded-md`
5. **Animation & Touch**: Add `.animate-fade-in` to card containers and interactive view transitions. Ensure touch action optimization on all buttons and inputs with `cursor-pointer` and `active:scale-[0.99]`.
