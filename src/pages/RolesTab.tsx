import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { PlatformAssignment } from '@/hooks/usePlatformLevelAssignments';
import { useUpdateInvestorStake } from '@/hooks/useUpdateInvestorStake';
import { useRemovePlatformAssignment, useAssignPlatformRole } from '@/hooks/usePlatformLevelAssignments';
import { useAssignSuperAdminRole } from '@/hooks/useAssignSuperAdminRole';
import { useAssignVendorRole } from '@/hooks/useAssignVendorRole';
import { usePlatforms } from '@/hooks/usePlatforms';
import { useTenants } from '@/hooks/useSuperadminTenants';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Trash2, Save, PlusCircle, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
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

interface RolesTabProps {
  user: PlatformAssignment;
}

type AddAssignmentFormData = {
  role: 'super_admin' | 'app_super_admin' | 'investor' | 'vendor' | '';
  appSuperAdminPlatforms: string[];
  investorPlatforms: { platformId: string; stake: number }[];
  vendorPlatform: string;
  vendorTenant: string;
};

// --- Add Assignment Component ---
function AddAssignment({ user }: { user: PlatformAssignment }) {
    const { toast } = useToast();
    const { data: platforms } = usePlatforms();
    
    const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm<AddAssignmentFormData>({
        defaultValues: {
            role: '',
            appSuperAdminPlatforms: [],
            investorPlatforms: [{ platformId: '', stake: 0 }],
            vendorPlatform: '',
            vendorTenant: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'investorPlatforms',
    });

    const selectedRole = watch('role');
    const vendorPlatform = watch('vendorPlatform');
    const { data: tenants } = useTenants(vendorPlatform);

    const assignRoleMutation = useAssignPlatformRole();
    const assignSuperAdminMutation = useAssignSuperAdminRole();
    const assignVendorMutation = useAssignVendorRole();

    const onSubmit = (data: AddAssignmentFormData) => {
        switch (data.role) {
            case 'super_admin':
                assignSuperAdminMutation.mutate({ userId: user.user_id }, {
                    onSuccess: () => toast({ title: 'Éxito', description: 'Rol de Super Admin asignado.'}),
                    onError: (e) => toast({ title: 'Error', description: `Error: ${e.message}`, variant: 'destructive' }),
                });
                break;
            case 'vendor':
                if (!data.vendorTenant) {
                    toast({ title: 'Error', description: 'Debes seleccionar un tenant.', variant: 'destructive' });
                    return;
                }
                assignVendorMutation.mutate({ userId: user.user_id, tenantId: data.vendorTenant }, {
                    onSuccess: () => toast({ title: 'Éxito', description: 'Rol de Vendor asignado.'}),
                    onError: (e) => toast({ title: 'Error', description: `Error: ${e.message}`, variant: 'destructive' }),
                });
                break;
            case 'app_super_admin':
            case 'investor':
                const assignments = data.role === 'investor' 
                    ? data.investorPlatforms 
                    : data.appSuperAdminPlatforms.map(p_id => ({platform_id: p_id}));
                
                if (assignments.length === 0) {
                    toast({ title: 'Error', description: 'Debes seleccionar al menos una plataforma.', variant: 'destructive' });
                    return;
                }
                assignRoleMutation.mutate({ userId: user.user_id, role: data.role, assignments }, {
                    onSuccess: () => toast({ title: 'Éxito', description: 'Rol de plataforma asignado.'}),
                    onError: (e) => toast({ title: 'Error', description: `Error: ${e.message}`, variant: 'destructive' }),
                });
                break;
            default:
                toast({ title: 'Error', description: 'Por favor, selecciona un rol.', variant: 'destructive' });
                return;
        }
        reset();
    };

    return (
        <Card>
            <CardHeader><CardTitle>Añadir Nueva Asignación</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Rol</Label>
                        <Controller
                            control={control}
                            name="role"
                            rules={{ required: 'El rol es requerido' }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Selecciona un rol" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                        <SelectItem value="app_super_admin">App Super Admin</SelectItem>
                                        <SelectItem value="investor">Investor</SelectItem>
                                        <SelectItem value="vendor">Vendor</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {selectedRole === 'app_super_admin' && (
                        <Controller
                            control={control}
                            name="appSuperAdminPlatforms"
                            render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" className="w-full justify-between">
                                    {field.value.length > 0 ? `${field.value.length} plataforma(s)` : "Selecciona plataformas..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Buscar plataforma..." />
                                    <CommandEmpty>No se encontraron plataformas.</CommandEmpty>
                                    <CommandGroup>
                                    {platforms?.map(p => (
                                        <CommandItem key={p.id} onSelect={() => {
                                            const newValue = field.value.includes(p.id) ? field.value.filter(id => id !== p.id) : [...field.value, p.id];
                                            field.onChange(newValue);
                                        }}>
                                        <Check className={cn("mr-2 h-4 w-4", field.value.includes(p.id) ? "opacity-100" : "opacity-0")} />
                                        {p.name}
                                        </CommandItem>
                                    ))}
                                    </CommandGroup>
                                </Command>
                                </PopoverContent>
                            </Popover>
                            )}
                        />
                    )}

                    {selectedRole === 'investor' && (
                        <div className="space-y-4">
                            {fields.map((item, index) => (
                                <div key={item.id} className="flex items-center gap-2">
                                    <Controller
                                        control={control}
                                        name={`investorPlatforms.${index}.platformId`}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Plataforma" /></SelectTrigger>
                                            <SelectContent>{platforms?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        )}
                                    />
                                    <Input type="number" placeholder="%" {...register(`investorPlatforms.${index}.stake`, { required: true, valueAsNumber: true })} className="w-24"/>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            ))}
                            <Button type="button" size="sm" variant="outline" onClick={() => append({ platformId: '', stake: 0 })}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Fila
                            </Button>
                        </div>
                    )}

                    {selectedRole === 'vendor' && (
                        <div className="space-y-4">
                            <Controller control={control} name="vendorPlatform" render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Selecciona una plataforma" /></SelectTrigger>
                                    <SelectContent>{platforms?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                                </Select>
                            )}/>
                            {vendorPlatform && <Controller control={control} name="vendorTenant" render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Selecciona un tenant" /></SelectTrigger>
                                    <SelectContent>{tenants?.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                </Select>
                            )}/>}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={assignRoleMutation.isPending || assignSuperAdminMutation.isPending || assignVendorMutation.isPending}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Asignación
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}


export function RolesTab({ user }: RolesTabProps) {
  const { toast } = useToast();
  const [editedStakes, setEditedStakes] = useState<Record<string, number>>({});
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; platformId: string; role: 'investor' | 'app_super_admin' } | null>(null);

  const updateStakeMutation = useUpdateInvestorStake();
  const removeAssignmentMutation = useRemovePlatformAssignment();

  const handleStakeChange = (platformId: string, stake: string) => {
    setEditedStakes(prev => ({ ...prev, [platformId]: parseFloat(stake) }));
  };

  const handleSaveStake = (platformId: string) => {
    const stake = editedStakes[platformId];
    if (stake === undefined || isNaN(stake)) {
        toast({ title: 'Error', description: 'Por favor, introduce un valor numérico válido.', variant: 'destructive' });
        return;
    };

    updateStakeMutation.mutate({ userId: user.user_id, platformId, stake }, {
      onSuccess: () => toast({ title: 'Éxito', description: 'Participación actualizada.' }),
      onError: (e) => toast({ title: 'Error', description: `Error: ${e.message}`, variant: 'destructive' }),
    });
  };

  const confirmRemoveAssignment = (platformId: string, role: 'investor' | 'app_super_admin') => {
    setDeleteAlert({ isOpen: true, platformId, role });
  };

  const handleRemoveAssignment = () => {
    if (!deleteAlert) return;
    const { platformId, role } = deleteAlert;

    removeAssignmentMutation.mutate({ userId: user.user_id, platformId, role }, {
        onSuccess: () => {
            toast({ title: 'Éxito', description: 'Asignación eliminada.' });
            setDeleteAlert(null);
        },
        onError: (e) => {
            toast({ title: 'Error', description: `Error: ${e.message}`, variant: 'destructive' });
            setDeleteAlert(null);
        },
    });
  };

  const hasAssignments = (user.platform_roles?.investor?.length || 0) > 0 || (user.platform_roles?.app_super_admin?.length || 0) > 0;

  return (
    <div className="space-y-6 py-4">
      {!hasAssignments && (
        <div className="text-center text-muted-foreground py-8">
          Este usuario no tiene asignaciones de plataforma.
        </div>
      )}

      {user.platform_roles?.investor && user.platform_roles.investor.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Asignaciones de Inversor</CardTitle>
            <CardDescription>Modifica el porcentaje de participación o revoca el acceso.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.platform_roles.investor.map(p => (
              <div key={p.platform_id} className="flex items-center justify-between p-2 border rounded-md gap-2">
                <div className="font-medium flex-grow">{p.platform_name}</div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={editedStakes[p.platform_id] ?? p.stake_percentage}
                    onChange={(e) => handleStakeChange(p.platform_id, e.target.value)}
                    className="w-28"
                    placeholder="%"
                  />
                  <Button size="icon" variant="ghost" onClick={() => handleSaveStake(p.platform_id)} disabled={updateStakeMutation.isPending}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => confirmRemoveAssignment(p.platform_id, 'investor')} disabled={removeAssignmentMutation.isPending}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {user.platform_roles?.app_super_admin && user.platform_roles.app_super_admin.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Asignaciones de App Super Admin</CardTitle>
            <CardDescription>Revoca el acceso de super administrador a una plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.platform_roles.app_super_admin.map(p => (
              <div key={p.platform_id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="font-medium">{p.platform_name}</div>
                <Button size="icon" variant="outline" onClick={() => confirmRemoveAssignment(p.platform_id, 'app_super_admin')} disabled={removeAssignmentMutation.isPending}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <AddAssignment user={user} />

      <AlertDialog open={!!deleteAlert} onOpenChange={(isOpen) => !isOpen && setDeleteAlert(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la asignación de rol para esta plataforma. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteAlert(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveAssignment} disabled={removeAssignmentMutation.isPending}>
              {removeAssignmentMutation.isPending ? 'Eliminando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
