import { create } from 'zustand';
import { Role, MainPanel, GovSubTab, ResponderSubTab, CitizenSubTab, AdminSubTab, SuperAdminSubTab, OfflineMutation } from '../types';

interface AppState {
  currentPanel: MainPanel;
  currentRole: Role;
  userEmail: string;
  language: 'en' | 'hi' | 'as';
  isOffline: boolean;
  socketConnected: boolean;
  offlineQueue: OfflineMutation[];
  
  subTabs: {
    gov: GovSubTab;
    responder: ResponderSubTab;
    citizen: CitizenSubTab;
    admin: AdminSubTab;
    superadmin: SuperAdminSubTab;
  };

  // Actions
  setPanel: (panel: MainPanel) => void;
  setUser: (email: string, role: Role) => void;
  setLanguage: (lang: 'en' | 'hi' | 'as') => void;
  toggleOffline: () => void;
  setGovSubTab: (tab: GovSubTab) => void;
  setResponderSubTab: (tab: ResponderSubTab) => void;
  setCitizenSubTab: (tab: CitizenSubTab) => void;
  setAdminSubTab: (tab: AdminSubTab) => void;
  setSuperAdminSubTab: (tab: SuperAdminSubTab) => void;
  addOfflineMutation: (mutation: OfflineMutation) => void;
  clearOfflineQueue: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPanel: 'auth',
  currentRole: 'SUPER_ADMIN',
  userEmail: 'admin@rakshasetu.gov.in',
  language: 'en',
  isOffline: false,
  socketConnected: true,
  offlineQueue: [],

  subTabs: {
    gov: 'dashboard',
    responder: 'dashboard',
    citizen: 'dashboard',
    admin: 'users',
    superadmin: 'system-dashboard'
  },

  setPanel: (panel) => set({ currentPanel: panel }),
  setUser: (email, role) => set({ userEmail: email, currentRole: role }),
  setLanguage: (lang) => set({ language: lang }),
  toggleOffline: () => set((state) => ({ 
    isOffline: !state.isOffline,
    socketConnected: state.isOffline, // reconnect socket when online
    offlineQueue: !state.isOffline ? state.offlineQueue : [] // clear on sync
  })),

  setGovSubTab: (tab) => set((s) => ({ subTabs: { ...s.subTabs, gov: tab } })),
  setResponderSubTab: (tab) => set((s) => ({ subTabs: { ...s.subTabs, responder: tab } })),
  setCitizenSubTab: (tab) => set((s) => ({ subTabs: { ...s.subTabs, citizen: tab } })),
  setAdminSubTab: (tab) => set((s) => ({ subTabs: { ...s.subTabs, admin: tab } })),
  setSuperAdminSubTab: (tab) => set((s) => ({ subTabs: { ...s.subTabs, superadmin: tab } })),

  addOfflineMutation: (mutation) => set((s) => ({ offlineQueue: [...s.offlineQueue, mutation] })),
  clearOfflineQueue: () => set({ offlineQueue: [] })
}));
