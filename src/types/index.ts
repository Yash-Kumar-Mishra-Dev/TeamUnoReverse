export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'GOVERNMENT_OFFICER' | 'FIELD_RESPONDER' | 'CITIZEN';

export type MainPanel = 'auth' | 'gov' | 'responder' | 'citizen' | 'admin' | 'superadmin' | 'assets';

export type GovSubTab = 'dashboard' | 'dept-coordination' | 'budget-approvals' | 'trend-analytics' | 'risk-map' | 'ai-alerts' | 'forecast' | 'reports';
export type ResponderSubTab = 'dashboard' | 'team-status' | 'verification' | 'reports' | 'queue' | 'live-map' | 'missions' | 'resources';
export type CitizenSubTab = 'dashboard' | 'sos' | 'report-incident' | 'report-history' | 'safe-zones' | 'resources' | 'safety-guides' | 'contacts-112' | 'daily-checklist' | 'feedback' | 'chatbot' | 'alert-subscription';
export type AdminSubTab = 'users' | 'incidents' | 'sensors' | 'alerts' | 'analytics';
export type SuperAdminSubTab = 'system-dashboard' | 'admin-mgmt' | 'roles-permissions' | 'ai-config' | 'audit-logs' | 'system-settings';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: 'Active' | 'Inactive';
}

export interface Incident {
  id: string;
  type: string;
  severity: 'CRITICAL' | 'WARNING' | 'NORMAL' | 'INFO';
  lat: number;
  lng: number;
  status: 'Unverified' | 'Verified' | 'Resolved';
  locationName: string;
  reportedBy: string;
  timestamp: string;
}

export interface Mission {
  id: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  title: string;
  location: string;
  assignedTeam: string;
  waterDepth: string;
  status: 'ON SITE' | 'EN ROUTE' | 'COMPLETED' | 'PENDING';
  score: number;
}

export interface AnomalyFlag {
  id: string;
  zone: string;
  zScore: number;
  classification: 'Critical' | 'Warning' | 'Normal';
  message: string;
  observedRate: string;
  baselineRate: string;
}

export interface OfflineMutation {
  id?: number;
  type: string;
  payload: any;
  timestamp: string;
}
