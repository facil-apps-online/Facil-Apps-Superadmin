import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ALLOWED_ROLES = ['super_admin', 'app_super_admin', 'investor', 'vendor'];

const ProtectedRoute: React.FC = () => {
  const { loading, isAuthenticated, currentAssignment } = useAuth();
  const location = useLocation();
  const role = currentAssignment?.role;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Si está autenticado pero por alguna razón no hay asignación, es un estado inválido.
  if (!currentAssignment) {
    // Esto puede pasar en un estado transitorio, lo mandamos al login para reiniciar.
    return <Navigate to="/auth" replace />;
  }

  // Redirección basada en roles
  if (role && !ALLOWED_ROLES.includes(role)) {
    return <Navigate to="/auth" replace />;
  }

  // Redireccionar a una página específica si el usuario no es super_admin
  if (role !== 'super_admin' && role !== 'app_super_admin' && location.pathname === '/') {
    switch (role) {
      case 'investor':
        return <Navigate to="/dashboard" replace />;
      case 'vendor':
        return <Navigate to="/commissions" replace />;

      default:
        return <Navigate to="/auth" replace />; // Fallback to auth for safety
    }
  }

  // Si está autenticado y tiene el rol correcto, renderizar la página solicitada.
  return <Outlet />;
};

export default ProtectedRoute;