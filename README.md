# 🛡️ RakshaSetu - Next-Gen Disaster Preparedness & Evacuation Response Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-green.svg)](https://leafletjs.com/)

**RakshaSetu** (रक्षासेतु / ৰক্ষাসেতু) is a comprehensive, multi-role, offline-first disaster response and evacuation management platform built to provide real-time situational awareness, geotagged incident reporting, automated relief shelter routing, and cross-departmental command coordination during extreme disaster events (Floods, Earthquakes, Landslides, Infrastructure Failures).

---

## 🌟 Key Features

### 👤 1. Citizen Safety Portal
- **Geotagged Incident Reporting**: Report flood level, structural collapse, or electrical hazards with live camera photo/video proof and auto-detected GPS coordinates.
- **My Report History (`report-history`)**: Track submitted citizen observation reports, view verification status badges (`VERIFIED`, `UNDER REVIEW`, `RESOLVED`), and monitor NDRF squad action logs.
- **Relief Shelters Map & Active Route Navigation**: Live geospatial radar map displaying active shelter capacity, occupied beds, amenities, and turn-by-turn navigation routes (`activeRouteTarget`) with elevation clearance.
- **Interactive Shelter Status Filters**: One-click filter pills (`ALL`, `OPEN`, `NEAR FULL`, `FULL`).
- **Daily Household Checklist**: Dynamic preparedness action plan with readiness score telemetry, interactive checkboxes, and custom task creation.
- **Safety & Evacuation Guides**: Step-by-step Standard Operating Procedures (SOPs) for floods, earthquakes, landslides, and electrical hazards with downloadable PDF pocket guides.
- **Direct Emergency Helpline Directory 112**: 24/7 one-touch emergency call buttons for National SOS (`112`), NDRF Operations (`1078`), SDMA (`1070`), and District Operations (`1079`).
- **AI Emergency Assistant**: Natural language disaster bot supporting location-based queries for nearest open shelters, road blockages, and first aid.
- **Personalized Alert Subscriptions**: Configure SMS, WhatsApp, App Push, Outdoor Siren, and Email warning preferences.

### 🚒 2. Field Responder Tactical Ops HUD
- **Squad Status Management**: Track assault boat units, drone recon squads, and de-watering teams in real-time (`ON SITE`, `EN ROUTE`, `AVAILABLE`).
- **Incident Verification Workflow**: Verify citizen reports with water depth telemetry, ground photos, and field notes.
- **Printable Disaster Report Generator**: Formal disaster incident report template with direct browser print capabilities (`window.print()`).
- **Push-To-Talk Voice Simulation**: Tactical radio channel communication simulation for rescue operations.

### 🏛️ 3. Government Disaster Command
- **Inter-Departmental Coordination**: Joint operational oversight across Water Resources, PWD, Health, Electricity Board, and NDRF.
- **Budget Approvals & Resource Allocation**: Expedited emergency relief funds allocation.
- **Live Geospatial Risk Map & AI Forecast Alerts**: Automated flood surge prediction and risk zone classification.

### ⚙️ 4. Admin & Super Admin Control
- **User & Role-Based Access Control (RBAC)**: Role switching (`CITIZEN`, `FIELD_RESPONDER`, `GOVERNMENT_OFFICER`, `ADMIN`, `SUPER_ADMIN`).
- **System Settings & Resource Records**: Full CRUD management, database backup scheduling, and platform configuration.
- **Audit Logs & External API Integration**: Complete system activity tracking and external weather/sensor API integration.

### 🌐 5. Multi-Language i18n Support
- Instant dynamic translation switching between **English (`en`)**, **Hindi (`hi`)**, and **Assamese (`as`)**.

### 📶 6. Dexie Offline-First Architecture
- Seamless offline mutation queueing during connectivity drops with background auto-synchronization when socket connection restores.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, TypeScript, Vite 5
- **Styling & Icons**: TailwindCSS, Lucide React
- **Geospatial Mapping**: Leaflet.js, OpenStreetMap, CartoDB Dark Tiles
- **State Management**: Zustand
- **Offline DB**: Dexie.js (IndexedDB wrapper)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Yash-Kumar-Mishra-Dev/TeamUnoReverse.git
   cd TeamUnoReverse
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for Production**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
rakshasetu-frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx            # Topbar with RBAC switcher, Language toggle & Socket status
│   │   ├── LiveMap.tsx           # Interactive Leaflet map with route polyline navigation
│   │   └── RegionSelector.tsx    # State & District location selector
│   ├── panels/
│   │   ├── citizen/              # Citizen Safety Portal & subtabs
│   │   ├── responder/            # Field Responder Tactical HUD & Report Print
│   │   ├── government/           # Government Command Center
│   │   ├── admin/                # Administrative Control Panel
│   │   ├── superadmin/           # Super Admin System Config
│   │   └── assets/               # Stitch Project Assets Panel
│   ├── store/
│   │   └── useAppStore.ts        # Zustand global store & Dexie offline queue
│   ├── utils/
│   │   └── translations.ts       # Multi-language dictionary (en, hi, as)
│   ├── types/
│   │   └── index.ts              # TypeScript interface definitions
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
