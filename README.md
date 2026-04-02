# Finlytics

Finlytics is a responsive finance dashboard with local persistence, dark mode, and dynamic insights.

## Screenshots

Add your own captures here for the live UI.

- `public/screenshots/overview.png`
- `public/screenshots/dark-mode.png`
- `public/screenshots/transactions-empty.png`

## Features

- Persistent transactions, filters, and role state with Zustand.
- Light and dark mode toggle in the header.
- Dynamic spending insights that compare this month with last month.
- Empty-state guidance when no transactions are available.
- Loading skeletons for a polished first impression.

## Architecture

- `Zustand` manages app state because it is lightweight, easy to persist, and avoids prop drilling.
- `next-themes` handles theme switching by toggling the `dark` class on the root element.
- The UI is componentized into summary cards, trends, transactions, and insights so each part stays isolated.

## Why Zustand

- Simple global state for transactions, filters, and role selection.
- Built-in persistence support keeps dashboard data across refreshes.
- Less boilerplate than Redux for a compact product demo.
