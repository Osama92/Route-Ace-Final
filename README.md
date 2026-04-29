# RouteAce — Enterprise Logistics Platform

RouteAce is a multi-tenant, AI-powered logistics management platform. It covers real-time tracking, intelligent dispatch, SLA enforcement, financial management, payroll, fleet control, and industry-specific verticals (FMCG, Liquor, Pharma, Building, Cosmetics, BFSI, Auto, Consumer, Agri).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript 5, Vite 5 |
| Styling | Tailwind CSS 3, shadcn/ui, Radix UI |
| Routing | React Router DOM 6 |
| Forms | React Hook Form + Zod |
| Server state | TanStack React Query 5 |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions) |
| Maps | Mapbox GL 3 |
| Charts | Recharts 2 |
| AI | OpenAI API (via Supabase Edge Functions) |
| Export | jsPDF, XLSX |

## Local Development

### Prerequisites
- Node.js 18+ and npm 10+
- A Supabase project (credentials in `.env`)
- An OpenAI API key (for AI-powered edge functions)

### Setup

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:8080)
npm run dev
```

### Environment Variables

Copy `.env` and fill in your values:

```env
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_SUPABASE_PROJECT_ID=<project-id>
```

For Supabase Edge Functions, set `OPENAI_API_KEY` as a Supabase secret:

```bash
supabase secrets set OPENAI_API_KEY=sk-...
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server on port 8080 |
| `npm run build` | Production build |
| `npm run build:dev` | Dev-mode build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build |

## Supabase

Apply database migrations:

```bash
supabase db push
```

Deploy edge functions:

```bash
supabase functions deploy
```

## Project Structure

```
src/
  components/   # 50+ feature modules (analytics, dispatch, fleet, finance, ...)
  contexts/     # Auth, Region, Workspace, Dispatch, I18n
  hooks/        # Custom React hooks
  integrations/ # Supabase client
  lib/          # Business logic (RBAC, pricing, entitlements, plans, ...)
  pages/        # 60+ page components
  utils/        # Helpers and formatters
supabase/
  functions/    # 50+ Deno edge functions
  migrations/   # PostgreSQL schema migrations
```

## RBAC Roles

`super_admin` > `org_admin` > `admin` > `ops_manager` / `finance_manager` > `sales_rep` / `driver` / `customer`

See [docs/RBAC_VERIFICATION_CHECKLIST.md](docs/RBAC_VERIFICATION_CHECKLIST.md) for the full matrix.

## AI Features

All AI features call `https://api.openai.com/v1/chat/completions` using model `gpt-4o-mini` via Supabase Edge Functions. The `OPENAI_API_KEY` secret must be set in Supabase.

AI engines included:
- Board Orchestrator (multi-executive debate engine)
- CEO Engine
- Decision Engine
- Deal Closer
- Investor Engine
- FMCG Insights
- Core Insights
- Fleet CCC Engine
- Growth Network Engine
- Autonomous Distribution AI
- Website Generator Engine
- Industry OS Generator
