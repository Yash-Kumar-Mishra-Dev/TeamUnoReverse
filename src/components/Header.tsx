import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Shield, RefreshCw, User, LogOut, ChevronDown, Globe } from 'lucide-react';
import { Role } from '../types';

export const Header: React.FC = () => {
  const { currentRole, isOffline, toggleOffline, socketConnected, language, setLanguage, offlineQueue, userEmail, setPanel, setUser } = useAppStore();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    setUser(userEmail, newRole);

    // Navigate to role panel
    if (newRole === 'SUPER_ADMIN') setPanel('superadmin');
    else if (newRole === 'ADMIN') setPanel('admin');
    else if (newRole === 'GOVERNMENT_OFFICER') setPanel('gov');
    else if (newRole === 'FIELD_RESPONDER') setPanel('responder');
    else if (newRole === 'CITIZEN') setPanel('citizen');
  };

  return (
    <header className="bg-[#12181F] text-white px-6 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setPanel('auth')} title="Return to Landing Page Portal Hub">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold group-hover:bg-blue-500 transition">
          <Shield className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <div className="font-heading text-base text-white font-extrabold leading-none tracking-tight flex items-center gap-1.5">
            <span>Raksha<span className="text-blue-400">Setu</span></span>
            <span className="text-[10px] bg-blue-900/80 text-blue-300 px-1.5 py-0.2 rounded border border-blue-700/60 uppercase font-mono">Portal Hub</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
            Disaster Preparedness & Response Platform
          </span>
        </div>
      </div>

      {/* Right System Controls & Identity */}
      <div className="flex items-center gap-4 text-xs font-mono">
        {/* Socket Status Indicator */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono border ${
          socketConnected && !isOffline
            ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400'
            : 'bg-red-950/80 border-red-500/30 text-red-400'
        }`}>
          <span className={`w-2 h-2 rounded-full ${socketConnected && !isOffline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span>SOCKET: {socketConnected && !isOffline ? 'LIVE (14ms)' : 'DISCONNECTED'}</span>
        </div>

        {/* Dexie Offline Mode Toggle */}
        <button
          onClick={toggleOffline}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono border transition-all ${
            isOffline
              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
              : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>DEXIE: {isOffline ? 'OFFLINE' : 'ONLINE'}</span>
          {offlineQueue.length > 0 && (
            <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-bold text-[10px]">
              {offlineQueue.length} PENDING
            </span>
          )}
        </button>

        {/* i18n Language Toggle */}
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded p-0.5 font-mono text-[11px]">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded ${language === 'en' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-0.5 rounded ${language === 'hi' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            HI
          </button>
          <button
            onClick={() => setLanguage('as')}
            className={`px-2 py-0.5 rounded ${language === 'as' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            AS
          </button>
        </div>

        {/* Clean RBAC User Role Switcher Dropdown */}
        <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-lg">
          <User className="w-4 h-4 text-blue-400" />
          <select
            value={currentRole}
            onChange={handleRoleChange}
            className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
          >
            <option value="CITIZEN" className="bg-slate-900 text-white">Citizen Panel</option>
            <option value="FIELD_RESPONDER" className="bg-slate-900 text-white">Field Responder HUD</option>
            <option value="GOVERNMENT_OFFICER" className="bg-slate-900 text-white">Government Command</option>
            <option value="ADMIN" className="bg-slate-900 text-white">Admin Control</option>
            <option value="SUPER_ADMIN" className="bg-slate-900 text-white">Super Admin</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
};
