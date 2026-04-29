# CLAUDE.md — RouteAce Platform Build Guide

This document is the authoritative reference for AI-assisted development on RouteAce. Read it fully before touching any code.

---

## 1. Project Overview

**RouteAce** is an enterprise, multi-tenant logistics management SaaS. It is a React + TypeScript SPA backed by Supabase (PostgreSQL + Auth + Deno Edge Functions).

Core capabilities:
- Real-time dispatch and shipment tracking (Mapbox GL)
- Fleet management (vehicles, drivers, maintenance)
- SLA enforcement and violation tracking
- Financial management (invoicing, AR/AP, payroll, expenses, P&L)
- AI-powered intelligence (board orchestrator, CEO engine, decision engine, investor analysis, FMCG insights, fleet CCC, etc.)
- Role-based access control (RBAC) across all features
- Industry-specific verticals: FMCG, Liquor, Pharma, Building, Cosmetics, BFSI, Auto, Consumer, Agri
- GTM (Go-To-Market) Brain with multi-industry replication
- Customer portal with waybill PDF generation
- Reseller / white-label tenant system
- Stablecoin / wallet payment rails

---

## 2. Tech Stack

| Concern | Library / Service | Version |
|---|---|---|
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.8.3 |
| Build | Vite + SWC | 5.4.19 |
| Styling | Tailwind CSS | 3.4.17 |
| Components | shadcn/ui + Radix UI | various |
| Routing | React Router DOM | 6.30.1 |
| Forms | React Hook Form + Zod | 7.x / 3.x |
| Server state | TanStack React Query | 5.83.0 |
| Backend | Supabase JS | 2.89.0 |
| Maps | Mapbox GL | 3.17.0 |
| Charts | Recharts | 2.15.4 |
| AI | OpenAI API (`gpt-4o-mini`) | via edge functions |
| PDF export | jsPDF + AutoTable | 4.x / 5.x |
| Spreadsheet export | XLSX | 0.18.5 |
| Icons | Lucide React | 0.462 |
| Animations | Framer Motion | 12.x |
| Testing | Vitest + Testing Library | 3.x / 16.x |

**Package manager:** npm (use `npm install --legacy-peer-deps` due to react-day-picker/date-fns peer dep mismatch).

---

## 3. Directory Structure

```
routeace-platform-87fbac5f-main/
├── src/
│   ├── App.tsx                  # Root router — 100+ routes
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Tailwind directives + CSS variables
│   ├── components/              # Feature modules (see §4)
│   ├── contexts/                # React contexts (see §5)
│   ├── hooks/                   # Custom hooks
│   ├── integrations/supabase/   # Supabase client + generated types
│   ├── lib/                     # Pure business logic (see §6)
│   ├── pages/                   # Page-level components (see §7)
│   ├── test/                    # Vitest setup
│   └── utils/                   # Formatting, helpers
├── supabase/
│   ├── config.toml
│   ├── migrations/              # SQL migrations (apply with: supabase db push)
│   └── functions/               # 50+ Deno edge functions (see §10)
├── docs/
│   └── RBAC_VERIFICATION_CHECKLIST.md
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── components.json              # shadcn/ui config
├── eslint.config.js
├── postcss.config.js
└── vitest.config.ts
```

---

## 4. Component Modules (`src/components/`)

Each subdirectory is a self-contained feature module. Key modules:

| Directory | Purpose |
|---|---|
| `analytics/` | Admin analytics, session analytics, KPI boards |
| `auth/` | Login, registration, password reset flows |
| `billing/` | Subscription, payment, multi-drop billing |
| `branding/` | White-label brand theming |
| `capital/` | Loan management, capital requests |
| `cfo/` | CFO daily brief, cash conversion cycle |
| `command/` | GTM command center |
| `customer/` | Customer portal, order forms, delivery details |
| `dashboard/` | Main dashboard, metric cards |
| `dispatch/` | Dispatch creation, assignment, tracking |
| `drivers/` | Driver profiles, performance, payroll |
| `entitlements/` | Feature gates, plan limits |
| `finance/` | Invoices, AR/AP, expenses |
| `fleet/` | Vehicle management, maintenance |
| `fmcg/` | FMCG vertical — field sales, procurement, dashboards |
| `fuel/` | Fuel tracking and management |
| `gtm/` | Go-to-market brain, campaign intelligence |
| `guards/` | Auth guards, role guards |
| `inbox/` | Notifications inbox |
| `industry/` | Industry OS configuration |
| `investor/` | Investor dashboard |
| `invoice/` | Invoice generation and management |
| `kpi/` | KPI metric display |
| `landing/` | Marketing landing pages |
| `layout/` | App shell, nav, sidebar |
| `network/` | Growth network engine |
| `onboarding/` | New user / tenant onboarding |
| `operations/` | Operational dashboards |
| `organization/` | Org settings, team management |
| `payroll/` | Payroll calculation and processing |
| `pricing/` | Pricing plans, trip rates |
| `rbac/` | RBAC management UI |
| `routing/` | Route optimization |
| `shared/` | Cross-module shared components |
| `shell/` | App shell wrapper |
| `sla/` | SLA rules, violation tracking |
| `stablecoin/` | Crypto wallet / stablecoin rails |
| `strategy/` | Strategic planning tools |
| `subscription/` | Plan management |
| `ui/` | shadcn/ui base components (do not modify directly) |
| `users/` | User management, profiles |
| `wallet/` | Wallet / balance management |
| `vendor/` | Vendor management |

---

## 5. Contexts (`src/contexts/`)

| Context | Provides |
|---|---|
| `AuthContext` | `user`, `session`, `signIn`, `signOut`, role data |
| `RegionContext` | Active region / country |
| `WorkspaceContext` | Active tenant workspace, plan, feature flags |
| `DispatchNotificationContext` | Real-time dispatch notifications |
| `I18nContext` | Locale and translation helpers |

All contexts are mounted at the root in `App.tsx`. Use hooks: `useAuth()`, `useWorkspace()`, etc.

---

## 6. Business Logic (`src/lib/`)

| Subdirectory | Responsibility |
|---|---|
| `entitlements/` | Plan-based feature gating |
| `eventBus/` | Cross-component event bus |
| `global/` | Global constants and config |
| `industry/` | Industry vertical config and routing |
| `integrations/` | Third-party integration helpers |
| `integrity/` | Data validation and integrity checks |
| `plans/` | Subscription plan definitions |
| `platform/` | Platform-level utilities |
| `pricing/` | Trip rate and pricing calculations |
| `rbac/` | RBAC role definitions and permission checks |
| `workforce/` | Workforce-related calculations |
| `workspace/` | Workspace resolution utilities |

---

## 7. Pages (`src/pages/`)

60+ top-level page components routed from `App.tsx`. Groups:

- **Core:** Dashboard, Analytics, Dispatch, Tracking, Fleet, Drivers, Customers, Routes
- **Finance:** Invoices, Payroll, Expenses, P&L, AR/AP, Loan Management
- **Operations:** SLA Management, Maintenance, Fuel Management
- **Admin:** Users, Roles, Organization Settings, Billing, Entitlements
- **Industry verticals:** `agri/`, `auto/`, `bfsi/`, `building/`, `cosmetics/`, `fmcg/`, `liquor/`, `pharma/`
- **Sales:** Sales dashboard, GTM, CRM
- **Investor:** Investor dashboard
- **Portodash / TradeGraph:** Partner and trading dashboards
- **Public:** CustomerPortal, PublicSiteViewer (white-label sites)
- **Auth:** Auth, CoreLogin, Signup variants

---

## 8. Routing (`App.tsx`)

All routes are in a single `BrowserRouter` in `src/App.tsx`. The app wraps routes with:

1. `AuthProvider`
2. `RegionProvider`
3. `WorkspaceProvider`
4. `DispatchNotificationProvider`
5. `AppErrorBoundary`
6. `OSIsolationGuard` — isolates industry OS sessions

When adding a new page:
1. Create the component in `src/pages/`
2. Import it in `App.tsx`
3. Add a `<Route>` inside the appropriate `<Routes>` block
4. Add role guard if needed via `useAuth()` or route-level guard component

---

## 9. Styling Conventions

- All styling via **Tailwind CSS utility classes**. No inline styles, no CSS modules.
- Use shadcn/ui components from `src/components/ui/` — never style them directly.
- Theme tokens are CSS variables defined in `src/index.css` and mapped in `tailwind.config.ts`.
- Dark mode is class-based (`dark:` prefix). The `next-themes` provider handles toggle.
- Color palette keys: `primary`, `secondary`, `muted`, `accent`, `card`, `sidebar`, plus `infra-*` variants.
- Custom fonts: `font-sans` = Inter, `font-heading` = Manrope.
- Use `cn()` from `src/lib/utils.ts` for conditional class merging (wraps `clsx` + `tailwind-merge`).

---

## 10. Supabase Edge Functions (`supabase/functions/`)

All functions are **Deno** (TypeScript). They follow this pattern:

```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  // auth check → data fetch → AI call → response
});
```

### AI Integration

All AI calls use OpenAI-compatible API:

```typescript
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [...],
  }),
});
```

**Required Supabase secret:** `OPENAI_API_KEY`

Set it with:
```bash
supabase secrets set OPENAI_API_KEY=sk-...
```

### Key Edge Functions

| Function | Purpose |
|---|---|
| `ai-board-orchestrator` | Multi-executive AI debate on strategic questions |
| `ai-ceo-engine` | CEO-level decision synthesis |
| `ai-decision-engine` | General decision support |
| `ai-deal-closer` | Sales deal analysis and recommendations |
| `ai-investor-engine` | Investor readiness and reporting |
| `ai-workforce-engine` | Workforce planning |
| `autonomous-distribution-ai` | Autonomous route/distribution decisions |
| `autonomous-execution-engine` | Task execution automation |
| `autonomous-fleet-controller` | Fleet state management |
| `cfo-daily-brief` | Daily financial summary for CFO |
| `core-ai-insights` | General business insights |
| `fleet-ccc-engine` | Cash Conversion Cycle analysis |
| `fmcg-ai-insights` | FMCG-specific market insights |
| `generate-industry-os` | Industry OS configuration generation |
| `growth-network-engine` | Network growth recommendations |
| `website-generator-engine` | White-label website generation |
| `admin-create-user` | Admin user provisioning |
| `maintenance-alert-dispatch` | Automated maintenance alerts |

---

## 11. RBAC System

Roles (descending privilege):

```
super_admin
  org_admin
    admin
      ops_manager
      finance_manager
        sales_rep
        driver
        customer
        standard
```

All role checks go through `src/lib/rbac/` helpers. Edge functions also enforce RBAC via the shared `_shared/rbac-middleware.ts`.

Full verification matrix: `docs/RBAC_VERIFICATION_CHECKLIST.md`

---

## 12. Environment Variables

### Frontend (`.env` — must be prefixed `VITE_`)

```env
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_SUPABASE_PROJECT_ID=<project-id>
VITE_MAPBOX_TOKEN=<mapbox-token>     # required for maps
```

### Edge Functions (Supabase Secrets)

```bash
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are automatically injected by Supabase into all edge functions.

---

## 13. Development Commands

```bash
# Install (use --legacy-peer-deps due to react-day-picker/date-fns peer dep)
npm install --legacy-peer-deps

# Dev server → http://localhost:8080
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint

# Run tests
npm test

# Apply DB migrations
supabase db push

# Deploy all edge functions
supabase functions deploy

# Deploy single function
supabase functions deploy <function-name>

# Set a secret
supabase secrets set KEY=value
```

---

## 14. Adding New Features

### New page
1. Create `src/pages/MyPage.tsx`
2. Import and add route in `src/App.tsx`
3. Add nav link in the appropriate sidebar component under `src/components/layout/`

### New component
1. Create under `src/components/<feature>/MyComponent.tsx`
2. Export from the feature's `index.ts` if one exists, otherwise import directly

### New Supabase table
1. Create migration: `supabase migration new <name>`
2. Write SQL in the new file under `supabase/migrations/`
3. Apply: `supabase db push`
4. Regenerate types: `supabase gen types typescript --local > src/integrations/supabase/types.ts`

### New edge function
1. Create `supabase/functions/<name>/index.ts`
2. Follow the existing pattern (CORS headers, auth check, RBAC check, business logic)
3. For AI calls, use `OPENAI_API_KEY` and `https://api.openai.com/v1/chat/completions` with model `gpt-4o-mini`
4. Deploy: `supabase functions deploy <name>`

---

## 15. Known Issues and Notes

- **Peer dep mismatch:** `react-day-picker@8` requires `date-fns@^3`, project uses `date-fns@4`. Always install with `--legacy-peer-deps`. This does not cause runtime issues for the date picker usage in this codebase.
- **Bundle size:** The main JS chunk is ~9.4 MB unminified (~2.3 MB gzipped). This is a known technical debt — the app imports 4,946 modules. Future work: code-split by route using dynamic `import()`.
- **Type checking strictness:** `tsconfig` has `strict: false` and `noImplicitAny: false`. TypeScript errors are soft. Do not rely on type errors alone to catch bugs — write tests.
- **Mapbox token:** Maps will not render without `VITE_MAPBOX_TOKEN` set in `.env`.
- **Edge function cold starts:** Supabase free-tier edge functions have cold start delays. Production deployment should use Supabase Pro for consistently warm functions.

---

## 16. Code Style Rules

- No inline comments unless the WHY is non-obvious.
- No multi-paragraph docstrings.
- Use `cn()` for all conditional Tailwind class merging.
- Prefer `const` over `let`. No `var`.
- All API calls go through TanStack Query (`useQuery` / `useMutation`). No raw `useEffect` data fetching.
- All form state goes through React Hook Form. No `useState` for form fields.
- All validation schemas use Zod.
- All toast notifications use `sonner` (`import { toast } from "sonner"`) or `useToast()` from shadcn, not browser `alert()`.
- Do not use `any` except at Supabase response boundaries.
- Prefer named exports over default exports for components (except page components, which use default export for lazy loading compatibility).
