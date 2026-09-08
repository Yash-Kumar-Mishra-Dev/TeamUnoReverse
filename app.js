/* RakshaSetu — Complete Multi-Panel Application Logic */

// Application State
const state = {
  currentPanel: 'auth',
  currentRole: 'SUPER_ADMIN',
  userEmail: 'admin@rakshasetu.gov.in',
  language: 'en',
  isOffline: false,
  pendingSyncCount: 0,
  sosCountdownTimer: null,
  sosSeconds: 3,
  maps: {
    citizen: null,
    field: null,
    risk: null
  },
  chart: null,
  offlineQueue: [],
  subTabs: {
    gov: 'dashboard',
    responder: 'dashboard',
    citizen: 'dashboard',
    admin: 'users',
    superadmin: 'system-dashboard'
  }
};

// Translations Dictionary
const i18n = {
  en: {
    citizen_panel_title: "PANEL 01: CITIZEN SAFETY APP",
    citizen_headline: "Emergency Safety & SOS Command"
  },
  hi: {
    citizen_panel_title: "पैनल 01: नागरिक सुरक्षा ऐप",
    citizen_headline: "आपातकालीन सुरक्षा एवं एसओएस कमांड"
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initMaps();
  initChart();
  startSocketSimulation();
});

// Primary Panel Switcher (Top Bar)
function switchPanel(panelId) {
  state.currentPanel = panelId;
  const panels = ['auth', 'gov', 'responder', 'citizen', 'admin', 'superadmin', 'assets'];
  
  panels.forEach(p => {
    const el = document.getElementById(`panel-${p}`);
    const btn = document.getElementById(`panel-btn-${p}`);
    if (el) {
      if (p === panelId) {
        el.classList.remove('hidden');
        if (btn) {
          btn.className = (p === 'assets') 
            ? 'px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 bg-amber-500 text-slate-950 font-bold shadow-sm'
            : 'px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 bg-blue-600 text-white shadow-sm font-semibold';
        }
      } else {
        el.classList.add('hidden');
        if (btn) {
          btn.className = (p === 'assets')
            ? 'px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold border border-amber-500/30 bg-amber-500/10'
            : 'px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-slate-300 hover:text-white';
        }
      }
    }
  });

  // Trigger Map Resizing
  setTimeout(() => {
    if (panelId === 'citizen' && state.maps.citizen) state.maps.citizen.invalidateSize();
    if (panelId === 'responder' && state.maps.field) state.maps.field.invalidateSize();
    if (panelId === 'gov' && state.subTabs.gov === 'risk-map' && state.maps.risk) state.maps.risk.invalidateSize();
  }, 150);
}

// Authentication Login Handler
function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const role = document.getElementById('login-role').value;
  
  state.userEmail = email;
  state.currentRole = role;
  
  const roleBadge = document.getElementById('active-user-role');
  if (roleBadge) roleBadge.textContent = `Role: ${role}`;
  document.getElementById('active-user-badge').classList.remove('hidden');
  
  showToast(`Authenticated as ${email} (${role})`, 'normal');

  // Auto route to corresponding panel based on RBAC role
  if (role === 'SUPER_ADMIN') switchPanel('superadmin');
  else if (role === 'ADMIN') switchPanel('admin');
  else if (role === 'GOVERNMENT_OFFICER') switchPanel('gov');
  else if (role === 'FIELD_RESPONDER') switchPanel('responder');
  else if (role === 'CITIZEN') switchPanel('citizen');
}

// Government Panel Subtabs
function switchGovSubTab(tab) {
  state.subTabs.gov = tab;
  ['dashboard', 'risk-map', 'ai-alerts', 'forecast', 'reports'].forEach(t => {
    const v = document.getElementById(`gov-view-${t}`);
    const b = document.getElementById(`gov-sub-${t}`);
    if (v) v.classList.toggle('hidden', t !== tab);
    if (b) b.classList.toggle('sidebar-tab-active', t === tab);
  });

  if (tab === 'risk-map') {
    setTimeout(() => {
      initGovRiskMap();
    }, 100);
  }
}

// Responder Panel Subtabs
function switchResponderSubTab(tab) {
  state.subTabs.responder = tab;
  ['dashboard', 'queue', 'live-map', 'missions', 'resources'].forEach(t => {
    const v = document.getElementById(`responder-view-${t}`);
    const b = document.getElementById(`responder-sub-${t}`);
    if (v) v.classList.toggle('hidden', t !== tab);
    if (b) b.classList.toggle('sidebar-tab-active', t === tab);
  });

  if (tab === 'live-map' && state.maps.field) {
    setTimeout(() => state.maps.field.invalidateSize(), 100);
  }
}

// Citizen Panel Subtabs
function switchCitizenSubTab(tab) {
  state.subTabs.citizen = tab;
  ['dashboard', 'sos', 'report-incident', 'safe-zones', 'chatbot'].forEach(t => {
    const v = document.getElementById(`citizen-view-${t}`);
    const b = document.getElementById(`citizen-sub-${t}`);
    if (v) v.classList.toggle('hidden', t !== tab);
    if (b) b.classList.toggle('sidebar-tab-active', t === tab);
  });

  if (tab === 'safe-zones' && state.maps.citizen) {
    setTimeout(() => state.maps.citizen.invalidateSize(), 100);
  }
}

// Admin Panel Subtabs
function switchAdminSubTab(tab) {
  state.subTabs.admin = tab;
  ['users', 'incidents', 'sensors', 'alerts', 'analytics'].forEach(t => {
    const v = document.getElementById(`admin-view-${t}`);
    const b = document.getElementById(`admin-sub-${t}`);
    if (v) v.classList.toggle('hidden', t !== tab);
    if (b) b.classList.toggle('sidebar-tab-active', t === tab);
  });
}

// Super Admin Panel Subtabs
function switchSuperAdminSubTab(tab) {
  state.subTabs.superadmin = tab;
  ['system-dashboard', 'admin-mgmt', 'roles-permissions', 'ai-config', 'audit-logs', 'system-settings'].forEach(t => {
    const v = document.getElementById(`superadmin-view-${t}`);
    const b = document.getElementById(`superadmin-sub-${t}`);
    if (v) v.classList.toggle('hidden', t !== tab);
    if (b) b.classList.toggle('sidebar-tab-active', t === tab);
  });
}

// Leaflet Maps Initialization
function initMaps() {
  const coords = [28.6139, 77.2090];

  // Citizen Map
  if (document.getElementById('citizen-map')) {
    state.maps.citizen = L.map('citizen-map').setView(coords, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(state.maps.citizen);

    L.circleMarker([28.6150, 77.2100], { color: '#DC3B33', radius: 10 }).addTo(state.maps.citizen).bindPopup("<b>Flood Alert #101</b><br>Yamuna Bank");
    L.circleMarker([28.6100, 77.2180], { color: '#1E9E63', radius: 10 }).addTo(state.maps.citizen).bindPopup("<b>Govt Shelter #4</b>");
  }

  // Field Map (Tactical Dark Mode)
  if (document.getElementById('field-map')) {
    state.maps.field = L.map('field-map').setView(coords, 14);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(state.maps.field);

    L.polyline([[28.6139, 77.2090], [28.6180, 77.2150], [28.6220, 77.2200]], { color: '#60A5FA', weight: 4 }).addTo(state.maps.field);
    L.circleMarker([28.6220, 77.2200], { color: '#F59E0B', radius: 9 }).addTo(state.maps.field).bindPopup("<b>Hazard Zone: Breach</b>");
  }
}

function initGovRiskMap() {
  if (!state.maps.risk && document.getElementById('gov-risk-map-canvas')) {
    const coords = [28.6139, 77.2090];
    state.maps.risk = L.map('gov-risk-map-canvas').setView(coords, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(state.maps.risk);
    
    L.circle([28.6139, 77.2090], { color: 'red', fillColor: '#f03', fillOpacity: 0.4, radius: 1500 }).addTo(state.maps.risk).bindPopup("High Flood Risk Zone");
  }
}

// Chart.js Hydrograph
function initChart() {
  const ctx = document.getElementById('gov-chart');
  if (!ctx) return;

  state.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00 (Now)', '18:00 (Fcst)'],
      datasets: [
        {
          label: 'Yamuna Elevation (m)',
          data: [204.10, 204.45, 204.90, 205.20, 205.55, 205.85, 206.20],
          borderColor: '#DC3B33',
          backgroundColor: 'rgba(220, 59, 51, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 3
        },
        {
          label: 'Danger Level (205.33m)',
          data: [205.33, 205.33, 205.33, 205.33, 205.33, 205.33, 205.33],
          borderColor: '#D98C1F',
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 203.5, max: 207.0 }
      }
    }
  });
}

// SOS Countdown & Fail-Open Flow
function triggerSOSCountdown() {
  state.sosSeconds = 3;
  document.getElementById('sos-timer').textContent = state.sosSeconds;
  document.getElementById('sos-fallback-info').classList.add('hidden');
  openModal('sos-modal');

  playAudioBeep(880, 0.2);

  if (state.sosCountdownTimer) clearInterval(state.sosCountdownTimer);
  state.sosCountdownTimer = setInterval(() => {
    state.sosSeconds--;
    document.getElementById('sos-timer').textContent = state.sosSeconds;
    playAudioBeep(880, 0.2);

    if (state.sosSeconds <= 0) {
      clearInterval(state.sosCountdownTimer);
      confirmSOSNow();
    }
  }, 1000);
}

function cancelSOS() {
  if (state.sosCountdownTimer) clearInterval(state.sosCountdownTimer);
  closeModal('sos-modal');
  showToast('SOS distress broadcast cancelled', 'normal');
}

function confirmSOSNow() {
  if (state.sosCountdownTimer) clearInterval(state.sosCountdownTimer);
  
  if (state.isOffline) {
    document.getElementById('sos-fallback-info').classList.remove('hidden');
    state.offlineQueue.push({ type: 'SOS_DISPATCH', timestamp: new Date().toISOString() });
    updatePendingBadge();
    showToast('SOS Queued in Dexie Store + SMS Link Triggered', 'warning');
  } else {
    showToast('🚨 EMERGENCY SOS BROADCASTED TO CONTROL ROOM (112)', 'critical');
    setTimeout(() => closeModal('sos-modal'), 1500);
  }
}

function playAudioBeep(freq, duration) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.1;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

// Dexie Offline Mode Toggle
function toggleOfflineMode() {
  state.isOffline = !state.isOffline;
  const toggleText = document.getElementById('offline-toggle-text');
  const toggleBtn = document.getElementById('offline-toggle-btn');
  const socketText = document.getElementById('socket-text');
  const socketInd = document.getElementById('socket-indicator');

  if (state.isOffline) {
    toggleText.textContent = 'DEXIE: AIRPLANE / OFFLINE';
    toggleBtn.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-bold border border-amber-400 font-mono text-[11px]';
    socketText.textContent = 'SOCKET: DISCONNECTED';
    socketInd.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-400 font-mono text-[11px]';
    showToast('Network Disconnected. Operations switched to Dexie Offline Store', 'warning');
  } else {
    toggleText.textContent = 'DEXIE: ONLINE';
    toggleBtn.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-all font-mono text-[11px]';
    socketText.textContent = 'SOCKET: LIVE (14ms)';
    socketInd.className = 'flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]';
    
    if (state.offlineQueue.length > 0) {
      showToast(`Auto-flushing ${state.offlineQueue.length} offline mutations to backend API...`, 'normal');
      state.offlineQueue = [];
      updatePendingBadge();
    } else {
      showToast('Socket Reconnected. State synchronized.', 'normal');
    }
  }
}

function updatePendingBadge() {
  const badge = document.getElementById('pending-sync-badge');
  if (state.offlineQueue.length > 0) {
    badge.classList.remove('hidden');
    badge.textContent = `${state.offlineQueue.length} PENDING`;
  } else {
    badge.classList.add('hidden');
  }
}

// Live Socket Simulation Engine
function startSocketSimulation() {
  setInterval(() => {
    if (state.isOffline) return;
    const randomElevation = (205.80 + (Math.random() * 0.15)).toFixed(2);
    if (state.chart && state.chart.data) {
      state.chart.data.datasets[0].data[5] = parseFloat(randomElevation);
      state.chart.update('none');
    }
  }, 4000);
}

// i18n Translation
function setLanguage(lang) {
  state.language = lang;
  document.getElementById('lang-en-btn').className = lang === 'en' ? 'px-2 py-0.5 rounded bg-blue-600 text-white font-bold' : 'px-2 py-0.5 text-slate-400 hover:text-white';
  document.getElementById('lang-hi-btn').className = lang === 'hi' ? 'px-2 py-0.5 rounded bg-blue-600 text-white font-bold' : 'px-2 py-0.5 text-slate-400 hover:text-white';
  showToast(`Language set to ${lang.toUpperCase()}`, 'normal');
}

// Modal Controls
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

// Form Handlers
function submitIncidentReport(e) {
  e.preventDefault();
  const desc = document.getElementById('inc-desc').value || 'Rising flood water near residential street.';
  closeModal('report-incident-modal');
  
  if (state.isOffline) {
    state.offlineQueue.push({ type: 'INCIDENT_REPORT', desc });
    updatePendingBadge();
    showToast('Incident Report saved in Dexie Offline Queue', 'warning');
  } else {
    showToast('Incident Report submitted to Command Center!', 'normal');
  }
}

function submitAlertBroadcast(e) {
  e.preventDefault();
  const text = document.getElementById('alert-text').value || 'Apex Warning: Evacuate Sector 9 immediately.';
  closeModal('broadcast-alert-modal');
  showToast(`Broadcasting Alert: "${text}"`, 'critical');
}

function saveUserRole() {
  const name = document.getElementById('target-user-name').value;
  const role = document.getElementById('target-user-role').value;
  closeModal('user-role-modal');
  showToast(`Updated Keycloak Role for ${name} to ${role}`, 'normal');
}

function updateMissionStatus(id, action) {
  if (state.isOffline) {
    state.offlineQueue.push({ type: 'MISSION_UPDATE', id, action });
    updatePendingBadge();
    showToast(`Mission ${id} ${action} queued offline`, 'warning');
  } else {
    showToast(`Mission ${id} ${action} verified & broadcasted on socket`, 'normal');
  }
}

function exportSitRep() {
  showToast('Generating Cabinet SitRep PDF Report...', 'normal');
}

function runSystemBackup() {
  showToast('Triggered PostgreSQL & S3 state backup run...', 'normal');
}

// Custom Toast System
function showToast(msg, type = 'normal') {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold font-mono transition-all transform translate-y-10 opacity-0 flex items-center gap-2 border';
    document.body.appendChild(toast);
  }

  if (type === 'critical') {
    toast.className = 'fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold font-mono transition-all bg-red-600 text-white border-red-400 flex items-center gap-2';
  } else if (type === 'warning') {
    toast.className = 'fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold font-mono transition-all bg-amber-500 text-slate-950 border-amber-300 flex items-center gap-2';
  } else {
    toast.className = 'fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold font-mono transition-all bg-slate-900 text-white border-slate-700 flex items-center gap-2';
  }

  toast.innerHTML = `<span class="material-symbols-outlined text-sm">notifications</span><span>${msg}</span>`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 3500);
}
