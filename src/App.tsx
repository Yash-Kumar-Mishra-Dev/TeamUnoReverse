import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Header } from './components/Header';
import { AuthPanel } from './panels/auth/AuthPanel';
import { GovernmentPanel } from './panels/government/GovernmentPanel';
import { ResponderPanel } from './panels/responder/ResponderPanel';
import { CitizenPanel } from './panels/citizen/CitizenPanel';
import { AdminPanel } from './panels/admin/AdminPanel';
import { SuperAdminPanel } from './panels/superadmin/SuperAdminPanel';
import { StitchAssetsPanel } from './panels/assets/AssetsPanel';

export const App: React.FC = () => {
  const { currentPanel } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFD]">
      <Header />

      <div className="flex-1 flex flex-col">
        {currentPanel === 'auth' && <AuthPanel />}
        {currentPanel === 'gov' && <GovernmentPanel />}
        {currentPanel === 'responder' && <ResponderPanel />}
        {currentPanel === 'citizen' && <CitizenPanel />}
        {currentPanel === 'admin' && <AdminPanel />}
        {currentPanel === 'superadmin' && <SuperAdminPanel />}
        {currentPanel === 'assets' && <StitchAssetsPanel />}
      </div>
    </div>
  );
};

export default App;
