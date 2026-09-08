import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Role } from '../../types';
import { 
  Shield, AlertTriangle, PhoneCall, Layers, CheckCircle2, MapPin, 
  Sparkles, Radio, Lock, KeyRound, UserCheck, ArrowRight, Building2, 
  Terminal, Activity, Users, Clock, Globe, ShieldAlert, Cpu, HeartPulse,
  Send, ExternalLink, ChevronRight, Gauge, FileText
} from 'lucide-react';

export const AuthPanel: React.FC = () => {
  const { setUser, setPanel } = useAppStore();
  
  // Auth state
  const [email, setEmail] = useState('admin@rakshasetu.gov.in');
  const [role, setRole] = useState<Role>('SUPER_ADMIN');
  const [activeTab, setActiveTab] = useState<'citizen' | 'field' | 'apex' | 'admin'>('apex');
  const [showPlanModal, setShowPlanModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(email, role);

    if (role === 'SUPER_ADMIN') setPanel('superadmin');
    else if (role === 'ADMIN') setPanel('admin');
    else if (role === 'GOVERNMENT_OFFICER') setPanel('gov');
    else if (role === 'FIELD_RESPONDER') setPanel('responder');
    else if (role === 'CITIZEN') setPanel('citizen');
  };

  const handleLaunchPanel = (targetPanel: 'citizen' | 'responder' | 'gov' | 'superadmin', targetRole: Role) => {
    setUser(email, targetRole);
    setPanel(targetPanel);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* EMERGENCY BROADCAST BANNER (Fail-Safe Channel) */}
      <div className="w-full bg-red-700 text-white px-6 py-2 shadow-sm text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-white animate-pulse shrink-0" />
            <span className="font-bold tracking-wider uppercase">Priority Fail-Safe Channel:</span>
            <span>In immediate life-threatening flood or seismic danger? Dial directly:</span>
          </div>
          <div className="flex items-center gap-3 font-bold">
            <a href="tel:112" className="px-3 py-1 bg-white text-red-700 rounded shadow-2xs hover:bg-slate-100 transition flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>112 (Universal SOS)</span>
            </a>
            <a href="tel:1078" className="px-3 py-1 bg-red-800 text-white rounded shadow-2xs hover:bg-red-900 transition flex items-center gap-1">
              <span>1078 (NDRF Disaster Hotline)</span>
            </a>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative w-full px-6 py-12 lg:py-16 bg-gradient-to-b from-white via-blue-50/40 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          {/* Operational Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 shadow-2xs mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
            <span className="font-mono text-xs uppercase tracking-widest text-blue-700 font-bold">
              NATIONAL DISASTER COORDINATION INFRASTRUCTURE • ALL 4 OPERATIONAL TIERS ACTIVE
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl md:text-5xl max-w-5xl tracking-tight text-slate-900 font-extrabold leading-tight mb-4 font-sans">
            Unified Disaster Response, Rapid Evacuation & Emergency Command Hub
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-slate-600 max-w-3xl mb-8 leading-relaxed">
            A single, resilient fail-open platform connecting citizens in distress, field tactical rescue units, state & national apex command rooms, and infrastructure SecOps administrators under India's unified NDMA triage protocols.
          </p>

          {/* Primary Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <a 
              href="#operational-panels" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Explore 4 Operational Panels</span>
            </a>
            <button 
              onClick={() => handleLaunchPanel('citizen', 'CITIZEN')}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold rounded-xl text-xs shadow-2xs transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Citizen Web Access</span>
            </button>
            <a 
              href="tel:112" 
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Launch Emergency SOS 112 (Fail-Open)</span>
            </a>
          </div>

          {/* Live Architecture Telemetry Ticker */}
          <div className="w-full max-w-4xl p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-around gap-4 font-mono text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-bold text-slate-900">Keycloak OIDC JWT</span>
              <span className="text-slate-400">• RS256 Validated</span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-bold text-slate-900">PostGIS Real-time Mesh</span>
              <span className="text-slate-400">• 4 Node Replicated</span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-bold text-slate-900">Kafka Ingress:</span>
              <span className="text-emerald-600 font-bold">8.2k evt/s</span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-bold text-slate-900">LoRaWAN:</span>
              <span className="text-emerald-600 font-bold">433.9 MHz Beacon Live</span>
            </div>
          </div>
        </div>
      </section>

      {/* OPERATIONAL SUMMARY STAT BAR (4 Key National Metrics) */}
      <section className="w-full px-6 py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">Civilian Registry</span>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                1,482,904
              </div>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-2">
                <span className="text-emerald-600 font-bold">↑ 3.2% today</span>
                <span>Across 28 States & 8 UTs</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">Tactical Deployment</span>
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                48 Squads
              </div>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span className="font-bold text-slate-900">NDRF & SDRF</span>
                <span>Live Sector Ops</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">Infrastructure SLA</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-600">
                99.98%
              </div>
              <div className="text-xs text-slate-500 font-mono mt-2">
                Tier-4 Geo-Redundant Cluster
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">Telemetry Ingress</span>
                <Gauge className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                &lt; 42ms
              </div>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-2">
                <span className="text-emerald-600 font-bold">Kafka + Socket.IO</span>
                <span>Sub-second alerts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAGIC AI SUGGESTION COMPONENT */}
      <section className="w-full px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="p-5 rounded-xl shadow-2xs bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200/80 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-blue-900 text-sm">Magic AI Suggests</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold">Unified Cross-Panel Coordination Engine</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed max-w-4xl font-medium">
                    Monsoon hydrological crest detected in <strong className="text-red-600">Brahmaputra & Yamuna basins</strong>. Citizen distress reports (+3.4x spike) automatically correlated with CWC river gauge sensors. Pre-authorizing <strong className="text-blue-700">NDRF 8th Battalion staging near Sector 9 embankment</strong> with dual motorized Zodiac units.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                <button 
                  onClick={() => setShowPlanModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-2xs transition flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>View Automated Coordination Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE 4 OPERATIONAL PANELS HUB (Main Showcase Grid) */}
      <section className="w-full px-6 py-10 bg-slate-50" id="operational-panels">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">Multi-Tier Architecture</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-sans">
                Four Dedicated Incident Operations Consoles
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Role-isolated, synchronized interfaces built for low-bandwidth resilience, hardware-token verification, and instant situational execution.
            </p>
          </div>

          {/* 4 Panel Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PANEL 01: Citizen Safety App & Web */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold uppercase">
                        PUBLIC ACCESS • PWA & WEB
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" /> LIVE
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Panel 01: Citizen Safety & Rescue Portal
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Target: Citizens in floodplains, evacuees, stranded families, community volunteers
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                </div>

                {/* Capabilities List */}
                <div className="space-y-2 text-xs text-slate-600 border-t pt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Multi-Language Broadcast:</strong> Hindi, Assamese, Bengali, English</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Offline Dexie.js Storage:</strong> Local IndexedDB caches maps & shelters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>LoRa Beacon Fallback:</strong> Pings offline SOS packets via 433MHz nodes</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleLaunchPanel('citizen', 'CITIZEN')}
                className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-2xs transition flex items-center justify-center gap-2"
              >
                <span>Launch Citizen Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PANEL 02: Field Tactical Ops HUD */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-mono text-[10px] font-bold uppercase">
                        TACTICAL FORCES • SECURE HWID LINK
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" /> SYNCED
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Panel 02: Field Tactical Rescue Ops HUD
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Target: NDRF Battalions, SDRF Flood Teams, Quick Response Teams (QRT), Boat Squads
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>

                {/* Capabilities List */}
                <div className="space-y-2 text-xs text-slate-600 border-t pt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Dynamic Triage Engine (P1-P4):</strong> Real-time priority updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Safe Navigation Corridors:</strong> Bathymetric river clearance routing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>PTT & Sync on Reconnect:</strong> Push-to-talk field voice & auto Dexie merge</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleLaunchPanel('responder', 'FIELD_RESPONDER')}
                className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-2xs transition flex items-center justify-center gap-2"
              >
                <span>Launch Tactical HUD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PANEL 03: Apex Government Command Center */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold uppercase">
                        APEX COMMAND • TIER-3 CLEARANCE
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" /> SITREP READY
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Panel 03: Apex Multi-Agency Command Center
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Target: NDMA Apex Committee, State Relief Commissioners, District Magistrates (DM)
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Capabilities List */}
                <div className="space-y-2 text-xs text-slate-600 border-t pt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>CAP v1.2 Warning Broadcast:</strong> Direct triggers for sirens & SMS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Spatial Resource Allocation:</strong> GIS-layering of fuel, food & helicopters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>SDRF Relief Treasury Tracking:</strong> Digital voucher audit trail under NDMA</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleLaunchPanel('gov', 'GOVERNMENT_OFFICER')}
                className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-2xs transition flex items-center justify-center gap-2"
              >
                <span>Launch Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PANEL 04: Admin & SecOps Control */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-mono text-[10px] font-bold uppercase">
                        SUPERUSER ROOT • L4 INFRASTRUCTURE
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" /> ENCRYPTED
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Panel 04: Admin & SecOps Telemetry Control
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Target: Platform Infrastructure Architects, SecOps Engineers, CERT-In Auditors
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Terminal className="w-5 h-5" />
                  </div>
                </div>

                {/* Capabilities List */}
                <div className="space-y-2 text-xs text-slate-600 border-t pt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Role-Based Access Control (RBAC):</strong> Hardware permissions & audit log</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Prometheus & Grafana Telemetry:</strong> Microsecond latency tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Automated Cold Backups:</strong> Immutable snapshots for Tier-IV mandate</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleLaunchPanel('superadmin', 'SUPER_ADMIN')}
                className="mt-6 w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-lg shadow-2xs transition flex items-center justify-center gap-2"
              >
                <span>Launch Admin Control</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATED MULTI-ROLE KEYCLOAK AUTHENTICATION GATEWAY */}
      <section className="w-full px-6 py-12 bg-white border-t border-slate-200" id="keycloak-gateway">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-bold uppercase mb-2">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Zero Trust Infrastructure Access</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Unified Multi-Role Auth Gateway
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto mt-1">
              Simulate instantaneous token validation across citizen, tactical responder, apex authority, and infrastructure root access tiers.
            </p>
          </div>

          {/* Interactive Tabbed Gateway Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Tab Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-100 p-1.5 gap-1 font-mono text-xs">
              <button 
                onClick={() => { setActiveTab('citizen'); setRole('CITIZEN'); setEmail('citizen@rakshasetu.gov.in'); }}
                className={`py-2 px-3 rounded-lg font-bold transition text-center ${
                  activeTab === 'citizen' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Citizen Access
              </button>
              <button 
                onClick={() => { setActiveTab('field'); setRole('FIELD_RESPONDER'); setEmail('responder@ndrf.gov.in'); }}
                className={`py-2 px-3 rounded-lg font-bold transition text-center ${
                  activeTab === 'field' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Field Squad
              </button>
              <button 
                onClick={() => { setActiveTab('apex'); setRole('GOVERNMENT_OFFICER'); setEmail('command@ndma.gov.in'); }}
                className={`py-2 px-3 rounded-lg font-bold transition text-center ${
                  activeTab === 'apex' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Apex Commander
              </button>
              <button 
                onClick={() => { setActiveTab('admin'); setRole('SUPER_ADMIN'); setEmail('admin@rakshasetu.gov.in'); }}
                className={`py-2 px-3 rounded-lg font-bold transition text-center ${
                  activeTab === 'admin' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                SecOps Admin
              </button>
            </div>

            {/* Login Form Body */}
            <div className="p-6 md:p-8">
              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">User Identity / Email</label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">RBAC Role Context</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as Role)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-bold text-xs"
                    >
                      <option value="CITIZEN">CITIZEN — Safety App, Media Upload & SOS</option>
                      <option value="FIELD_RESPONDER">FIELD_RESPONDER — Tactical Ops HUD & Queue</option>
                      <option value="GOVERNMENT_OFFICER">GOVERNMENT_OFFICER — Command Center & Hydrograph</option>
                      <option value="ADMIN">ADMIN — Users, Incidents, Sensors & Alerts</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN — Platform Control & AI Config</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>JWT RSA256 Token Signature Verified</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Authenticate & Launch Console</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-slate-900 text-slate-400 px-6 py-8 text-xs font-mono border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white">© 2026 RakshaSetu Portal. Ministry of Home Affairs, Govt. of India.</span>
            <div className="text-[11px] text-slate-500 mt-1">STQC / CERT-In Certified Tier-IV Compliant Infrastructure</div>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Data Privacy Directive</a>
            <a href="#" className="hover:text-white transition">CAP v1.2 Protocol</a>
          </div>
        </div>
      </footer>

      {/* AUTOMATED PLAN MODAL */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" /> Automated Coordination Plan
              </h3>
              <button onClick={() => setShowPlanModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-base">✕</button>
            </div>
            <div className="space-y-2 font-mono text-slate-700">
              <div className="p-2.5 bg-slate-50 rounded border">
                <strong>1. Trigger:</strong> Hydrological sensor breach (+2.1m crest) in Sector 9.
              </div>
              <div className="p-2.5 bg-slate-50 rounded border">
                <strong>2. Auto Action:</strong> NDRF 8th Battalion deployed with 2 Zodiac boats.
              </div>
              <div className="p-2.5 bg-slate-50 rounded border">
                <strong>3. CAP Broadcast:</strong> Level-3 Flash Flood Advisory pushed via SMS to 84,000 citizens.
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setShowPlanModal(false)} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg">
                Close Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
