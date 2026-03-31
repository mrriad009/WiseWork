<div align="center">

![WiseWork Banner](./assets/wisework_banner.png?v=3)

# 🧠 WiseWork: AI Resume & CV Evaluator

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Empowering recruitment with intelligent automation and explainable candidate insights.**

[Overview](#-overview) • [Key Features](#-key-features) • [Project structure](#-project-structure) • [Tech stack](#-tech-stack) • [API contract](#-api-contract) • [Setup](#-getting-started)

</div>

---

## 📖 Overview

**WiseWork** is an AI-assisted resume screening tool. The **client** is a React + Vite app with a marketing landing page and an **analyzer** flow: you add one or more candidates (CV upload and/or LinkedIn URL), run analysis against a **local backend**, and review ranked results with scores, strengths, risks, and recommendations.

The **server** is a Node.js Express app that parses documents, optionally enriches with LinkedIn metadata, calls **xAI (Grok)** via the OpenAI-compatible API (`XAI_API_KEY`, `XAI_BASE_URL`, `XAI_MODEL`), and can persist each analysis run to **[Neon](https://neon.tech)** (PostgreSQL) when `DATABASE_URL` is set.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **Landing + analyzer** | Single-page flow: hero, product sections, then “Open analyzer” for `ResumeAnalysis`. |
| **Multi-candidate batch** | Add several candidates; each request sends `multipart/form-data` with optional file, LinkedIn URL, and display name. |
| **Explainable scoring** | UI expects dimension scores (e.g. technical depth, leadership), executive summary, strengths/weaknesses, and hire-style recommendation. |
| **Editorial UI** | Light “paper” surfaces, stone neutrals, teal accents; **DM Sans** + **Fraunces** (see `client/src/index.css`). |
| **Dev proxy** | Vite proxies `/api` to the backend so the client can call `/api/...` in development. |

---

## 📂 Project Structure

```bash
Ai/
├── assets/                    # Static assets (e.g. banner)
├── client/                    # Frontend (React + Vite + Tailwind v4)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PageChrome.tsx       # Brand, background, layout chrome
│   │   │   ├── LandingHeroArt.tsx
│   │   │   ├── LandingDividerArt.tsx
│   │   │   └── ResumeAnalysis.tsx   # Analyzer UI + fetch to /api/resume
│   │   ├── App.tsx            # Landing ↔ analyzer toggle
│   │   ├── main.tsx
│   │   └── index.css          # Design tokens, Tailwind @theme
│   ├── vite.config.ts         # port 3000, /api → localhost:5000
│   └── package.json
├── server/                    # Backend (Express + TypeScript)
│   ├── db/
│   │   └── schema.sql         # Neon: run once in SQL Editor
│   ├── src/
│   │   ├── db/client.ts      # Neon serverless driver
│   │   ├── services/analysisStore.ts
│   │   └── …
│   ├── .env                   # Secrets — do not commit (see Setup)
│   └── package.json
├── package.json               # Root: install:all, dev (client + server)
└── README.md
```

**Backend entrypoint:** `server/package.json` runs `tsx watch src/index.ts`. If `server/src/index.ts` is missing in your tree, restore it from version control; otherwise `npm run dev` in `server` will fail. A small `test-pdf-lib.ts` helper may exist for PDF library checks only.

---

## 🛠️ Tech Stack

### Frontend (`client/package.json`)

- **React** 19 + **TypeScript**
- **Vite** 7
- **Tailwind CSS** v4 via `@tailwindcss/vite`
- **Framer Motion**, **lucide-react**

### Backend (`server/package.json`)

- **Node.js** (ESM), **Express** 5, **TypeScript** + **tsx**
- **AI:** `openai` (OpenAI SDK pointed at xAI’s base URL)
- **Database (optional):** `@neondatabase/serverless` + `DATABASE_URL` (Neon PostgreSQL)
- **Parsing / web:** `pdf-parse`, `mammoth`, `cheerio`, `axios`
- **Uploads:** `multer`, `cors`, `dotenv`

---

## 🔌 API Contract

The analyzer (`ResumeAnalysis.tsx`) calls:

- **Method:** `POST`
- **Path:** `/api/resume` (resolved via Vite proxy to `http://localhost:5000` in dev)
- **Body:** `multipart/form-data` with:
  - `resumes` — file (optional if LinkedIn URL is used)
  - `linkedinUrl` — string
  - `candidateName` — string

**Success:** JSON with a `results` array; the client uses the first element per candidate. Shape includes fields such as `score`, `executive_summary`, `recommendation`, `detailed_scores`, `experience`, `skills`, `strengths`, `weaknesses`, and optional `error` for failures.

**Persisted runs (Neon):** Each successful or failed candidate row is inserted into `analysis_runs` when `DATABASE_URL` is configured.

- **Method:** `GET`
- **Path:** `/api/analyses?limit=50` — `{ runs, databaseConfigured }`. If Neon is not configured, `runs` is `[]` and `databaseConfigured` is `false`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher  
- **npm** v9 or higher  

### 1. Install dependencies

From the repository root:

```bash
npm run install:all
```

### 2. Configure the server

Copy or edit `server/.env`. Typical variables (names only — use your own secrets):

- `PORT` — API port (default **5000**; must match Vite proxy target)
- **xAI:** `XAI_API_KEY` (required), optional `XAI_BASE_URL` (default `https://api.x.ai/v1`), `XAI_MODEL` (e.g. `grok-3-mini`)
- **Neon (optional):** `DATABASE_URL` — Postgres connection string from the [Neon dashboard](https://console.neon.tech) (use the **pooled** string if offered). Create tables with **`cd server && npm run db:push`** (or run `server/db/schema.sql` manually in the Neon SQL Editor).

Never commit real keys or credential JSON files.

### 3. Run the app

```bash
npm run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000) (configured in `client/vite.config.ts`)
- **Backend:** [http://localhost:5000](http://localhost:5000) when `server/src/index.ts` is present and `npm run dev` for the server succeeds

Individual packages:

```bash
npm run client   # Vite only
npm run server   # API only
```

### 4. Production build (client)

```bash
npm run build --prefix client
```

Static output is under `client/dist/` (served or deployed as you prefer; API must be reachable for analyzer calls).

---

## 📅 Roadmap (reference)

Earlier planning used a phased rollout (UI → AI → API → LinkedIn → analytics → polish). Treat the table below as **historical / planning**; implementation status should be verified against the repo and your deployed backend.

| Phase | Focus |
| :--- | :--- |
| Foundation | Design system, layout, landing |
| Core | LLM integration, PDF/DOC parsing |
| API | Upload routes, error handling |
| Data | LinkedIn enrichment (if implemented) |
| Analytics | Ranking, comparative UI |
| Delivery | QA, limits, docs |

---

<div align="center">
  <sub>Built with care for clear, explainable hiring workflows.</sub>
</div>
