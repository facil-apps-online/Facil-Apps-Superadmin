import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateUser, UpdateUserPayload } from '@/hooks/useUpdateUser';
import { useDeleteUser } from '@/hooks/useDeleteUser';
import { useToast } from '@/hooks/use-toast';
import { PlatformAssignment } from '@/hooks/usePlatformLevelAssignments';
import { RolesTab } from './RolesTab';
import { Separator } from '@/components/ui/separator';

interface ManageUserDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: PlatformAssignment | null;
}

// --- Personal Info Tab Component ---
function PersonalInfoTab({ user, onSaveSuccess }: { user: PlatformAssignment, onSaveSuccess: () => void }) {
  const { toast } = useToast();
  const updateUserMutation = useUpdateUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (user) {
      if (user.first_name || user.last_name) {
        setFirstName(user.first_name || '');
        setLastName(user.last_name || '');
      } else {
        const nameParts = user.full_name?.split(' ') || [''];
        const initialFirstName = nameParts.shift() || '';
        const initialLastName = nameParts.join(' ');
        setFirstName(initialFirstName);
        setLastName(initialLastName);
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload: UpdateUserPayload = {
      userId: user.user_id,
      firstName,
      lastName,
    };

    updateUserMutation.mutate(payload, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: 'Nombre de usuario actualizado.' });
        onSaveSuccess();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: `No se pudo actualizar el usuario: ${error.message}`,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={updateUserMutation.isPending}>
          {updateUserMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogFooter>
    </form>
  );
}


// --- Main Dialog Component ---
export function ManageUserDialog({ isOpen, onOpenChange, user }: ManageUserDialogProps) {
  const { toast } = useToast();
  const deleteUserMutation = useDeleteUser();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const handleDeleteUser = () => {
    if (!user) return;
    deleteUserMutation.mutate({ userId: user.user_id }, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: 'Usuario eliminado permanentemente.' });
        setIsDeleteAlertOpen(false);
        onOpenChange(false);
      },
      onError: (error) => {
        toast({ title: 'Error', description: `No se pudo eliminar el usuario: ${error.message}`, variant: 'destructive' });
        setIsDeleteAlertOpen(false);
      }
    });
  };

  if (!user) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Gestionar Usuario: {user.full_name}</DialogTitle>
            <DialogDescription>{user.email}</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="personal-info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal-info">Información Personal</TabsTrigger>
              <TabsTrigger value="roles">Roles y Asignaciones</TabsTrigger>
            </TabsList>
            <TabsContent value="personal-info">
              <PersonalInfoTab user={user} onSaveSuccess={() => onOpenChange(false)} />
            </TabsContent>
            <TabsContent value="roles">
              <RolesTab user={user} />
            </TabsContent>
          </Tabs>
          
          <Separator />

          <div className="mt-6">
            <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
            <div className="mt-2 flex items-center justify-between rounded-lg border border-destructive p-4">
              <div>
                <h4 className="font-semibold">Eliminar Usuario</h4>
                <p className="text-sm text-muted-foreground">
                  Esta acción es irreversible y eliminará permanentemente al usuario y todas sus asignaciones.
                </p>
              </div>
              <Button variant="destructive" onClick={() => setIsDeleteAlertOpen(true)}>
                Eliminar
              </Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar permanentemente al usuario <span className="font-bold">{user.full_name}</span> ({user.email}). Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} disabled={deleteUserMutation.isPending}>
              {deleteUserMutation.isPending ? 'Eliminando...' : 'Sí, eliminar permanentemente'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
