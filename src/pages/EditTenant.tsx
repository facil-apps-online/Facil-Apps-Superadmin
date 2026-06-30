import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTenantById, useUpdateTenant } from '@/hooks/useSuperadminTenants';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EditTenant() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!tenantId) {
    return <div className="p-4">ID de Tenant no encontrado.</div>;
  }

  const { data: tenant, isLoading, isError, error } = useTenantById(tenantId);
  const updateTenantMutation = useUpdateTenant();

  const [name, setName] = useState('');

  useEffect(() => {
    if (tenant) {
      console.log('EditTenant: tenant loaded:', tenant); // DEBUG
      setName(tenant.name || '');
    }
  }, [tenant]);

  const handleSave = () => {
    updateTenantMutation.mutate({ tenantId, updates: { name } }, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: 'Tenant actualizado correctamente.' });
        navigate('/tenants');
      },
      onError: (e) => {
        toast({ title: 'Error', description: `No se pudo actualizar el tenant: ${e.message}`, variant: 'destructive' });
      },
    });
  };

  if (isLoading) {
    return <div className="p-4">Cargando detalles del tenant...</div>;
  }

  if (isError) {
    return <div className="p-4">Error al cargar los datos: {error.message}</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tenants')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">Editar Tenant</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Información del Tenant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tenant-name">Nombre</Label>
            <Input id="tenant-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={() => navigate('/tenants')}>Cancelar</Button>
        <Button onClick={handleSave} disabled={updateTenantMutation.isPending}>
          {updateTenantMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  );
}
