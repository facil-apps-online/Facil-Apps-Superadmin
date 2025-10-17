import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTenantById, useUpdateTenant, useTenantIntegrations, useUpdateTenantIntegrations } from '@/hooks/useSuperadminTenants';
import { useIntegrationProviders } from '@/hooks/useIntegrationProviders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

function AssignIntegrationsDialog({ isOpen, onOpenChange, tenantId }) {
  const { data: providers, isLoading: isLoadingProviders } = useIntegrationProviders();
  const { data: assigned, isLoading: isLoadingAssigned } = useTenantIntegrations(tenantId);
  const updateIntegrationsMutation = useUpdateTenantIntegrations();
  const { toast } = useToast();

  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (assigned) {
      setSelected(assigned.map(a => a.provider_id));
    }
  }, [assigned]);

  const handleSave = () => {
    updateIntegrationsMutation.mutate({ tenantId, integrationIds: selected }, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: 'Integraciones actualizadas correctamente.' });
        onOpenChange(false);
      },
      onError: (e) => {
        toast({ title: 'Error', description: `No se pudieron actualizar las integraciones: ${e.message}`, variant: 'destructive' });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar Integraciones</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoadingProviders || isLoadingAssigned ? (
            <p>Cargando...</p>
          ) : (
            providers?.map(provider => (
              <div key={provider.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`provider-${provider.id}`}
                  checked={selected.includes(provider.id)}
                  onCheckedChange={(checked) => {
                    setSelected(prev => checked ? [...prev, provider.id] : prev.filter(id => id !== provider.id));
                  }}
                />
                <Label htmlFor={`provider-${provider.id}`}>{provider.name}</Label>
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
          <Button onClick={handleSave} disabled={updateIntegrationsMutation.isPending}>
            {updateIntegrationsMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
  const [isAssignIntegrationsOpen, setIsAssignIntegrationsOpen] = useState(false);

  useEffect(() => {
    if (tenant) {
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
          {/* Aquí se pueden agregar más campos para editar */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integraciones</CardTitle>
          <CardDescription>Asigna y configura las integraciones para este tenant.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsAssignIntegrationsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Asignar Integraciones
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/tenants')}>Cancelar</Button>
        <Button onClick={handleSave} disabled={updateTenantMutation.isPending}>
          {updateTenantMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <AssignIntegrationsDialog 
        isOpen={isAssignIntegrationsOpen} 
        onOpenChange={setIsAssignIntegrationsOpen} 
        tenantId={tenantId} 
      />
    </div>
  );
}
