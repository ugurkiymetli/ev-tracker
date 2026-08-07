# Project Name: ev-tracker

## Project Vision

`ev-tracker` is a local-first & cloud-syncable EV ownership analytics platform designed to provide detailed insights into electric vehicle ownership. The application goes beyond simple charging history by tracking charging sessions, driving efficiency, operating costs, battery utilization, maintenance, non-charging operating expenses, and long-term ownership statistics.

The primary goal is to become a comprehensive personal EV dashboard that answers questions such as:

- What is my real cost per kilometer?
- How efficient is my vehicle over time (kWh / 100 km)?
- Which charging provider or station network is the cheapest?
- How much money have I saved compared to an equivalent ICE gas vehicle?
- How is my battery utilization aging over estimated discharge cycles?
- What is my full Total Cost of Ownership (TCO)?

---

# Tech Stack & Architecture

## Framework

- **Frontend & Backend:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript (Strict mode)
- **Runtime:** Node.js

## UI & Styling

- Vanilla CSS with CSS Variables & Glassmorphism design tokens ([STYLING_RULES.md](file:///Users/ugurkiymetli/Developer/ev-tracker/.antigravity/STYLING_RULES.md))
- Tailwind CSS
- Lucide React Icons
- Recharts (Composed Bar & Line Charts, Vertical Bar Charts)

## Data & Authentication

- **Database:** Prisma ORM 7.9 (SQLite for local dev & Turso libSQL for serverless production)
- **User Authentication:** Account System (`User` model with username, password, session cookies)
- **Sign In / Sign Up Pages:** Dedicated auth pages (`/signin`, `/signup`) with secure server actions
- **Landing Page:** Public showcase landing page (`/landing` or `/`) for app introduction and onboarding

## Internationalization (i18n)

- Custom Context Provider (`LanguageProvider`) supporting **English (US/UK) 🇬🇧** and **Türkçe (TR) 🇹🇷** with automatic browser cookie & `localStorage` persistence.

## File Processing

- `xlsx` (SheetJS) for Excel (`.xlsx`, `.xls`) & CSV import pipeline.

---

# Issues & Feature Tracking

All reported bugs and feature requests are tracked in [ISSUES_BACKLOG.md](file:///Users/ugurkiymetli/Developer/ev-tracker/ISSUES_BACKLOG.md).

- **Bugs Tracked:** BUG-001 through BUG-006 (i18n consistency, vehicle brand/model selector, dashboard modal stations, decimal kWh inputs, modal alignment).
- **Features Tracked:** FEATURE-001 through FEATURE-010 (loading indicators, browser language detection, simplified footer, onboarding flow, flexible cost entry, AC/DC visual selector, optional fields, table sorting/filtering, average charging power, monthly ICE energy comparison).

---

# Core Features Status Tracker

## MVP & Core Infrastructure

- [x] Vehicle Management (Profile configuration, battery capacity, odometer tracking)
- [x] Excel & CSV Charging History Import Engine (Zod validation & column mapping)
- [x] Charging Session Management (Create, Edit, Delete, AC/DC categorization)
- [x] Responsive Analytics Dashboard (KPIs, Monthly Trends, Network Breakdown)
- [x] Server-side Statistics Engine (`server/calculators/statistics.ts`)
- [x] Dual App Settings & Car Settings Panels
- [x] Multi-Language Support (English 🇬🇧 & Turkish 🇹🇷)
- [x] Global Currency Selector (USD `$`, EUR `€`, TRY `₺`, GBP `£`, CAD `C$`, AUD `A$`, JPY `¥`, CHF, Krona `kr`)
- [x] Demo Data Seed & Clear Database Reset Options
- [x] Turso libSQL Cloud Database Integration for Vercel Serverless
- [x] User Account System (`User` model & HTTP-only session cookies)
- [x] Public Landing Page (`/landing` app introduction & feature showcase)
- [x] Sign Up & Sign In Pages (`/signup`, `/signin`)

## Charging Analytics

- [x] Detailed Charging Session History Table & Filters
- [x] AC Level 2 vs DC Fast Charger Statistics & Distribution Ratio
- [x] Charging Provider & Station Network Breakdown
- [x] Cost per Charge & Average Price per kWh calculation
- [x] Monthly Energy & Cost Trend Composed Charts

## Driving & Ownership Analytics

- [x] Average Consumption (kWh / 100 km)
- [x] Cost per Kilometer ($/km or ₺/km)
- [x] Cost per 100 kilometers
- [x] Distance Driven & Odometer Tracking
- [x] Battery Discharge Cycle Estimation
- [x] Estimated Full Range Calculation

## Financial & Operating Expenses (TCO)

- [x] Non-charging Operating Expense Tracker
- [x] Expense Categories (Maintenance & Service, Kasko & Insurance, Tax & License, Parking & Tolls, Accessories, Other)
- [x] Total Cost of Ownership (TCO) calculation (Charging Cost + Operating Expenses)

## ICE Gasoline Savings Comparison

- [x] Custom Gasoline Benchmark Configuration (Fuel Price per Liter & Fuel Economy L/100km)
- [x] Net Lifetime Financial Savings calculation vs gas vehicle
- [x] Liters / Gallons of Gasoline Avoided
- [x] Direct CO2 Tailpipe Emissions Prevented (kg CO2)
- [x] Per-Kilometer Cost Comparison (EV Actual vs ICE Benchmark)

---

# Roadmap & Future Expansion Plan

## 🔐 Phase 1: Authentication & User Onboarding (COMPLETED)
- [x] **Public Landing Page (`/landing` or `/`)**: Modern landing page with hero banner, key feature highlights, interactive analytics teaser, and CTA buttons.
- [x] **Account Schema & Prisma Model**: Added `User` model (`id`, `username`, `passwordHash`, `email`, `createdAt`) linked to `Vehicle` and `Settings`.
- [x] **Sign Up Page (`/signup`)**: Dedicated registration page with username, password, and instant account setup.
- [x] **Sign In Page (`/signin`)**: Dedicated sign-in page with credential validation and session cookie handling.
- [x] **Session & Route Protection**: Automatically displays public landing showcase to guests and private dashboard to authenticated users.

## 📌 Phase 2: Data Export & Monthly Reporting (NEXT IMMEDIATE STEP)
- [ ] **PDF Ownership Report Export**: Generate downloadable, formatted PDF summaries of monthly/yearly charging, costs, and savings.
- [ ] **Excel / CSV Data Export**: Download full charging logs and expense histories back into `.csv` or `.xlsx` files.
- [ ] **Monthly & Yearly Filter Selectors**: Filter dashboard charts and table records by specific months or years.

## 🚗 Phase 3: Multi-Vehicle Support & Trip Tracking
- [ ] **Multi-Vehicle Switcher**: Manage multiple EVs (e.g. Tesla Model Y + Hyundai Ioniq 5) under a single user account.
- [ ] **Trip & Road-trip Logger**: Track specific road trips (start odometer, end odometer, total kWh charged during trip, hotel/supercharger costs).
- [ ] **Home vs Public Charging Split**: Dedicated tag and analytics chart comparing Home Charging electricity rates vs Public Fast Charger rates.

## 🔋 Phase 4: Advanced Battery Health & Intelligence
- [ ] **Battery Degradation & Range Retention Tracking**: Track estimated battery health percentage (SOH) over time based on odometer vs full charge capacity.
- [ ] **Seasonal Weather Correlation**: Correlate summer vs winter consumption efficiency variations (kWh/100km by season).
- [ ] **AI Ownership Insights**: Intelligent personalized recommendations (e.g., "Shifting 30% of DC charging to Home AC charging will save you ~₺4,200 annually").
- [ ] **Scheduled Maintenance Reminders**: Odometer-based alerts for tire rotations, cabin filter replacements, and brake fluid checks.