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
import PlatformsList from '@/pages/PlatformsList';
import AccessManagement from '@/pages/AccessManagement';
import SystemCatalogs from '@/pages/SystemCatalogs';
import IntegrationsPage from '@/pages/Integrations';
import { LocalizationsSettings } from '@/pages/LocalizationsSettings';
import SystemAlerts from '@/pages/SystemAlerts';
import ErrorReports from '@/pages/ErrorReports';
import PerformanceMetrics from '@/pages/PerformanceMetrics';
import { SuperadminLayout } from '@/layouts/SuperadminLayout';
import { Layout } from '@/components/Layout';
import IntegrationProviderForm from '@/pages/IntegrationProviderForm';
import PlatformSettings from '@/pages/PlatformSettings';
import PlatformPlans from '@/pages/PlatformPlans';
import PlanForm from '@/pages/PlanForm';
import AssetCatalog from '@/pages/AssetCatalog';
import EditPlatform from '@/pages/EditPlatform';
import CreatePlatform from '@/pages/CreatePlatform';
import EditTenant from '@/pages/EditTenant';
import TenantDetails from '@/pages/TenantDetails';


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
                <Route path="/tenants" element={<TenantList />} />
                <Route path="/tenants/create" element={<CreateTenant />} />
                <Route path="/tenants/:tenantId/edit" element={<EditTenant />} />
                <Route path="/tenants/:tenantId" element={<TenantDetails />} />
                <Route path="/platforms" element={<PlatformsList />} />
                <Route path="/platforms/create" element={<CreatePlatform />} />
                <Route path="/platforms/edit/:id" element={<EditPlatform />} />
                <Route path="/platforms/:platformId/settings" element={<PlatformSettings />} />
                <Route path="/platforms/:platformId/plans" element={<PlatformPlans />} />
                <Route path="/platforms/:platformId/plans/create" element={<PlanForm />} />
                <Route path="/platforms/:platformId/plans/edit/:planId" element={<PlanForm />} />
                <Route path="/platforms/:platformId/assets" element={<AssetCatalog />} />
                <Route path="/access-management" element={<AccessManagement />} />
                <Route path="/system-catalogs" element={<SystemCatalogs />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/integrations/new" element={<IntegrationProviderForm />} />
                <Route path="/integrations/edit/:id" element={<IntegrationProviderForm />} />
                <Route path="/translations" element={<LocalizationsSettings />} />
                <Route path="/system-alerts" element={<SystemAlerts />} />
                <Route path="/error-reports" element={<ErrorReports />} />
                <Route path="/performance-metrics" element={<PerformanceMetrics />} />
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
