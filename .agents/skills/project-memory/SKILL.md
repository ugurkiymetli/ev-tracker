---
name: project-memory
description: Mandatory skill to inspect, adhere to, and update PROJECT_MEMORY.md, PROJECT_RULES.md, and STYLING_RULES.md for EV Tracker architecture, design system, and roadmap.
---

# Project Memory & Rules Skill for EV Tracker

Use this skill whenever working on **EV Tracker** to ensure complete alignment with project history, architecture, design rules, and roadmap.

## 📋 MANDATORY STEPS BEFORE ANY CODING OR TASK

1. **Read Memory & Rules**:
   - Inspect [PROJECT_MEMORY.md](file:///Users/ugurkiymetli/Developer/ev-tracker/PROJECT_MEMORY.md) or [PROJECT_MEMORY.md](file:///Users/ugurkiymetli/Developer/ev-tracker/.antigravity/PROJECT_MEMORY.md) to review completed features and current roadmap status.
   - Inspect [PROJECT_RULES.md](file:///Users/ugurkiymetli/Developer/ev-tracker/.antigravity/PROJECT_RULES.md) for core execution guidelines.
   - Inspect [STYLING_RULES.md](file:///Users/ugurkiymetli/Developer/ev-tracker/.antigravity/STYLING_RULES.md) for UI, glassmorphism, responsive hover, and monochrome design tokens.

2. **Maintain Memory Integrity**:
   - Whenever completing a feature or task, update the checklist `[x]` in `PROJECT_MEMORY.md` and `.antigravity/PROJECT_MEMORY.md`.
   - Never remove architectural context or past milestones without user confirmation.

3. **Adhere to Code Standards**:
   - All server calculations belong in `server/calculators/` or `server/services/`.
   - Never leave unannotated implicit `any` in callback parameters.
   - Always translate user-facing UI text strings in `lib/i18n/translations.ts`.
   - Always use `revalidatePath("/", "layout")` when mutating settings or active user preferences.
