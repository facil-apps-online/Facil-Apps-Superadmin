import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from "@/components/ui/toaster";
import { supabase } from '@/lib/supabaseClient';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthPage from '@/pages/Auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import CreateTenant from '@/pages/CreateTenant';
import SuperadminStats from '@/pages/SuperadminStats'; // Importamos el nuevo dashboard
import TenantList from '@/pages/TenantList';
import PlatformsList from '@/pages/Platforms/PlatformsList';
import AccessManagement from '@/pages/AccessManagement';
import SystemCatalogs from '@/pages/SystemCatalogs';
import IntegrationsPage from '@/pages/Integrations';
import { LocalizationsSettings } from '@/components/settings/LocalizationsSettings';
import SystemAlerts from '@/pages/SystemAlerts';

import PerformanceMetrics from '@/pages/PerformanceMetrics';
import { SuperadminLayout } from '@/layouts/SuperadminLayout';
import { Layout } from '@/components/Layout';
import IntegrationProviderForm from '@/pages/IntegrationProviderForm';
import PlatformSettings from '@/pages/Platforms/PlatformSettings';
import PlatformPlans from '@/pages/Platforms/PlatformPlans';
import PlanForm from '@/pages/Platforms/PlanForm';
import AssetCatalog from '@/pages/Platforms/AssetCatalog';

import EditPlatform from '@/pages/Platforms/EditPlatform';
import CreatePlatform from '@/pages/Platforms/CreatePlatform';
import EditTenant from '@/pages/EditTenant';
import TenantDetails from '@/pages/TenantDetails';
import GlobalSettings from '@/pages/Settings/GlobalSettings';
import VendorDashboard from '@/pages/VendorDashboard';
import InvitationsPage from '@/pages/Vendor/InvitationsPage';
import ProspectsPage from '@/pages/Vendor/ProspectsPage';
import ConversionReportPage from '@/pages/Vendor/ConversionReportPage';
import TeamPage from '@/pages/Vendor/TeamPage';
import CommissionsAdminPage from '@/pages/Vendor/CommissionsAdminPage';
import ProfileSettings from '@/pages/Settings/ProfileSettings';
import AuthCallback from '@/pages/AuthCallback';
import SetupSuperadmin from '@/pages/SetupSuperadmin';
import AcceptInvitation from '@/pages/AcceptInvitation';
import AppInitializer from '@/components/AppInitializer';
import InvestorDashboard from '@/pages/InvestorDashboard';


// --- Asumo que estas páginas existen o las crearás ---
// import SuperAdminDashboard from './pages/SuperAdminDashboard';
// import NotFoundPage from './pages/NotFoundPage';

// Creamos una instancia del cliente de React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider supabaseClient={supabase}>
          <AppInitializer>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/setup-superadmin" element={<SetupSuperadmin />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/invitacion" element={<AcceptInvitation />} />
              

              {/* Rutas Protegidas (usando tu componente ProtectedRoute) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<SuperadminLayout />}>
                  <Route path="/" element={<SuperadminStats />} />
                  <Route path="/dashboard" element={<InvestorDashboard />} />

                  <Route path="/tenants/:tenantId/edit" element={<EditTenant />} />
                  <Route path="/tenants/:tenantId" element={<TenantDetails />} />
                  <Route path="/platforms" element={<PlatformsList />} />
                  <Route path="/platforms/:platformId/dashboard" element={<SuperadminStats />} />
                  <Route path="/platforms/create" element={<CreatePlatform />} />
                  <Route path="/platforms/edit/:id" element={<EditPlatform />} />
                  <Route path="/platforms/:platformId/settings" element={<PlatformSettings />} />
                  <Route path="/platforms/:platformId/plans" element={<PlatformPlans />} />
                  <Route path="/platforms/:platformId/plans/create" element={<PlanForm />} />
                  <Route path="/platforms/:platformId/plans/edit/:planId" element={<PlanForm />} />
                  <Route path="/platforms/:platformId/assets" element={<AssetCatalog />} />
                  <Route path="/platforms/:platformId/tenants" element={<TenantList />} />
                  <Route path="/platforms/:platformId/tenants/:tenantId" element={<TenantDetails />} />
                  <Route path="/platforms/:platformId/tenants/:tenantId/edit" element={<EditTenant />} />
                  <Route path="/access-management" element={<AccessManagement />} />
                  <Route path="/system-catalogs" element={<SystemCatalogs />} />
                  <Route path="/integrations" element={<IntegrationsPage />} />
                  <Route path="/integrations/new" element={<IntegrationProviderForm />} />
                  <Route path="/integrations/edit/:id" element={<IntegrationProviderForm />} />
                  <Route path="/translations" element={<LocalizationsSettings />} />
                  <Route path="/system-alerts" element={<SystemAlerts />} />

                  <Route path="/performance-metrics" element={<PerformanceMetrics />} />
                  {/* Rutas de configuración movidas a un nivel superior o eliminadas */}
                  {/* <Route path="/subscription-plans" element={<SubscriptionPlans />} /> */}
                  {/* <Route path="/plan-pricing" element={<PlanPricingManager />} /> */}
                  <Route path="/global-settings" element={<GlobalSettings />} />
                  <Route path="/profile-settings" element={<ProfileSettings />} />
                  <Route path="/commissions" element={<VendorDashboard />} />
                  <Route path="/invitations" element={<InvitationsPage />} />
                  <Route path="/crm/invitations" element={<InvitationsPage />} />
                  <Route path="/prospects" element={<ProspectsPage />} />
                  <Route path="/crm/prospects" element={<ProspectsPage />} />
                  <Route path="/conversion" element={<ConversionReportPage />} />
                  <Route path="/crm/conversion" element={<ConversionReportPage />} />
                  <Route path="/crm/team" element={<TeamPage />} />
                  <Route path="/crm/commissions" element={<CommissionsAdminPage />} />
                  {/* Aquí irían el resto de tus rutas protegidas */}
                </Route>
              </Route>

              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
          </AppInitializer>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
