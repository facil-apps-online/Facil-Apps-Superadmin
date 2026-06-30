import { useEffect } from 'react';
import { useSettings } from "@/hooks/useSettings";
import { setAppTimeZone } from "@/lib/i18n";
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext'; // Importar el hook de autenticación
import { FullScreenLoader } from '@/components/ui/FullScreenLoader'; // Importar el loader

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { data: settings } = useSettings();
  const { loading: authLoading, isAuthenticated } = useAuth(); // Obtener el estado de carga de la autenticación
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (settings) {
      const timezoneSetting = settings.find(s => s.key === 'timezone');
      if (timezoneSetting && timezoneSetting.value) {
        setAppTimeZone(timezoneSetting.value);
      }
    }
  }, [settings]);

  useEffect(() => {
    const checkSuperadmin = async () => {
      try {
        console.log('[AppInitializer] Checking for superadmin...');
        const { data, error } = await supabase.functions.invoke('core-actions', {
          body: { action: 'check_superadmin_exists' },
        });

        console.log('[AppInitializer] RPC Result:', { data, error });

        if (error) {
          console.error('Error al verificar superadministrador:', error);
          return;
        }

        if (data === false) {
          if (location.pathname !== '/setup-superadmin') {
            navigate('/setup-superadmin');
          }
        } else {
          // If superadmin exists and we are on the setup page, redirect to auth
          if (location.pathname === '/setup-superadmin') {
            navigate('/auth');
          }
        }
      } catch (err) {
        console.error('Excepción al verificar superadministrador:', err);
      }
    };

    // Only run the check if auth state is resolved and user is not authenticated
    if (!authLoading && !isAuthenticated) {
      checkSuperadmin();
    }
  }, [navigate, location.pathname, authLoading, isAuthenticated]);

  // Si la autenticación está en proceso, mostrar el loader
  if (authLoading) {
    return <FullScreenLoader />;
  }

  // Si no, mostrar el contenido de la aplicación
  return <>{children}</>;
};

export default AppInitializer;