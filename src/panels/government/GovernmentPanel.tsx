import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { GovSubTab } from '../../types';
import { 
  Grid, Map, Package, Radio, TrendingUp, AlertTriangle, Shield, 
  Megaphone, Users, Activity, Plus, Minus, Maximize2, Send, 
  Navigation, Eye, ChevronRight, Share2, Flame, Stethoscope, ShieldAlert, 
  Filter, Waves, RefreshCw, CheckCircle2, AlertCircle, ArrowUpRight, ArrowUp,
  Building2, DollarSign, PieChart, CheckSquare, XCircle, Clock, FileText,
  BarChart3, Check, Download, Search, Layers, Truck, HardHat, PhoneCall,
  ArrowDownRight, PlusCircle, CreditCard, Award
} from 'lucide-react';
import { LiveMap } from '../../components/LiveMap';
import { MagicAICard } from '../../components/MagicAICard';
import { RegionSelector } from '../../components/RegionSelector';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Legend } from 'recharts';

// River Hydrograph Hydro-Telemetry Data
const hydroChartData = [
  { time: '06:00', level: 204.10, warning: 204.50, danger: 205.33 },
  { time: '08:00', level: 204.45, warning: 204.50, danger: 205.33 },
  { time: '10:00', level: 204.90, warning: 204.50, danger: 205.33 },
  { time: '12:00', level: 205.20, warning: 204.50, danger: 205.33 },
  { time: '14:00', level: 205.55, warning: 204.50, danger: 205.33 },
  { time: '16:00', level: 205.85, warning: 204.50, danger: 205.33 },
  { time: '18:00', level: 206.20, warning: 204.50, danger: 205.33 }
];

// Incident Velocity & Analytics Trend Data
const trendAnalyticsData = [
  { hour: '00:00', floods: 12, landslides: 4, structural: 2, medical: 5 },
  { hour: '04:00', floods: 18, landslides: 6, structural: 3, medical: 7 },
  { hour: '08:00', floods: 35, landslides: 12, structural: 8, medical: 14 },
  { hour: '12:00', floods: 54, landslides: 22, structural: 14, medical: 20 },
  { hour: '16:00', floods: 42, landslides: 18, structural: 10, medical: 16 },
  { hour: '20:00', floods: 68, landslides: 28, structural: 19, medical: 25 },
  { hour: '24:00 (Est)', floods: 75, landslides: 32, structural: 22, medical: 28 }
];

interface DeptTask {
  id: string;
  fromDept: string;
  toDept: string;
  title: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  timestamp: string;
  coordinator: string;
}

interface FinancialApproval {
  id: string;
  department: string;
  title: string;
  amountLakhs: number;
  requestedBy: string;
  status: 'PENDING' | 'APPROVED' | 'DISBURSED' | 'REJECTED';
  urgency: 'EMERGENCY P1' | 'STANDARD P2' | 'ROUTINE P3';
  date: string;
}

export const GovernmentPanel: React.FC = () => {
  const { subTabs, setGovSubTab, setPanel } = useAppStore();
  const currentTab = subTabs.gov;

  // Region Aggregation Filter
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'delhi' | 'assam' | 'odisha'>('delhi');

  // Dispatcher state
  const [dispatchZone, setDispatchZone] = useState('Zone 4: Yamuna Basin Lower (84,000 civ)');
  const [dispatchSeverity, setDispatchSeverity] = useState('LEVEL 3: CRITICAL IMMEDIATE EVAC');
  const [dispatchMsg, setDispatchMsg] = useState('URGENT EVACUATION DIRECTIVE: Yamuna river cresting +3.5m above danger level. Move to designated elevation shelters immediately.');
  const [smsChecked, setSmsChecked] = useState(true);
  const [sirensChecked, setSirensChecked] = useState(true);
  const [appChecked, setAppChecked] = useState(true);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Map Layer Filter Toggle
  const [activeLayer, setActiveLayer] = useState<'all' | 'incidents' | 'units' | 'shelters' | 'danger'>('all');

  // Inter-Department Tasks State
  const [deptTasks, setDeptTasks] = useState<DeptTask[]>([
    {
      id: 'TASK-101',
      fromDept: 'NDMA Strike Force',
      toDept: 'PWD & Civil Infra',
      title: 'Deploy heavy 150HP excavators to clear Sector 9 riverbank debris',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      timestamp: '10m ago',
      coordinator: 'Cmdr. R. Sharma'
    },
    {
      id: 'TASK-102',
      fromDept: 'Health Corps',
      toDept: 'SDRF Transport',
      title: 'Dispatch 4 Mobile ICU Ambulances with trauma kits to Shelter 14',
      priority: 'CRITICAL',
      status: 'PENDING',
      timestamp: '18m ago',
      coordinator: 'CMO Dr. A. Gupta'
    },
    {
      id: 'TASK-103',
      fromDept: 'Police Command',
      toDept: 'Traffic Control',
      title: 'Establish NH-44 detour cordon for emergency helitack convoy',
      priority: 'HIGH',
      status: 'COMPLETED',
      timestamp: '35m ago',
      coordinator: 'DCP S. Rao'
    },
    {
      id: 'TASK-104',
      fromDept: 'Fire & Rescue',
      toDept: 'Logistics Hub',
      title: 'Supply 300L outboard boat fuel tanks to Barrage Sector 4',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      timestamp: '42m ago',
      coordinator: 'Chief Officer V. Singh'
    }
  ]);

  // New Department Task Modal / Form State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskFrom, setNewTaskFrom] = useState('NDMA Strike Force');
  const [newTaskTo, setNewTaskTo] = useState('PWD & Civil Infra');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('HIGH');

  // Financial Approvals State
  const [approvals, setApprovals] = useState<FinancialApproval[]>([
    {
      id: 'REQ-401',
      department: 'NDRF Strike Platoons',
      title: 'Procurement of 50 Inflatable Assault Rescue Boats with Outboard Engines',
      amountLakhs: 1250,
      requestedBy: 'Cmdr. R. Sharma',
      status: 'PENDING',
      urgency: 'EMERGENCY P1',
      date: '2026-09-07'
    },
    {
      id: 'REQ-402',
      department: 'Medical & Health Corps',
      title: 'Emergency Stock Replacement — 10,000 ORS Packets & Trauma Dressing Kits',
      amountLakhs: 420,
      requestedBy: 'CMO Dr. A. Gupta',
      status: 'APPROVED',
      urgency: 'EMERGENCY P1',
      date: '2026-09-07'
    },
    {
      id: 'REQ-403',
      department: 'PWD & Civil Infrastructure',
      title: 'High-Capacity 150HP De-Watering Pumps & Fuel Supply',
      amountLakhs: 850,
      requestedBy: 'Chief Eng. P. Kumar',
      status: 'PENDING',
      urgency: 'STANDARD P2',
      date: '2026-09-06'
    },
    {
      id: 'REQ-404',
      department: 'IAF Air Command',
      title: 'Helitack Fuel Subsidy & Continuous Air Rescue Sorties',
      amountLakhs: 280,
      requestedBy: 'Air Cdre K. Verma',
      status: 'DISBURSED',
      urgency: 'EMERGENCY P1',
      date: '2026-09-05'
    }
  ]);

  // New Financial Requisition Modal / Form State
  const [showReqModal, setShowReqModal] = useState(false);
  const [newReqDept, setNewReqDept] = useState('NDRF Strike Platoons');
  const [newReqTitle, setNewReqTitle] = useState('');
  const [newReqAmount, setNewReqAmount] = useState(100);
  const [newReqUrgency, setNewReqUrgency] = useState<'EMERGENCY P1' | 'STANDARD P2' | 'ROUTINE P3'>('EMERGENCY P1');

  // Trigger Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleQuickDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastSent(true);
    showToast(`Emergency alert pushed to 84,000 citizens in ${dispatchZone}!`);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: DeptTask = {
      id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
      fromDept: newTaskFrom,
      toDept: newTaskTo,
      title: newTaskTitle,
      priority: newTaskPriority,
      status: 'PENDING',
      timestamp: 'Just now',
      coordinator: 'Commander R. Sharma'
    };
    setDeptTasks([newTask, ...deptTasks]);
    setNewTaskTitle('');
    setShowTaskModal(false);
    showToast(`Inter-Department Directive ${newTask.id} assigned to ${newTaskTo}!`);
  };

  const updateTaskStatus = (id: string, newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    setDeptTasks(deptTasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    showToast(`Task ${id} status updated to ${newStatus.replace('_', ' ')}!`);
  };

  const handleCreateReq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqTitle.trim()) return;
    const newReq: FinancialApproval = {
      id: `REQ-${Math.floor(400 + Math.random() * 900)}`,
      department: newReqDept,
      title: newReqTitle,
      amountLakhs: Number(newReqAmount),
      requestedBy: 'Commander R. Sharma',
      status: 'PENDING',
      urgency: newReqUrgency,
      date: new Date().toISOString().split('T')[0]
    };
    setApprovals([newReq, ...approvals]);
    setNewReqTitle('');
    setShowReqModal(false);
    showToast(`Emergency Requisition ${newReq.id} submitted for ₹${(newReq.amountLakhs / 100).toFixed(2)} Cr!`);
  };

  const updateApprovalStatus = (id: string, newStatus: 'APPROVED' | 'DISBURSED' | 'REJECTED') => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: newStatus } : a));
    showToast(`Financial Request ${id} is now ${newStatus}!`);
  };

  const navItems: { id: GovSubTab; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'Command Aggregation', icon: Grid },
    { id: 'dept-coordination', label: 'Dept Coordination', icon: Building2, badge: 'Live Sync' },
    { id: 'budget-approvals', label: 'Budget & Approvals', icon: DollarSign, badge: '₹450 Cr' },
    { id: 'trend-analytics', label: 'Incident Trends & AI', icon: BarChart3 },
    { id: 'risk-map', label: 'Live Tactical Map', icon: Map },
    { id: 'ai-alerts', label: 'Resources & Logistics', icon: Package },
    { id: 'forecast', label: 'Alert Broadcast', icon: Radio },
    { id: 'reports', label: 'Reports & System Logs', icon: FileText }
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50 text-slate-900 min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3 animate-slide-in font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar matching Clean UI */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm">
        <div className="flex flex-col">
          {/* Logo Header */}
          <div 
            onClick={() => setPanel('auth')}
            className="h-16 px-4 flex items-center gap-3 bg-slate-50 border-b border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors"
            title="Return to Portal Hub"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold tracking-tight text-slate-900 uppercase text-sm font-sans">
                Raksha<span className="text-blue-600">Setu</span>
              </span>
              <span className="text-[10px] text-slate-500 tracking-widest uppercase font-mono mt-0.5">
                Gov Command Center
              </span>
            </div>
          </div>

          {/* Region Aggregator Dropdown */}
          <div className="p-3">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
              Active Regional Hub
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value as any);
                showToast(`Aggregated view updated to ${e.target.selectedOptions[0].text}`);
              }}
              className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
            >
              <option value="delhi">Delhi NCR (Yamuna Basin Hub)</option>
              <option value="assam">Assam Valley (Brahmaputra Hub)</option>
              <option value="odisha">Odisha Coastal Division</option>
              <option value="all">🌐 All India National Aggregation</option>
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-1">
            {navItems.map((t) => {
              const Icon = t.icon;
              const isActive = currentTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setGovSubTab(t.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-colors text-xs font-medium ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/70 shadow-2xs' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span>{t.label}</span>
                  </div>
                  {t.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Info Box */}
        <div className="p-3 bg-slate-50 border border-slate-200 m-3 rounded-lg flex flex-col gap-2">
          <div className="flex flex-col gap-1 text-[11px] font-mono">
            <div className="flex items-center justify-between text-slate-500">
              <span>HUB NODE</span>
              <span className="text-blue-600 font-bold">IN-GOV-DEL-01</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>AGENCY SYNC</span>
              <span className="text-emerald-600 font-bold">8/8 Depts Live</span>
            </div>
          </div>
          <button 
            onClick={() => setPanel('auth')}
            className="w-full py-1.5 px-3 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold font-mono transition-colors text-center"
          >
            ← Exit Command Center
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="py-2.5 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex flex-wrap items-center justify-between border-b border-slate-200 shadow-2xs gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-mono font-semibold text-slate-900 shrink-0">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
              <span className="hidden sm:inline">Apex Command Link: Connected</span>
              <span className="sm:hidden">Connected</span>
              <span className="text-slate-500 font-normal">[18ms]</span>
            </div>

            {/* State & District / City Selector Widget */}
            <RegionSelector onRegionChange={(st, dist) => showToast(`Filtered telemetry to ${st} • ${dist}`)} />
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <button 
              onClick={() => setGovSubTab('forecast')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all shrink-0 active:scale-95 cursor-pointer"
            >
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Broadcast Alert</span>
              <span className="sm:hidden">Broadcast</span>
            </button>

            <div className="hidden md:flex flex-col items-end leading-tight px-3 py-1.5 bg-slate-100 border border-slate-200/70 rounded-lg font-mono text-[11px] shrink-0">
              <div className="font-bold text-slate-900">17:15:20 UTC</div>
              <div className="text-slate-500">22:45:20 IST</div>
            </div>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 shrink-0">
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-xs font-bold text-slate-900">Commander R. Sharma</span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">NDRF Dir-Ops</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                <Users className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 lg:p-6 space-y-6">
          
          {/* ========================================================= */}
          {/* 1. COMMAND DASHBOARD AGGREGATION SUBTAB                    */}
          {/* ========================================================= */}
          {currentTab === 'dashboard' && (
            <>
              {/* HIGH-LEVEL REGIONAL AGGREGATION HEADER */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-400/30 uppercase">
                      National Aggregated Telemetry
                    </span>
                    <span className="text-slate-400 text-xs font-mono">• Live Real-Time Feed</span>
                  </div>
                  <h1 className="text-xl font-bold font-sans tracking-tight">
                    {selectedRegion === 'delhi' && 'Delhi NCR Command Sector Aggregation'}
                    {selectedRegion === 'assam' && 'Assam Valley Brahmaputra Sector Aggregation'}
                    {selectedRegion === 'odisha' && 'Odisha Coastal Cyclone Division Aggregation'}
                    {selectedRegion === 'all' && 'All-India Disaster Operations Multi-Sector Aggregation'}
                  </h1>
                  <p className="text-xs text-slate-300">
                    Aggregated multi-department response metrics, live hazard telemetry, and inter-agency dispatch status.
                  </p>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                  <div className="px-3 py-2 rounded bg-slate-800/80 border border-slate-700 flex flex-col items-end">
                    <span className="text-slate-400 text-[10px]">TOTAL RESCUED</span>
                    <span className="text-emerald-400 font-bold text-sm">14,892 Civilians</span>
                  </div>
                  <div className="px-3 py-2 rounded bg-slate-800/80 border border-slate-700 flex flex-col items-end">
                    <span className="text-slate-400 text-[10px]">TOTAL DISBURSED</span>
                    <span className="text-amber-400 font-bold text-sm">₹218.00 Cr</span>
                  </div>
                </div>
              </div>

              {/* TOP LEVEL OPERATIONAL SUMMARY & KPI ROW */}
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
                {/* STAT 1: ACTIVE INCIDENTS */}
                <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-2xs border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-100/60 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Active Incidents</span>
                    </div>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 border border-red-200 text-red-700 font-mono text-[10px] font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />
                      CRITICAL P1
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">42</div>
                    <div className="flex items-center gap-1 text-red-600 font-mono text-xs font-bold">
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>+8 in last 2h</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 font-mono text-[11px] text-slate-500">
                    <span>Triage Rate: 94.2%</span>
                    <span className="text-slate-700 font-bold">12 Critical • 18 High</span>
                  </div>
                </div>

                {/* STAT 2: AFFECTED CITIZENS */}
                <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-2xs border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-100/60 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Users className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Affected Citizens</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 font-mono text-[10px] font-bold">
                      EVAC IN PROGRESS
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">18,450</div>
                    <div className="font-mono text-xs text-blue-600 font-bold">74% Complete</div>
                  </div>
                  <div className="mt-3 space-y-1 pt-2 border-t border-slate-100">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: '74%' }} />
                    </div>
                    <div className="flex justify-between font-mono text-[11px] text-slate-500">
                      <span>13,653 Safe</span>
                      <span>4,797 Pending</span>
                    </div>
                  </div>
                </div>

                {/* STAT 3: RELIEF SHELTERS */}
                <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-2xs border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-100/60 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Active Shelters</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold">
                      STABLE (87.5%)
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                      28 <span className="text-slate-400 text-lg font-normal">/ 32</span>
                    </div>
                    <div className="font-mono text-xs text-emerald-600 font-bold">4 Reserve Ready</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 font-mono text-[11px]">
                    <span className="text-slate-500">Capacity: 22,400 / 25,600</span>
                    <span className="text-emerald-700 font-bold">3,200 Beds Available</span>
                  </div>
                </div>

                {/* STAT 4: CRITICAL RED ALERTS */}
                <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-2xs border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-100/70 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Radio className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Critical Broadcasts</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold animate-pulse">
                      3 LIVE CHANNELS
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <div className="text-3xl font-extrabold font-mono text-red-600 tracking-tight">3</div>
                    <div className="font-mono text-xs text-slate-600 font-medium">SMS + Sirens Linked</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 font-mono text-[11px]">
                    <span className="text-red-700 font-medium truncate max-w-[180px]">Zone 4 Yamuna Basin, NH44</span>
                    <button onClick={() => setGovSubTab('forecast')} className="text-blue-600 font-bold underline hover:text-blue-800">
                      View Logs
                    </button>
                  </div>
                </div>
              </section>

              {/* CENTER SPLIT: TACTICAL LIVE MAP & PRIORITY QUEUE */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
                {/* TACTICAL LIVE MAP PREVIEW (COL 7) */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
                  <LiveMap height="h-[480px]" tacticalOverlay={false} />
                </div>

                {/* PRIORITY INCIDENT QUEUE (COL 5) */}
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <h2 className="font-bold text-slate-900 text-sm leading-none">Priority Incidents Queue</h2>
                        <span className="font-mono text-[10px] text-slate-500">Sorted by Urgency (P1 → P4)</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold">
                      42 Total
                    </span>
                  </div>

                  <div className="p-3 flex flex-col gap-3 overflow-y-auto max-h-[480px]">
                    <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200 shadow-2xs flex flex-col gap-2 border-l-4 border-l-red-600">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-red-50 border border-red-200 text-red-700 font-mono text-[10px] font-bold flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />
                          P1 CRITICAL
                        </span>
                        <span className="font-mono text-[11px] text-red-600 font-bold">SOS 4m ago</span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs leading-snug">
                          Flash Flood Trap - Sector 9 Residential
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          6 stranded civilians on terrace, water level 1.8m and surging rapidly.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <button 
                          onClick={() => showToast('Unit NDRF Alpha-1 dispatched to Sector 9!')}
                          className="flex-1 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Deploy Unit</span>
                        </button>
                        <button 
                          onClick={() => showToast('Incident Escalated to National Defense Command!')}
                          className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Escalate</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200 shadow-2xs flex flex-col gap-2 border-l-4 border-l-red-600">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-red-50 border border-red-200 text-red-700 font-mono text-[10px] font-bold">
                          P1 CRITICAL
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">11m ago</span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs leading-snug">
                          Bridge Structural Failure - NH-44 Crossing
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Pillar fracture reported. 2 emergency ambulances rerouted to Old bypass.
                        </p>
                      </div>
                      <button 
                        onClick={() => showToast('Traffic Reroute Directive pushed via SMS & Maps API!')}
                        className="w-full px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 mt-1"
                      >
                        <Navigation className="w-3.5 h-3.5 text-blue-600" />
                        <span>Broadcast Reroute Directive</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* QUICK DISPATCH & RIVER HYDROGRAPH */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
                <div className="lg:col-span-5 flex flex-col rounded-xl bg-white border border-slate-200 p-4 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-red-600" />
                      <h3 className="font-bold text-slate-900 text-sm">Alert Quick Dispatcher</h3>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">CAP v1.2 Protocol</span>
                  </div>

                  <form onSubmit={handleQuickDispatch} className="flex flex-col gap-3 flex-1 justify-between">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-mono text-[10px] text-slate-600 uppercase mb-1 font-bold">Target Zone</label>
                        <select 
                          value={dispatchZone}
                          onChange={(e) => setDispatchZone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        >
                          <option>Zone 4: Yamuna Basin Lower (84,000 civ)</option>
                          <option>Zone 2: Old Delhi Ridge (120,000 civ)</option>
                          <option>Zone 5: Industrial Corridor (18,000 civ)</option>
                          <option>All Command Sectors (City-wide)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] text-slate-600 uppercase mb-1 font-bold">Severity Level</label>
                        <select 
                          value={dispatchSeverity}
                          onChange={(e) => setDispatchSeverity(e.target.value)}
                          className="w-full bg-red-50 border border-red-300 text-red-700 text-xs font-bold rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-red-600"
                        >
                          <option>LEVEL 3: CRITICAL IMMEDIATE EVAC</option>
                          <option>LEVEL 2: ADVISORY PREPAREDNESS</option>
                          <option>LEVEL 1: INFORMATIONAL WATCH</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-slate-600 uppercase mb-1 font-bold">Directive Text</label>
                      <textarea 
                        rows={2} 
                        value={dispatchMsg}
                        onChange={(e) => setDispatchMsg(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-600" 
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3 font-mono text-[10px] text-slate-700">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" checked={smsChecked} onChange={(e) => setSmsChecked(e.target.checked)} className="rounded border-slate-300 text-red-600 focus:ring-red-500" />
                          <span>SMS</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" checked={sirensChecked} onChange={(e) => setSirensChecked(e.target.checked)} className="rounded border-slate-300 text-red-600 focus:ring-red-500" />
                          <span>Sirens</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" checked={appChecked} onChange={(e) => setAppChecked(e.target.checked)} className="rounded border-slate-300 text-red-600 focus:ring-red-500" />
                          <span>App</span>
                        </label>
                      </div>

                      <button 
                        type="submit"
                        className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-2xs flex items-center gap-1.5 transition-all shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Push Broadcast</span>
                      </button>
                    </div>
                  </form>
                </div>

                <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">CWC River Hydrograph Telemetry</h3>
                      <p className="text-xs text-slate-500">Real-time water level vs Danger Mark (205.33m)</p>
                    </div>
                    <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-bold border border-red-300 font-mono">
                      CRITICAL RISE (+0.45m/hr)
                    </span>
                  </div>

                  <div className="w-full h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hydroChartData}>
                        <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                        <YAxis domain={[203.5, 207.0]} stroke="#64748B" fontSize={11} />
                        <Tooltip />
                        <ReferenceLine y={205.33} label="Danger Mark (205.33m)" stroke="#DC3B33" strokeDasharray="3 3" />
                        <Area type="monotone" dataKey="level" stroke="#DC3B33" fill="#FEE2E2" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              <MagicAICard
                text="Citizen reports in Sector 9 have spiked 3x above baseline in the last hour — likely an unflagged incident cluster."
                ctaText="Authorize NDRF Deployment"
                onApply={() => showToast('NDRF Sector 9 Deployment Authorized!')}
              />
            </>
          )}

          {/* ========================================================= */}
          {/* 2. INTER-DEPARTMENT COORDINATION SUBTAB                   */}
          {/* ========================================================= */}
          {currentTab === 'dept-coordination' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Inter-Department Operational Coordination</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time agency readiness matrix, task dispatch queue, and communication channel status.
                  </p>
                </div>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Department Directive</span>
                </button>
              </div>

              {/* Department Readiness Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. NDMA / SDRF */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-sm text-slate-900">NDMA / SDRF Strike Teams</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-mono text-xs font-bold">
                      94% Ready
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 font-mono">
                    <div className="flex justify-between"><span>Leader:</span><strong className="text-slate-900">Cmdr. R. Sharma</strong></div>
                    <div className="flex justify-between"><span>Comms Channel:</span><strong className="text-blue-700">VHF Ch-1 (Encrypted)</strong></div>
                    <div className="flex justify-between"><span>Deployed Units:</span><span>18/19 Platoons</span></div>
                  </div>
                  <button 
                    onClick={() => showToast('Direct radio link initiated with NDMA Strike Force Commander!')}
                    className="w-full py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold font-mono border border-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                    <span>Connect Live Channel</span>
                  </button>
                </div>

                {/* 2. FIRE & RESCUE */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-sm text-slate-900">Fire & Water Rescue</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-mono text-xs font-bold">
                      88% Ready
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 font-mono">
                    <div className="flex justify-between"><span>Leader:</span><strong className="text-slate-900">Chief V. Singh</strong></div>
                    <div className="flex justify-between"><span>Comms Channel:</span><strong className="text-blue-700">VHF Ch-2 (Fire-Net)</strong></div>
                    <div className="flex justify-between"><span>Motorboats Active:</span><span>44 Boats</span></div>
                  </div>
                  <button 
                    onClick={() => showToast('Direct radio link initiated with Fire & Rescue Operations!')}
                    className="w-full py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold font-mono border border-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                    <span>Connect Live Channel</span>
                  </button>
                </div>

                {/* 3. MEDICAL CORPS */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-red-600" />
                      <span className="font-bold text-sm text-slate-900">Medical & Health Corps</span>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-mono text-xs font-bold">
                      79% (Strained)
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 font-mono">
                    <div className="flex justify-between"><span>Leader:</span><strong className="text-slate-900">CMO Dr. A. Gupta</strong></div>
                    <div className="flex justify-between"><span>Comms Channel:</span><strong className="text-blue-700">Med-Radio 108</strong></div>
                    <div className="flex justify-between"><span>ICU Beds / Ambulances:</span><span>32 Beds / 14 Amb</span></div>
                  </div>
                  <button 
                    onClick={() => showToast('Direct radio link initiated with Health Corps Chief Medical Officer!')}
                    className="w-full py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold font-mono border border-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                    <span>Connect Live Channel</span>
                  </button>
                </div>
              </div>

              {/* Inter-Departmental Directive Task List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Active Inter-Agency Directive Queue</h3>
                  </div>
                  <span className="font-mono text-xs text-slate-500 font-bold">{deptTasks.length} Active Directives</span>
                </div>

                <div className="divide-y divide-slate-200">
                  {deptTasks.map(task => (
                    <div key={task.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{task.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            task.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' :
                            task.priority === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            {task.fromDept} → <strong className="text-blue-700">{task.toDept}</strong>
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-800">{task.title}</p>
                        <div className="text-[11px] font-mono text-slate-500">
                          Coordinator: {task.coordinator} • {task.timestamp}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {task.status === 'PENDING' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
                            className="px-3 py-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-mono text-xs font-bold transition-all"
                          >
                            Mark In Progress
                          </button>
                        )}
                        {task.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => updateTaskStatus(task.id, 'COMPLETED')}
                            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all"
                          >
                            Complete Task
                          </button>
                        )}
                        {task.status === 'COMPLETED' && (
                          <span className="px-3 py-1.5 rounded bg-slate-100 text-emerald-700 font-mono text-xs font-bold flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. BUDGET & APPROVAL RESOURCE TRACKING SUBTAB             */}
          {/* ========================================================= */}
          {currentTab === 'budget-approvals' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                    <h2 className="text-xl font-bold text-slate-900">Emergency Budget & Financial Approvals Tracker</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    SDRF emergency fund allocation, departmental expenditure tracking, and procurement approval workflow.
                  </p>
                </div>
                <button
                  onClick={() => setShowReqModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Financial Requisition</span>
                </button>
              </div>

              {/* Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500">TOTAL EMERGENCY FUND</span>
                  <div className="text-2xl font-extrabold font-mono text-slate-900">₹500.00 Cr</div>
                  <span className="text-xs text-slate-500 font-mono">SDRF Sanctioned Treasury</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500">FUNDS APPROVED</span>
                  <div className="text-2xl font-extrabold font-mono text-blue-600">₹342.50 Cr</div>
                  <span className="text-xs text-blue-600 font-mono font-bold">68.5% Committed</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500">FUNDS DISBURSED</span>
                  <div className="text-2xl font-extrabold font-mono text-emerald-600">₹218.00 Cr</div>
                  <span className="text-xs text-emerald-600 font-mono font-bold">43.6% Transferred</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500">AVAILABLE RESERVE</span>
                  <div className="text-2xl font-extrabold font-mono text-amber-600">₹157.50 Cr</div>
                  <span className="text-xs text-slate-500 font-mono">Ready for Immediate Release</span>
                </div>
              </div>

              {/* Financial Approval Queue Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Emergency Requisitions Approval Queue</h3>
                  </div>
                  <span className="font-mono text-xs text-slate-500 font-bold">{approvals.length} Requisitions</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-mono text-slate-600 uppercase">
                        <th className="p-3">ID</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Requisition Title</th>
                        <th className="p-3">Amount (₹)</th>
                        <th className="p-3">Urgency</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {approvals.map(req => (
                        <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-900">{req.id}</td>
                          <td className="p-3 font-medium text-slate-700">{req.department}</td>
                          <td className="p-3 text-slate-900 font-medium max-w-xs">{req.title}</td>
                          <td className="p-3 font-mono font-bold text-slate-900">₹{(req.amountLakhs / 100).toFixed(2)} Cr</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              req.urgency.includes('P1') ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {req.urgency}
                            </span>
                          </td>
                          <td className="p-3 font-mono">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              req.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                              req.status === 'DISBURSED' ? 'bg-emerald-100 text-emerald-800' :
                              req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {req.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => updateApprovalStatus(req.id, 'APPROVED')}
                                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-mono text-[11px] font-bold"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateApprovalStatus(req.id, 'REJECTED')}
                                  className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-mono text-[11px] font-bold"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {req.status === 'APPROVED' && (
                              <button
                                onClick={() => updateApprovalStatus(req.id, 'DISBURSED')}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[11px] font-bold"
                              >
                                Disburse Funds
                              </button>
                            )}
                            {req.status === 'DISBURSED' && (
                              <span className="text-[11px] font-mono text-emerald-700 font-bold">Disbursed ✓</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. INCIDENT TREND ANALYTICS SUBTAB                         */}
          {/* ========================================================= */}
          {currentTab === 'trend-analytics' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Incident Trend Analytics & AI Forecasting</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Historical incident velocity, disaster classification breakdown, and predictive vulnerability models.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Full Analytics Report PDF downloaded to local disk!')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0"
                >
                  <Download className="w-4 h-4 text-slate-300" />
                  <span>Export Analytics PDF</span>
                </button>
              </div>

              {/* Analytics Stacked Bar Chart */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">24-Hour Incident Volume & Disaster Category Breakdown</h3>
                    <p className="text-xs text-slate-500">Hourly incident velocity by hazard classification</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-mono text-xs font-bold">
                    Peak Expected: 22:00 IST
                  </span>
                </div>

                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendAnalyticsData}>
                      <XAxis dataKey="hour" stroke="#64748B" fontSize={11} />
                      <YAxis stroke="#64748B" fontSize={11} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="floods" fill="#2563EB" name="Flash Floods" stackId="a" />
                      <Bar dataKey="landslides" fill="#D97706" name="Landslides" stackId="a" />
                      <Bar dataKey="structural" fill="#DC2626" name="Structural Collapse" stackId="a" />
                      <Bar dataKey="medical" fill="#059669" name="Medical Trauma" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Predictive AI Insight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Peak Hazard Window</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-xl font-extrabold font-mono text-amber-600">20:00 - 22:30 IST</div>
                  <p className="text-xs text-slate-600">
                    High tide crest alignment with heavy upstream water release from Hathnikund Barrage.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Response Efficiency Index</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xl font-extrabold font-mono text-emerald-600">94.2% (1.4s Latency)</div>
                  <p className="text-xs text-slate-600">
                    Average triage-to-dispatch time reduced by 40% using automated AI priority tags.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">High-Risk Vulnerability Zone</span>
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-xl font-extrabold font-mono text-red-600">Sector 9 Apex</div>
                  <p className="text-xs text-slate-600">
                    Estimated 4,797 civilians requiring priority boat evacuation before 23:00 IST.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. Live Tactical Map Subtab */}
          {currentTab === 'risk-map' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Live Tactical Map & Hazard Geofence</h2>
                  <p className="text-xs text-slate-500">Real-time geospatial tracking with live disaster telemetry overlay</p>
                </div>
                <span className="px-3 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold">
                  19 Field Units Online
                </span>
              </div>
              <LiveMap height="h-[600px]" />
            </div>
          )}

          {/* 6. Resources & Logistics Subtab */}
          {currentTab === 'ai-alerts' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Resources & Logistics Registry</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Assault Rescue Boats</div>
                  <div className="text-emerald-600 font-bold text-lg">14 Deployed / 4 Reserve</div>
                  <div className="text-slate-500 text-[11px]">NDRF Battalion 8 & SDRF</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="font-bold text-slate-900 text-sm">Mi-17 Helicopters (IAF)</div>
                  <div className="text-blue-600 font-bold text-lg">6 Active Sorties</div>
                  <div className="text-slate-500 text-[11px]">Hindon Air Force Base</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="font-bold text-slate-900 text-sm">SDRF Treasury Fund</div>
                  <div className="text-amber-600 font-bold text-lg">₹450 Crore Released</div>
                  <div className="text-slate-500 text-[11px]">Emergency Allocation v2</div>
                </div>
              </div>
            </div>
          )}

          {/* 7. Alert Broadcast Subtab */}
          {currentTab === 'forecast' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Apex Alert Broadcast Center</h2>
              <div className="p-6 bg-white border border-slate-200 rounded-xl max-w-xl space-y-4 text-xs shadow-2xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Zone</label>
                  <input type="text" readOnly value="Sector 9 — Yamuna Basin All Districts" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alert Message</label>
                  <textarea rows={4} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500" defaultValue="URGENT: Flash flood waters surging in Sector 9. Evacuate to rooftops or elevated relief shelters immediately." />
                </div>
                <button onClick={() => showToast('Emergency Broadcast Transmitted!')} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold uppercase tracking-wider flex items-center gap-2">
                  <Megaphone className="w-4 h-4" />
                  <span>Push Broadcast Now</span>
                </button>
              </div>
            </div>
          )}

          {/* 8. Reports & System Logs Subtab */}
          {currentTab === 'reports' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">System Reports & Audit Logs</h2>
              <div className="p-5 bg-white border border-slate-200 rounded-xl text-xs font-mono space-y-3 shadow-2xs">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-slate-600">Triage Efficiency Index</span>
                  <span className="font-bold text-emerald-600 text-sm">94.2%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-slate-600">Average Response Latency</span>
                  <span className="font-bold text-blue-600 text-sm">1.4 seconds</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Active Telemetry Sensors</span>
                  <span className="font-bold text-slate-900 text-sm">1,248 Connected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CREATE NEW INTER-AGENCY TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create Inter-Department Directive</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-slate-700 mb-1 uppercase text-[10px]">From Department</label>
                  <select 
                    value={newTaskFrom} 
                    onChange={e => setNewTaskFrom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-mono"
                  >
                    <option>NDMA Strike Force</option>
                    <option>Fire & Water Rescue</option>
                    <option>Health Corps</option>
                    <option>Police Command</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono font-bold text-slate-700 mb-1 uppercase text-[10px]">Target Department</label>
                  <select 
                    value={newTaskTo} 
                    onChange={e => setNewTaskTo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-mono"
                  >
                    <option>PWD & Civil Infra</option>
                    <option>SDRF Transport</option>
                    <option>Traffic Control</option>
                    <option>Logistics Hub</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold text-slate-700 mb-1 uppercase text-[10px]">Directive Details</label>
                <textarea 
                  rows={3} 
                  required
                  placeholder="e.g. Deploy 150HP de-watering pumps to Sector 9 riverbank crossing..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-mono font-bold text-slate-700 mb-1 uppercase text-[10px]">Priority Level</label>
                <select 
                  value={newTaskPriority}
                  onChange={e => setNewTaskPriority(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-mono font-bold"
                >
                  <option value="CRITICAL">CRITICAL P1</option>
                  <option value="HIGH">HIGH P2</option>
                  <option value="MEDIUM">MEDIUM P3</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Dispatch Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW FINANCIAL REQUISITION MODAL */}
      {showReqModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Submit Emergency Financial Requisition</h3>
              <button onClick={() => setShowReqModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReq} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono font-bold text-slate-700 mb-1 uppercase text-[10px]">Requesting Department</label>
                <select 
                  value={newReqDept} 
                  onChange={e => setNewReqDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-mono"
                >
                  <option>NDRF Strike Platoons</option>
                  <option>Medical & Health Corps</option>
                  <option>PWD & Civil Infrastructure</option>
                  <option>IAF Air Command</option>
                </select>
              </div>

              <div>
                <label className="block font-mono font-bold text-slate-700 mb-1 uppercase text-[10px]">Requisition Title & Justification</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Purchase of 100 Outboard Rescue Boat Engines..."
                  value={newReqTitle}
                  onChange={e => setNewReqTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-slate-700 mb-1 uppercase text-[10px]">Amount (₹ Lakhs)</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    value={newReqAmount}
                    onChange={e => setNewReqAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                    ₹{(newReqAmount / 100).toFixed(2)} Crore
                  </span>
                </div>
                <div>
                  <label className="block font-mono font-bold text-slate-700 mb-1 uppercase text-[10px]">Urgency Level</label>
                  <select 
                    value={newReqUrgency} 
                    onChange={e => setNewReqUrgency(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 font-mono font-bold"
                  >
                    <option value="EMERGENCY P1">EMERGENCY P1</option>
                    <option value="STANDARD P2">STANDARD P2</option>
                    <option value="ROUTINE P3">ROUTINE P3</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setShowReqModal(false)}
                  className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
