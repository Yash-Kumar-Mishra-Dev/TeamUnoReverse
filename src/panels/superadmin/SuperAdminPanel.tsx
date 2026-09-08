import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SuperAdminSubTab } from '../../types';
import { HardDrive, ShieldAlert, Key, Sliders, Terminal, Settings } from 'lucide-react';

export const SuperAdminPanel: React.FC = () => {
  const { subTabs, setSuperAdminSubTab } = useAppStore();
  const currentTab = subTabs.superadmin;

  const tabs: { id: SuperAdminSubTab; label: string; icon: any }[] = [
    { id: 'system-dashboard', label: 'System Dashboard', icon: HardDrive },
    { id: 'admin-mgmt', label: 'Admin Management', icon: ShieldAlert },
    { id: 'roles-permissions', label: 'Roles & Permissions', icon: Key },
    { id: 'ai-config', label: 'AI Configuration', icon: Sliders },
    { id: 'audit-logs', label: 'Audit Logs (Kafka)', icon: Terminal },
    { id: 'system-settings', label: 'System Settings & DR', icon: Settings }
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#12181F] text-slate-100">
      {/* Sidebar Subtab Navigation */}
      <aside className="w-full md:w-64 bg-[#171E29] p-4 space-y-4 shrink-0 border-r border-slate-800">
        <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded font-mono text-[11px] font-bold border border-emerald-500/30">
          SUPER ADMIN PANEL
        </div>
        <nav className="space-y-1 text-xs">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = currentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSuperAdminSubTab(t.id)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  isActive ? 'sidebar-tab-active' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Subtab View */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* 1. System Dashboard */}
        {currentTab === 'system-dashboard' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-heading text-white">Microservice Architecture Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-[#171E29] rounded-xl border border-slate-800">
                <div className="text-slate-400">NestJS API Gateway</div>
                <div className="text-emerald-400 font-bold text-sm mt-1">HEALTHY (99.99%)</div>
              </div>
              <div className="p-4 bg-[#171E29] rounded-xl border border-slate-800">
                <div className="text-slate-400">Sensing Fusion Service</div>
                <div className="text-emerald-400 font-bold text-sm mt-1">HEALTHY (v1 Fusion)</div>
              </div>
              <div className="p-4 bg-[#171E29] rounded-xl border border-slate-800">
                <div className="text-slate-400">Apache Kafka Event Bus</div>
                <div className="text-emerald-400 font-bold text-sm mt-1">12 Topics Active</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Admin Management */}
        {currentTab === 'admin-mgmt' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-white">Platform Administrator Accounts</h2>
            <div className="p-4 bg-[#171E29] rounded-xl text-xs font-mono">
              <div>Super Admin 01: root-admin@rakshasetu.gov.in (Active)</div>
            </div>
          </div>
        )}

        {/* 3. Roles & Permissions */}
        {currentTab === 'roles-permissions' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-white">RBAC Permission Matrix Configuration</h2>
            <div className="p-4 bg-[#171E29] rounded-xl text-xs font-mono">
              <div>SUPER_ADMIN permissions: wildcard (*)</div>
            </div>
          </div>
        )}

        {/* 4. AI Configuration */}
        {currentTab === 'ai-config' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-white">AI Sensing & Anomaly Detection Parameters</h2>
            <div className="p-4 bg-[#171E29] rounded-xl space-y-3 text-xs font-mono">
              <div>Sensing Fusion Weights: Field Responder (0.9), Sensor (0.8), Citizen (0.6)</div>
              <div>Z-Score Anomaly Threshold: Z &gt; 3.0 (Critical Alert Trigger)</div>
            </div>
          </div>
        )}

        {/* 5. Audit Logs */}
        {currentTab === 'audit-logs' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-white">Immutable Kafka Audit Event Stream</h2>
            <div className="p-4 bg-[#171E29] rounded-xl text-xs font-mono space-y-1">
              <div className="text-emerald-400">[AUDIT] 15:35:00 — ROLE_UPDATE: User Dr. Verma assigned GOVERNMENT_OFFICER</div>
              <div className="text-blue-400">[AUDIT] 15:30:00 — SOS_FIRED: Citizen 112 Emergency Dispatch #SOS-901</div>
            </div>
          </div>
        )}

        {/* 6. System Settings */}
        {currentTab === 'system-settings' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-white">System Settings & DR Backup Schedule</h2>
            <button
              onClick={() => alert('Backup triggered!')}
              className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg"
            >
              Trigger Immediate DB & S3 Backup
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
