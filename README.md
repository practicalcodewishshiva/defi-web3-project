# defi-web3-project (Tidefall Guardians MVP)

## Overview

This repository contains the **Tidefall Guardians** Game‑Fi MVP – a Web3‑ready battle game designed as a **DeFi / Game‑Fi prototype** for the **Germany client project “Lubov”**.

The goal of this MVP is to demonstrate:
- **Hero-based battle gameplay** with selectable heroes and inventory
- **DeFi / Web3 readiness** (wallet integration, on‑chain transaction lifecycle, auditability)
- **Production-grade frontend architecture** with clean state management and UX
- A **Node.js backend API** ready to sit behind real smart‑contract interactions

For a deep technical review and rationale behind the architecture, see:
- `AUDIT_REPORT.md`
- `IMPLEMENTATION_REPORT.md`
- `IMPROVEMENT_SUMMARY.md`
- `APP_STATUS.md`

## Tech Stack

- **Frontend**
  - React 18 + TypeScript
  - Vite (dev server & build) on port **8080**
  - React Router, React Query
  - Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Backend**
  - Node.js (workspace under `backend/`)
  - REST API on port **3001**
  - Database connection & health endpoint (`/health`)
- **Web3 / DeFi readiness**
  - `wagmi` + `viem` (for future wallet / smart-contract integration)
  - Transaction lifecycle hooks and components prepared for on‑chain flows

## Getting Started

### 1. Prerequisites

- Node.js (LTS recommended, e.g. 20.x)
- npm (comes with Node)

### 2. Install Dependencies

From the project root:

```bash
npm run install:all
```

This will:
- Install root/frontend dependencies
- Install `backend/` workspace dependencies

If you prefer manual installation:

```bash
npm install
npm install --workspace=backend
```

### 3. Run the App (Frontend + Backend)

From the project root:

```bash
npm run start
```

This will:
- Start the **backend API** on `http://localhost:3001`
- Start the **frontend** on `http://localhost:8080`

You can also run them independently:

```bash
# Frontend only
npm run dev

# Backend only
npm run backend:dev
```

Then open the game UI in your browser at:

```text
http://localhost:8080
```

## Project Structure (High Level)

- `src/` – React SPA (pages, components, hooks, context, game logic)
  - `src/pages/` – main screens (`Battle`, `HeroSelection`, `Inventory`, etc.)
  - `src/contexts/GameContext.tsx` – core game and transaction state
  - `src/lib/` – helpers, API client, game store
  - `src/components/ui/` – reusable UI primitives
- `backend/` – Node.js backend workspace
- `APP_STATUS.md` – current app and environment status
- `AUDIT_REPORT.md` – architecture and production readiness audit
- `IMPLEMENTATION_REPORT.md` – detailed description of transaction lifecycle improvement
- `IMPROVEMENT_SUMMARY.md` / `DELIVERY_SUMMARY.md` – summary docs for the client

