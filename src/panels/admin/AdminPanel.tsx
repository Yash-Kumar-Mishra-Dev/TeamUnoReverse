import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Users, Shield, FileText, AlertTriangle, Edit3, BarChart2, Bell, Link2, 
  Database, Settings, Clock, ArrowRight, UserPlus, 
  Plus, RefreshCw, Activity, Zap, 
  LogOut, Download, Sliders, Send, CheckCircle2, XCircle, Search, Filter, Server,
  Globe, Radio, Cpu, ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { RegionSelector } from '../../components/RegionSelector';

export const AdminPanel: React.FC = () => {
  const { setPanel } = useAppStore();
  const [activeSubTab, setActiveSubTab] = useState<string>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    showToast('Logged out of Admin Portal. Returning to Unified Portal.');
    setTimeout(() => setPanel('auth'), 800);
  };

  // IAM Users State
  const [userList, setUserList] = useState([
    { id: 'USR-101', name: 'Dr. A. K. Verma', email: 'verma@cwc.gov.in', role: 'GOVERNMENT_OFFICER', dept: 'Cabinet Disaster Cell', status: 'ACTIVE' },
    { id: 'USR-102', name: 'Cmdr. Rajesh Kumar', email: 'rajesh@ndrf.gov.in', role: 'FIELD_RESPONDER', dept: 'NDRF 8th Battalion', status: 'ACTIVE' },
    { id: 'USR-103', name: 'Priya Sharma', email: 'priya@delhi.gov.in', role: 'GOVERNMENT_OFFICER', dept: 'DDMA North-East', status: 'ACTIVE' },
    { id: 'USR-104', name: 'Rohan Mehta', email: 'rohan.m@gmail.com', role: 'CITIZEN', dept: 'Citizen Observer', status: 'ACTIVE' },
    { id: 'USR-105', name: 'Apex Admin', email: 'admin@rakshasetu.gov.in', role: 'SUPER_ADMIN', dept: 'HQ Control Center', status: 'ACTIVE' }
  ]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'GOVERNMENT_OFFICER', dept: 'DDMA' });

  // RBAC State
  const [rbacMatrix, setRbacMatrix] = useState<{ [role: string]: { [perm: string]: boolean } }>({
    SUPER_ADMIN: { user_manage: true, resource_crud: true, backup_trigger: true, platform_config: true, incident_triage: true, broadcast_alerts: true },
    GOVERNMENT_OFFICER: { user_manage: false, resource_crud: true, backup_trigger: false, platform_config: false, incident_triage: true, broadcast_alerts: true },
    FIELD_RESPONDER: { user_manage: false, resource_crud: true, backup_trigger: false, platform_config: false, incident_triage: true, broadcast_alerts: false },
    CITIZEN: { user_manage: false, resource_crud: false, backup_trigger: false, platform_config: false, incident_triage: false, broadcast_alerts: false }
  });

  const toggleRbacPermission = (role: string, perm: string) => {
    setRbacMatrix(prev => ({
      ...prev,
      [role]: { ...prev[role], [perm]: !prev[role][perm] }
    }));
    showToast(`Updated RBAC permission ${perm} for ${role}`);
  };

  // Resource Catalog State
  const [resourceList, setResourceList] = useState([
    { id: 'RES-01', name: 'Assault Rescue Motorboats', category: 'RESCUE_VEHICLE', qty: 24, location: 'Guwahati Depot', status: 'AVAILABLE', dept: 'NDRF Assam' },
    { id: 'RES-02', name: 'High-Volume Water Dewatering Pumps', category: 'MACHINERY', qty: 12, location: 'Silchar Yard', status: 'DEPLOYED', dept: 'Assam State Fire Services' },
    { id: 'RES-03', name: 'Emergency Inflatable Tents (10-Person)', category: 'SHELTER', qty: 350, location: 'Dispur Central Store', status: 'AVAILABLE', dept: 'Red Cross Assam' },
    { id: 'RES-04', name: 'Satellite Phone Transceivers', category: 'COMMUNICATION', qty: 45, location: 'Guwahati Airbase', status: 'AVAILABLE', dept: 'State Emergency Ops Center' }
  ]);

  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState<any | null>(null);
  const [resourceForm, setResourceForm] = useState({ name: '', category: 'RESCUE_VEHICLE', qty: 10, location: '', dept: '' });

  // Backup State
  const [isTakingSnapshot, setIsTakingSnapshot] = useState(false);
  const [backupSchedule, setBackupSchedule] = useState({ cron: '0 0 * * *', retentionDays: 30, autoSnapshot: true });
  const [backupLogs, setBackupLogs] = useState([
    { id: 'BK-9901', timestamp: '2026-09-07 02:00:00', type: 'FULL_POSTGRES', size: '4.2 GB', status: 'SUCCESS', checksum: 'sha256-a9f81b...' },
    { id: 'BK-9900', timestamp: '2026-09-06 02:00:00', type: 'INCREMENTAL', size: '680 MB', status: 'SUCCESS', checksum: 'sha256-7e31c2...' }
  ]);

  // System Settings State
  const [platformConfig, setPlatformConfig] = useState({ 
    kongRateLimit: 5000, 
    keycloakSessionTimeout: 30, 
    redisTtl: 3600, 
    maintenanceMode: false,
    debugLogging: true,
    emergencySirenThreshold: 85
  });

  // System Audit Logs State
  const [auditFilterLevel, setAuditFilterLevel] = useState<string>('ALL');
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [auditLogs] = useState([
    { id: 'LOG-8812', timestamp: '2026-09-07 16:40:11', service: 'KEYCLOAK_OAUTH', ip: '10.244.1.84', level: 'SUCCESS', user: 'admin@rakshasetu.gov.in', message: 'Admin authenticated via 2FA WebAuthn' },
    { id: 'LOG-8811', timestamp: '2026-09-07 16:15:42', service: 'KONG_API_GATEWAY', ip: '10.244.2.19', level: 'WARNING', user: 'verma@cwc.gov.in', message: 'Rate limit 80% threshold reached on /api/v2/cwc-gauges' },
    { id: 'LOG-8810', timestamp: '2026-09-07 15:58:02', service: 'INCIDENT_TRIAGE', ip: '10.244.1.84', level: 'INFO', user: 'rajesh@ndrf.gov.in', message: 'Escalated INC-901 priority from P2 to P1_CRITICAL' },
    { id: 'LOG-8809', timestamp: '2026-09-07 15:20:19', service: 'CONTENT_ADVISORY', ip: '10.244.1.84', level: 'SUCCESS', user: 'admin@rakshasetu.gov.in', message: 'Published Statewide Emergency Advisory ADV-101' },
    { id: 'LOG-8808', timestamp: '2026-09-07 14:02:11', service: 'BACKUP_ENGINE', ip: 'SYSTEM_CRON', level: 'SUCCESS', user: 'SYSTEM', message: 'Automated DB snapshot sha256-a9f81b created successfully' },
    { id: 'LOG-8807', timestamp: '2026-09-07 13:45:00', service: 'SMS_GATEWAY_TWILIO', ip: '10.244.3.05', level: 'ERROR', user: 'SYSTEM', message: 'Carrier timeout on cell tower segment Assam-East (+91 98765*****)' }
  ]);

  // Incident Triage Controls State
  const [incidentTriageList, setIncidentTriageList] = useState([
    { id: 'INC-901', title: 'Terrace Flood Stranding', location: 'Block C-4, Guwahati', priority: 'P1_CRITICAL', waterDepth: '2.8m', squad: 'NDRF Bravo-04', status: 'DISPATCHED', reporter: 'Citizen #8841' },
    { id: 'INC-902', title: 'Substation Electrical Leakage', location: 'Sector 5 Dewatering Hub', priority: 'P1_CRITICAL', waterDepth: '1.2m', squad: 'State Fire Team 2', status: 'INVESTIGATING', reporter: 'Govt Observer' },
    { id: 'INC-903', title: 'Landslide Road Blockade', location: 'NH-37 Km 42 Hill Sector', priority: 'P2_HIGH', waterDepth: 'N/A', squad: 'PWD Heavy Machinery', status: 'EN_ROUTE', reporter: 'Field Squad 09' },
    { id: 'INC-904', title: 'Potable Water Contamination', location: 'Relief Camp 3, Silchar', priority: 'P3_MEDIUM', waterDepth: '0.4m', squad: 'Health Ops Team B', status: 'QUEUED', reporter: 'Camp Admin' }
  ]);

  // Content & Advisories Publisher State
  const [advisoryList, setAdvisoryList] = useState([
    { id: 'ADV-101', title: 'Flash Flood & River Level Evacuation Alert', zone: 'Brahmaputra Valley Sector 4-8', level: 'CRITICAL', status: 'PUBLISHED', date: '2026-09-07', author: 'NDMA Control' },
    { id: 'ADV-102', title: 'Heavy Rainfall Warning & Power Grid Shutdown', zone: 'Guwahati Urban District', level: 'HIGH', status: 'PUBLISHED', date: '2026-09-06', author: 'State Weather Bureau' },
    { id: 'ADV-103', title: 'Post-Flood Sanitation & Water Treatment Protocol', zone: 'Statewide', level: 'ADVISORY', status: 'DRAFT', date: '2026-09-07', author: 'Health Department' }
  ]);
  const [showAddAdvisoryModal, setShowAddAdvisoryModal] = useState(false);
  const [newAdvisory, setNewAdvisory] = useState({ title: '', zone: 'Statewide', level: 'CRITICAL', body: '' });

  // Notification Gateway State
  const [notificationStats] = useState({
    smsSentToday: 142500,
    pushSentToday: 890000,
    sirenBroadcasts: 14,
    deliveryRate: '99.4%'
  });
  const [showTestPushModal, setShowTestPushModal] = useState(false);
  const [testPushData, setTestPushData] = useState({ district: 'Guwahati Urban', title: 'EVACUATION TEST SIREN', channel: 'ALL_GATEWAYS' });

  // External API Integrations State
  const [externalApis, setExternalApis] = useState([
    { id: 'API-CWC', name: 'CWC River Gauge Telemetry', endpoint: 'https://cwc.gov.in/api/v2/telemetry', status: 'CONNECTED', ping: '14ms', lastSync: '2 mins ago', rateLimit: '10,000 req/hr' },
    { id: 'API-IMD', name: 'IMD Doppler Radar & Rainfall Feed', endpoint: 'https://mausam.imd.gov.in/api/doppler', status: 'CONNECTED', ping: '28ms', lastSync: '1 min ago', rateLimit: '50,000 req/hr' },
    { id: 'API-NDMA', name: 'NDMA National Disaster Alert System', endpoint: 'https://ndma.gov.in/api/alerts', status: 'CONNECTED', ping: '19ms', lastSync: 'Just now', rateLimit: 'Unlimited' },
    { id: 'API-ISRO', name: 'ISRO Bhuvan Flood Inundation GIS', endpoint: 'https://bhuvan.nrsc.gov.in/api/gis/wms', status: 'CONNECTED', ping: '42ms', lastSync: '5 mins ago', rateLimit: '5,000 req/hr' }
  ]);

  // Handlers
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUserList(userList.map(u => u.id === editingUser.id ? { ...u, ...userForm } : u));
      showToast(`Updated user details for ${userForm.name}`);
      setEditingUser(null);
    } else {
      const newU = {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name: userForm.name || 'New Officer',
        email: userForm.email || 'officer@gov.in',
        role: userForm.role,
        dept: userForm.dept,
        status: 'ACTIVE'
      };
      setUserList([newU, ...userList]);
      showToast(`Provisioned new IAM user ${newU.name}`);
    }
    setShowAddUserModal(false);
    setUserForm({ name: '', email: '', role: 'GOVERNMENT_OFFICER', dept: 'DDMA' });
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUserList(userList.filter(u => u.id !== id));
    showToast(`Revoked access for user ${name}`);
  };

  const handleAddResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResource) {
      setResourceList(resourceList.map(r => r.id === editingResource.id ? { ...r, ...resourceForm } : r));
      showToast(`Updated resource catalog item ${resourceForm.name}`);
      setEditingResource(null);
    } else {
      const newR = {
        id: `RES-0${resourceList.length + 1}`,
        name: resourceForm.name || 'Emergency Resource',
        category: resourceForm.category,
        qty: Number(resourceForm.qty) || 1,
        location: resourceForm.location || 'Central Depot',
        status: 'AVAILABLE',
        dept: resourceForm.dept || 'State Ops'
      };
      setResourceList([newR, ...resourceList]);
      showToast(`Added ${newR.name} to resource catalog`);
    }
    setShowAddResourceModal(false);
    setResourceForm({ name: '', category: 'RESCUE_VEHICLE', qty: 10, location: '', dept: '' });
  };

  const handleDeleteResource = (id: string, name: string) => {
    setResourceList(resourceList.filter(r => r.id !== id));
    showToast(`Removed ${name} from resource catalog`);
  };

  const handleTriggerSnapshot = () => {
    setIsTakingSnapshot(true);
    setTimeout(() => {
      setIsTakingSnapshot(false);
      const newLog = {
        id: `BK-${Math.floor(9902 + Math.random() * 100)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        type: 'MANUAL_SNAPSHOT',
        size: '4.3 GB',
        status: 'SUCCESS',
        checksum: 'sha256-' + Math.random().toString(36).substring(2, 8)
      };
      setBackupLogs([newLog, ...backupLogs]);
      showToast('Database snapshot created successfully!');
    }, 1800);
  };

  const handleSaveConfig = () => {
    showToast('Platform settings and Gateway configuration updated successfully!');
  };

  const handleEscalateIncident = (id: string) => {
    setIncidentTriageList(incidentTriageList.map(i => i.id === id ? { ...i, priority: 'P1_CRITICAL', status: 'DISPATCHED' } : i));
    showToast(`Escalated ${id} to P1 CRITICAL dispatch level`);
  };

  const handleResolveIncident = (id: string) => {
    setIncidentTriageList(incidentTriageList.map(i => i.id === id ? { ...i, status: 'RESOLVED' } : i));
    showToast(`Incident ${id} marked as RESOLVED`);
  };

  const toggleAdvisoryStatus = (id: string) => {
    setAdvisoryList(advisoryList.map(a => a.id === id ? { ...a, status: a.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' } : a));
    showToast(`Toggled publication state for advisory ${id}`);
  };

  const handleCreateAdvisorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdv = {
      id: `ADV-${Math.floor(104 + Math.random() * 90)}`,
      title: newAdvisory.title || 'Official Advisory',
      zone: newAdvisory.zone || 'Statewide',
      level: newAdvisory.level || 'CRITICAL',
      status: 'PUBLISHED',
      date: new Date().toISOString().split('T')[0],
      author: 'Apex Control'
    };
    setAdvisoryList([newAdv, ...advisoryList]);
    setShowAddAdvisoryModal(false);
    setNewAdvisory({ title: '', zone: 'Statewide', level: 'CRITICAL', body: '' });
    showToast(`Broadcasted new advisory ${newAdv.id}`);
  };

  const handleTestApiConnection = (id: string, name: string) => {
    showToast(`Pinging ${name}... Handshake verified in 14ms (200 OK)`);
    setExternalApis(externalApis.map(a => a.id === id ? { ...a, lastSync: 'Just now' } : a));
  };

  const handleSendTestPush = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTestPushModal(false);
    showToast(`Triggered test alert push broadcast to ${testPushData.district}`);
  };

  // Recharts Chart Mock Data
  const areaData = [
    { time: '00:00', requests: 1200, latency: 25 },
    { time: '04:00', requests: 2400, latency: 30 },
    { time: '08:00', requests: 8900, latency: 65 },
    { time: '12:00', requests: 14200, latency: 110 },
    { time: '16:00', requests: 18500, latency: 95 },
    { time: '20:00', requests: 9400, latency: 40 }
  ];

  const donutData = [
    { name: 'Citizens', value: 82, color: '#2563eb' },
    { name: 'Responders', value: 12, color: '#10b981' },
    { name: 'Govt Officers', value: 5, color: '#8b5cf6' },
    { name: 'Super Admins', value: 1, color: '#ef4444' }
  ];

  const barChartData = [
    { district: 'Guwahati', incidents: 42, rescueBoats: 14, camps: 8 },
    { district: 'Silchar', incidents: 38, rescueBoats: 10, camps: 6 },
    { district: 'Dhubri', incidents: 29, rescueBoats: 8, camps: 5 },
    { district: 'Nagaon', incidents: 19, rescueBoats: 6, camps: 4 },
    { district: 'Tezpur', incidents: 12, rescueBoats: 4, camps: 3 }
  ];

  const trendLineData = [
    { day: 'Mon', activeIncidents: 120, resolved: 95, avgResponseMin: 14 },
    { day: 'Tue', activeIncidents: 145, resolved: 110, avgResponseMin: 12 },
    { day: 'Wed', activeIncidents: 198, resolved: 160, avgResponseMin: 11 },
    { day: 'Thu', activeIncidents: 240, resolved: 210, avgResponseMin: 9 },
    { day: 'Fri', activeIncidents: 210, resolved: 230, avgResponseMin: 8 },
    { day: 'Sat', activeIncidents: 160, resolved: 190, avgResponseMin: 8 },
    { day: 'Sun', activeIncidents: 110, resolved: 140, avgResponseMin: 7 }
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard HUD', icon: BarChart2 },
    { id: 'iam', label: 'User Directory (IAM)', icon: Users },
    { id: 'rbac', label: 'Role Controls (RBAC)', icon: Shield },
    { id: 'resources', label: 'Resource Catalog', icon: Database },
    { id: 'backup', label: 'Backup Scheduler', icon: Clock },
    { id: 'settings', label: 'Platform Config', icon: Settings },
    { id: 'audit', label: 'System Audit Logs', icon: FileText },
    { id: 'incidents', label: 'Incident Triage', icon: AlertTriangle },
    { id: 'content', label: 'Advisories Publisher', icon: Edit3 },
    { id: 'analytics', label: 'Platform Analytics', icon: Activity },
    { id: 'notifications', label: 'Notification Gateway', icon: Bell },
    { id: 'integrations', label: 'External APIs', icon: Link2 }
  ];

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesLevel = auditFilterLevel === 'ALL' || log.level === auditFilterLevel;
    const matchesSearch = auditSearch === '' || 
      log.service.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.message.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.user.toLowerCase().includes(auditSearch.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] text-slate-800 min-h-screen relative font-sans">
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce border border-slate-700">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Admin Header Bar */}
      <div className="bg-[#1e1b4b] text-white text-xs px-6 py-3 flex flex-wrap items-center justify-between font-medium shadow-md border-b border-indigo-900/50 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-600/30 rounded-lg border border-indigo-500/40">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-wide">APEX SYSTEM ADMINISTRATION PORTAL</h1>
            <p className="text-[10px] text-indigo-300 font-mono">RAKSHASETU HIGH-AVAILABILITY CLUSTER v2.4 • MULTI-TENANT GATEWAY</p>
          </div>
        </div>

        {/* State & District / City Selector Widget */}
        <RegionSelector onRegionChange={(st, dist) => showToast(`Admin scope updated to ${st} • ${dist}`)} />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-indigo-950/80 px-3 py-1.5 rounded-lg border border-indigo-800/60 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-bold">ALL SYSTEMS OPERATIONAL</span>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className="w-64 bg-[#0f172a] text-slate-300 p-4 flex flex-col justify-between border-r border-slate-800 shadow-xl">
          <div className="space-y-1 overflow-y-auto pr-1">
            <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">System Modules</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-bold' 
                      : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px]">
              <div className="text-slate-400 font-medium">Logged in as</div>
              <div className="font-bold text-white truncate">Apex Admin (SUPER_ADMIN)</div>
              <div className="text-indigo-400 text-[10px] font-mono">admin@rakshasetu.gov.in</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-slate-800 hover:bg-rose-950/50 hover:text-rose-400 text-slate-300 border border-slate-700 hover:border-rose-800/50 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out Panel</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Content Main Panel */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: DASHBOARD HUD */}
          {activeSubTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">System Dashboard HUD</h2>
                  <p className="text-xs text-slate-500">Real-time metrics on network throughput, active user sessions, and resource deployment</p>
                </div>
                <button onClick={() => showToast('Refreshing telemetry...')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase">API Ingestion Rate</div>
                  <div className="text-2xl font-extrabold text-blue-600 mt-1">18,500 <span className="text-xs font-normal text-slate-500">req/m</span></div>
                  <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">↑ 14% vs baseline</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase">Active Platform Users</div>
                  <div className="text-2xl font-extrabold text-purple-600 mt-1">1,024,890</div>
                  <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">99.8% websocket uptime</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase">Emergency Incidents</div>
                  <div className="text-2xl font-extrabold text-amber-600 mt-1">118 <span className="text-xs font-normal text-slate-500">Active</span></div>
                  <div className="text-[11px] text-indigo-600 mt-1">24 P1 Critical assigned</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase">Gateway Latency</div>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-1">28 ms</div>
                  <div className="text-[11px] text-slate-500 mt-1">Kong API Proxy Edge</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" /> Gateway Ingestion & Latency (24h)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaData}>
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip />
                        <Area type="monotone" dataKey="requests" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" /> Active Session Distribution by Role
                  </h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                          {donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER DIRECTORY (IAM) */}
          {activeSubTab === 'iam' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">IAM User Provisioning & Directory</h2>
                  <p className="text-xs text-slate-500">Manage user accounts, assign administrative roles, and revoke platform access</p>
                </div>
                <button
                  onClick={() => { setEditingUser(null); setUserForm({ name: '', email: '', role: 'GOVERNMENT_OFFICER', dept: 'DDMA' }); setShowAddUserModal(true); }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Provision New User
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase font-bold text-slate-500">
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Assigned Role</th>
                      <th className="py-3 px-4">Department / Org</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {userList.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-bold text-slate-600">{u.id}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{u.name}</td>
                        <td className="py-3 px-4 text-slate-600 font-mono">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.role === 'SUPER_ADMIN' ? 'bg-rose-100 text-rose-700' :
                            u.role === 'GOVERNMENT_OFFICER' ? 'bg-purple-100 text-purple-700' :
                            u.role === 'FIELD_RESPONDER' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{u.dept}</td>
                        <td className="py-3 px-4 text-center space-x-2">
                          <button
                            onClick={() => { setEditingUser(u); setUserForm({ name: u.name, email: u.email, role: u.role, dept: u.dept }); setShowAddUserModal(true); }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-bold text-[11px] cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-md font-bold text-[11px] cursor-pointer"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ROLE MANAGEMENT (RBAC) */}
          {activeSubTab === 'rbac' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Role-Based Access Control (RBAC) Permissions</h2>
                <p className="text-xs text-slate-500">Toggle system capability privileges across role definitions</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase font-bold text-slate-500">
                      <th className="py-3 px-4">Role Definition</th>
                      <th className="py-3 px-4 text-center">User Manage</th>
                      <th className="py-3 px-4 text-center">Resource CRUD</th>
                      <th className="py-3 px-4 text-center">Backup Trigger</th>
                      <th className="py-3 px-4 text-center">Platform Config</th>
                      <th className="py-3 px-4 text-center">Incident Triage</th>
                      <th className="py-3 px-4 text-center">Broadcast Alerts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {Object.keys(rbacMatrix).map(role => (
                      <tr key={role} className="hover:bg-slate-50/80">
                        <td className="py-4 px-4 font-bold text-slate-800 font-mono">{role}</td>
                        {Object.keys(rbacMatrix[role]).map(perm => (
                          <td key={perm} className="py-4 px-4 text-center">
                            <button
                              onClick={() => toggleRbacPermission(role, perm)}
                              className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-colors cursor-pointer ${
                                rbacMatrix[role][perm] ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                              }`}
                            >
                              {rbacMatrix[role][perm] ? 'ALLOWED' : 'DENIED'}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: RESOURCE CATALOG */}
          {activeSubTab === 'resources' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">State Resource Catalog & Inventory CRUD</h2>
                  <p className="text-xs text-slate-500">Track and manage emergency rescue equipment, machinery, and relief supplies</p>
                </div>
                <button
                  onClick={() => { setEditingResource(null); setResourceForm({ name: '', category: 'RESCUE_VEHICLE', qty: 10, location: '', dept: '' }); setShowAddResourceModal(true); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Resource
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase font-bold text-slate-500">
                      <th className="py-3 px-4">Resource ID</th>
                      <th className="py-3 px-4">Resource Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Quantity</th>
                      <th className="py-3 px-4">Depot Location</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {resourceList.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-bold text-slate-600">{r.id}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{r.name}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] rounded-md font-bold">
                            {r.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-blue-600">{r.qty} units</td>
                        <td className="py-3 px-4 text-slate-600">{r.location}</td>
                        <td className="py-3 px-4 text-slate-600">{r.dept}</td>
                        <td className="py-3 px-4 text-center space-x-2">
                          <button
                            onClick={() => { setEditingResource(r); setResourceForm({ name: r.name, category: r.category, qty: r.qty, location: r.location, dept: r.dept }); setShowAddResourceModal(true); }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-bold text-[11px] cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteResource(r.id, r.name)}
                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-md font-bold text-[11px] cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP SCHEDULER */}
          {activeSubTab === 'backup' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Database Backup & Disaster Recovery Scheduler</h2>
                  <p className="text-xs text-slate-500">Configure automated Cron snapshots and trigger manual failover back-ups</p>
                </div>
                <button
                  onClick={handleTriggerSnapshot}
                  disabled={isTakingSnapshot}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isTakingSnapshot ? 'animate-spin' : ''}`} />
                  {isTakingSnapshot ? 'Creating Snapshot...' : 'Trigger Immediate DB Snapshot'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800">Cron Schedule Settings</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Automated Schedule Cron</label>
                    <input
                      type="text"
                      value={backupSchedule.cron}
                      onChange={e => setBackupSchedule({...backupSchedule, cron: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Retention Window (Days)</label>
                    <input
                      type="number"
                      value={backupSchedule.retentionDays}
                      onChange={e => setBackupSchedule({...backupSchedule, retentionDays: Number(e.target.value)})}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <button onClick={handleSaveConfig} className="w-full py-2 bg-slate-900 text-white font-bold rounded-lg text-xs cursor-pointer">
                    Save Schedule Policy
                  </button>
                </div>

                <div className="col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800">Snapshot Logs & Checksums</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                          <th className="py-2">Snapshot ID</th>
                          <th className="py-2">Timestamp</th>
                          <th className="py-2">Type</th>
                          <th className="py-2">Size</th>
                          <th className="py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {backupLogs.map(b => (
                          <tr key={b.id}>
                            <td className="py-2.5 font-bold text-purple-700">{b.id}</td>
                            <td className="py-2.5 text-slate-600">{b.timestamp}</td>
                            <td className="py-2.5 text-slate-800">{b.type}</td>
                            <td className="py-2.5 text-slate-600">{b.size}</td>
                            <td className="py-2.5 text-emerald-600 font-bold">{b.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PLATFORM CONFIGURATION */}
          {activeSubTab === 'settings' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Platform Gateway & Security Configuration</h2>
                <p className="text-xs text-slate-500">Fine-tune Kong API rate-limit throttles, Keycloak OAuth timeouts, and emergency sirens</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kong API Gateway Global Rate Limit (req/min)</label>
                    <input
                      type="number"
                      value={platformConfig.kongRateLimit}
                      onChange={e => setPlatformConfig({...platformConfig, kongRateLimit: Number(e.target.value)})}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Keycloak Session Inactivity Timeout (Minutes)</label>
                    <input
                      type="number"
                      value={platformConfig.keycloakSessionTimeout}
                      onChange={e => setPlatformConfig({...platformConfig, keycloakSessionTimeout: Number(e.target.value)})}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Redis In-Memory Telemetry Cache TTL (Seconds)</label>
                    <input
                      type="number"
                      value={platformConfig.redisTtl}
                      onChange={e => setPlatformConfig({...platformConfig, redisTtl: Number(e.target.value)})}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-800 text-sm">Emergency System Overrides</h3>
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <div>
                      <div className="text-xs font-bold text-slate-800">System Maintenance Lockout</div>
                      <div className="text-[10px] text-slate-500">Restricts platform logins exclusively to SUPER_ADMIN accounts</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformConfig.maintenanceMode}
                      onChange={e => setPlatformConfig({...platformConfig, maintenanceMode: e.target.checked})}
                      className="w-4 h-4 accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Verbose Security Audit Debugging</div>
                      <div className="text-[10px] text-slate-500">Stream detailed payload traces into audit log storage</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={platformConfig.debugLogging}
                      onChange={e => setPlatformConfig({...platformConfig, debugLogging: e.target.checked})}
                      className="w-4 h-4 accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={handleSaveConfig}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer mt-4"
                  >
                    Apply & Save Platform Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SYSTEM AUDIT LOGS */}
          {activeSubTab === 'audit' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">System Audit Trail & Access Logs</h2>
                  <p className="text-xs text-slate-500">Immutable ledger of administrative actions, auth tokens, and system exceptions</p>
                </div>
                <button
                  onClick={() => showToast('Audit logs exported to CSV.')}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Export Logs (CSV)
                </button>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search logs by service, message, or user..."
                    value={auditSearch}
                    onChange={e => setAuditSearch(e.target.value)}
                    className="w-full bg-transparent outline-none text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={auditFilterLevel}
                    onChange={e => setAuditFilterLevel(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg p-1.5 font-bold text-xs"
                  >
                    <option value="ALL">All Levels</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="INFO">INFO</option>
                    <option value="WARNING">WARNING</option>
                    <option value="ERROR">ERROR</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100 text-slate-500 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Log ID</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Service Module</th>
                      <th className="py-2.5 px-3">IP Address</th>
                      <th className="py-2.5 px-3">Level</th>
                      <th className="py-2.5 px-3">User</th>
                      <th className="py-2.5 px-3">Log Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAuditLogs.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 text-slate-400">{l.id}</td>
                        <td className="py-3 px-3 text-slate-600">{l.timestamp}</td>
                        <td className="py-3 px-3 text-indigo-600 font-bold">{l.service}</td>
                        <td className="py-3 px-3 text-slate-500">{l.ip}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.level === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' :
                            l.level === 'WARNING' ? 'bg-amber-100 text-amber-700' :
                            l.level === 'ERROR' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {l.level}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700">{l.user}</td>
                        <td className="py-3 px-3 text-slate-900 font-sans">{l.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: INCIDENT TRIAGE CONTROLS */}
          {activeSubTab === 'incidents' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Incident Triage & Priority Escalate Controls</h2>
                  <p className="text-xs text-slate-500">Override incident priorities, reassign dispatch teams, and mark verified resolutions</p>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs">
                  {incidentTriageList.filter(i => i.status !== 'RESOLVED').length} Active Triage Queue Items
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase font-bold text-slate-500">
                      <th className="py-3 px-4">Incident ID</th>
                      <th className="py-3 px-4">Title / Description</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Priority Level</th>
                      <th className="py-3 px-4">Water Depth</th>
                      <th className="py-3 px-4">Assigned Squad</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Triage Override Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {incidentTriageList.map(inc => (
                      <tr key={inc.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-mono font-bold text-purple-700">{inc.id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{inc.title}</td>
                        <td className="py-3.5 px-4 text-slate-600">{inc.location}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            inc.priority === 'P1_CRITICAL' ? 'bg-rose-600 text-white animate-pulse' :
                            inc.priority === 'P2_HIGH' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                          }`}>
                            {inc.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{inc.waterDepth}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-semibold">{inc.squad}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inc.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {inc.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center space-x-2">
                          {inc.status !== 'RESOLVED' && (
                            <>
                              <button
                                onClick={() => handleEscalateIncident(inc.id)}
                                className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-md font-bold text-[11px] cursor-pointer"
                              >
                                Escalate P1
                              </button>
                              <button
                                onClick={() => handleResolveIncident(inc.id)}
                                className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-md font-bold text-[11px] cursor-pointer"
                              >
                                Mark Resolved
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: CONTENT & ADVISORIES PUBLISHER */}
          {activeSubTab === 'content' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Content & Official Public Advisories Publisher</h2>
                  <p className="text-xs text-slate-500">Draft, publish, and toggle public alert bulletins broadcasted across Citizen apps</p>
                </div>
                <button
                  onClick={() => setShowAddAdvisoryModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create Public Advisory
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {advisoryList.map(adv => (
                  <div key={adv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-purple-700">{adv.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          adv.level === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {adv.level}
                        </span>
                        <span className="text-xs text-slate-500">• Zone: <strong className="text-slate-800">{adv.zone}</strong></span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{adv.title}</h3>
                      <p className="text-[11px] text-slate-500">Published on {adv.date} by {adv.author}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        adv.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {adv.status}
                      </span>
                      <button
                        onClick={() => toggleAdvisoryStatus(adv.id)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Toggle Publish State
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: PLATFORM ANALYTICS */}
          {activeSubTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Platform Analytics & Emergency Incident Trends</h2>
                <p className="text-xs text-slate-500">7-day performance analysis of incident resolution velocity and rescue team deployment</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">7-Day Incident Triage & Resolution Volume</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendLineData}>
                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="activeIncidents" stroke="#ef4444" strokeWidth={2} name="Active Incidents" />
                        <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved Incidents" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">District Resource Allocation Breakdown</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barChartData}>
                        <XAxis dataKey="district" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="incidents" fill="#8b5cf6" name="Incidents" />
                        <Bar dataKey="rescueBoats" fill="#3b82f6" name="Rescue Boats" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: NOTIFICATION GATEWAY */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Multi-Channel Notification Gateway & Emergency Siren</h2>
                  <p className="text-xs text-slate-500">Twilio SMS Gateway, Firebase Cloud Messaging (FCM), and 112 Public Sirens</p>
                </div>
                <button
                  onClick={() => setShowTestPushModal(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Bell className="w-4 h-4" /> Trigger Test Broadcast Alert
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase">SMS Delivered Today</div>
                  <div className="text-2xl font-extrabold text-blue-600 mt-1">{notificationStats.smsSentToday.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Twilio Shortcode 56161</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase">Push Alerts (FCM)</div>
                  <div className="text-2xl font-extrabold text-purple-600 mt-1">{notificationStats.pushSentToday.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Android & iOS Push</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase">Public Siren Triggers</div>
                  <div className="text-2xl font-extrabold text-amber-600 mt-1">{notificationStats.sirenBroadcasts} <span className="text-xs font-normal text-slate-500">Events</span></div>
                  <div className="text-[11px] text-slate-500 mt-1">112 Sector Speakers</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-400 uppercase">Delivery SLA</div>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-1">{notificationStats.deliveryRate}</div>
                  <div className="text-[11px] text-slate-500 mt-1">&lt; 1.5s Latency</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: EXTERNAL API INTEGRATIONS */}
          {activeSubTab === 'integrations' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">External Government API Integrations & Telemetry Feeds</h2>
                <p className="text-xs text-slate-500">Real-time sync connections with CWC, IMD, NDMA, and ISRO satellite GIS servers</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {externalApis.map(api => (
                  <div key={api.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-600" />
                        <span className="font-bold text-slate-900 text-sm">{api.name}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {api.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-mono bg-white p-2 rounded-lg border border-slate-200 truncate">
                      {api.endpoint}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                      <span>Latency: <strong className="text-slate-800 font-mono">{api.ping}</strong></span>
                      <span>Last Synced: <strong className="text-slate-800">{api.lastSync}</strong></span>
                      <button
                        onClick={() => handleTestApiConnection(api.id, api.name)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Ping Connection
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT USER */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">{editingUser ? 'Edit IAM User Account' : 'Provision New IAM Account'}</h3>
            <form onSubmit={handleAddUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="e.g. Officer Sunita Rao"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="e.g. sunita@ddma.gov.in"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">System Role</label>
                <select
                  value={userForm.role}
                  onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  <option value="GOVERNMENT_OFFICER">GOVERNMENT_OFFICER</option>
                  <option value="FIELD_RESPONDER">FIELD_RESPONDER</option>
                  <option value="CITIZEN">CITIZEN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Department / Organization</label>
                <input
                  type="text"
                  value={userForm.dept}
                  onChange={e => setUserForm({ ...userForm, dept: e.target.value })}
                  placeholder="e.g. State Disaster Control Cell"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  {editingUser ? 'Save User' : 'Provision User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT RESOURCE */}
      {showAddResourceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">{editingResource ? 'Edit Catalog Resource' : 'Add Resource to Catalog'}</h3>
            <form onSubmit={handleAddResourceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Resource Name</label>
                <input
                  type="text"
                  required
                  value={resourceForm.name}
                  onChange={e => setResourceForm({ ...resourceForm, name: e.target.value })}
                  placeholder="e.g. Inflatable Rescue Motorboat"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Category</label>
                <select
                  value={resourceForm.category}
                  onChange={e => setResourceForm({ ...resourceForm, category: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  <option value="RESCUE_VEHICLE">RESCUE_VEHICLE</option>
                  <option value="MACHINERY">MACHINERY</option>
                  <option value="SHELTER">SHELTER</option>
                  <option value="COMMUNICATION">COMMUNICATION</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  value={resourceForm.qty}
                  onChange={e => setResourceForm({ ...resourceForm, qty: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Depot Location</label>
                <input
                  type="text"
                  value={resourceForm.location}
                  onChange={e => setResourceForm({ ...resourceForm, location: e.target.value })}
                  placeholder="e.g. Silchar Yard"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  {editingResource ? 'Save Changes' : 'Register Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ADVISORY */}
      {showAddAdvisoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Broadcast Public Emergency Advisory</h3>
            <form onSubmit={handleCreateAdvisorySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Advisory Title</label>
                <input
                  type="text"
                  required
                  value={newAdvisory.title}
                  onChange={e => setNewAdvisory({ ...newAdvisory, title: e.target.value })}
                  placeholder="e.g. Flash Flood Evacuation Notice"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Target District / Zone</label>
                <input
                  type="text"
                  value={newAdvisory.zone}
                  onChange={e => setNewAdvisory({ ...newAdvisory, zone: e.target.value })}
                  placeholder="e.g. Guwahati Urban District"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Urgency Severity Level</label>
                <select
                  value={newAdvisory.level}
                  onChange={e => setNewAdvisory({ ...newAdvisory, level: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="ADVISORY">ADVISORY</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAdvisoryModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Broadcast Advisory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TEST PUSH BROADCAST */}
      {showTestPushModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Trigger Gateway Test Broadcast</h3>
            <form onSubmit={handleSendTestPush} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Target District</label>
                <input
                  type="text"
                  value={testPushData.district}
                  onChange={e => setTestPushData({ ...testPushData, district: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Alert Headline</label>
                <input
                  type="text"
                  value={testPushData.title}
                  onChange={e => setTestPushData({ ...testPushData, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTestPushModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Send Gateway Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
