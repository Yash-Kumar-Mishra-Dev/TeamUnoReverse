import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ResponderSubTab } from '../../types';
import { 
  LayoutGrid, AlertOctagon, Map, CheckSquare, ShieldCheck, 
  Wifi, RefreshCw, Radio, Users, CheckCircle2, TrendingUp,
  AlertTriangle, Navigation, Edit3, ArrowRight, Layers, Plus, 
  Minus, Target, Mic, Sparkles, Droplets, Home, Activity,
  Printer, FileText, Download, Check, XCircle, Search, Clock, 
  MapPin, Eye, FileCheck, PhoneCall, LogOut, Send, AlertCircle, Shield
} from 'lucide-react';
import { LiveMap } from '../../components/LiveMap';
import { RegionSelector } from '../../components/RegionSelector';

interface SquadStatus {
  id: string;
  name: string;
  leader: string;
  status: 'AVAILABLE' | 'EN ROUTE' | 'ON SITE' | 'RETURNING' | 'MAINTENANCE';
  personnel: number;
  location: string;
  gps: string;
  channel: string;
  equipment: string;
  batteryFuel: string;
}

interface IncidentVerification {
  id: string;
  title: string;
  citizenLocation: string;
  reportedTime: string;
  initialCategory: string;
  verificationStatus: 'UNVERIFIED' | 'VERIFIED CRITICAL' | 'VERIFIED STABLE' | 'FALSE ALARM' | 'RESOLVED';
  waterDepth: string;
  fieldNotes: string;
  verifiedBy: string;
}

export const ResponderPanel: React.FC = () => {
  const { subTabs, setResponderSubTab, setPanel, isOffline, toggleOffline, offlineQueue } = useAppStore();
  const currentTab = subTabs.responder;

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Push-To-Talk Voice Transmitting State
  const [isTalking, setIsTalking] = useState(false);
  const [showAiBanner, setShowAiBanner] = useState(true);

  // 1. Team Status Management State
  const [squads, setSquads] = useState<SquadStatus[]>([
    {
      id: 'SQ-01',
      name: 'Team Bravo-04 (Your Squad)',
      leader: 'Inspector R. Kalita',
      status: 'ON SITE',
      personnel: 12,
      location: 'Sector 9 Yamuna Basin Terrace',
      gps: '28.6139° N, 77.2090° E',
      channel: 'CH-04 TACTICAL (433.9 MHz)',
      equipment: '2 Assault Inflatable Boats, Sonar, Trauma Kit',
      batteryFuel: '92% Fuel / 88% Battery'
    },
    {
      id: 'SQ-02',
      name: 'Alpha-01 Strike Team',
      leader: 'Captain S. Vardhan',
      status: 'EN ROUTE',
      personnel: 16,
      location: 'NH-27 Bypass Corridor',
      gps: '28.6210° N, 77.2140° E',
      channel: 'CH-01 COMMAND (433.1 MHz)',
      equipment: 'Heavy De-Watering Pump, Winch Truck',
      batteryFuel: '78% Fuel / 95% Battery'
    },
    {
      id: 'SQ-03',
      name: 'Delta-02 Aerial Recon Squad',
      leader: 'Lt. M. Phukan',
      status: 'AVAILABLE',
      personnel: 6,
      location: 'Heli-Deck Base Alpha',
      gps: '28.6050° N, 77.2300° E',
      channel: 'AIR-OPS 108',
      equipment: '4 Thermal Aerial Drones, Satellite Link',
      batteryFuel: '68% Drone Battery'
    },
    {
      id: 'SQ-04',
      name: 'Charlie-03 Motorboat Rescue',
      leader: 'Sub-Insp T. Das',
      status: 'ON SITE',
      personnel: 10,
      location: 'Old Bridge Substation Sector',
      gps: '28.5840° N, 77.2980° E',
      channel: 'CH-03 RESCUE',
      equipment: '3 Motorized Assault Boats, Life Vests',
      batteryFuel: '84% Fuel / 90% Battery'
    }
  ]);

  const [selectedSquadId, setSelectedSquadId] = useState('SQ-01');

  // 2. Incident Verification State
  const [incidents, setIncidents] = useState<IncidentVerification[]>([
    {
      id: 'INC-801',
      title: 'Terrace Flood Trap — 6 Civilians Stranded',
      citizenLocation: 'Sector 9 Residential, Block C-4',
      reportedTime: '6m ago',
      initialCategory: 'Severe Waterlogging / Rising Flood',
      verificationStatus: 'VERIFIED CRITICAL',
      waterDepth: '2.7m',
      fieldNotes: 'Confirmed rooftop evacuation needed. Surge rate +1.2m/hr. Motorboat deployed.',
      verifiedBy: 'Inspector R. Kalita'
    },
    {
      id: 'INC-802',
      title: 'Substation Transformer Electrical Sparks',
      citizenLocation: 'Old Bridge Substation Sector',
      reportedTime: '18m ago',
      initialCategory: 'Electrical / Infrastructure Hazard',
      verificationStatus: 'UNVERIFIED',
      waterDepth: '1.4m',
      fieldNotes: 'Citizen reported loud popping. Power grid de-energization requested.',
      verifiedBy: 'Pending Field Inspection'
    },
    {
      id: 'INC-803',
      title: 'Bridge Structural Fracture Warning',
      citizenLocation: 'NH-44 Crossing Elevation Zone',
      reportedTime: '32m ago',
      initialCategory: 'Structural Damage & Collapse',
      verificationStatus: 'VERIFIED STABLE',
      waterDepth: '0.8m',
      fieldNotes: 'Bridge pillar 3 has minor crack. Traffic cordoned. No immediate collapse risk.',
      verifiedBy: 'Captain S. Vardhan'
    },
    {
      id: 'INC-804',
      title: 'Submerged Vehicle False Alarm Report',
      citizenLocation: 'Block B Bypass Road',
      reportedTime: '45m ago',
      initialCategory: 'Submerged Vehicle Trap',
      verificationStatus: 'FALSE ALARM',
      waterDepth: '0.3m',
      fieldNotes: 'Vehicle was parked on elevated pavement. Owner safely retrieved car.',
      verifiedBy: 'Lt. M. Phukan'
    }
  ]);

  const [selectedIncId, setSelectedIncId] = useState<string | null>('INC-802');
  const [verifyStatusInput, setVerifyStatusInput] = useState<'VERIFIED CRITICAL' | 'VERIFIED STABLE' | 'FALSE ALARM' | 'RESOLVED'>('VERIFIED CRITICAL');
  const [verifyDepthInput, setVerifyDepthInput] = useState('2.1m');
  const [verifyNotesInput, setVerifyNotesInput] = useState('');

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handler: Update Squad Status
  const handleUpdateSquadStatus = (newStatus: SquadStatus['status']) => {
    setSquads(squads.map(s => s.id === selectedSquadId ? { ...s, status: newStatus } : s));
    showToast(`Squad ${selectedSquadId} status updated to ${newStatus}!`);
  };

  // Handler: Submit Incident Field Verification
  const handleSaveVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncId) return;

    setIncidents(incidents.map(inc => {
      if (inc.id === selectedIncId) {
        return {
          ...inc,
          verificationStatus: verifyStatusInput,
          waterDepth: verifyDepthInput,
          fieldNotes: verifyNotesInput || inc.fieldNotes,
          verifiedBy: 'Inspector R. Kalita (Bravo-04)'
        };
      }
      return inc;
    }));

    showToast(`Incident ${selectedIncId} verified as ${verifyStatusInput} & synced to Command!`);
    setVerifyNotesInput('');
  };

  // Handler: Trigger Report Print
  const handlePrintReport = () => {
    window.print();
  };

  const tabs: { id: ResponderSubTab; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'Tactical HUD', icon: LayoutGrid },
    { id: 'team-status', label: 'Team Status Update', icon: ShieldCheck, badge: 'Live' },
    { id: 'verification', label: 'Incident Verification', icon: FileCheck, badge: '4 Pending' },
    { id: 'reports', label: 'Mission Reports & Print', icon: Printer },
    { id: 'queue', label: 'Missions Queue', icon: AlertOctagon },
    { id: 'live-map', label: 'Safe Water Routes', icon: Map },
    { id: 'missions', label: 'SOS Dispatches', icon: CheckSquare },
    { id: 'resources', label: 'Squads & Equipment', icon: Users }
  ];

  const currentSquad = squads.find(s => s.id === selectedSquadId) || squads[0];
  const currentIncident = incidents.find(i => i.id === selectedIncId);

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#F8FAFC] text-[#0F172A] min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3 animate-slide-in font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar matching Stitch Light Theme */}
      <aside className="w-full md:w-72 bg-white border-r border-[#E2E8F0] p-4 flex flex-col justify-between shrink-0 shadow-sm z-20 print:hidden">
        <div className="space-y-4">
          {/* Header Badge */}
          <div 
            onClick={() => setPanel('auth')}
            className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl space-y-1 cursor-pointer hover:bg-slate-100 transition-colors"
            title="Exit to Portal Hub"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-700 tracking-wider uppercase">FIELD RESPONDER HQ</span>
              <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                ACTIVE
              </span>
            </div>
            <div className="text-base font-bold text-[#0F172A] truncate">Sector 9 Yamuna Basin</div>
            <div className="text-xs text-[#64748B] flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>Ops Status: <strong className="text-emerald-700 font-bold">{currentSquad.status}</strong></span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Tactical Ops Navigation
            </div>
            <nav className="space-y-1">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = currentTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setResponderSubTab(t.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between font-semibold transition-all text-xs ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </div>
                    {t.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                        isActive ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {t.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer Widgets */}
        <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
          {/* Radio Widget */}
          <div className="flex items-center justify-between bg-slate-50 border border-[#E2E8F0] p-2.5 rounded-lg">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="flex flex-col text-xs">
                <span className="font-bold text-[#0F172A]">Mesh Radio</span>
                <span className="text-[10px] text-[#64748B]">CH-04 TACTICAL (433.9 MHz)</span>
              </div>
            </div>
          </div>

          {/* Dexie Offline Toggle */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-medium text-[#0F172A]">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <span>Dexie Offline Store</span>
            </div>
            <button
              onClick={toggleOffline}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                isOffline ? 'bg-amber-500' : 'bg-blue-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isOffline ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button 
            onClick={() => {
              if (window.confirm('Exit Field Responder Panel?')) setPanel('auth');
            }}
            className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold font-mono transition-colors text-center flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-600" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Strip */}
        <header className="bg-white/95 backdrop-blur border-b border-[#E2E8F0] sticky top-0 z-10 shadow-xs print:hidden">
          <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 tracking-wider">
                FIELD RESPONDER TACTICAL OPS PORTAL
              </span>

              {/* State & District / City Selector Widget */}
              <RegionSelector onRegionChange={(st, dist) => showToast(`Field Operations scope set to ${st} • ${dist}`)} />
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] border border-emerald-200 text-[#16A34A] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
                <span>SOCKET: CONNECTED [18ms]</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                <span>DEXIE QUEUE: {offlineQueue.length === 0 ? 'SYNCED (0 PENDING)' : `${offlineQueue.length} PENDING`}</span>
              </div>

              <div className="h-6 w-px bg-slate-200" />

              <div className="text-right">
                <div className="font-bold text-[#0F172A]">{currentSquad.name}</div>
                <div className="text-[10px] text-[#64748B]">{currentSquad.leader}</div>
              </div>
            </div>
          </div>

          {/* Sub banner status strip */}
          <div className="px-6 py-1.5 bg-slate-50 flex flex-wrap items-center justify-between text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded bg-amber-500" />
              <span className="font-bold text-amber-700">STATUS:</span>
              <span className="font-bold text-slate-900">{currentSquad.status}</span>
              <span>•</span>
              <span className="font-medium text-slate-700">Ground Unit Telemetry, Active Dispatches & Evacuation Corridors</span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <span>GRID: {currentSquad.gps}</span>
              <span>RADIO: <strong className="text-emerald-700">{currentSquad.channel}</strong></span>
            </div>
          </div>
        </header>

        {/* Dashboard / Subtabs Content */}
        <div className="p-6 space-y-6">
          
          {/* ========================================================= */}
          {/* 1. DASHBOARD TACTICAL HUD                                  */}
          {/* ========================================================= */}
          {currentTab === 'dashboard' && (
            <>
              {/* 4 Stat KPI Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#64748B] tracking-widest uppercase">Active Missions</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-[#0F172A]">14</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                      4 En Route
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-[#64748B]">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>+3 dispatched last 30 mins</span>
                  </div>
                </div>

                <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#64748B] tracking-widest uppercase">Responders Deployed</span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-[#0F172A]">128</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                      8 Battalions
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[#64748B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    <span>NDRF & SDRF strike force in Sector 9</span>
                  </div>
                </div>

                <div className="bg-white border border-rose-200 p-4 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#DC2626] tracking-widest uppercase">Critical Alerts (P1)</span>
                    <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] border border-rose-200 flex items-center justify-center text-[#DC2626]">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-[#DC2626]">6</span>
                    <span className="px-2 py-0.5 rounded bg-[#FEE2E2] border border-rose-300 text-[#DC2626] text-xs font-bold animate-pulse">
                      2 Unassigned
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-[#DC2626] font-medium">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Immediate surge response mandatory</span>
                  </div>
                </div>

                <div className="bg-white border border-emerald-200 p-4 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#64748B] tracking-widest uppercase">Resources Ready</span>
                    <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] border border-emerald-200 flex items-center justify-center text-[#16A34A]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-xl font-bold text-[#0F172A]">
                      42 <span className="text-xs font-normal text-[#64748B]">Boats</span> / 18 <span className="text-xs font-normal text-[#64748B]">Drones</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#DCFCE7] border border-emerald-300 text-[#16A34A] text-xs font-bold">
                      Operational
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[#64748B]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Telemetry online via Mesh 433MHz</span>
                  </div>
                </div>
              </div>

              {/* 3-Column Main Dashboard Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs flex flex-col space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#DC2626]" />
                      <h2 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">Priority Missions</h2>
                    </div>
                    <span className="font-semibold text-emerald-700 text-xs">LIVE SORT</span>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-50 border border-[#E2E8F0] p-3 rounded-lg space-y-2 relative overflow-hidden hover:bg-blue-50/40 transition-colors">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#DC2626]" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2 py-0.5 rounded bg-[#FEE2E2] border border-rose-200 text-[#DC2626] font-bold">P1 CRITICAL</span>
                        <span className="text-blue-600 font-semibold flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" /> Ready to sync
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-[#0F172A] text-sm">Terrace Flood Evacuation</div>
                        <div className="text-xs text-slate-600 mt-0.5">Yamuna Sector 9, Block C-4 • 6 Civilians stranded</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button 
                          onClick={() => setResponderSubTab('verification')} 
                          className="px-3 py-1.5 rounded bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors shadow-xs"
                        >
                          <FileCheck className="w-3.5 h-3.5" /> Verify Incident
                        </button>
                        <button 
                          onClick={() => showToast('Escalated to Surge Team!')} 
                          className="px-3 py-1.5 rounded bg-rose-50 border border-rose-300 text-[#DC2626] font-semibold text-xs flex items-center justify-center gap-1 hover:bg-[#DC2626] hover:text-white transition-colors"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Escalate
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#64748B] border-t border-[#E2E8F0]">
                    <button onClick={() => setResponderSubTab('queue')} className="text-blue-600 hover:underline flex items-center gap-1 font-bold">
                      View All 14 Missions <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs flex flex-col space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-blue-600" />
                      <h2 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">Tactical Sonar & Live Map</h2>
                    </div>
                  </div>

                  <LiveMap height="h-[360px]" darkTheme={false} tacticalOverlay={true} />
                </div>

                <div className="lg:col-span-3 bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <h2 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider">Squad Telemetry</h2>
                      </div>
                      <button onClick={() => setResponderSubTab('team-status')} className="text-blue-600 font-bold text-xs hover:underline">
                        Manage
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      {squads.map(sq => (
                        <div key={sq.id} className="p-2.5 rounded-lg bg-slate-50 border border-[#E2E8F0]">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-[#0F172A]">{sq.name}</span>
                            <span className={`text-[10px] font-bold ${
                              sq.status === 'ON SITE' ? 'text-emerald-600' :
                              sq.status === 'EN ROUTE' ? 'text-blue-600' :
                              'text-slate-600'
                            }`}>{sq.status}</span>
                          </div>
                          <div className="text-[10px] text-[#64748B] mt-0.5">{sq.location}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl space-y-2">
                    <button
                      onMouseDown={() => setIsTalking(true)}
                      onMouseUp={() => setIsTalking(false)}
                      onTouchStart={() => setIsTalking(true)}
                      onTouchEnd={() => setIsTalking(false)}
                      className={`w-full py-2.5 rounded-lg border font-bold flex items-center justify-center gap-2 transition-all shadow-xs text-xs ${
                        isTalking ? 'bg-amber-600 text-white border-amber-700 animate-pulse' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
                      }`}
                    >
                      <Mic className={`w-4 h-4 ${isTalking ? 'text-white' : 'text-amber-600'}`} />
                      <span>{isTalking ? 'TRANSMITTING VOICE...' : 'HOLD TO TALK (PTT CH-04)'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* 2. TEAM STATUS UPDATE SUBTAB                              */}
          {/* ========================================================= */}
          {currentTab === 'team-status' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Field Squad & Team Status Management</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update live operational status, location coordinates, radio channel, and equipment availability.
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-mono text-xs font-bold">
                  Active Squad: {currentSquad.name}
                </span>
              </div>

              {/* Squad Selection Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {squads.map(sq => (
                  <div 
                    key={sq.id} 
                    onClick={() => setSelectedSquadId(sq.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                      selectedSquadId === sq.id 
                        ? 'bg-blue-50/70 border-blue-600 shadow-md ring-2 ring-blue-500/20' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-500">{sq.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sq.status === 'ON SITE' ? 'bg-emerald-100 text-emerald-800' :
                        sq.status === 'EN ROUTE' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {sq.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{sq.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Leader: {sq.leader}</p>
                    </div>

                    <div className="space-y-1 text-xs font-mono pt-2 border-t border-slate-200/80">
                      <div className="flex justify-between"><span>Personnel:</span><strong className="text-slate-900">{sq.personnel} Responders</strong></div>
                      <div className="flex justify-between"><span>Location:</span><span className="text-slate-700 truncate max-w-[140px]">{sq.location}</span></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Update Form */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
                <h3 className="font-bold text-slate-900 text-base border-b pb-3 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  Update Operational Status for <span className="text-blue-700">{currentSquad.name}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(['AVAILABLE', 'EN ROUTE', 'ON SITE', 'RETURNING', 'MAINTENANCE'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateSquadStatus(st)}
                      className={`py-3 px-4 rounded-xl border font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                        currentSquad.status === st 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{st}</span>
                      <span className="text-[10px] font-normal opacity-80">
                        {st === 'ON SITE' ? 'Performing Rescue' : st === 'EN ROUTE' ? 'Transit to GPS' : 'Standby Base'}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-slate-500 block text-[10px]">CURRENT GPS GRID</span>
                      <strong className="text-slate-900 text-sm">{currentSquad.gps}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">RADIO CHANNEL</span>
                      <strong className="text-blue-700 text-sm">{currentSquad.channel}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">EQUIPMENT TELEMETRY</span>
                      <strong className="text-emerald-700 text-sm">{currentSquad.batteryFuel}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. INCIDENT VERIFICATION SUBTAB                           */}
          {/* ========================================================= */}
          {currentTab === 'verification' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">On-Site Field Incident Verification</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Inspect citizen reports, record water depth, tag verification status, and sync field notes with Command.
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded font-mono text-xs font-bold">
                  {incidents.filter(i => i.verificationStatus === 'UNVERIFIED').length} Pending Inspection
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Incident List Column (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Select Incident to Verify</div>
                  {incidents.map(inc => (
                    <div
                      key={inc.id}
                      onClick={() => setSelectedIncId(inc.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        selectedIncId === inc.id
                          ? 'bg-blue-50/80 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900">{inc.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inc.verificationStatus === 'VERIFIED CRITICAL' ? 'bg-red-100 text-red-700' :
                          inc.verificationStatus === 'VERIFIED STABLE' ? 'bg-emerald-100 text-emerald-800' :
                          inc.verificationStatus === 'FALSE ALARM' ? 'bg-slate-200 text-slate-700' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {inc.verificationStatus}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{inc.title}</h4>
                      <div className="text-xs text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{inc.citizenLocation}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verification Form Column (7 cols) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
                  {currentIncident ? (
                    <form onSubmit={handleSaveVerification} className="space-y-4 text-xs">
                      <div className="border-b pb-3">
                        <span className="font-mono text-xs font-bold text-blue-700">{currentIncident.id}</span>
                        <h3 className="text-base font-bold text-slate-900">{currentIncident.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">Location: {currentIncident.citizenLocation} • Reported: {currentIncident.reportedTime}</p>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Set Field Verification Status</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['VERIFIED CRITICAL', 'VERIFIED STABLE', 'FALSE ALARM', 'RESOLVED'] as const).map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setVerifyStatusInput(st)}
                              className={`py-2 px-3 rounded-lg border font-bold text-xs transition-all ${
                                verifyStatusInput === st
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">On-Site Water Depth Reading</label>
                        <input
                          type="text"
                          value={verifyDepthInput}
                          onChange={e => setVerifyDepthInput(e.target.value)}
                          placeholder="e.g. 2.1m"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Responder Inspection Notes</label>
                        <textarea
                          rows={4}
                          value={verifyNotesInput}
                          onChange={e => setVerifyNotesInput(e.target.value)}
                          placeholder="Enter ground observation details, structural damage status, and personnel required..."
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Submit Field Verification & Sync Command</span>
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-12 text-slate-500">Select an incident from the left queue to verify.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. MISSION REPORTS & PRINT SUBTAB                         */}
          {/* ========================================================= */}
          {currentTab === 'reports' && (
            <div className="space-y-6">
              {/* Print Controls Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs print:hidden">
                <div>
                  <div className="flex items-center gap-2">
                    <Printer className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Tactical Ops Mission Reports</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official field operations log, casualty extraction record, and print-ready mission summary.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintReport}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Tactical Report</span>
                  </button>
                  <button
                    onClick={() => showToast('Mission Log CSV downloaded to local disk!')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
              <div className="printable-report-document bg-white p-8 md:p-10 rounded-xl border border-slate-300 shadow-md space-y-6 text-slate-900 font-sans print:shadow-none print:border-none print:p-0">
                {/* Official Government Header & Emblem */}
                <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                      <Shield className="w-7 h-7 text-blue-400" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs uppercase tracking-widest text-blue-900 font-mono">
                        GOVERNMENT OF INDIA • NATIONAL DISASTER RESPONSE FORCE
                      </div>
                      <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                        APEX FIELD OPERATIONS & INCIDENT SITUATION REPORT (SITREP)
                      </h1>
                      <div className="text-xs text-slate-600 font-mono">
                        Sector 9 Yamuna Basin Command • Operative Unit: NDRF 8th Battalion
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right font-mono text-xs space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200 shrink-0">
                    <div className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px] inline-block border border-red-200">
                      RESTRICTED / OFFICIAL USE ONLY
                    </div>
                    <div className="font-bold text-slate-900">DOC REF: #SITREP-2026-0907-YAMUNA</div>
                    <div className="text-slate-600">DATE: 07 SEP 2026 • 22:50 IST</div>
                  </div>
                </div>

                {/* Executive Operations Summary */}
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono text-slate-500">
                    1. Executive Operational Metrics Summary
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
                    <div className="space-y-0.5">
                      <span className="text-slate-500 text-[10px] block font-bold">TOTAL MISSIONS EXECUTED</span>
                      <strong className="text-slate-900 text-base font-extrabold">14 Operations</strong>
                      <span className="text-emerald-700 text-[10px] block">100% Target Met</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-500 text-[10px] block font-bold">CIVILIANS EVACUATED</span>
                      <strong className="text-emerald-700 text-base font-extrabold">128 Rescued</strong>
                      <span className="text-slate-600 text-[10px] block">0 Casualties Reported</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-500 text-[10px] block font-bold">VERIFIED INCIDENTS</span>
                      <strong className="text-blue-700 text-base font-extrabold">18 Inspected</strong>
                      <span className="text-blue-600 text-[10px] block">Command Synced</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-500 text-[10px] block font-bold">FIELD READINESS INDEX</span>
                      <strong className="text-emerald-700 text-base font-extrabold">94.2% Nominal</strong>
                      <span className="text-slate-600 text-[10px] block">L-Band Radio Sync</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Incident Verification Ledger */}
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono text-slate-500">
                    2. Ground Incident Inspection & Verification Ledger
                  </h3>
                  <div className="overflow-x-auto border border-slate-300 rounded-lg">
                    <table className="w-full text-left border-collapse font-sans text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-mono text-slate-700 uppercase">
                          <th className="p-2.5 border-r border-slate-200">REF ID</th>
                          <th className="p-2.5 border-r border-slate-200">Incident Description</th>
                          <th className="p-2.5 border-r border-slate-200">Location / Grid</th>
                          <th className="p-2.5 border-r border-slate-200">Water Depth</th>
                          <th className="p-2.5 border-r border-slate-200">Verification Status</th>
                          <th className="p-2.5">Inspector & Field Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                        {incidents.map(inc => (
                          <tr key={inc.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">{inc.id}</td>
                            <td className="p-2.5 text-slate-900 font-sans font-semibold border-r border-slate-200">{inc.title}</td>
                            <td className="p-2.5 text-slate-700 border-r border-slate-200">{inc.citizenLocation}</td>
                            <td className="p-2.5 font-bold text-blue-700 border-r border-slate-200">{inc.waterDepth}</td>
                            <td className="p-2.5 border-r border-slate-200">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                inc.verificationStatus === 'VERIFIED CRITICAL' ? 'bg-red-100 text-red-800 border border-red-300' :
                                inc.verificationStatus === 'VERIFIED STABLE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                'bg-slate-100 text-slate-700 border border-slate-300'
                              }`}>
                                {inc.verificationStatus}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-700 font-sans text-[10px]">{inc.verifiedBy}: {inc.fieldNotes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Resource & Asset Utilization */}
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono text-slate-500">
                    3. Tactical Resource & Asset Utilization
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-[10px]">ASSAULT RESCUE BOATS</div>
                      <div className="text-sm font-bold text-emerald-700 mt-0.5">14 Deployed / 4 Reserve</div>
                      <div className="text-[10px] text-slate-500">Outboard 40HP Engines</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-[10px]">THERMAL RECON DRONES</div>
                      <div className="text-sm font-bold text-blue-700 mt-0.5">18 Active Sorties</div>
                      <div className="text-[10px] text-slate-500">Grid Aerial Coverage 100%</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-[10px]">DEXIE LOCAL STORAGE</div>
                      <div className="text-sm font-bold text-emerald-700 mt-0.5">Offline Synced ✓</div>
                      <div className="text-[10px] text-slate-500">0 Pending Mutations</div>
                    </div>
                  </div>
                </div>

                {/* Formal Certification Statement */}
                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
                  <span className="font-bold font-mono text-[10px] text-blue-700 uppercase">Official Ground Certification Statement</span>
                  <p className="text-[11px] font-sans">
                    Certified that all 14 tactical missions, 128 citizen extractions, and water depth telemetry logs recorded in this SITREP report have been physically verified on site by Field Responders and transmitted via encrypted L-Band Satellite radio to Apex Central Command.
                  </p>
                </div>

                {/* Signatures & Security Stamp */}
                <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs font-mono text-slate-800">
                  <div className="space-y-6">
                    <div className="text-[10px] text-slate-500 font-bold">FIELD TACTICAL OFFICER SIGNATURE</div>
                    <div className="font-bold">
                      <span className="text-blue-900 underline">Insp. Rohit Kalita</span><br />
                      <span>Commander, NDRF Team Bravo-04</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-100 border border-slate-300 rounded text-center space-y-1">
                    <div className="font-bold text-[10px] text-slate-700">RAKSHASETU APEX VERIFIED STAMP</div>
                    <div className="text-emerald-700 font-bold text-xs">DIGITALLY SIGNED ✓</div>
                    <div className="text-[9px] text-slate-500">HASH: #88492-NDMA-AUTH</div>
                  </div>

                  <div className="space-y-6 text-left sm:text-right">
                    <div className="text-[10px] text-slate-500 font-bold">APEX COMMAND APPROVAL STAMP</div>
                    <div className="font-bold">
                      <span className="text-slate-900 underline">Cmdr. R. Sharma</span><br />
                      <span>Director of Operations, NDRF HQ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Queue, Live Map, SOS Dispatches, Resources */}
          {currentTab === 'queue' && (
            <div className="space-y-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
              <h2 className="text-xl font-bold text-[#0F172A]">Full Priority Missions Queue</h2>
              <div className="space-y-3 pt-2">
                <div className="p-4 bg-slate-50 border border-[#E2E8F0] rounded-lg flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-xs font-bold">P1 CRITICAL</span>
                    <div className="font-bold text-[#0F172A] mt-1">Terrace Flood Evacuation (Block C-4)</div>
                    <div className="text-xs text-slate-600">6 Civilians stranded • Water Depth: 2.7m</div>
                  </div>
                  <button onClick={() => showToast('Squad Assigned!')} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">
                    Assign Squad
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'live-map' && (
            <div className="space-y-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
              <h2 className="text-xl font-bold text-[#0F172A]">Safe Water Routes & Live Drone Navigation</h2>
              <LiveMap height="h-[500px]" darkTheme={false} tacticalOverlay={true} />
            </div>
          )}

          {currentTab === 'missions' && (
            <div className="space-y-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
              <h2 className="text-xl font-bold text-[#0F172A]">SOS Dispatches & Field Verification</h2>
              <div className="p-4 bg-slate-50 rounded-lg border border-[#E2E8F0] space-y-2">
                <div className="font-bold text-[#0F172A] text-sm">DISPATCH #SOS-9122 — Yamuna Sector 9</div>
                <p className="text-xs text-slate-600">Citizen reported rapid water rise. Ground Team Bravo-04 verified on site.</p>
              </div>
            </div>
          )}

          {currentTab === 'resources' && (
            <div className="space-y-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
              <h2 className="text-xl font-bold text-[#0F172A]">Squad Telemetry & Rescue Equipment Inventory</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-4 bg-slate-50 rounded-lg border border-[#E2E8F0]">
                  <div className="text-slate-500 font-sans">Inflatable Assault Boats</div>
                  <div className="text-2xl font-bold text-emerald-600 font-heading mt-1">12 Ready</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-[#E2E8F0]">
                  <div className="text-slate-500 font-sans">Satellite Radios</div>
                  <div className="text-2xl font-bold text-amber-600 font-heading mt-1">8 Active</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
