# Finance Dashboard

Fin OS is an interactive financial dashboard built to demonstrate a clean, modern approach to data visualization and state management in React. The interface utilizes a highly polished "bento box" spatial layout, designed to present complex financial data intuitively.

## Table of Contents
- [Setup Instructions](#setup-instructions)
- [Overview of Approach](#overview-of-approach)
- [Explanation of Features](#explanation-of-features)
  - [1. Dashboard Overview](#1-dashboard-overview)
  - [2. Transactions Section](#2-transactions-section)
  - [3. Role-Based UI (RBAC)](#3-role-based-ui-rbac)
  - [4. Insights Section](#4-insights-section)
  - [5. State Management Approach](#5-state-management-approach)
- [Optional Enhancements Added](#optional-enhancements-added)

---

## Setup Instructions

1. **Prerequisites**: Ensure you have Node.js and `npm` installed.
2. **Installation**: From the project root, install all dependencies:
   ```bash
   npm install
   ```
3. **Start Development Server**: 
   ```bash
   npm run dev
   ```
4. Access the application running on your local server port `5173` (e.g., http://localhost:5173).

---

## Overview of Approach

The application is structured to decouple complex routing dependencies by rendering contextual spaces ("Dashboard" and "Transactions") sequentially. I opted for a vanilla CSS architecture anchored in custom CSS Variables (`data-theme`) to build a scalable and hardware-accelerated "glassmorphic effect". 
Technically, the component utilizes React hooks (`useState`, `useMemo`, `useEffect`) rather than external statement management libraries to keep the bundle size extremely lightweight but maximally performant via derived data mappings.

---

## Explanation of Features

### 1. Dashboard Overview
The dashboard utilizes a modular grid layout housing:
- **Summary Cards:** Automatically calculated "Total Balance", "Total Income", and "Total Expenses".
- **Time-Based Visualization:** A smooth `AreaChart` tracks liquidity trajectory across the financial year.
- **Categorical Visualization:** A `PieChart` styled in a soft pastel palette cleanly breaks down spending history by category, dynamically positioning labels based on geometric coordinate algorithms.

### 2. Transactions Section
Using the dedicated navigation dock tab, users can access an isolated Ledger space that lists all historical transactions safely apart from high-level visualizations.
- **Detailed Entries:** Elements present Title, Date, Amount (formatted), and Categories mapped gracefully to `lucide-react` SVG symbols.
- **Search & Filtering:** A real-time search input and an Income/Expense filter drop-down strictly modify the ledger view efficiently.

### 3. Role-Based UI (RBAC)
Robust simulated User Roles exist to test accessibility logic safely.
- Users can switch between **Viewer** and **Admin** via the Settings Modal (accessed by clicking "Manage").
- A **Viewer** strictly accesses the dashboard read-only.
- **Admins** unlock powerful CRUD actions permitting them to click the **New** (+) button or tap directly on Transaction Cards to open a portal overlay allowing form modification and record deletions over the active dataset.

### 4. Insights Section
A calculated cluster of metric "Pills" rapidly summarizes actionable constraints:
- Tracks total Inflow/Outflow pipelines.
- Implements a pure derived function sweeping the `expense` dataset arrays to determine and flag the current **Highest Spend Category**.

### 5. State Management Approach
Handled natively in React without bloated external dependencies. 
- Utilizes an absolute single source of truth matrix (`transactions` state).
- Leverages `useMemo` computation hooks universally. All metric cards, pie slices, filtered search outputs, and chart plots react perfectly in real-time derived immediately from state revisions, skipping unnecessary expensive re-renders seamlessly.

---

## Optional Enhancements Added

The following optional features were integrated into this implementation:
- **Dark Mode ecosystem:** Fully functional theming architecture swapping root level CSS variables.
- **Data Persistence:** Tied to browser Native `localStorage` pipelines upon initialization to retain ledger manipulation records persistently on page refreshes.
- **Animations:** Custom pure CSS keyframes mapped across the App layer for fade-ins, component floating states, modal overlay popping algorithms, and hovering. 
- **Graceful Empty States:** Defensive logic intercepts completely empty datasets (e.g. wiping all transactions) smoothly yielding "No expenses" messaging and safe $0.00 mathematical parsing over NaNs.
