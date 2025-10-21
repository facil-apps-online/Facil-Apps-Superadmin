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
    // Si no está autenticado, redirigir al login.
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Si está autenticado pero por alguna razón no hay asignación, es un estado inválido.
  if (!currentAssignment) {
    // Esto puede pasar en un estado transitorio, lo mandamos al login para reiniciar.
    return <Navigate to="/auth" replace />;
  }

  if (role && !ALLOWED_ROLES.includes(role)) {
    // Redirect to a "not authorized" page or back to login
    return <Navigate to="/auth" replace />;
  }

  // Si está autenticado y tiene el rol correcto, renderizar la página solicitada.
  return <Outlet />;
};

export default ProtectedRoute;