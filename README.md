# ⚡ EV Tracker

**EV Tracker** is a personal, local-first & cloud-syncable electric vehicle ownership analytics platform. It provides insights into charging sessions, driving efficiency (kWh/100km), operating costs, battery cycle utilization, non-charging maintenance expenses, and long-term gasoline savings.

---

## ✨ Features

- **⚡ Charging History & Analytics**: Log, edit, and categorize AC Level 2 vs DC Fast charging sessions.
- **📊 Real-time Dashboard**: Interactive Recharts for monthly energy trends, top charging networks, and ownership KPIs.
- **⛽ ICE Gasoline Savings**: Compare your actual EV charging costs against gas vehicle benchmarks (net savings, liters saved, CO2 avoided).
- **💸 Total Cost of Ownership (TCO)**: Track non-charging operating expenses (Maintenance, Insurance, Tax, Parking/Tolls, Accessories).
- **🌐 Internationalization (i18n)**: Native support for **English 🇬🇧** and **Türkçe 🇹🇷** with instant currency selection (`$`, `€`, `₺`, `£`, `C$`, `A$`, `¥`, `CHF`, `kr`).
- **📥 Excel & CSV Importer**: Seamlessly import existing charging logs with automatic column header mapping and Zod validation.
- **🌩️ Turso & SQLite Database**: Seamless local development on SQLite (`dev.db`) and serverless production database on Turso (libSQL) on Vercel.

---

## 🛠️ Upcoming Account & Authentication Features (Phase 1 Roadmap)

- **Public Landing Page (`/`)**: Feature showcase, ownership analytics highlights, and onboarding.
- **User Account System**: Username & Password authentication with `User` Prisma model.
- **Sign In & Sign Up Pages (`/signin`, `/signup`)**: Dedicated authentication flows.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
DATABASE_URL="file:./dev.db"
```

### 3. Initialize Local Database & Seed Demo Data
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Build

```bash
# Run Vitest test suite
npm run test

# Run Next.js production build
npm run build
```
