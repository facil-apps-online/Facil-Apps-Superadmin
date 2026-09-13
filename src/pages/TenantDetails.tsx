import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTenantById } from '@/hooks/useSuperadminTenants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TenantIntegrationManager } from './TenantIntegrationManager';
import { TenantSubscriptionsManager } from '@/pages/TenantSubscriptionsManager';
// import { BranchesTab } from '../Settings/BranchesTab';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { ArrowLeft, Check, ChevronsUpDown, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { usePlatformLevelAssignments } from '@/hooks/usePlatformLevelAssignments';
import {
  useTenantVendorAssignment,
  useAssignVendorToTenant,
  useRemoveVendorFromTenant,
} from '@/hooks/useVendorTenantAssignment';
import { useToast } from '@/hooks/use-toast';

function AssignedVendorCard({ tenantId }: { tenantId: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { data: assignedVendor, isLoading } = useTenantVendorAssignment(tenantId);
  const { data: allAssignments } = usePlatformLevelAssignments();
  const assignMutation = useAssignVendorToTenant();
  const removeMutation = useRemoveVendorFromTenant();

  const vendors = (allAssignments || []).filter((a) => (a.platform_roles?.vendor?.length || 0) > 0);

  const handleAssign = (userId: string) => {
    assignMutation.mutate({ userId, tenantId }, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: 'Vendedor asignado al tenant.' });
        setOpen(false);
      },
      onError: (e) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
    });
  };

  const handleRemove = () => {
    if (!assignedVendor) return;
    removeMutation.mutate({ userId: assignedVendor.userId, tenantId }, {
      onSuccess: () => toast({ title: 'Éxito', description: 'Asignación eliminada.' }),
      onError: (e) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendedor Asignado</CardTitle>
        <CardDescription>El vendedor que gestiona comercialmente este tenant.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}
        {!isLoading && assignedVendor && (
          <div className="flex items-center justify-between p-2 border rounded-md">
            <div>
              <p className="font-medium">{assignedVendor.fullName || assignedVendor.email}</p>
              <p className="text-xs text-muted-foreground">{assignedVendor.email}</p>
            </div>
            <Button size="icon" variant="outline" onClick={handleRemove} disabled={removeMutation.isPending}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
        {!isLoading && !assignedVendor && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                Asignar vendedor...
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar vendedor..." />
                <CommandEmpty>No se encontraron vendedores.</CommandEmpty>
                <CommandGroup>
                  {vendors.map((v) => (
                    <CommandItem key={v.user_id} onSelect={() => handleAssign(v.user_id)}>
                      <Check className="mr-2 h-4 w-4 opacity-0" />
                      {v.full_name || v.email}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </CardContent>
    </Card>
  );
}

export default function TenantDetails() {
  const { tenantId, platformId } = useParams<{ tenantId: string; platformId?: string }>();
  const navigate = useNavigate();
  const { currentAssignment } = useAuth();
  const canManageVendorAssignment = ['super_admin', 'app_super_admin', 'comercial_admin'].includes(currentAssignment?.role || '');

  if (!tenantId) {
    return <div className="p-4">ID de Tenant no encontrado.</div>;
  }

  const { data: tenant, isLoading, isError, error } = useTenantById(tenantId);

  const handleBack = () => {
    if (platformId) {
      navigate(`/platforms/${platformId}/tenants`);
    } else {
      navigate('/tenants');
    }
  };

  if (isLoading) {
    return <div className="p-4">Cargando detalles del tenant...</div>;
  }

  if (isError) {
    return <div className="p-4">Error al cargar los datos: {error.message}</div>;
  }

  const getStatusVariant = (status: string | undefined) => {
    if (!status) return 'outline';
    switch (status) {
      case 'active': return 'success';
      case 'trial': return 'warning';
      case 'trial_ended': return 'destructive';
      case 'inactive': return 'secondary';
      default: return 'outline';
    }
  };

  const detailsContent = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
      <div>
        <div className="font-semibold text-muted-foreground">ID</div>
        <div className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded w-full truncate">{tenant?.id}</div>
      </div>
      <div>
        <div className="font-semibold text-muted-foreground">País</div>
        <div>{tenant?.country?.name || 'No especificado'}</div>
      </div>
      <div>
        <div className="font-semibold text-muted-foreground">Estado de Suscripción</div>
        <div>
          <Badge variant={getStatusVariant(tenant?.subscription_status)}>{tenant?.subscription_status || 'N/A'}</Badge>
        </div>
      </div>
      <div>
        <div className="font-semibold text-muted-foreground">Email Comercial</div>
        <div>{tenant?.commercial_email || 'No especificado'}</div>
      </div>
      <div>
        <div className="font-semibold text-muted-foreground">Nombre Legal</div>
        <div>{tenant?.legal_name || 'No especificado'}</div>
      </div>
      <div>
        <div className="font-semibold text-muted-foreground">ID de Impuestos</div>
        <div>{tenant?.tax_id || 'No especificado'}</div>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">Detalles del Tenant</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{tenant?.name}</CardTitle>
          <CardDescription>Información general del tenant</CardDescription>
        </CardHeader>
        <CardContent>
          {detailsContent}
        </CardContent>
      </Card>

      {canManageVendorAssignment && <AssignedVendorCard tenantId={tenantId} />}

      <TenantSubscriptionsManager tenantId={tenantId} />

      <TenantIntegrationManager
        tenantId={tenantId} 
        platformId={tenant?.platform_id || tenant?.platform?.id || ''} 
      />
      
      {/* <BranchesTab tenantId={tenantId} /> */}
    </div>
  );
}