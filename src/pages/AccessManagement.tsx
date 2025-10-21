import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { usePlatformLevelAssignments, useRemovePlatformAssignment, PlatformAssignment } from '@/hooks/usePlatformLevelAssignments';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import { CreateUserDialog } from './CreateUserDialog';
import { ManageUserDialog } from './ManageUserDialog';

export default function AccessManagementPage() {
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isManageUserDialogOpen, setIsManageUserDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // Store ID only
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; assignment: any | null }>({ isOpen: false, assignment: null });
  
  const { data: assignments, isLoading, isError, error } = usePlatformLevelAssignments();
  const removeAssignmentMutation = useRemovePlatformAssignment();
  const { toast } = useToast();

  // Find the full user object from the latest query data
  const selectedUserForManage = assignments?.find(u => u.user_id === selectedUserId) || null;

  const handleOpenManageUserDialog = (user: PlatformAssignment) => {
    setSelectedUserId(user.user_id);
    setIsManageUserDialogOpen(true);
  };

  const handleCloseManageUserDialog = () => {
    setIsManageUserDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleRemove = () => {
    if (!deleteAlert.assignment) return;
    
    removeAssignmentMutation.mutate(deleteAlert.assignment, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: 'La asignación ha sido eliminada.' });
        setDeleteAlert({ isOpen: false, assignment: null });
      },
      onError: (e) => {
        toast({ title: 'Error', description: `No se pudo eliminar la asignación: ${e.message}`, variant: 'destructive' });
      },
    });
  };

  const renderPlatformRoles = (user: PlatformAssignment) => {
    // This function now receives the most up-to-date user object on each render
    const hasAppSuperAdminRoles = user.platform_roles?.app_super_admin && user.platform_roles.app_super_admin.length > 0;
    const hasInvestorRoles = user.platform_roles?.investor && user.platform_roles.investor.length > 0;
    const isSuperAdmin = user.platform_roles?.super_admin;

    return (
      <TableCell>
        <div className="flex flex-col gap-2">
          {isSuperAdmin && (
            <div className="flex items-center gap-2">
              <Badge>Super Admin</Badge>
            </div>
          )}
          {hasAppSuperAdminRoles && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">App Super Admin</Badge>
              <div className="flex flex-wrap gap-1">
                {user.platform_roles.app_super_admin.map((platform, index) => (
                  <Badge key={index} variant="outline">{platform.platform_name}</Badge>
                ))}
              </div>
            </div>
          )}
          {hasInvestorRoles && (
             <div className="flex items-center gap-2">
              <Badge variant="success">Investor</Badge>
              <div className="flex flex-wrap gap-1">
                {user.platform_roles.investor.map((p, index) => (
                  <Badge key={index} variant="outline">{p.platform_name} ({p.stake_percentage}%)</Badge>
                ))}
              </div>
            </div>
          )}
          {(!isSuperAdmin && !hasAppSuperAdminRoles && !hasInvestorRoles) && (
             <p className="text-muted-foreground">Sin roles especiales</p>
          )}
        </div>
      </TableCell>
    );
  };

  return (
    <>
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Usuarios y Accesos</h1>
            <p className="text-muted-foreground">Crea nuevos usuarios y gestiona sus roles y asignaciones de plataforma.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateUserDialogOpen(true)} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear Usuario
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios con Roles Especiales</CardTitle>
            <CardDescription>
              Usuarios con permisos de `investor` o `app_super_admin` sobre una o más plataformas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Roles y Plataformas Asignadas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={3}>Cargando...</TableCell></TableRow>}
                {isError && <TableRow><TableCell colSpan={3} className="text-destructive">Error: {error.message}</TableCell></TableRow>}
                {assignments && assignments.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <div className="font-medium">{user.full_name || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    {renderPlatformRoles(user)}
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleOpenManageUserDialog(user)}>
                        Gestionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <CreateUserDialog isOpen={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen} />
      <ManageUserDialog
        isOpen={isManageUserDialogOpen}
        onOpenChange={handleCloseManageUserDialog}
        user={selectedUserForManage}
      />

      <AlertDialog open={deleteAlert.isOpen} onOpenChange={(isOpen) => setDeleteAlert({ ...deleteAlert, isOpen })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la asignación de rol para este usuario. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteAlert({ isOpen: false, assignment: null })}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} disabled={removeAssignmentMutation.isPending}>
              {removeAssignmentMutation.isPending ? 'Eliminando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
