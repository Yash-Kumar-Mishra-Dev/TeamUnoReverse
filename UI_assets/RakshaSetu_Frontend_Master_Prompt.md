# RakshaSetu — Frontend Master Build Prompt
*(Paste this into Stitch for UI generation, and into Antigravity/MCP for the actual working build)*

---

## 0. HOW TO USE THIS PROMPT
- **In Stitch:** Copy Section 3 (Design System) + one Panel section at a time (e.g. Section 4.2 Citizen App) as a single prompt per screen-set. Stitch works best screen-by-screen, not all four panels in one shot.
- **In Antigravity (with MCP server connected):** Paste the whole document as project context/system prompt once, then ask it to scaffold the repo (Section 6), then build panel-by-panel (Section 4), then wire APIs + WebSockets (Section 5). Keep this file in the repo as `docs/FRONTEND_SPEC.md` so the agent can re-read it every session.

---

## 1. PROJECT SUMMARY

Build the **frontend** for RakshaSetu, a Disaster Preparedness & Emergency Response Platform with **4 panels**: Government (Command Center), Citizen (Safety App), Field Responder (Field Ops), Admin (Platform Control).

Backend is already spec'd (NestJS microservices, REST `/api/v1`, WebSocket via Socket.IO, Kafka events, JWT/Keycloak auth). **The frontend must be built exactly against this contract** — no placeholder/mock data logic left behind; every screen must call the real endpoint or real socket channel listed in Section 5.

Non-negotiables:
- Real JWT auth flow (access + refresh token), not fake login.
- Real-time channels actually subscribed and rendered live, not polled fake.
- Field Responder app must work **offline-first** (queue + sync).
- SOS flow must be the fastest, most fail-proof path in the entire app.

---

## 2. TECH STACK (Frontend)

| Concern | Choice | Why |
|---|---|---|
| Framework | React 18 + Vite (or Next.js if SSR/SEO needed for Gov/Admin) | Fast dev loop, matches NestJS/TS backend language |
| Language | TypeScript strict mode | Type-safe contracts against OpenAPI specs |
| Styling | Tailwind CSS | Utility-first, fast to theme per-panel |
| Component Library | **shadcn/ui** (Radix primitives + Tailwind) as base, extended with custom components | Accessible, unstyled-by-default, easy to re-skin per panel without fighting a heavy design system |
| Icons | **lucide-react** | Clean, consistent stroke icons, huge coverage (map pins, alerts, shields — fits disaster-response iconography) |
| State (server) | **TanStack Query (React Query)** | Caching, retries, background refetch — critical for dashboards pulling `/gov/dashboard/summary` etc. |
| State (client/UI) | **Zustand** | Lightweight, no boilerplate, good for auth/session + map filters + offline queue state |
| Forms | React Hook Form + Zod | Type-safe validation matching backend DTOs (Incident, Report, SOS payloads) |
| Real-time | **socket.io-client** | Matches backend's Socket.IO gateway exactly |
| Maps | **Mapbox GL JS** (react-map-gl wrapper) | Matches backend's Mapbox/Google Maps choice; supports live marker layers, heatmaps for zones |
| Charts | **Recharts** | Government analytics/trends, Admin dashboards |
| Offline storage | IndexedDB via **Dexie.js** | Field Responder queued verification/status updates when offline |
| PWA | Workbox / vite-plugin-pwa | Citizen + Field Responder apps should be installable + offline-tolerant |
| i18n | **i18next** + react-i18next | Citizen-facing multilingual requirement (Section 9 of SRS) |
| Fonts | **Inter** (UI/body) + **Manrope** or **Plus Jakarta Sans** (headings/dashboard numerals) — self-hosted via `@fontsource` or Google Fonts, NOT CDN font-swap causing layout shift | Inter is the most legible at small sizes for dense dashboards; Manrope gives dashboards a slightly more "command-center" geometric feel for big KPI numbers |
| Auth | Keycloak JS adapter (`keycloak-js`) or custom JWT interceptor via Axios | Matches backend's Keycloak OAuth2/OIDC |
| HTTP client | Axios with interceptors (attach JWT, auto-refresh on 401, retry) | |

---

## 3. DESIGN SYSTEM

### 3.1 Typography
- Primary font: **Inter** — body text, forms, tables, nav.
- Display font: **Manrope** (600–800 weight) — big KPI numbers, dashboard headers, SOS/alert banners.
- Font scale (Tailwind): `text-xs` (12px) captions → `text-sm/base` body → `text-lg/xl` section headers → `text-3xl/4xl` KPI numbers → `text-5xl` for the SOS countdown/critical alert only.
- Never go below 14px for any actionable text on Citizen/Field Responder mobile — these are used under stress, sometimes one-handed, sometimes in poor light.

### 3.2 Color System (severity-driven, not decorative)
Disaster UI colors must encode **meaning**, not just brand:

| Token | Hex (suggested) | Use |
|---|---|---|
| `critical` | `#DC2626` (red-600) | P1/Critical severity, SOS active, anomaly=Critical |
| `warning` | `#F59E0B` (amber-500) | P2/Warning severity, anomaly=Warning |
| `normal` | `#16A34A` (green-600) | Resolved, Normal status, Available resources |
| `info` | `#2563EB` (blue-600) | Informational alerts, links, active navigation |
| `neutral-bg` | `#0B1220` (near-black) for Government/Admin "command center" dark theme; `#FFFFFF`/`#F8FAFC` for Citizen light theme | Government/Field Responder benefit from a dark, low-glare command-center theme; Citizen app should default to light, high-contrast, accessible theme |
| `surface` | `#111827` (dark) / `#FFFFFF` (light) | Cards, panels |

- Government + Field Responder Command/Ops screens → **dark theme default** (control-room feel, night-field-use friendly, less glare).
- Citizen app → **light theme default**, with a manual dark toggle.
- Admin → light, clean, "boring on purpose" (it's a config/audit tool, not a live-ops tool — don't compete visually with Gov/Field for urgency).
- Never use red/amber/green as the *only* differentiator — always pair with icon/shape/label too (accessibility, colorblind-safe).

### 3.3 Components (build these once as shared primitives, reuse across panels)
- `SeverityBadge` (Critical/Warning/Normal/Info pill, icon + color + label)
- `StatCard` (big number + label + trend delta, used in every dashboard)
- `LiveMap` (Mapbox wrapper, accepts layer configs: incidents, teams, shelters, danger-zones)
- `IncidentCard` / `IncidentRow` (compact + expanded variants)
- `PriorityQueueList` (P1→P4 sorted list with drag-disabled reorder, real-time re-sort animation)
- `SOSButton` (Citizen — huge, thumb-reachable, long-press confirm to avoid accidental fire, haptic feedback)
- `AlertBanner` (broadcast alerts, dismissible but re-appears on new `alert.broadcast` event)
- `ConnectionStatusPill` (shows WebSocket connected/reconnecting/offline — mandatory on Field Responder + Government)
- `SyncQueueIndicator` (Field Responder — "3 updates pending sync")
- `AuditLogTable` (Admin, virtualized for large logs)
- `LanguageSwitcher` (Citizen, i18next-driven)
- `ChatWidget` (Citizen multilingual chatbot, streaming message support)

---

## 4. PANEL-BY-PANEL SCREENS & FUNCTIONALITY

### 4.1 Government (Command Center) — Dark theme, desktop-first, data-dense
Screens:
1. **Dashboard** — KPI `StatCard`s (active incidents, affected people, camps, critical alerts) from `GET /gov/dashboard/summary`; auto-refresh via `map.incidents` + `alerts.broadcast` sockets.
2. **Live Map** — `LiveMap` with incidents/zones/shelters/responder layers from `GET /gov/map/live`, live-updated via `map.incidents` and `team.tracking` sockets.
3. **Resources** — table/grid from `GET /gov/resources`, status color-coded (Available/Allocated/In Use/Depleted).
4. **Budget** — `GET /gov/budget`, Recharts bar/donut per department.
5. **Analytics/Trends** — `GET /gov/analytics/trends`, line charts (incident count, severity, response time).
6. **Departments Status** — `GET /gov/departments/status`, grid of cards.
7. **Alert Broadcast** — form → `POST /gov/alerts`; must show delivery confirmation (subscribe `alert.broadcast` echo).
8. **Deploy Responder** — action from an incident/mission view → `POST /gov/responders/deploy`.

### 4.2 Citizen (Safety App) — Light theme, mobile-first, PWA, offline-tolerant reads
Screens:
1. **Home/Dashboard** — `GET /citizen/dashboard` (location, warnings, weather, nearby shelter, my-reports).
2. **SOS** — the single most important screen. `SOSButton` → `POST /citizen/sos`. Must work with degraded connectivity (retry queue), show live "help is coming" status via `sos.alert` socket ack.
3. **Report Incident** — form + photo/video upload → `POST /citizen/reports` (upload media first via `POST /media/upload`, then attach `media_ids[]`).
4. **My Reports** — list, status tracked via `GET /citizen/reports/{id}/status` + live status-update socket.
5. **Safety Map** — `GET /citizen/map/safety` (safe/danger zones, shelters, hospitals, evacuation routes) on `LiveMap`.
6. **Family Safety** — `POST /citizen/family-safety`, status chips (Safe/NeedHelp/Missing/Unknown) per family member.
7. **Chatbot** — `ChatWidget` → `POST /citizen/chat`, language-aware.
8. **Alerts Feed** — `GET /citizen/alerts` + live `alerts.broadcast` push (also wire to browser/Web Push + FCM if PWA installed).

### 4.3 Field Responder (Field Ops) — Dark theme, mobile/tablet, **offline-first**
Screens:
1. **My Missions** — `GET /field/missions`, rendered via `PriorityQueueList`, re-sorts live on `mission.assigned`/priority-score change.
2. **Mission Detail** — `GET /field/missions/{id}`.
3. **Verify Incident** — form + media → `POST /field/missions/{id}/verify`. **Must queue in IndexedDB if offline and auto-sync on reconnect** (`SyncQueueIndicator` visible).
4. **Escalate** — `POST /field/missions/{id}/escalate`.
5. **Team Status** — toggle (Available/En Route/On Site/Returning/Offline) → `PUT /field/team/status`, also streams to `team.tracking` socket.
6. **Navigation** — `GET /field/navigation/{missionId}`, route on `LiveMap` avoiding blocked roads.
7. **Media Upload** — `POST /field/media`.
8. **Comms** — `POST /field/comms`, real-time via socket to control room/other teams.

### 4.4 Admin (Platform Control) — Light theme, desktop, "boring on purpose"
Screens:
1. **Dashboard** — `GET /admin/dashboard/status`.
2. **Users** — `GET /admin/users`, role change → `POST /admin/users/{id}/role`.
3. **Audit Logs** — `GET /admin/audit-logs`, `AuditLogTable` (virtualized, filterable).
4. **Settings** — `PUT /admin/settings` (notifications, security, languages, integrations).
5. **Resources (registry)** — `GET /admin/resources` (distinct from Gov's deployment view — registration only).
6. **Backup** — `POST /admin/backup/run`, restore via `POST /admin/backup/{id}/restore`, list of `BackupRecord`.

---

## 5. JS WIRING — EXACT CONTRACT (this is the part that must "just work")

### 5.1 Auth
- `POST /auth/login` → store access + refresh JWT (memory + httpOnly-cookie-preferred, never localStorage for the access token if avoidable).
- Axios interceptor: on `401`, call `POST /auth/refresh`, retry original request once, else force logout.
- Route guards per role (Citizen/Government/FieldResponder/Admin) driven by JWT role claim — mirror Section 9.1 RBAC table exactly; don't render nav items a role can't use.

### 5.2 REST base
- All calls under `/api/v1`, always with `Authorization: Bearer <token>` except `/auth/*` and health checks.
- Wrap every panel's API calls in a typed `api/<panel>.ts` module (e.g. `api/citizen.ts`, `api/government.ts`) matching Section 6 endpoint tables 1:1 — do not invent endpoints not in the SRS.

### 5.3 WebSocket channels (subscribe exactly these, per panel)
| Channel | Subscribe in |
|---|---|
| `map.incidents` | Government, Citizen, Field Responder maps |
| `team.tracking` | Government, Field Responder |
| `mission.status` | Field Responder (own missions), Government |
| `sos.alert` | Government control room, nearest Field Responders |
| `alerts.broadcast` | Citizen (by zone subscription) |

- Reconnection strategy: exponential backoff, show `ConnectionStatusPill`, and on reconnect **re-fetch via REST** to reconcile any missed events (don't trust socket-only state after a gap).

### 5.4 Offline (Field Responder specifically)
- Detect `navigator.onLine` + socket-disconnect as offline signal.
- Queue `verify`/`team status`/`media` mutations in Dexie (IndexedDB) with a `synced: boolean` flag.
- On reconnect: flush queue in order, show per-item sync status, never silently drop a queued action.

### 5.5 Error handling (global)
- All API errors go through a single `ApiError` shape; toast for recoverable errors, full-screen fallback only for auth failures.
- SOS submission specifically: **never block on error** — if `POST /citizen/sos` fails, fall back to an SMS-trigger deep link / tel: link per backend's "fail open" requirement (Section 9.2 of SRS: SOS must not be throttled or blocked).

---

## 6. REPO SCAFFOLD (ask Antigravity to generate this structure)

```
rakshasetu-frontend/
  apps/
    citizen/         (or route-group if single Next.js app)
    government/
    field-responder/
    admin/
  packages/
    ui/               shared shadcn-based components (Section 3.3)
    api-client/        typed Axios modules per panel + auth
    sockets/            socket.io client setup + channel hooks
    offline-sync/       Dexie queue logic (field responder)
    i18n/               translation resources
  tailwind.config.ts
  vite.config.ts (or next.config.ts)
```

If a single app with route-based panels is preferred instead of a monorepo, keep the same `packages/` separation as internal `src/lib/` folders — the separation matters more than the monorepo tooling.

---

## 7. ACCEPTANCE CHECKLIST (don't consider a panel "done" until all true)
- [ ] Every screen's data comes from a real endpoint listed in Section 5, no hardcoded mock arrays left in.
- [ ] Every live-data screen is subscribed to its correct socket channel and updates without refresh.
- [ ] Auth guard blocks cross-role access to routes.
- [ ] SOS button works and degrades gracefully offline.
- [ ] Field Responder verify/status actions survive airplane-mode + reconnect.
- [ ] Color/severity system is consistent across all 4 panels using the shared `SeverityBadge`.
- [ ] Citizen app passes a basic Lighthouse PWA + accessibility check.
- [ ] No console errors, no unhandled promise rejections on any screen.

---

## 8. STITCH-SPECIFIC PROMPT SNIPPETS (paste per screen)

> Design the **Citizen SOS screen** for a disaster-response mobile PWA. Light theme, high contrast, huge thumb-reachable red SOS button with long-press confirmation, live status text below it ("Sending your location...", "Help is on the way"), a subtle map preview showing nearest responder, and a persistent bottom nav (Home, Map, Report, Family, Chat). Font: Inter for body, Manrope bold for the SOS label. Must feel calm but urgent — no clutter.

> Design the **Government Command Center dashboard**. Dark theme (#0B1220 background), left sidebar nav, top KPI stat cards row (active incidents, affected people, camps, critical alerts) using Manrope bold numerals, a large live map center-panel with incident/zone/shelter/responder layers, right-side live alert feed panel. Data-dense, control-room aesthetic, Inter for all secondary text.

*(Repeat this pattern for each screen in Section 4 — one focused prompt per screen gives Stitch better results than one giant prompt.)*

---

## 9. NOTES FOR ANTIGRAVITY / MCP BUILD SESSION
- Treat Sections 5 (JS wiring) and 6 (repo scaffold) as source of truth for code generation — build incrementally: scaffold → shared `packages/ui` + `api-client` + `sockets` → Citizen panel (has the SOS-critical path) → Field Responder → Government → Admin.
- If the actual backend isn't live yet, stub it behind the exact same endpoint/socket contract (e.g. a local mock server matching Section 5) so swapping to the real backend later requires zero frontend code changes.
