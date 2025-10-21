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
import ErrorReports from '@/pages/ErrorReports';
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
import ProfileSettings from '@/pages/Settings/ProfileSettings';


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
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/auth" element={<AuthPage />} />
            

            {/* Rutas Protegidas (usando tu componente ProtectedRoute) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<SuperadminLayout />}>
                <Route path="/" element={<SuperadminStats />} />

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
                <Route path="/access-management" element={<AccessManagement />} />
                <Route path="/system-catalogs" element={<SystemCatalogs />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/integrations/new" element={<IntegrationProviderForm />} />
                <Route path="/integrations/edit/:id" element={<IntegrationProviderForm />} />
                <Route path="/translations" element={<LocalizationsSettings />} />
                <Route path="/system-alerts" element={<SystemAlerts />} />
                <Route path="/error-reports" element={<ErrorReports />} />
                <Route path="/performance-metrics" element={<PerformanceMetrics />} />
                {/* Rutas de configuración movidas a un nivel superior o eliminadas */}
                {/* <Route path="/subscription-plans" element={<SubscriptionPlans />} /> */}
                {/* <Route path="/plan-pricing" element={<PlanPricingManager />} /> */}
                <Route path="/global-settings" element={<GlobalSettings />} />
                <Route path="/profile-settings" element={<ProfileSettings />} />
                <Route path="/commissions" element={<VendorDashboard />} />
                {/* Aquí irían el resto de tus rutas protegidas */}
              </Route>
            </Route>

            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
