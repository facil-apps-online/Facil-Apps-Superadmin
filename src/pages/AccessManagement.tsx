import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { usePlatformLevelAssignments, useRemovePlatformAssignment, PlatformAssignment } from '@/hooks/usePlatformLevelAssignments';
import { PlusCircle, Trash2 } from 'lucide-react';
import { AssignRoleDialog } from './AssignRoleDialog';
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

export default function AccessManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; assignment: any | null }>({ isOpen: false, assignment: null });
  
  const { data: assignments, isLoading, isError, error } = usePlatformLevelAssignments();
  const removeAssignmentMutation = useRemovePlatformAssignment();
  const { toast } = useToast();

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
    if (!user.platform_roles) return <TableCell>Sin roles especiales</TableCell>;

    return (
      <TableCell>
        <div className="flex flex-col gap-2">
          {user.platform_roles.app_super_admin && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">App Super Admin</Badge>
              <div className="flex flex-wrap gap-1">
                {user.platform_roles.app_super_admin.map((platformName, index) => (
                  <Badge key={index} variant="outline">{platformName}</Badge>
                ))}
              </div>
            </div>
          )}
          {user.platform_roles.investor && (
             <div className="flex items-center gap-2">
              <Badge variant="success">Investor</Badge>
              <div className="flex flex-wrap gap-1">
                {user.platform_roles.investor.map((p, index) => (
                  <Badge key={index} variant="outline">{p.platform_name} ({p.stake_percentage}%)</Badge>
                ))}
              </div>
            </div>
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
            <h1 className="text-2xl font-bold">Gestión de Accesos</h1>
            <p className="text-muted-foreground">Asigna roles especiales a nivel de plataforma.</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Asignar Rol
          </Button>
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
                      {/* Lógica de borrado se podría implementar aquí si se quisiera borrar por rol/plataforma */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* <AssignRoleDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} /> */}

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