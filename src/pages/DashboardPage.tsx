import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard';
import CompanyAdminDashboard from './dashboards/CompanyAdminDashboard';
import TeamInchargeDashboard from './dashboards/TeamInchargeDashboard';
import TelecallerDashboard from './dashboards/TelecallerDashboard';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const dashboards = {
    SuperAdmin: SuperAdminDashboard,
    CompanyAdmin: CompanyAdminDashboard,
    TeamIncharge: TeamInchargeDashboard,
    Telecaller: TelecallerDashboard
  };

  const DashboardComponent = dashboards[user.role as keyof typeof dashboards];

  if (!DashboardComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Invalid role or permissions.</p>
        </div>
      </div>
    );
  }

  return <DashboardComponent />;
};

export default DashboardPage;