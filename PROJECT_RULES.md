# PROJECT_RULES.md

> Development standards and architectural guidelines for the EV Tracker project.

## Guiding Principles

### Simplicity First

Always prefer the simplest solution that satisfies the requirements.

Avoid introducing abstractions, design patterns, or libraries unless they provide clear long-term value.

---

### Readability Over Cleverness

Code is read far more often than it is written.

Prefer explicit, descriptive code over clever or condensed implementations.

Good code should require little explanation.

---

### Type Safety

- Always use TypeScript.
- Never use `any`.
- Prefer descriptive types.
- Enable strict mode.
- Use Zod for runtime validation.
- Avoid unnecessary type assertions.

---

## Tech Stack

### Framework

- Next.js (App Router)
- TypeScript

### Styling

- Tailwind CSS
- shadcn/ui

### Database

- Prisma ORM
- SQLite (development)
- PostgreSQL (future)

### Charts

- Recharts

---

## Architecture Rules

### Business Logic

Business logic must never exist inside React components.

Business logic belongs in:

```text
server/
├── calculators/
├── services/
├── analytics/
└── repositories/
```

Components should only render UI.

---

### Server Actions

Prefer Server Actions.

Use API Routes only when necessary:

- File uploads
- File downloads
- External integrations
- Webhooks

---

### Calculations

All calculations belong in:

```text
server/calculators/
```

Examples:

- calculateAverageConsumption()
- calculateCostPerKm()
- calculateBatteryCycles()
- calculateEstimatedRange()
- calculateLifetimeSavings()

Calculators should be pure functions whenever possible.

---

## Folder Rules

```text
app/
```

Contains:

- Pages
- Layouts
- Routes
- Server Actions

Never place business logic here.

---

```text
components/
```

Contains reusable UI components.

Examples:

- dashboard
- charts
- tables
- dialogs
- forms

---

```text
server/
```

Contains all backend logic.

---

```text
lib/
```

Contains infrastructure and shared utilities.

Examples:

- Prisma client
- Helpers
- Constants
- Formatting

---

```text
types/
```

Contains shared TypeScript types.

---

## Naming Rules

### Components

PascalCase

```text
VehicleCard
ChargingHistoryTable
DashboardHeader
```

### Hooks

```text
useVehicle()
useChargingStatistics()
useDashboard()
```

### Utility Functions

camelCase

```text
calculateEfficiency()
calculateAveragePrice()
formatCurrency()
```

### Files

Use kebab-case.

Good:

```text
charging-history-table.tsx
vehicle-card.tsx
battery-statistics.ts
```

Bad:

```text
Helpers.ts
Utils.ts
Misc.ts
```

---

## Database Rules

Only store facts.

Never persist derived values such as:

- Cost per km
- Average consumption
- Battery cycles
- Estimated range

Always calculate these from source data.

---

## Validation Rules

Every external input must be validated with Zod.

Examples:

- Forms
- Settings
- Excel imports
- API requests

Never trust imported data.

---

## Import Pipeline

```text
Upload
↓
Parse
↓
Validate
↓
Normalize
↓
Preview
↓
Import
↓
Recalculate Statistics
```

Invalid rows should not cancel the import.

Import valid rows and report invalid ones.

---

## Dashboard Philosophy

Every dashboard metric should answer a question.

Examples:

- How much have I spent?
- How efficient is my vehicle?
- What changed this month?
- How much have I saved?
- Is my battery usage changing?

Avoid dashboards that only display raw numbers.

---

## Charts

Prefer:

- Line
- Area
- Bar

Avoid unnecessary pie charts and decorative visuals.

Every chart should communicate a trend or comparison.

---

## Testing

Prioritize tests for:

- Statistics calculations
- Battery calculations
- Cost calculations
- Import pipeline
- ICE comparison

Business logic has higher priority than UI tests.

---

## Git Commit Convention

```text
feat:
fix:
refactor:
docs:
test:
chore:
```

Examples:

```text
feat: add Excel import
fix: correct battery cycle calculation
refactor: simplify statistics engine
docs: update README
```

---

## Code Review Checklist

- No duplicated logic
- No `any`
- Strong typing
- Clear naming
- Business logic separated from UI
- Zod validation
- Tests for calculations
- Responsive UI
- Accessibility considered

---

## Long-Term Goal

The project should remain modular, scalable, and easy to extend.

Future modules—including weather integration, OBD-II telemetry, home charging analytics, solar production, and AI-powered insights—should integrate without major architectural changes.