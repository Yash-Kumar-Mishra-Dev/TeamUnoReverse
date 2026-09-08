# RakshaSetu — FINAL Master Build Prompt (v2)
*(Consolidated: backend contract + clean design system + Magic AI. Paste into Stitch for UI, Antigravity/MCP for the working build.)*

---

## 0. HOW TO USE
- **Stitch:** copy Section 3 (Design System) + one panel's spec from Section 4 per prompt. One screen at a time gives better results than the whole doc at once.
- **Antigravity (MCP connected):** paste this whole file as project context (`docs/FRONTEND_SPEC.md`), then: scaffold (Section 6) → shared UI kit → Citizen → Field Responder → Government/Apex → Admin. Re-read this file each session.

---

## 1. PROJECT SUMMARY
RakshaSetu — Disaster Preparedness & Emergency Response Platform. **4 panels**: Citizen (Safety App), Field Responder (Tactical Ops), Government/Apex Command (National Situation Room), Admin (Platform Control).

Backend is fixed (NestJS microservices, REST `/api/v1`, Socket.IO, Kafka, Keycloak JWT) — frontend must call the real contract in Section 5, no leftover mock logic. Non-negotiables: real JWT auth, real live sockets, offline-first Field Responder, fail-open SOS.

**Design mandate: clean over dense.** Every screen in this build must pass this test — remove one element, one border, one color, before shipping. Flat cards, no heavy shadows, no busy grid backgrounds, generous whitespace, one accent color doing the "urgent" work per screen, not five.

---

## 2. TECH STACK
React 18 + Vite/TS · Tailwind CSS · shadcn/ui + lucide-react icons · TanStack Query (server state) + Zustand (client state) · React Hook Form + Zod · socket.io-client · Mapbox GL JS · Recharts · Dexie.js (offline queue) · vite-plugin-pwa · i18next · keycloak-js/Axios-JWT-interceptor.

Fonts: **Space Grotesk** (headings, big numbers, panel titles — 600/700 weight only) + **Inter** (everything else — body, labels, nav, table data). Never mix in a third font.

---

## 3. DESIGN SYSTEM (clean baseline — use exactly this, don't drift into generic SaaS-card defaults)

### 3.1 Color tokens
| Token | Hex | Use |
|---|---|---|
| `critical` | `#DC3B33` | P1/critical severity, SOS, danger |
| `warning` | `#D98C1F` | P2/warning severity |
| `normal` | `#1E9E63` | resolved, safe, available |
| `info` | `#2F6FBF` | links, primary actions, brand accent |
| `ink` | `#12181F` | primary text on light, dark-panel background |
| `sub` | `#6B7684` | secondary text |
| `line` | `#EBEEF1` | hairline dividers only — used sparingly, not as a default border on every card |

Dark panels (Field Responder, optionally Government/Apex header strip) use `#10151D` base with `#171E29` flat cards — no borders, separation comes from background-shade contrast only, not outlines.
Light panels (Citizen, Admin) use `#FCFCFD`/`#FFFFFF` base with `#F7F8FA` flat cards, same rule — no borders unless truly needed for a form input.

### 3.2 Layout shell (every panel follows this — matches the real product structure)
```
┌───────────────────────────────────────────────────┐
│ TopBar: logo + panel badge | lang toggle | logout  │
├───────────────────────────────────────────────────┤
│ Banner: step number + panel name + one-line context│  ← colored strip, panel-specific tone
├───────────┬─────────────────────────────────────────┤
│  Sidebar  │  Content: stat row → primary content    │
│  (nav +   │  grid → secondary widgets                │
│  user id) │                                          │
└───────────┴─────────────────────────────────────────┘
```
- Sidebar: user identity block on top, then flat nav list — active item gets a filled pill background, nothing else (no left border accent, no icon color change beyond active state).
- Content: stat cards row first (flat, icon in a tinted 32px box, big Space Grotesk number, small Inter label) — then a 2–3 column grid for the panel's main widgets.

### 3.3 Motion — smooth, not decorative
Apply a single global transition (`background-color, box-shadow, transform, opacity` at `0.15s ease`) to all interactive elements. That's it — no per-card entrance animations, no staggered fades. Buttons get `active:scale-95`. Live-updating elements (queue re-sort, socket-driven values) use a brief highlight-flash on change, not a bounce.

### 3.4 "Magic AI" pattern (use anywhere the platform surfaces an AI suggestion — anomaly flags, route optimization, priority re-scoring, chatbot teaser)
Build this as **one shared component** (`MagicAICard`), not a copy-pasted block per panel — takes `text`, `cta` (default "Apply"), and a `dark` boolean so it auto-adapts to light panels (Citizen/Admin/Apex) vs dark panels (Field Responder):
- Flat card, very subtle two-stop gradient background (same hue family as the panel — `#171E29→#17202C` on dark, `#F3F7FC→#EFF4FB` on light — never a rainbow gradient)
- Small icon tile (40px, tinted background, a single accent-colored spark/star glyph — not a generic robot icon)
- One bold line ("Magic AI suggests"), one line of plain-language recommendation, one primary action button (button text can vary by context: "Apply", "Review", "Dismiss")
- Never stack more than one Magic AI card per screen — it should read as a single trusted assistant voice, not a notification feed

Reference copy per panel (tune wording, keep the pattern identical):
- **Citizen:** safety nudges — e.g. "Water level near your home is rising faster than usual — consider moving to [nearest shelter] before evening."
- **Field Responder:** operational suggestions — e.g. "Reroute Team Bravo via NH-27 — current route has 40% higher flood risk in next 2 hours."
- **Admin:** anomaly/ops flags — e.g. "Citizen reports in [zone] have spiked 3x above baseline in the last hour — likely an unflagged incident cluster." (cta: "Review")
- **Government/Apex:** strategic-level flags — e.g. resource-shortfall or escalation-risk predictions, cta: "Authorize" or "Review".

---

## 4. PANEL SPECS

### 4.1 Citizen (light, mobile-first, PWA)
Sidebar: Dashboard, Emergency Alerts, Report Incident, Relief Shelters, All Incidents, Safety Guides, Emergency Contacts, Daily Checklist, Feedback.
Content: location bar → [flood/critical alert card (2-col wide, solid `critical` fill), weather card, nearest shelter card] → [live safety map (2-col) + SOS/quick-actions column (1-col: SOS button styled as a solid critical card with the 112 number, then Report/Request Help/Check-in Safe rows)].
APIs: `GET /citizen/dashboard`, `POST /citizen/sos`, `POST /citizen/reports`, `GET /citizen/map/safety`, `POST /citizen/family-safety`, `POST /citizen/chat`, `GET /citizen/alerts`. Socket: `alerts.broadcast`, `map.incidents`.

### 4.2 Field Responder (dark, tactical, clean — no border-grid clutter)
Sidebar: Tactical HUD, Missions, Safe Water Routes, SOS Dispatches, Squads & Telemetry, Rescue Equipment, Relief Shelters.
Content: stat row (Active missions / Responders deployed / Critical alerts / Resources ready) → 3-col grid: Priority queue (flat mission cards, P-tag pill, no heavy border) | Tactical route map | Team status list (colored dot + status text only, no card-per-team clutter) → **one Magic AI card at the bottom** (e.g. reroute suggestion based on flood-risk prediction).
APIs: `GET /field/missions`, `POST /field/missions/{id}/verify`, `POST /field/missions/{id}/escalate`, `PUT /field/team/status`, `GET /field/navigation/{missionId}`, `POST /field/comms`. Socket: `mission.status`, `team.tracking`, `sos.alert`. **Offline:** queue verify/status/media mutations in Dexie when `team.tracking` socket disconnects; flush + show sync state on reconnect.

### 4.3 Government / Apex Command (light content area, dark top strip for command-room gravity)
Sidebar: Apex Situation Room, Tri-Services Mobilization, CWC River Danger Levels, SDRF & NDRF Treasury, National Directives, Critical Infrastructure, Cabinet SitRep Export, Command Hierarchy.
Content: 4 KPI cards with left color-bar accent (affected population, rescued/sheltered, forces deployed, relief fund) → 3-col force-status cards (Army/IAF/NDRF, each with one "+ Authorize" action) → river danger chart (2-col) + directives feed (1-col, flat cards, order number + one-line summary).
APIs: `GET /gov/dashboard/summary`, `GET /gov/map/live`, `GET /gov/resources`, `GET /gov/budget`, `GET /gov/analytics/trends`, `POST /gov/alerts`, `POST /gov/responders/deploy`. Socket: `map.incidents`, `alert.broadcast`, `anomaly.detected`.

### 4.4 Admin (light, quiet, boring-on-purpose)
Sidebar: Dashboard, User Directory, Role Management, System Audit Logs, Incident Management, Content & Advisories, Platform Analytics, Notification Gateway, External Integrations, Backup & Recovery, System Settings.
Content: two summary cards (Citizen/SOS panel oversight, Field Responder fleet oversight) → 5-stat row (users, incidents, departments, teams, uptime) → 2-col: overview chart | system health list (dot + "Operational" status, no card-per-service clutter).
APIs: `GET /admin/dashboard/status`, `GET /admin/users`, `POST /admin/users/{id}/role`, `GET /admin/audit-logs`, `PUT /admin/settings`, `POST /admin/backup/run`, `POST /admin/backup/{id}/restore`.

---

## 5. JS WIRING CONTRACT
- **Auth:** `POST /auth/login` → JWT access+refresh; Axios interceptor auto-refreshes on 401; route guards per role, nav items hidden per RBAC (Citizen/Government/FieldResponder/Admin).
- **REST:** all calls under `/api/v1`, `Authorization: Bearer <token>`; one typed `api/<panel>.ts` module per panel, 1:1 with the endpoint lists above — don't invent endpoints.
- **Sockets:** `map.incidents` (Gov/Citizen/Field maps), `team.tracking` (Gov/Field), `mission.status` (Field/Gov), `sos.alert` (Gov control room + nearest Field units), `alerts.broadcast` (Citizen, by zone). Reconnect = exponential backoff + REST re-fetch to reconcile state, never trust socket-only state after a gap.
- **Offline (Field Responder):** Dexie queue for verify/status/media mutations, `synced` flag, ordered flush on reconnect, visible per-item sync indicator.
- **Errors:** global `ApiError` shape, toast for recoverable errors; **SOS never blocks on error** — fallback to SMS/`tel:` deep link, matches backend's fail-open requirement.

---

## 6. REPO SCAFFOLD
```
rakshasetu-frontend/
  apps/ citizen/ government/ field-responder/ admin/
  packages/
    ui/            shared components: StatCard, SeverityBadge, MagicAICard (shared, light/dark variant via `dark` prop — do NOT reimplement per panel), LiveMap, PriorityQueueList, SOSButton, ConnectionStatusPill, SyncQueueIndicator
    api-client/    typed Axios modules per panel + auth
    sockets/       socket.io client + channel hooks
    offline-sync/  Dexie queue logic
    i18n/          translation resources
  tailwind.config.ts
  vite.config.ts
```

---

## 7. ACCEPTANCE CHECKLIST
- [ ] No screen uses mock arrays where a real endpoint from Section 4/5 exists.
- [ ] Every live-data screen subscribes to its socket channel and updates without refresh.
- [ ] Only ONE Magic AI card visible per screen, always the same visual pattern (Section 3.4), rendered via the shared `MagicAICard` component — not a hand-rolled copy per panel.
- [ ] No card has both a border AND a shadow AND a background tint — pick one separation method per surface.
- [ ] Field Responder verify/status actions survive airplane-mode + reconnect.
- [ ] All transitions use the single global 0.15s ease rule — no extra animation libraries added for decoration.
- [ ] Citizen app passes basic Lighthouse PWA + accessibility check.
- [ ] SOS button works and degrades gracefully offline.

---

## 8. STITCH SNIPPETS (paste one at a time)

> Design a **Field Responder Tactical HUD** dashboard. Dark theme (#10151D background, #171E29 flat cards, no borders — separation by shade only). Left sidebar with squad identity + flat nav list, active item as a filled pill. Top: 4 stat cards (active missions, responders deployed, critical alerts in soft red, resources ready in soft green). Below: 3-column row — priority mission queue (flat nested cards with P1/P2 pill tags), a tactical route map placeholder, a team status list (colored dot + label, no per-team card chrome). At the bottom, ONE "Magic AI suggests" card with a subtle gradient, a spark icon, one line of recommendation text, and an "Apply" button. Fonts: Space Grotesk for numbers/headers, Inter for everything else. Feel: calm, professional, control-room — not busy or gamified.

> Design a **Citizen Safety App home screen**, light theme, mobile width. Location bar on top. A red flood-warning card, a weather card, a nearest-shelter card in a row. Below: a live map card and, beside it, a solid-red SOS card showing "112" plus three quiet action rows (Report Incident, Request Help, Check-in Safe). Calm but urgent — minimal clutter, generous padding, Inter body text, Space Grotesk for the temperature/big numbers only.

*(Repeat this one-screen-per-prompt pattern for Government/Apex and Admin using Section 4.3 / 4.4 specs.)*

---

## 9. NOTES FOR ANTIGRAVITY / MCP SESSION
Build order: scaffold → `packages/ui` (build `MagicAICard` and `StatCard` first, they're reused everywhere) → Citizen (SOS path is highest priority) → Field Responder (offline sync is the highest-risk feature, build and test it in isolation) → Government/Apex → Admin. If the real backend isn't live yet, stub behind the identical endpoint/socket contract in Section 5 so swapping later needs zero frontend changes.
