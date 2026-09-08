import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CitizenSubTab } from '../../types';
import { INDIA_LOCATIONS } from '../../data/indiaLocations';
import { 
  LayoutGrid, Bell, Camera, Home as HomeIcon, Package, BookOpen, 
  Phone, CheckSquare, MessageSquare, AlertTriangle, ShieldCheck, Zap, 
  MapPin, Globe, Compass, Sparkles, Droplets, Navigation, ChevronDown, CheckCircle2,
  UploadCloud, Image as ImageIcon, Video as VideoIcon, Trash2, Send, Radio, PhoneCall,
  UserCheck, Layers, Plus, Minus, Filter, ExternalLink, HelpCircle, Star, FileText,
  LifeBuoy, ShieldAlert, Check, RefreshCw, LogOut, PhoneOff, Shield, Search, Sliders, BellRing, Smartphone, Mail, MessageCircle
} from 'lucide-react';
import { LiveMap } from '../../components/LiveMap';
import { RegionSelector } from '../../components/RegionSelector';

import { getTranslation } from '../../utils/translations';

interface UploadedMedia {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'video';
  url: string;
}

interface ShelterData {
  id: string;
  name: string;
  district: string;
  address: string;
  distance: string;
  capacity: number;
  occupied: number;
  status: 'OPEN' | 'NEAR FULL' | 'FULL';
  contact: string;
  amenities: string[];
  lat: number;
  lng: number;
}

export const CitizenPanel: React.FC = () => {
  const { subTabs, setCitizenSubTab, setPanel, isOffline, addOfflineMutation, language } = useAppStore();
  const currentTab = subTabs.citizen;

  // Active Route State for Map Navigation
  const [activeRouteTarget, setActiveRouteTarget] = useState<{ name: string; lat: number; lng: number; distance: string } | null>(null);

  // State & District Location Selectors
  const [selectedState, setSelectedState] = useState<string>('Assam');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Kamrup Metropolitan (Guwahati)');

  // Media & Incident Uploader State
  const [showReportModal, setShowReportModal] = useState(false);
  const [category, setCategory] = useState('Severe Waterlogging / Rising Flood');
  const [description, setDescription] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Report History State
  const [myReportsHistory, setMyReportsHistory] = useState([
    {
      id: 'REP-2026-9041',
      category: 'Severe Waterlogging / Rising Flood',
      location: 'Kamrup Metropolitan (Guwahati), Assam',
      description: 'Water depth reached 3.5 ft near Sector 9 market line. 4 households stranded on upper terrace.',
      timestamp: '2026-09-07 16:30 IST',
      status: 'VERIFIED',
      ndrfAction: 'NDRF Bravo-04 Boat Team dispatched to site at 16:42 IST',
      mediaCount: 2
    },
    {
      id: 'REP-2026-8812',
      category: 'Electrical / Infrastructure Hazard',
      location: 'Kamrup Metropolitan (Guwahati), Assam',
      description: 'High voltage transformer sparking near flooded road junction.',
      timestamp: '2026-09-06 11:15 IST',
      status: 'RESOLVED',
      ndrfAction: 'State Electricity Board isolated transformer & restored grid safety',
      mediaCount: 1
    },
    {
      id: 'REP-2026-7490',
      category: 'Landslide & Road Blockade',
      location: 'Kamrup Metropolitan (Guwahati), Assam',
      description: 'Minor mudslide blocking two lanes near bypass elevated bridge.',
      timestamp: '2026-09-05 09:40 IST',
      status: 'UNDER REVIEW',
      ndrfAction: 'District Operations reviewing excavator deployment request',
      mediaCount: 0
    }
  ]);

  // Relief Shelter Search & Filter State
  const [shelterSearch, setShelterSearch] = useState('');
  const [shelterStatusFilter, setShelterStatusFilter] = useState<'ALL' | 'OPEN' | 'NEAR FULL' | 'FULL'>('ALL');

  // Personalized Alert Subscriptions State
  const [phoneNo, setPhoneNo] = useState('+91 98765 43210');
  const [emailAddr, setEmailAddr] = useState('rohit.kalita@gmail.com');
  const [channelApp, setChannelApp] = useState(true);
  const [channelSms, setChannelSms] = useState(true);
  const [channelWhatsapp, setChannelWhatsapp] = useState(true);
  const [channelSiren, setChannelSiren] = useState(true);
  const [channelEmail, setChannelEmail] = useState(false);

  const [disasterFlood, setDisasterFlood] = useState(true);
  const [disasterLandslide, setDisasterLandslide] = useState(true);
  const [disasterSeismic, setDisasterSeismic] = useState(true);
  const [disasterDam, setDisasterDam] = useState(true);
  const [disasterRain, setDisasterRain] = useState(true);
  const [disasterEpidemic, setDisasterEpidemic] = useState(false);

  const [severityThreshold, setSeverityThreshold] = useState('LEVEL2');
  const [quietHoursOverride, setQuietHoursOverride] = useState(true);
  const [alertSavedToast, setAlertSavedToast] = useState(false);

  // Daily Checklist State
  const [checklist, setChecklist] = useState([
    { id: '1', task: 'Reserve 5 Liters of Sealed Drinking Water per person', completed: true },
    { id: '2', task: 'Charge Mobile Phones, Power Banks & Emergency Torches to 100%', completed: true },
    { id: '3', task: 'Seal Essential Documents (Aadhaar, Passport, Meds) in Waterproof Pouch', completed: true },
    { id: '4', task: 'Keep First Aid Box & Essential Prescription Medicines Ready', completed: true },
    { id: '5', task: 'Confirm Family Emergency Evacuation Point & Route', completed: false },
    { id: '6', task: 'Keep ₹2,000 Emergency Cash in Small Denominations', completed: false }
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Safety Guides Search State
  const [guideSearch, setGuideSearch] = useState('');

  // SOS Emergency State
  const [sosHeadcount, setSosHeadcount] = useState('1');
  const [sosMedicalNeeded, setSosMedicalNeeded] = useState(false);
  const [sosElderlyPresent, setSosElderlyPresent] = useState(false);
  const [sosRoofStranded, setSosRoofStranded] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);

  // Feedback State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Relief Supply Issue');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Chatbot State
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'AI', text: 'Hello Rohit! I am RakshaSetu AI Safety Assistant. How can I assist you with shelters, emergency SOS, or evacuation routes today?' }
  ]);

  // Shelter Mock Data List
  const sheltersList: ShelterData[] = [
    {
      id: 'SHELTER-01',
      name: `${selectedDistrict} Central Govt High School`,
      district: selectedDistrict,
      address: 'Main Road, Block B, Near Elevated Highway',
      distance: '1.8 km',
      capacity: 1500,
      occupied: 1140,
      status: 'OPEN',
      contact: '+91 361 2459001',
      amenities: ['Hot Meals', '2 Doctors On-Duty', 'Clean Water', 'Generators'],
      lat: 28.6100,
      lng: 77.2180
    },
    {
      id: 'SHELTER-02',
      name: 'Beltola Community Relief Hall',
      district: selectedDistrict,
      address: 'Sector 4, Dispur Bypass Road',
      distance: '3.2 km',
      capacity: 800,
      occupied: 740,
      status: 'NEAR FULL',
      contact: '+91 361 2459002',
      amenities: ['Dry Rations', 'First Aid', 'Solar Power'],
      lat: 28.6050,
      lng: 77.2300
    },
    {
      id: 'SHELTER-03',
      name: 'Kamrup Indoor Sports Stadium Camp',
      district: selectedDistrict,
      address: 'Sports Complex Road, Elevation Zone',
      distance: '4.5 km',
      capacity: 3000,
      occupied: 1850,
      status: 'OPEN',
      contact: '+91 361 2459003',
      amenities: ['ICU Beds', 'Hot Meals', 'Sanitation Kits', 'Helipad'],
      lat: 28.6250,
      lng: 77.2010
    },
    {
      id: 'SHELTER-04',
      name: 'University Campus Safe Shelter Hub',
      district: selectedDistrict,
      address: 'Academic Block 2, High Ground',
      distance: '5.1 km',
      capacity: 2500,
      occupied: 1200,
      status: 'OPEN',
      contact: '+91 361 2459004',
      amenities: ['Wi-Fi Mesh', 'Child Care', 'Boiled Water', 'Medical Squad'],
      lat: 28.6180,
      lng: 77.2050
    },
    {
      id: 'SHELTER-05',
      name: 'Dispur Municipal Secondary School',
      district: selectedDistrict,
      address: 'G.S. Road, Sector 2',
      distance: '6.2 km',
      capacity: 1000,
      occupied: 1000,
      status: 'FULL',
      contact: '+91 361 2459005',
      amenities: ['First Aid', 'Emergency Power', 'Subsidized Canteen'],
      lat: 28.5900,
      lng: 77.2150
    }
  ];

  const filteredShelters = sheltersList.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(shelterSearch.toLowerCase()) || s.address.toLowerCase().includes(shelterSearch.toLowerCase());
    const matchesStatus = shelterStatusFilter === 'ALL' || s.status === shelterStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const loc = INDIA_LOCATIONS.find((l) => l.state === state);
    if (loc && loc.districts.length > 0) {
      setSelectedDistrict(loc.districts[0]);
    }
  };

  const navItems: { id: CitizenSubTab; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: getTranslation('dashboard', language), icon: LayoutGrid },
    { id: 'alert-subscription', label: getTranslation('alert_subscriptions', language), icon: BellRing, badge: 'NEW' },
    { id: 'sos', label: getTranslation('emergency_sos', language), icon: AlertTriangle, badge: 'P1 SOS' },
    { id: 'report-incident', label: getTranslation('report_incident', language), icon: Camera, badge: 'Camera' },
    { id: 'report-history', label: getTranslation('report_history', language), icon: FileText, badge: 'History' },
    { id: 'safe-zones', label: getTranslation('relief_shelters', language), icon: HomeIcon, badge: 'Live Map' },
    { id: 'daily-checklist', label: getTranslation('daily_checklist', language), icon: CheckSquare },
    { id: 'safety-guides', label: getTranslation('safety_guides', language), icon: BookOpen },
    { id: 'contacts-112', label: getTranslation('helpline', language), icon: Phone },
    { id: 'chatbot', label: getTranslation('ai_assistant', language), icon: Sparkles },
    { id: 'feedback', label: getTranslation('feedback_support', language), icon: MessageSquare }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out from Citizen Panel?')) {
      setPanel('auth');
    }
  };

  // Save Alert Subscription Preferences
  const handleSaveAlertPreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertSavedToast(true);
    setTimeout(() => setAlertSavedToast(false), 4000);
  };

  // Handle File Selection for Photo/Video Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(30);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 35;
      });
    }, 150);

    Array.from(files).forEach((file, idx) => {
      const isVideo = file.type.startsWith('video');
      const newMedia: UploadedMedia = {
        id: `media_${Date.now()}_${idx}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: isVideo ? 'video' : 'image',
        url: URL.createObjectURL(file)
      };
      setUploadedMedia((prev) => [...prev, newMedia]);
    });
  };

  const handleRemoveMedia = (id: string) => {
    setUploadedMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && uploadedMedia.length === 0) {
      alert('Please provide observation details or attach photo/video media proof.');
      return;
    }

    const payload = {
      category,
      description,
      state: selectedState,
      district: selectedDistrict,
      location: `${selectedDistrict}, ${selectedState}`,
      mediaCount: uploadedMedia.length,
      timestamp: new Date().toISOString()
    };

    // Add to local history list
    const newHistoryItem = {
      id: `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      location: `${selectedDistrict}, ${selectedState}`,
      description: description || 'Visual media report attached.',
      timestamp: 'Just now (GPS Verified)',
      status: 'UNDER REVIEW',
      ndrfAction: 'Submitted to District Operations & NDRF Control',
      mediaCount: uploadedMedia.length
    };
    setMyReportsHistory((prev) => [newHistoryItem, ...prev]);

    if (isOffline) {
      addOfflineMutation({ type: 'CITIZEN_INCIDENT_REPORT', payload, timestamp: new Date().toISOString() });
      alert('Report saved to Dexie local DB! Auto-sync will trigger when connection is restored.');
    } else {
      alert(`✅ Incident Report Submitted Successfully!\nLocation: ${selectedDistrict}, ${selectedState}\nCategory: ${category}\nMedia Files Attached: ${uploadedMedia.length}`);
    }

    setDescription('');
    setUploadedMedia([]);
    setShowReportModal(false);
    setCitizenSubTab('report-history');
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newItem = {
      id: `task_${Date.now()}`,
      task: newChecklistText.trim(),
      completed: false
    };
    setChecklist((prev) => [...prev, newItem]);
    setNewChecklistText('');
  };

  const handleTriggerSos = () => {
    setSosTriggered(true);
    alert(`🚨 EMERGENCY SOS DISPATCHED TO NDRF CONTROL!\nLocation: ${selectedDistrict}, ${selectedState} (28.6139° N, 77.2090° E)\nStranded Headcount: ${sosHeadcount}\nSpecial Medical/Evacuation Flagged: ${sosMedicalNeeded ? 'YES' : 'NO'}`);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackSubject('');
      setFeedbackMsg('');
    }, 4000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const msg = chatMessage;
    setChatHistory((prev) => [...prev, { sender: 'User', text: msg }]);
    setChatMessage('');

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { 
          sender: 'AI', 
          text: `Relief Shelter in ${selectedDistrict} is open. High ground route via main highway is clear. Emergency Helpline 112 / 1079 active.` 
        }
      ]);
    }, 600);
  };

  const completedChecklistCount = checklist.filter((c) => c.completed).length;
  const checklistPercentage = Math.round((completedChecklistCount / checklist.length) * 100);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 min-h-screen font-sans">
      {/* Top Header Banner */}
      <section className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between text-xs shadow-2xs z-20 gap-2">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200/90 text-emerald-800 font-bold px-3 py-1.5 rounded-lg shrink-0">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-mono text-xs uppercase tracking-wider">CITIZEN SAFETY PORTAL</span>
          </div>
          <span className="text-slate-300 hidden md:inline">•</span>
          <span className="text-slate-600 font-medium truncate hidden md:inline">
            Real-Time Disaster Safety, Geotagged Reporting, Alert Subscriptions & Emergency 112 Response
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono shrink-0">
          <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200/90 px-3 py-1.5 rounded-lg text-slate-800 font-semibold shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>GPS Verified: <strong className="text-emerald-700 font-bold">{selectedDistrict}, {selectedState}</strong></span>
          </div>
        </div>
      </section>

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left White Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 text-slate-700 flex flex-col justify-between shrink-0 select-none shadow-2xs">
          <div className="p-3 space-y-4 overflow-y-auto">
            {/* User Profile Pill Card */}
            <div className="bg-slate-50 rounded-xl p-3 flex items-center space-x-3 border border-slate-200/90 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                RK
              </div>
              <div className="overflow-hidden leading-tight">
                <h4 className="text-xs font-bold text-slate-900 truncate">Rohit Kalita</h4>
                <p className="text-[10px] text-slate-500">Citizen ID: <span className="text-slate-800 font-semibold">#CZ-4820</span></p>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
                  <span className="text-[9px] text-emerald-700 font-bold">Geotag Verified</span>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCitizenSubTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-white font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs ${
                        item.badge === 'NEW' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Widgets */}
          <div className="p-3 space-y-2.5 border-t border-slate-200 bg-slate-50/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition shadow-2xs cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-600 shrink-0" />
              <span>Logout Session</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4">
          {/* Top Region Selector */}
          <RegionSelector onRegionChange={(st, dist) => { setSelectedState(st); setSelectedDistrict(dist); }} />

          {/* ========================================================= */}
          {/* 1. CITIZEN DASHBOARD SUBTAB                                */}
          {/* ========================================================= */}
          {currentTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl p-4 shadow-sm space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-100">Disaster Alert Level</span>
                  <div className="text-xl font-extrabold">LEVEL 3: HIGH FLOOD WATCH</div>
                  <p className="text-[11px] text-red-100">River water cresting above danger level. Evacuate low ground.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Nearest Open Shelter</span>
                  <div className="text-sm font-bold text-slate-900">{selectedDistrict} Govt High School</div>
                  <div className="text-xs font-bold text-emerald-600">1.8 km away • 1,140/1,500 Beds Occupied</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Alert Subscriptions</span>
                  <div className="text-xl font-extrabold text-blue-600">SMS, WhatsApp & Siren</div>
                  <div className="text-xs text-emerald-600 font-bold">Active for +91 98765****</div>
                </div>
                <div className="bg-rose-600 text-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-red-100 uppercase">Emergency Helpline</span>
                    <div className="text-2xl font-black">112</div>
                  </div>
                  <button onClick={() => setCitizenSubTab('sos')} className="px-3 py-1.5 bg-white text-rose-700 font-bold rounded-lg text-xs">
                    PRESS SOS
                  </button>
                </div>
              </div>

              {/* Live Map & Actions Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <section className="lg:col-span-2 bg-white rounded-xl p-4 shadow-2xs border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <h2 className="font-bold text-slate-900 text-sm">Live Safety & Tactical Grid Map</h2>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      {selectedDistrict}, {selectedState}
                    </span>
                  </div>
                  <div id="citizen-live-map">
                    <LiveMap height="h-[380px]" tacticalOverlay={true} activeRouteTarget={activeRouteTarget} />
                  </div>
                </section>

                <section className="bg-white rounded-xl p-4 shadow-2xs border border-slate-200 space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-xs tracking-wider uppercase">Citizen Quick Actions</h3>
                  <button onClick={() => setCitizenSubTab('report-incident')} className="w-full p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-left flex items-center gap-3">
                    <Camera className="w-5 h-5 text-rose-600" />
                    <div><div className="font-bold text-xs">Report Incident with Photo</div><div className="text-[10px] text-slate-500">Upload live observation photos/videos</div></div>
                  </button>
                  <button onClick={() => setCitizenSubTab('report-history')} className="w-full p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-left flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <div><div className="font-bold text-xs">My Report History</div><div className="text-[10px] text-slate-500">View status & updates on submitted reports</div></div>
                  </button>
                  <button onClick={() => setCitizenSubTab('safe-zones')} className="w-full p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-left flex items-center gap-3">
                    <HomeIcon className="w-5 h-5 text-blue-600" />
                    <div><div className="font-bold text-xs">Relief Shelters Map</div><div className="text-[10px] text-slate-500">Get route directions to high ground</div></div>
                  </button>
                  <button onClick={() => setCitizenSubTab('alert-subscription')} className="w-full p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-left flex items-center gap-3">
                    <BellRing className="w-5 h-5 text-indigo-600" />
                    <div><div className="font-bold text-xs">Personalized Alert Subscriptions</div><div className="text-[10px] text-slate-500">SMS, WhatsApp & Siren preferences</div></div>
                  </button>
                </section>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. MY REPORT HISTORY SUBTAB                                */}
          {/* ========================================================= */}
          {currentTab === 'report-history' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    {getTranslation('report_history', language)}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track all citizen observation reports submitted to NDRF Control & District Operations
                  </p>
                </div>
                <button
                  onClick={() => setCitizenSubTab('report-incident')}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Submit New Report</span>
                </button>
              </div>

              <div className="space-y-3">
                {myReportsHistory.map((rep) => (
                  <div key={rep.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 hover:border-slate-300 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{rep.id}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-semibold text-slate-600">{rep.category}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full font-mono ${
                        rep.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        rep.status === 'RESOLVED' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                        'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {rep.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-800 font-medium">
                      {rep.description}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                      <div>📍 Location: <strong className="text-slate-800">{rep.location}</strong></div>
                      <div>🕒 Submitted: <strong className="text-slate-800">{rep.timestamp}</strong></div>
                      <div>📷 Media Proof: <strong className="text-slate-800">{rep.mediaCount} Files Attached</strong></div>
                      <div>🛡️ NDRF Status: <strong className="text-emerald-700">{rep.ndrfAction}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. RELIEF SHELTERS MAP SUBTAB (SAFE-ZONES)                 */}
          {/* ========================================================= */}
          {currentTab === 'safe-zones' && (
            <div className="space-y-4">
              {/* Filter Controls Header */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <HomeIcon className="w-5 h-5 text-emerald-600" />
                    {getTranslation('relief_shelters', language)} & Evacuation Hubs
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live shelter capacity, water elevation safety status & routes in {selectedDistrict}, {selectedState}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={shelterSearch}
                      onChange={(e) => setShelterSearch(e.target.value)}
                      placeholder="Search shelter name..."
                      className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs w-48 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {(['ALL', 'OPEN', 'NEAR FULL', 'FULL'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setShelterStatusFilter(st)}
                        className={`px-3 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
                          shelterStatusFilter === st
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-200/80'
                        }`}
                      >
                        {st === 'ALL' ? getTranslation('all_shelters', language) :
                         st === 'OPEN' ? getTranslation('open_only', language) :
                         st === 'NEAR FULL' ? getTranslation('near_full', language) :
                         getTranslation('full_only', language)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Interactive Map Container */}
              <div id="citizen-shelter-map" className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Geospatial Radar & Shelter Pins</span>
                  <span className="font-mono text-emerald-600 font-bold">{filteredShelters.length} Shelters Verified Active</span>
                </div>
                <LiveMap height="h-[420px]" tacticalOverlay={true} activeRouteTarget={activeRouteTarget} />
              </div>

              {/* Detailed Shelters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredShelters.map((shelter) => {
                  const percentOccupied = Math.round((shelter.occupied / shelter.capacity) * 100);
                  return (
                    <div key={shelter.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded font-mono ${
                              shelter.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                              shelter.status === 'NEAR FULL' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {shelter.status}
                            </span>
                            <span className="text-xs font-mono text-slate-500">{shelter.distance} away</span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm mt-1">{shelter.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{shelter.address}</p>
                        </div>
                      </div>

                      {/* Capacity Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-600">{getTranslation('occupancy', language)}</span>
                          <span className="font-bold text-slate-900">{shelter.occupied} / {shelter.capacity} ({percentOccupied}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${percentOccupied >= 100 ? 'bg-red-600' : percentOccupied > 85 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                            style={{ width: `${percentOccupied}%` }}
                          />
                        </div>
                      </div>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {shelter.amenities.map((am, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px] font-semibold">
                            ✓ {am}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setActiveRouteTarget({
                              name: shelter.name,
                              lat: shelter.lat,
                              lng: shelter.lng,
                              distance: shelter.distance
                            });
                            const mapElem = document.getElementById('citizen-shelter-map');
                            if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>{getTranslation('get_route', language)}</span>
                        </button>

                        <button
                          onClick={() => alert(`Hotline dialed: ${shelter.contact}`)}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5 text-blue-600" />
                          <span>{getTranslation('call_manager', language)}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. REPORT INCIDENT SUBTAB                                  */}
          {/* ========================================================= */}
          {currentTab === 'report-incident' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Camera className="w-6 h-6 text-rose-600" />
                    Report Incident & Geotag Photo/Video
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload camera evidence of flooding or structural damage to alert NDRF and District Operations.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Incident Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800"
                  >
                    <option value="Severe Waterlogging / Rising Flood">Severe Waterlogging / Rising Flood</option>
                    <option value="Electrical / Infrastructure Hazard">Electrical / Infrastructure Hazard</option>
                    <option value="Landslide & Road Blockade">Landslide & Road Blockade</option>
                    <option value="Submerged Vehicle / Trapped Civilians">Submerged Vehicle / Trapped Civilians</option>
                    <option value="Potable Water / Medical Emergency">Potable Water / Medical Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Observation Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe exact ground observations, estimated water depth, and stranded counts..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Attach Camera Evidence (Photo / Video)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="incident-file-input"
                    />
                    <label htmlFor="incident-file-input" className="cursor-pointer space-y-2 block">
                      <UploadCloud className="w-8 h-8 text-blue-600 mx-auto" />
                      <div className="font-bold text-slate-800 text-xs">Click to browse or drop media files</div>
                      <div className="text-[10px] text-slate-500">Supports JPG, PNG, MP4 (Max 25MB)</div>
                    </label>
                  </div>
                </div>

                {uploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span>Uploading Media Files...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                {uploadedMedia.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 block text-xs">Attached Media Files ({uploadedMedia.length}):</span>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedMedia.map((m) => (
                        <div key={m.id} className="p-2 bg-slate-100 rounded-lg flex items-center justify-between border border-slate-200">
                          <div className="flex items-center space-x-2 truncate">
                            {m.type === 'video' ? <VideoIcon className="w-4 h-4 text-purple-600" /> : <ImageIcon className="w-4 h-4 text-blue-600" />}
                            <span className="truncate text-xs font-mono">{m.name}</span>
                          </div>
                          <button type="button" onClick={() => handleRemoveMedia(m.id)} className="text-rose-600 hover:text-rose-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Report to NDRF Control</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. DAILY CHECKLIST SUBTAB                                 */}
          {/* ========================================================= */}
          {currentTab === 'daily-checklist' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                    {getTranslation('daily_checklist', language)}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Disaster preparedness action plan for households in {selectedDistrict}, {selectedState}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">{completedChecklistCount} of {checklist.length} Completed</div>
                    <div className="text-[10px] text-emerald-600 font-bold">{checklistPercentage}% Readiness Score</div>
                  </div>
                  <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${checklistPercentage}%` }} />
                  </div>
                </div>
              </div>

              {/* Add Custom Task Form */}
              <form onSubmit={handleAddChecklistItem} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  placeholder="Add custom preparedness item (e.g. Extra baby formula, Pet leash)..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </form>

              {/* Checklist Items Card List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition ${
                      item.completed ? 'bg-slate-50/80' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                        item.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-semibold ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {item.task}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      item.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.completed ? 'READY' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. SAFETY & EVACUATION GUIDES SUBTAB                      */}
          {/* ========================================================= */}
          {currentTab === 'safety-guides' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    {getTranslation('safety_guides', language)}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Official NDRF & SDMA standard operating procedures for floods, landslides, and infrastructure hazards
                  </p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={guideSearch}
                    onChange={(e) => setGuideSearch(e.target.value)}
                    placeholder="Search guides..."
                    className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs w-52 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Flood Evacuation & High Ground Passage',
                    icon: Droplets,
                    color: 'text-blue-600 bg-blue-50 border-blue-200',
                    badge: 'HIGH PRIORITY',
                    steps: [
                      'Disconnect main circuit breakers & gas cylinder valves before leaving.',
                      'Evacuate towards designated high-ground school hubs or elevated bypass roads.',
                      'Do NOT walk through moving water deeper than knee-level (6 inches can knock down adults).'
                    ]
                  },
                  {
                    title: 'Earthquake Survival & Drop-Cover-Hold',
                    icon: AlertTriangle,
                    color: 'text-amber-600 bg-amber-50 border-amber-200',
                    badge: 'DISASTER DRILL',
                    steps: [
                      'DROP onto your hands and knees to prevent being knocked over.',
                      'COVER your head and neck under a sturdy table or desk.',
                      'HOLD ON until shaking completely stops. Watch for aftershocks.'
                    ]
                  },
                  {
                    title: 'Landslide & Hill Slope Precautions',
                    icon: ShieldAlert,
                    color: 'text-rose-600 bg-rose-50 border-rose-200',
                    badge: 'SLOPE WARNING',
                    steps: [
                      'Watch for leaning trees, pole tilting, or sudden trickles of muddy water on slopes.',
                      'Evacuate immediately if rumbling sound or soil cracking occurs.',
                      'Avoid taking shelter directly under steep unreinforced earthen embankments.'
                    ]
                  },
                  {
                    title: 'Electrical Hazard & Submerged Grid Safety',
                    icon: Zap,
                    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
                    badge: 'HAZARD SAFETY',
                    steps: [
                      'Treat all fallen power lines as live electrical hazards (stay 10+ meters away).',
                      'Never touch electrical switches while standing in flood water.',
                      'Report transformer sparking or submerged junction boxes immediately via 112 Desk.'
                    ]
                  }
                ]
                .filter(g => g.title.toLowerCase().includes(guideSearch.toLowerCase()))
                .map((guide, idx) => {
                  const GuideIcon = guide.icon;
                  return (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:shadow-md transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2.5 rounded-xl border ${guide.color}`}>
                            <GuideIcon className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm">{guide.title}</h3>
                        </div>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded font-mono">
                          {guide.badge}
                        </span>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-600 pt-1">
                        {guide.steps.map((st, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => alert(`📥 Downloading PDF Guide: ${guide.title}`)}
                        className="w-full mt-2 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Download PDF Pocket Guide</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. HELPLINE DESK 112 SUBTAB                                */}
          {/* ========================================================= */}
          {currentTab === 'contacts-112' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-rose-600" />
                    {getTranslation('helpline', language)} & Direct Emergency Directory
                  </h2>
                  <p className="text-xs text-slate-500">
                    24/7 Verified Emergency Hotlines in {selectedDistrict}, {selectedState}
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-mono text-xs font-bold flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ALL HOTLINES ACTIVE • AVG RESP 45s</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'National Emergency Response System', number: '112', desc: 'Single Unified Number for Police, Fire & Medical SOS', badge: 'CRITICAL', color: 'border-rose-300 bg-rose-50/40 text-rose-700' },
                  { title: 'NDRF Disaster Operations Control', number: '1078 / 011-24363260', desc: 'National Disaster Response Force Command Headquarters', badge: 'NDRF DIRECT', color: 'border-blue-300 bg-blue-50/40 text-blue-700' },
                  { title: 'State Disaster Management (SDMA)', number: '1070', desc: 'State Level Relief Coordination & Flood Watch', badge: 'STATE LEVEL', color: 'border-emerald-300 bg-emerald-50/40 text-emerald-700' },
                  { title: 'District Relief Operation Center', number: '1079', desc: `District Magistrate Control Room - ${selectedDistrict}`, badge: 'DISTRICT HQ', color: 'border-indigo-300 bg-indigo-50/40 text-indigo-700' },
                  { title: 'Fire & Emergency Rescue Service', number: '101', desc: 'Boat Deployment & Structural Collapse Rescue', badge: 'RESCUE', color: 'border-amber-300 bg-amber-50/40 text-amber-700' },
                  { title: 'Ambulance Emergency Medical Corps', number: '108', desc: '24/7 Paramedic Response & Trauma Care Evacuation', badge: 'MEDICAL', color: 'border-teal-300 bg-teal-50/40 text-teal-700' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded font-mono border ${item.color}`}>
                          {item.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">24/7 Verified</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm pt-1">{item.title}</h3>
                      <div className="text-xl font-black font-mono text-slate-900">{item.number}</div>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>

                    <button
                      onClick={() => alert(`📞 Dialing Hotline: ${item.number}`)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Call Hotline Now</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 8. AI EMERGENCY ASSISTANT SUBTAB (CHATBOT)                 */}
          {/* ========================================================= */}
          {currentTab === 'chatbot' && (
            <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[650px]">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{getTranslation('ai_assistant', language)}</h2>
                    <p className="text-[11px] text-slate-500">Real-Time Natural Language Emergency AI • Geotagged to {selectedDistrict}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[10px] font-bold font-mono">
                  ONLINE (LLM v4.2)
                </span>
              </div>

              {/* Chat History Messages Scroll Area */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex-1 overflow-y-auto space-y-3">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs ${
                      msg.sender === 'User'
                        ? 'bg-emerald-600 text-white font-medium rounded-br-none'
                        : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-bl-none'
                    }`}>
                      <div className="text-[9px] font-mono uppercase tracking-wider mb-1 opacity-75">
                        {msg.sender === 'User' ? 'You' : 'RakshaSetu AI Safety Bot'}
                      </div>
                      <div className="leading-relaxed">{msg.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Action Suggestion Chips */}
              <div className="flex flex-wrap gap-2 shrink-0">
                {[
                  `Nearest shelter in ${selectedDistrict}`,
                  'Evacuation route to high ground',
                  'Water purification steps',
                  'NDRF Helpline contact'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setChatMessage(chip);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition cursor-pointer"
                  >
                    💡 {chip}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendChat} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask AI safety assistant about shelters, road blocks, or first aid..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Ask AI</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* 9. FEEDBACK & SUPPORT SUBTAB                               */}
          {/* ========================================================= */}
          {currentTab === 'feedback' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-emerald-600" />
                    {getTranslation('feedback_support', language)}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Share ground relief feedback, report shelter supply shortages, or request platform technical support.
                  </p>
                </div>

                {feedbackSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
                    <h3 className="text-sm font-bold text-emerald-900">Feedback Submitted Successfully!</h3>
                    <p className="text-xs text-emerald-700">Thank you. Your observations have been routed to District Operations Support Team.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Feedback Category</label>
                      <select
                        value={feedbackCategory}
                        onChange={(e) => setFeedbackCategory(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800"
                      >
                        <option value="Relief Supply Issue">Relief Supply / Food Ration Shortage</option>
                        <option value="Shelter Hygiene">Shelter Sanitation & Medical Care</option>
                        <option value="Alert Subscription Delay">Alert Subscription / SMS Delay</option>
                        <option value="App Technical Issue">App Technical Bug / Offline Sync</option>
                        <option value="General Suggestion">General Suggestion</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Rating</label>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackRating(star)}
                            className="p-1.5 focus:outline-none cursor-pointer"
                          >
                            <Star className={`w-6 h-6 ${star <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                          </button>
                        ))}
                        <span className="font-bold text-slate-700 text-xs ml-2">{feedbackRating} / 5 Stars</span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        value={feedbackSubject}
                        onChange={(e) => setFeedbackSubject(e.target.value)}
                        placeholder="Brief summary of issue or suggestion..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Detailed Message</label>
                      <textarea
                        rows={4}
                        required
                        value={feedbackMsg}
                        onChange={(e) => setFeedbackMsg(e.target.value)}
                        placeholder="Describe ground observations, shelter name, or specific support requirement..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Feedback</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 10. ALERT SUBSCRIPTIONS SUBTAB                            */}
          {/* ========================================================= */}
          {currentTab === 'alert-subscription' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                <div className="border-b pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <BellRing className="w-6 h-6 text-blue-600" />
                      {getTranslation('alert_subscriptions', language)}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Configure automated SMS, WhatsApp, Siren and Push warning channels for {selectedDistrict}
                    </p>
                  </div>
                  {alertSavedToast && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg animate-pulse">
                      ✓ Preferences Saved!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveAlertPreferences} className="space-y-5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Verified Mobile Number</label>
                      <input
                        type="text"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={emailAddr}
                        onChange={(e) => setEmailAddr(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Channel Preferences */}
                  <div className="space-y-2">
                    <label className="block font-bold text-slate-800">Alert Dispatch Channels</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'App Push Notification', state: channelApp, setter: setChannelApp },
                        { label: 'SMS High Priority Alert', state: channelSms, setter: setChannelSms },
                        { label: 'WhatsApp SOS Broadcast', state: channelWhatsapp, setter: setChannelWhatsapp },
                        { label: 'Outdoor Siren Trigger', state: channelSiren, setter: setChannelSiren },
                        { label: 'Email Advisory', state: channelEmail, setter: setChannelEmail }
                      ].map((ch, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => ch.setter(!ch.state)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                            ch.state ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          <span className="text-xs">{ch.label}</span>
                          <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${ch.state ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                            {ch.state ? '✓' : ''}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Save Alert Preferences</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 11. EMERGENCY SOS (112) SUBTAB                            */}
          {/* ========================================================= */}
          {currentTab === 'sos' && (
            <div className="space-y-6 max-w-2xl mx-auto text-center py-6">
              <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 shadow-sm space-y-6">
                <div className="inline-flex items-center space-x-2 bg-rose-600 text-white font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider font-mono">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                  <span>EMERGENCY SOS RESPONSE DESK 112</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-rose-950">Immediate Life Safety Rescue Signal</h2>
                  <p className="text-xs text-rose-700 max-w-md mx-auto">
                    Pressing the button below instantly broadcasts your live GPS coordinates to NDRF Alpha Squads, Air Operations, and District Command.
                  </p>
                </div>

                {/* Big Red Pulsing SOS Button */}
                <button
                  onClick={handleTriggerSos}
                  className="w-48 h-48 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white font-black text-2xl shadow-xl hover:scale-105 transition-all flex flex-col items-center justify-center mx-auto border-4 border-rose-300 animate-pulse cursor-pointer"
                >
                  <AlertTriangle className="w-12 h-12 mb-1" />
                  <span>PRESS SOS</span>
                  <span className="text-[10px] font-mono font-normal opacity-90">HOLD 1 SEC</span>
                </button>

                {/* Stranded Options */}
                <div className="bg-white p-4 rounded-2xl border border-rose-200 text-left space-y-3 text-xs">
                  <div className="font-bold text-slate-800">Rescue Requirements Context</div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sosMedicalNeeded}
                        onChange={(e) => setSosMedicalNeeded(e.target.checked)}
                        className="rounded text-rose-600"
                      />
                      <span>Medical Emergency / ICU</span>
                    </label>
                    <label className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sosElderlyPresent}
                        onChange={(e) => setSosElderlyPresent(e.target.checked)}
                        className="rounded text-rose-600"
                      />
                      <span>Elderly / Infants Present</span>
                    </label>
                  </div>
                </div>

                {sosTriggered && (
                  <div className="bg-emerald-600 text-white p-4 rounded-2xl font-bold text-xs shadow-md animate-bounce">
                    ✅ RESCUE SIGNAL DISPATCHED! NDRF SQUAD ON ROUTE TO YOUR GPS COORDINATES!
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
