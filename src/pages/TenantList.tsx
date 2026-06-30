import React, { useState, useMemo } from 'react';
import { useTenants, useDeleteTenant, useSetSystemOwner } from '@/hooks/useSuperadminTenants';
import { usePlatforms } from '@/hooks/usePlatforms';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2, Edit, Search, Eye, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useDebounce } from '@/hooks/useDebounce';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FilterableSelect } from '@/components/FilterableSelect';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/contexts/AuthContext';
import { usePlatformLevelAssignments } from '@/hooks/usePlatformLevelAssignments';

export default function TenantsList() {
  const { platformId: platformIdFromParams } = useParams<{ platformId: string }>();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [searchTerm, setSearchTerm] = useState('');
  const [platformId, setPlatformId] = useState<string | undefined>(platformIdFromParams);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { user, currentAssignment } = useAuth();
  const role = currentAssignment?.role;
  const { data: allAssignments } = usePlatformLevelAssignments();

  const { data: allPlatforms, isLoading: isLoadingPlatforms } = usePlatforms();

  const assignedPlatforms = useMemo(() => {
    if (role === 'super_admin') return allPlatforms || [];
    if (!user || !allAssignments || !allPlatforms) return [];
    const currentUserAssignments = allAssignments?.find(a => a.user_id === user?.id);
    if (!currentUserAssignments) return [];

    const platformIds = [
      ...(currentUserAssignments.platform_roles?.app_super_admin?.map(p => p.platform_id) || []),
      ...(currentUserAssignments.platform_roles?.investor?.map(p => p.platform_id) || [])
    ];
    
    return allPlatforms.filter(p => platformIds.includes(p.id));
  }, [user, allAssignments, role, allPlatforms]);

  const platformOptions = useMemo(() => {
    return (assignedPlatforms || []).map(p => ({ value: p.id, label: p.name }));
  }, [assignedPlatforms]);

  const { data: allTenants, isLoading, isError, error } = useTenants({
    searchTerm: debouncedSearchTerm,
  });

  const tenants = useMemo(() => {
    if (!allTenants) return [];
    
    if (role === 'super_admin') {
        return platformId ? allTenants.filter(t => t.platform?.id === platformId) : allTenants;
    }

    const assignedPlatformIds = assignedPlatforms.map(p => p.id);
    let filteredTenants = allTenants.filter(tenant => 
        tenant.platform?.id && assignedPlatformIds.includes(tenant.platform.id)
    );

    if (platformId) {
        filteredTenants = filteredTenants.filter(t => t.platform?.id === platformId);
    }
    
    return filteredTenants;
  }, [allTenants, role, assignedPlatforms, platformId]);

  const deleteTenantMutation = useDeleteTenant();
  const setSystemOwnerMutation = useSetSystemOwner();
  const { toast } = useToast();
  const screenSize = useScreenSize();

  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; tenantId: string | null; tenantName: string | null }>({ isOpen: false, tenantId: null, tenantName: null });

  const handleDeleteRequest = (tenantId: string, tenantName: string) => {
    setDeleteAlert({ isOpen: true, tenantId, tenantName });
  };

  const confirmDelete = () => {
    if (!deleteAlert.tenantId || !deleteAlert.tenantName) return;
    deleteTenantMutation.mutate(deleteAlert.tenantId, {
      onSuccess: () => toast({ title: 'Éxito', description: `El tenant "${deleteAlert.tenantName}" ha sido eliminado.` }),
      onError: (e) => toast({ title: 'Error', description: `No se pudo eliminar el tenant: ${e.message}`, variant: 'destructive' }),
      onSettled: () => setDeleteAlert({ isOpen: false, tenantId: null, tenantName: null }),
    });
  };

  const handleOwnerChange = (tenantId: string, platformId: string | undefined) => {
    if (!platformId) {
      toast({ title: 'Error', description: 'El tenant no está asociado a ninguna plataforma.', variant: 'destructive' });
      return;
    }
    setSystemOwnerMutation.mutate({ tenantId, platformId }, {
      onSuccess: () => toast({ title: 'Éxito', description: 'El propietario del sistema ha sido actualizado.' }),
      onError: (e) => toast({ title: 'Error', description: `No se pudo cambiar el propietario: ${e.message}`, variant: 'destructive' }),
    });
  };

  const getStatusVariant = (status: string | null) => {
    if (!status) return 'outline';
    switch (status) {
      case 'active': return 'activo';
      case 'grace_period': return 'gracia';
      case 'suspended': return 'suspendido';
      case 'cancelled': return 'cancelado';
      default: return 'outline';
    }
  };

  const platformName = allPlatforms?.find(p => p.id === platformIdFromParams)?.name;

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            {platformIdFromParams && (
                <Button variant="ghost" size="icon" onClick={() => navigate('/platforms')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            )}
            <h1 className="text-2xl font-bold">{platformIdFromParams ? `Tenants de ${platformName}` : 'Listado de Tenants'}</h1>
          </div>
          {role === 'super_admin' && (
            <Button asChild>
              <Link to="/tenants/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear
              </Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {!platformIdFromParams && (
            <div className="w-full md:w-56">
              <FilterableSelect
                options={platformOptions}
                value={platformId || ''}
                onValueChange={setPlatformId}
                placeholder="Filtrar por aplicación..."
                disabled={!!platformIdFromParams}
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div>Cargando tenants...</div>
        ) : isError ? (
          <div>Error al cargar los tenants: {error?.message}</div>
        ) : tenants && tenants.length > 0 ? (
          screenSize === 'mobile' ? (
            <div className="space-y-4">
              {tenants.map((tenant) => {
                const detailPath = platformIdFromParams
                  ? `/platforms/${platformIdFromParams}/tenants/${tenant.id}`
                  : `/tenants/${tenant.id}`;
                const editPath = platformIdFromParams
                  ? `/platforms/${platformIdFromParams}/tenants/${tenant.id}/edit`
                  : `/tenants/${tenant.id}/edit`;

                return (
                <Card key={tenant.id}>
                  <CardHeader>
                    <CardTitle>{tenant.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {!platformIdFromParams && <div><strong>Plataforma:</strong> {tenant.platform?.name || 'N/A'}</div>}
                    <div className="flex items-center gap-2">
                      <strong>País:</strong>
                      {tenant.countries?.iso_code ? (
                        <img src={`https://flagcdn.com/w20/${tenant.countries.iso_code.toLowerCase()}.png`} alt={`Bandera de ${tenant.countries.name}`} className="w-5 h-auto" />
                      ) : <span className="w-5 h-3"></span>}
                      <span>{tenant.countries?.name || 'N/A'}</span>
                    </div>
                    <div><strong>Estado:</strong> <Badge variant={getStatusVariant(tenant.subscription_status)}>{tenant.subscription_status}</Badge></div>
                    {role === 'super_admin' && (
                        <div className="flex items-center justify-between">
                        <strong>Propietario:</strong>
                        <Switch
                            checked={tenant.is_system_owner}
                            onCheckedChange={() => handleOwnerChange(tenant.id, tenant.platform?.id)}
                            disabled={setSystemOwnerMutation.isPending}
                            aria-label="Marcar como propietario del sistema"
                        />
                        </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild><Link to={detailPath}><Eye className="mr-2 h-4 w-4" /> Ver</Link></Button>
                    {role === 'super_admin' && (
                        <>
                        <Button variant="outline" size="sm" asChild><Link to={editPath}><Edit className="mr-2 h-4 w-4" /> Editar</Link></Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteRequest(tenant.id, tenant.name)} disabled={deleteTenantMutation.isPending}><Trash2 className="h-4 w-4" /></Button>
                        </>
                    )}
                  </CardFooter>
                </Card>
              )})}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  {!platformIdFromParams && <TableHead>Plataforma</TableHead>}
                  {role === 'super_admin' && <TableHead>Propietario</TableHead>}
                  <TableHead>Estado</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => {
                  const detailPath = platformIdFromParams
                    ? `/platforms/${platformIdFromParams}/tenants/${tenant.id}`
                    : `/tenants/${tenant.id}`;
                  const editPath = platformIdFromParams
                    ? `/platforms/${platformIdFromParams}/tenants/${tenant.id}/edit`
                    : `/tenants/${tenant.id}/edit`;

                  return (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      {!platformIdFromParams && <TableCell>{tenant.platform?.name || 'N/A'}</TableCell>}
                      {role === 'super_admin' && (
                          <TableCell>
                          <Switch
                              checked={!!tenant.is_system_owner}
                              onCheckedChange={() => handleOwnerChange(tenant.id, tenant.platform?.id)}
                              disabled={setSystemOwnerMutation.isPending}
                              aria-label={`Marcar a ${tenant.name} como propietario del sistema`}
                          />
                          </TableCell>
                      )}
                      <TableCell><Badge variant={getStatusVariant(tenant.subscription_status)}>{tenant.subscription_status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {tenant.countries?.iso_code ? (
                            <img src={`https://flagcdn.com/w20/${tenant.countries.iso_code.toLowerCase()}.png`} alt={`Bandera de ${tenant.countries.name}`} className="w-5 h-auto" />
                          ) : <span className="w-5 h-3"></span>}
                          <span>{tenant.countries?.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild><Link to={detailPath}><Eye className="mr-2 h-4 w-4" /> Ver Detalles</Link></Button>
                        {role === 'super_admin' && (
                          <>
                              <Button variant="outline" size="sm" asChild className="ml-2"><Link to={editPath}><Edit className="mr-2 h-4 w-4" /> Editar</Link></Button>
                              <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteRequest(tenant.id, tenant.name)} disabled={deleteTenantMutation.isPending}><Trash2 className="mr-2 h-4 w-4" /> Borrar</Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )
        ) : (
          <p>No se encontraron tenants con los criterios de búsqueda.</p>
        )}
      </div>

      <AlertDialog open={deleteAlert.isOpen} onOpenChange={(isOpen) => setDeleteAlert({ ...deleteAlert, isOpen })}>
        <AlertDialogContent className="w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es irreversible y borrará permanentemente el tenant <strong>{deleteAlert.tenantName}</strong> y todos sus datos asociados, incluyendo usuarios, citas, productos y configuraciones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteAlert({ isOpen: false, tenantId: null, tenantName: null })}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteTenantMutation.isPending}>
              {deleteTenantMutation.isPending ? 'Borrando...' : 'Sí, borrar tenant'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}