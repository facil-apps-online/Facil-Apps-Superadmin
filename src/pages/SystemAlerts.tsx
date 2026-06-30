import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SystemAlert {
  id: string;
  platform_id: string;
  platform_name: string; // Added to display the name
  type: string;
  message: string;
  details: any;
  created_at: string;
  is_resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
}


// Use the regular supabase client for all interactions, relying on RLS for authorization

const SystemAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [platforms, setPlatforms] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterPlatformId, setFilterPlatformId] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterResolved, setFilterResolved] = useState<string>('false'); // 'true', 'false', 'all'

  const fetchPlatforms = async () => {
    try {
      const { data, error: rpcError } = await supabase.functions.invoke('core-actions', {
        body: {
          action: 'get_platforms',
        },
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }
      setAlerts(data);
    } catch (err: any) {
      console.error('Error fetching system alerts:', err);
      setError(err.message || 'Failed to fetch system alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [filterPlatformId, filterType, filterResolved]);

  const handleMarkAsResolved = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres marcar esta alerta como resuelta?')) {
      return;
    }
    try {
      // In a real application, you'd get the current user's ID from auth context
      const currentUser = await supabase.auth.getUser();
      const resolvedBy = currentUser.data.user?.id;

      if (!resolvedBy) {
        alert('No se pudo obtener el ID del usuario para marcar la alerta como resuelta.');
        return;
      }

      const { data, error: rpcError } = await supabase.functions.invoke('core-actions', {
        body: {
          action: 'update_system_alert_status',
          payload: {
            id,
            is_resolved: true,
            resolved_by: resolvedBy,
          },
        },
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      if (data) {
        alert('Alerta marcada como resuelta.');
        fetchAlerts(); // Refresh the list
      }
    } catch (err: any) {
      console.error('Error marking alert as resolved:', err);
      alert(`Error al marcar la alerta como resuelta: ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alertas del Sistema</h1>

      <div className="mb-4 flex space-x-4">
        <select
          value={filterPlatformId}
          onChange={(e) => setFilterPlatformId(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todas las Plataformas</option>
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todos los Tipos</option>
          <option value="alert">Alerta</option>
          <option value="error">Error</option>
        </select>
        <select
          value={filterResolved}
          onChange={(e) => setFilterResolved(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="false">Pendientes</option>
          <option value="true">Resueltas</option>
          <option value="all">Todas</option>
        </select>
        <button onClick={fetchAlerts} className="bg-blue-500 text-white p-2 rounded">
          Aplicar Filtros
        </button>
      </div>

      {loading && <p>Cargando alertas...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && alerts.length === 0 && <p>No hay alertas para mostrar.</p>}

      {!loading && alerts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Plataforma</th>
                <th className="py-2 px-4 border-b">Tipo</th>
                <th className="py-2 px-4 border-b">Mensaje</th>
                <th className="py-2 px-4 border-b">Detalles</th>
                <th className="py-2 px-4 border-b">Creado En</th>
                <th className="py-2 px-4 border-b">Resuelto</th>
                <th className="py-2 px-4 border-b">Resuelto En</th>
                <th className="py-2 px-4 border-b">Resuelto Por</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td className="py-2 px-4 border-b text-sm">{alert.id.substring(0, 8)}...</td>
                  <td className="py-2 px-4 border-b text-sm">{alert.platform_name}</td>
                  <td className="py-2 px-4 border-b text-sm">{alert.type}</td>
                  <td className="py-2 px-4 border-b text-sm">{alert.message}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    {alert.details ? (
                      <pre className="text-xs bg-gray-100 p-1 rounded overflow-auto max-h-20">
                        {JSON.stringify(alert.details, null, 2)}
                      </pre>
                    ) : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">{new Date(alert.created_at).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b text-sm">{alert.is_resolved ? 'Sí' : 'No'}</td>
                  <td className="py-2 px-4 border-b text-sm">
                    {alert.resolved_at ? new Date(alert.resolved_at).toLocaleString() : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {alert.resolved_by ? alert.resolved_by.substring(0, 8) + '...' : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {!alert.is_resolved && (
                      <button
                        onClick={() => handleMarkAsResolved(alert.id)}
                        className="bg-green-500 text-white p-1 rounded text-xs"
                      >
                        Marcar como Resuelta
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SystemAlerts;
