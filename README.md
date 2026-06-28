# Rupiyo — Household Financial Engine

A production-ready personal finance web app for multi-member households. Track income, expenses, investments, and wealth across multiple currencies, members, and countries.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** (dark premium design)
- **Supabase** (PostgreSQL + RLS)
- **Recharts**, **Zustand**, **React Hook Form**, **Zod v4**

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy env template and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

3. Run the database schema in your Supabase SQL editor:
   ```
   supabase/schema.sql
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Features (Phase 1)

- Dark premium UI with Bloomberg-style gold accents
- Auth: email/password + Google OAuth via Supabase
- 12-route dashboard with collapsible sidebar
- Full TypeScript types for all 7 DB entities
- Calculation engine: cashflow, tax brackets, compound projections
- Zod v4 validation schemas
- SQL schema with RLS policies (household isolation)

## Phases

- **Phase 1** ✅ Foundation — scaffold, types, calculations, auth, DB schema, app shell
- **Phase 2** 🔜 Core — live dashboard KPIs, transaction CRUD, income/expenses pages
- **Phase 3** 🔜 Advanced — accounts, overseas, projections chart, tax center
- **Phase 4** 🔜 Polish — mobile responsive, export, animations
