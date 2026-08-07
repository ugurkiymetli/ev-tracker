# EV-Tracker Issues & Feature Backlog

This document tracks all reported bugs, improvements, and feature requests for EV Tracker.

---

## 🐞 Bugs

### BUG-001: Language Switching Is Inconsistent
- **Status:** ✅ Resolved
- **Category:** General / i18n
- **Description:** The application language is inconsistent after switching languages. Some parts of the UI remain in Turkish while others are translated into English.
- **Resolution:** Audited and expanded translation key dictionary in `lib/i18n/translations.ts` for 100% key parity across English and Turkish. Enforced instant client context state and cookie synchronization in `LanguageProvider`.

### BUG-002: Vehicle Brand and Model Selection Is Not Functional
- **Status:** ✅ Resolved
- **Category:** Vehicle Management / Settings
- **Description:** The vehicle brand and model selectors do not work correctly. Existing vehicles also cannot be edited.
- **Resolution:** Built structured `EV_CATALOG` (`server/data/vehicles-catalog.ts`) featuring top EV brands (Tesla, Togg, Hyundai, BYD, BMW, Mercedes-Benz, Porsche, Volvo, Renault, MG, Kia, Audi, Peugeot, Volkswagen). Integrated dynamic brand & model dropdown selectors in `SettingsForms` and server action updates.

### BUG-003 / BUG-006: Charging Stations Are Not Loaded from the Dashboard
- **Status:** ✅ Resolved
- **Category:** Dashboard / Charging Modal
- **Description:** When opening the "Add Charging Session" dialog from the Dashboard, the charging station list is empty.
- **Resolution:** Passed `allProviders` and `userTopProviderIds` to `ChargingSessionDialog` on `app/page.tsx`.

### BUG-004: Energy Input Does Not Properly Support Decimal Values
- **Status:** ✅ Resolved
- **Category:** Charging Sessions / Inputs
- **Description:** Energy (kWh) input has issues with decimal numbers (cannot enter 3 decimal places, period vs comma inconsistency).
- **Resolution:** Normalized comma (`,`) to period (`.`) before parsing floats across forms and server actions, allowing up to 3 decimal places precision (e.g. `45.125` kWh).

### BUG-005: Add Charging Session Modal Opens Too Low
- **Status:** ✅ Resolved
- **Category:** UI / Modal Dialogs
- **Description:** The "Add Charging Session" modal appears near the bottom of the screen instead of being vertically centered in the viewport.
- **Resolution:** Enforced viewport vertical and horizontal centering (`my-auto max-h-[90vh] overflow-y-auto`) on modal backdrop dialog in `ChargingSessionDialog`.

---

## 🚀 Improvements & Features

### FEATURE-001: Add Loading Indicators
- **Status:** ✅ Resolved
- **Category:** UX / Feedback
- **Resolution:** Implemented Next.js App Router loading skeleton UI in `app/loading.tsx`.

### FEATURE-002: Automatically Detect Browser Language
- **Status:** ✅ Resolved
- **Category:** General / i18n
- **Resolution:** Implemented `detectBrowserLanguage()` in `LanguageProvider`.

### FEATURE-003: Simplify Footer
- **Status:** ✅ Resolved
- **Category:** General / UI
- **Resolution:** Cleaned up footer layout and added GitHub and LinkedIn profile links.

### FEATURE-004: Create an Onboarding Flow
- **Status:** 🟡 Scheduled for Phase 2
- **Category:** User Experience / Setup

### FEATURE-005: Flexible Cost Input (Total Cost vs. Price per kWh)
- **Status:** ✅ Resolved
- **Category:** Charging Sessions
- **Resolution:** Added real-time toggle between **Total Session Cost** vs **Price per kWh** manual entry in `ChargingSessionDialog`, automatically computing the unselected value.

### FEATURE-006: Improve Charging Type Selection
- **Status:** ✅ Resolved
- **Category:** Charging Sessions / UI
- **Resolution:** Replaced basic select box with visual segmented buttons (AC Level 2 vs DC Fast Charging) with icons.

### FEATURE-007: Support Additional Optional Charging Information
- **Status:** ✅ Resolved
- **Category:** Charging Sessions
- **Resolution:** Added optional fields for Charger Power (kW), Duration (minutes), Location, and Notes.

### FEATURE-008: Add Filtering and Sorting to Charging Sessions
- **Status:** ✅ Resolved
- **Category:** Charging Sessions / Table
- **Resolution:** Built `ChargingTableView` client component featuring column sorting (Date, Provider, Energy, Cost, Price/kWh, Odometer) and multi-field search/type filtering.

### FEATURE-009: Calculate Average Charging Power
- **Status:** ✅ Resolved
- **Category:** Charging Sessions / Analytics
- **Resolution:** Added real-time calculation badge for Average Charging Power (`Energy kWh / (Duration Mins / 60)`).

### FEATURE-010: Compare Monthly Energy Consumption with ICE Vehicle
- **Status:** ✅ Resolved
- **Category:** Dashboard / Analytics
- **Resolution:** Added interactive toggle on `MonthlyTrendChart` to switch between EV Electricity Consumption (kWh) and Equivalent ICE Fuel Consumption (Liters).
