# Project Name: ev-tracker

## Project Vision

ev-tracker is a local-first EV ownership analytics platform designed to provide detailed insights into electric vehicle ownership. The application goes beyond simple charging history by tracking charging sessions, driving efficiency, operating costs, battery utilization, maintenance, expenses, and long-term ownership statistics.

The primary goal is to become a comprehensive personal EV dashboard that answers questions such as:

- What is my real cost per kilometer?
- How efficient is my vehicle over time?
- Which charging provider is the cheapest?
- How much money have I saved compared to an ICE vehicle?
- How is my battery aging?
- What is my total cost of ownership?

The project should always prioritize analytics and historical accuracy over simply storing data.

---

# Tech Stack & Architecture

## Framework

- **Frontend & Backend:** Next.js (App Router)
- **Language:** TypeScript
- **Runtime:** Node.js

## UI

- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Recharts (preferred)
- TanStack Table

## Data

- Prisma ORM
- SQLite (development)
- PostgreSQL (optional future migration)

## Validation

- Zod

## File Processing

- xlsx (SheetJS)

## Charts

- Recharts

---

# Architecture Principles

- Single full-stack Next.js application.
- No separate backend API project.
- Use Server Actions whenever possible.
- API Routes only for file uploads, exports, or external integrations.
- Keep calculations on the server.
- Use TypeScript across the entire stack.
- Prefer composition over inheritance.
- Avoid unnecessary abstractions.
- Local-first design with no cloud dependency.

---

# Core Features Tracker

## MVP

- [ ] Vehicle Management
- [ ] Excel Charging History Import
- [ ] Charging Session Management
- [ ] Dashboard
- [ ] Statistics Engine
- [ ] Settings

## Charging

- [ ] Charging History
- [ ] AC/DC Statistics
- [ ] Charging Provider Statistics
- [ ] Cost per Charge
- [ ] Average Price per kWh
- [ ] Monthly Charging Reports

## Analytics

- [ ] Average Consumption (kWh/100km)
- [ ] Cost per Kilometer
- [ ] Cost per 100 km
- [ ] Distance Between Charges
- [ ] Average Daily Mileage
- [ ] Monthly Statistics
- [ ] Battery Cycle Estimation
- [ ] Estimated Range
- [ ] Charging Price Trends

## Financial

- [ ] Expense Tracking
- [ ] Insurance
- [ ] Taxes
- [ ] Maintenance Costs
- [ ] Parking
- [ ] Accessories
- [ ] Total Cost of Ownership

## ICE Comparison

- [ ] Fuel Price Configuration
- [ ] Fuel Consumption Configuration
- [ ] Cost Comparison
- [ ] Lifetime Savings
- [ ] Monthly Savings
- [ ] Annual Savings
- [ ] Break-even Analysis

## Reports

- [ ] Monthly Reports
- [ ] Annual Reports
- [ ] PDF Export
- [ ] Excel Export
- [ ] CSV Export

## Future Features

- [ ] Multi-Vehicle Support
- [ ] Trip Tracking
- [ ] Weather Correlation
- [ ] Home Charging Analytics
- [ ] Solar Production Tracking
- [ ] OBD-II Integration
- [ ] Battery Health Estimation
- [ ] AI Ownership Insights

---

# Data Model Philosophy

Core entities should represent real-world objects.

Examples:

- Vehicle
- ChargingSession
- Expense
- Maintenance
- Trip
- ChargingProvider
- Settings

Statistics should never be manually entered.

Examples of derived data:

- Cost per km
- Cost per 100 km
- Average consumption
- Battery cycles
- Estimated range
- Lifetime savings
- Monthly summaries

Derived values should always be recalculated from source data.

---

# Statistics Engine Responsibilities

The statistics engine should calculate:

- Total charging sessions
- Total energy charged
- Total charging cost
- Average charging price
- Cheapest charge
- Most expensive charge
- Average charging session size
- Median charging session size
- Average kWh/100km
- Average km/day
- Average km/month
- Average km/charge
- Cost/km
- Cost/100km
- Battery cycles
- Estimated battery throughput
- Estimated driving range
- Monthly trends
- Charging provider comparisons

---

# Import Pipeline

Excel/CSV Upload

↓

Validate using Zod

↓

Normalize data

↓

Import to Prisma

↓

Recalculate statistics

↓

Refresh dashboard

---

# Directory Structure Rules

```
app/
    (dashboard)/
    api/

components/
    charts/
    dashboard/
    tables/
    ui/

server/
    calculators/
    services/
    importers/
    analytics/

lib/
    calculations/
    db/
    import/
    utils/

prisma/

types/

public/
```

---

# Coding Standards

- Always use TypeScript.
- Avoid `any`.
- Prefer server components unless client interaction is required.
- Keep business logic inside `/server`.
- Keep reusable calculations inside `/server/calculators`.
- UI components must remain presentation-only.
- Prefer small, composable components.
- Use Zod for every external input.
- Never duplicate calculation logic.
- Keep naming explicit and descriptive.

---

# Future Design Goals

ev-tracker should eventually evolve into a complete vehicle ownership platform capable of managing multiple electric vehicles, comparing them with ICE vehicles, tracking all ownership costs, generating reports, estimating battery health, and providing actionable insights through analytics and AI.