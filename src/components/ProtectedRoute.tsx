import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ALLOWED_ROLES = ['super_admin', 'app_super_admin', 'investor', 'vendor'];

const ProtectedRoute: React.FC = () => {
  const { loading, isAuthenticated, currentAssignment } = useAuth();
  const location = useLocation();
  const role = currentAssignment?.role;

  console.log("ProtectedRoute: loading:", loading);
  console.log("ProtectedRoute: isAuthenticated:", isAuthenticated);
  console.log("ProtectedRoute: currentAssignment:", currentAssignment);
  console.log("ProtectedRoute: role:", role);

  if (loading) {
    console.log("ProtectedRoute: Loading state, showing Cargando...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to /auth.");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Si está autenticado pero por alguna razón no hay asignación, es un estado inválido.
  if (!currentAssignment) {
    console.log("ProtectedRoute: Authenticated but no currentAssignment, redirecting to /auth.");
    // Esto puede pasar en un estado transitorio, lo mandamos al login para reiniciar.
    return <Navigate to="/auth" replace />;
  }

  // Redirección basada en roles
  if (role && !ALLOWED_ROLES.includes(role)) {
    console.log(`ProtectedRoute: Role '${role}' not in ALLOWED_ROLES, redirecting to /auth.`);
    // Si el rol no está permitido, redirigir a /auth
    return <Navigate to="/auth" replace />;
  }

  // Redireccionar a una página específica si el usuario no es super_admin
  if (role !== 'super_admin' && role !== 'app_super_admin' && location.pathname === '/') {
    console.log(`ProtectedRoute: Role '${role}' is not super_admin or app_super_admin, checking specific redirection.`);
    switch (role) {
      case 'investor':
        console.log("ProtectedRoute: Redirecting investor to /dashboard.");
        return <Navigate to="/dashboard" replace />;
      case 'vendor':
        console.log("ProtectedRoute: Redirecting vendor to /commissions.");
        return <Navigate to="/commissions" replace />;

      default:
        console.log(`ProtectedRoute: Allowed role '${role}' has no specific redirection, falling back to /auth.`);
        // Si el rol está permitido pero no tiene una redirección específica,
        // o si hay un rol inesperado, redirigir a una página de acceso denegado o al inicio.
        return <Navigate to="/auth" replace />; // Fallback to auth for safety
    }
  }

  console.log(`ProtectedRoute: Role '${role}' is super_admin or app_super_admin, rendering Outlet.`);
  // Si está autenticado y tiene el rol correcto, renderizar la página solicitada.
  return <Outlet />;
};

export default ProtectedRoute;