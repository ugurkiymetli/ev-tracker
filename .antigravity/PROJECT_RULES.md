# PROJECT_RULES.md

## Core Directives

1. **Inspect Before Modifying**
   - Always view the target file before making any changes.
   - Do not guess signatures, prop names, imports, or variable types.

2. **Server-Side Calculation Logic**
   - Business calculations belong exclusively in `server/calculators/` or `server/services/`.
   - Never duplicate calculation logic inside UI components.

3. **Strict Type Safety**
   - Explicitly type all callback parameters in map, filter, reduce, or server actions.
   - Never leave callback parameters as implicit `any`.

4. **UI Styling & Interaction**
   - Adhere strictly to `STYLING_RULES.md`.
   - Every primary/secondary action button must include hover state, press feedback (`active:scale-[0.99]`), and explicit `cursor-pointer`.
   - Ensure full dark mode support with curated color tokens.

5. **Internationalization Integrity**
   - Every user-facing text string, button label, modal title, table header, chart tooltip, and badge text must be translated in `lib/i18n/translations.ts`.
   - Never hardcode user-visible strings in JSX/TSX components.

6. **Settings & Action Safety**
   - `updateSettingsAction` must preserve unsubmitted form fields by checking `formData.has(...)`.
   - Always call `revalidatePath("/", "layout")` when mutating settings or language preferences to update Next.js layout cache.
