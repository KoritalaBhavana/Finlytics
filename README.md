Here's your complete README — copy everything between the lines:

---

```markdown
# Finlytics — Finance Dashboard

A fully responsive, role-aware finance dashboard built as part of a frontend developer internship assignment. It lets users track income, expenses, and spending patterns through an interactive UI with real-time filtering, charting, and insights.

**Live Demo:** https://finlytics-app-8280565b.netlify.app  
**Repository:** https://github.com/KoritalaBhavana/Finlytics

---

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [How to Use](#how-to-use)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Decisions](#architecture-decisions)
- [State Management](#state-management)
- [Role Based UI](#role-based-ui)
- [Optional Enhancements](#optional-enhancements)

---

## Overview

Finlytics is a single-page finance dashboard that simulates a personal finance tracker. It was built to demonstrate:

- Clean, componentized frontend architecture
- Thoughtful UI/UX with responsiveness and accessibility in mind
- Role-based interface behavior without a backend
- Persistent application state using Zustand and localStorage
- Data visualization using Recharts

All data is mock/static. No backend or authentication is required to run the project.

---

## Setup

### Prerequisites
- Node.js 18 or above
- npm

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/KoritalaBhavana/Finlytics.git

# 2. Navigate into the project
cd Finlytics

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open **http://localhost:8080** in your browser.

### Build for production

```bash
npm run build
npm run preview
```

---

## How to Use

### Role Switching
The **Admin / Viewer** toggle is in the top-right corner of the header. Switching roles resets all active filters automatically so each role always starts with a clean view.

| Role | Permissions |
|------|-------------|
| **Admin** | View all data. Add, edit, and delete transactions. Full filter and sort access. |
| **Viewer** | Read-only. Add, edit, and delete buttons are hidden. Filters reset on switch. |

### Dark Mode
Click the **sun/moon icon** in the header to toggle between light and dark mode. The preference is saved and persists across page refreshes.

### Transactions
- **Search** — type any keyword to filter by transaction description or category
- **Filter by type** — show All, Income only, or Expense only
- **Filter by category** — narrow down to a specific spending category
- **Sort** — toggle between sorting by date or amount using the sort button
- **Add (Admin only)** — click the Add button to open a form dialog and create a new transaction
- **Edit (Admin only)** — hover over any transaction row and click the pencil icon
- **Delete (Admin only)** — hover over any transaction row and click the trash icon

---

## Features

### Core

| Feature | Details |
|---------|---------|
| Summary Cards | Total Balance, Total Income, Total Expenses — calculated live from transaction data |
| Balance Trend Chart | Area chart showing monthly income vs expenses over time |
| Spending Breakdown | Donut chart with per-category amounts and percentages |
| Transaction List | Paginated list with date, description, category, type, and amount |
| Search | Real-time search across description and category fields |
| Filter | Filter by transaction type and category simultaneously |
| Sort | Sort by date or amount, ascending or descending |
| Add Transaction | Dialog form with validation — Admin only |
| Edit Transaction | Pre-filled dialog form — Admin only |
| Delete Transaction | Instant delete with confirmation via hover action — Admin only |
| Insights Panel | Four dynamic insights derived from live transaction data |
| Role Based UI | Admin and Viewer roles with different UI behavior |
| Dark Mode | Full dark theme with persistent preference |
| Empty States | Distinct messages for no data vs no filtered results, with CTA for Admin |
| Loading Skeletons | Skeleton layout shown for 450ms on first render for a polished experience |
| LocalStorage Persistence | Transactions, filters, and role all persist across page refreshes |

### Insights Panel (details)

| Insight | How it works |
|---------|-------------|
| Spending Pulse | Compares top spending category this month vs last month |
| Monthly Expenses | Percentage change in total expenses vs previous month |
| Savings Rate | Percentage of total income not spent |
| Largest Expense | Single highest expense transaction across all time |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety throughout |
| Vite | 5 | Build tool and dev server |
| Zustand | 5 | Global state management with persistence |
| Recharts | 3 | Charts (area chart, donut chart) |
| shadcn/ui | latest | Accessible UI component library |
| Tailwind CSS | 3 | Utility-first styling |
| next-themes | 0.3 | Dark/light mode management |
| React Router DOM | 6 | Client-side routing |
| Lucide React | latest | Icon library |
| Vitest | latest | Unit testing setup |
| Playwright | latest | E2E testing setup |

---

## Project Structure

```
Finlytics/
├── public/
│   ├── favicon.ico
│   └── finlytics-favicon.svg
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── SummaryCards.tsx        # Balance, Income, Expense summary cards
│   │   │   ├── BalanceTrend.tsx        # Monthly area chart (income vs expenses)
│   │   │   ├── SpendingBreakdown.tsx   # Category donut chart with legend
│   │   │   ├── TransactionList.tsx     # Full transaction list with filters and CRUD
│   │   │   ├── InsightsPanel.tsx       # Four dynamic spending insights
│   │   │   ├── RoleToggle.tsx          # Admin / Viewer switcher (resets filters)
│   │   │   └── ThemeToggle.tsx         # Light / Dark mode toggle
│   │   ├── ui/                         # shadcn/ui base components (Button, Dialog, etc.)
│   │   └── theme-provider.tsx          # next-themes ThemeProvider wrapper
│   ├── hooks/
│   │   └── use-mobile.tsx              # Hook to detect mobile viewport
│   ├── lib/
│   │   └── utils.ts                    # Tailwind class merge utility
│   ├── pages/
│   │   ├── Index.tsx                   # Main dashboard layout and skeleton logic
│   │   └── NotFound.tsx                # 404 page
│   ├── store/
│   │   └── useFinanceStore.ts          # Zustand store, actions, selectors, mock data
│   ├── index.css                       # Global styles, CSS tokens, dark mode variables
│   ├── main.tsx                        # App entry point
│   └── App.tsx                         # Root component with providers and routing
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Architecture Decisions

### Why Zustand over Redux or Context

Zustand was chosen because:
- It requires minimal boilerplate — no actions, reducers, or providers to wire up
- It has built-in `persist` middleware that handles localStorage serialization automatically
- Selector hooks (`useFilteredTransactions`, `useSummary`) allow components to subscribe only to the data they need, avoiding unnecessary re-renders
- It scales cleanly for a project of this size without the overhead of Redux Toolkit

### Component Design

Each dashboard section is a self-contained component that reads directly from the store. This means:
- Components can be moved, reordered, or replaced independently
- No prop drilling — every component gets what it needs from the store directly
- The `Index.tsx` page is purely a layout file — it composes components without any business logic

### Role Based UI Approach

Roles are stored in Zustand and persisted to localStorage. The UI reads `role` from the store and conditionally renders controls:
- The Add button in `TransactionList` only renders when `role === 'admin'`
- Edit and Delete buttons on each row only render when `role === 'admin'`
- When the role is switched, all filters are reset to defaults so the Viewer always sees the complete unfiltered dataset

### Dark Mode

Dark mode is handled by `next-themes` which toggles a `dark` class on the root HTML element. All colors are defined as CSS HSL variables in `index.css` with separate `:root` (light) and `.dark` (dark) blocks, so every component automatically responds to the theme without any extra logic. Chart tooltip and axis colors also adapt using `useTheme()` from `next-themes`.

### TypeScript

All data types are defined and exported from the store — `Role`, `TransactionType`, `Category`, `Transaction`. This ensures every component that touches transaction data is fully type-safe.

---

## State Management

The Zustand store (`useFinanceStore.ts`) manages:

| State | Type | Description |
|-------|------|-------------|
| `role` | `'admin' \| 'viewer'` | Current active role |
| `transactions` | `Transaction[]` | Full list of all transactions |
| `filters` | `Filters` | Active search, type, category, sort settings |

### Actions

| Action | Description |
|--------|-------------|
| `setRole(role)` | Switches role and resets all filters to defaults |
| `setFilter(key, value)` | Updates a single filter field |
| `addTransaction(t)` | Adds a new transaction with a generated UUID |
| `editTransaction(id, updates)` | Updates fields on an existing transaction |
| `deleteTransaction(id)` | Removes a transaction by ID |

### Selectors

| Selector | Description |
|----------|-------------|
| `useFilteredTransactions()` | Returns transactions after applying all active filters and sort |
| `useSummary()` | Returns total balance, income, and expenses |

All state (role, transactions, filters) is persisted to localStorage under the key `finlytics-finance-store` using Zustand's `persist` middleware with `partialize` to exclude action functions from storage.

---

## Optional Enhancements Implemented

| Enhancement | Status |
|-------------|--------|
| Dark mode | Implemented |
| LocalStorage persistence | Implemented |
| Animations and transitions | Staggered slide-up animations, hover micro-interactions |
| Advanced filtering |  Filter by type + category simultaneously with live search |

---

*Built by Bhavana Koritala — Frontend Developer*
```