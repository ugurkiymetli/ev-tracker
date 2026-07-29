# ev-tracker

A local-first Electric Vehicle (EV) ownership analytics platform designed to provide comprehensive insights into EV charging sessions, driving efficiency, operating costs, battery utilization, and total cost of ownership.

## Overview

**ev-tracker** helps EV owners answer key questions about their vehicle economics and performance over time:
- What is my real cost per kilometer?
- How efficient is my vehicle over time and across different seasons/charging providers?
- How much money have I saved compared to an ICE (Internal Combustion Engine) vehicle?
- What is my overall total cost of ownership (maintenance, insurance, charging, and expenses)?

## Features

- ⚡ **Charging Analytics:** Log & import charging history (AC/DC), track price/kWh trends, and compare charging providers.
- 📊 **Performance & Efficiency Dashboard:** Real-time derived analytics including consumption (`kWh/100km`), cost per kilometer, and estimated battery cycle usage.
- 💡 **ICE Savings Breakdown:** Compare electric vehicle operating costs with traditional fuel vehicles to track lifetime, annual, and monthly savings.
- 📂 **Local-First & Private:** Local data storage using SQLite via Prisma ORM with flexible Excel/CSV imports.

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **UI & Styling:** Tailwind CSS, shadcn/ui, Lucide Icons
- **Charts & Data Tables:** Recharts, TanStack Table
- **Database & ORM:** SQLite, Prisma ORM
- **Validation:** Zod
