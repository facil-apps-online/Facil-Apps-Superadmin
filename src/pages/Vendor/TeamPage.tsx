import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePlatformLevelAssignments, PlatformAssignment } from '@/hooks/usePlatformLevelAssignments';
import { useResendTeamInvitation, useRevokeTeamMember, useReactivateTeamMember } from '@/hooks/useTeamInvite';
import { useReassignVendorPipeline } from '@/hooks/useReassignVendorPipeline';
import { InviteTeamMemberDialog } from './InviteTeamMemberDialog';
import { Mail, Ban, RotateCcw, Repeat } from 'lucide-react';

export default function TeamPage() {
  const { data: assignments, isLoading } = usePlatformLevelAssignments();
  const { toast } = useToast();
  const resendMutation = useResendTeamInvitation();
  const revokeMutation = useRevokeTeamMember();
  const reactivateMutation = useReactivateTeamMember();
  const reassignMutation = useReassignVendorPipeline();
  const [revokeTarget, setRevokeTarget] = useState<PlatformAssignment | null>(null);
  const [reassignTarget, setReassignTarget] = useState<PlatformAssignment | null>(null);
  const [reassignToUserId, setReassignToUserId] = useState<string>('');
  const [reassignPlatformId, setReassignPlatformId] = useState<string>('all');

  const vendors = useMemo(
    () => (assignments || []).filter((a) => (a.platform_roles?.vendor?.length || 0) > 0),
    [assignments]
  );

  const handleResend = (userId: string, email: string) => {
    resendMutation.mutate(userId, {
      onSuccess: () => toast({ title: 'Invitación reenviada', description: `Se envió un nuevo correo a ${email}.` }),
      onError: (error) => toast({ title: 'Error', description: error.message, variant: 'destructive' }),
    });
  };

  const handleConfirmRevoke = () => {
    if (!revokeTarget) return;
    revokeMutation.mutate(revokeTarget.user_id, {
      onSuccess: () => {
        toast({ title: 'Acceso revocado', description: `${revokeTarget.email} ya no puede iniciar sesión.` });
        setRevokeTarget(null);
      },
      onError: (error) => {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        setRevokeTarget(null);
      },
    });
  };

  const handleReactivate = (userId: string, email: string) => {
    reactivateMutation.mutate(userId, {
      onSuccess: () => toast({ title: 'Acceso reactivado', description: `${email} ya puede iniciar sesión de nuevo.` }),
      onError: (error) => toast({ title: 'Error', description: error.message, variant: 'destructive' }),
    });
  };

  const openReassignDialog = (v: PlatformAssignment) => {
    setReassignTarget(v);
    setReassignToUserId('');
    setReassignPlatformId('all');
  };

  const handleConfirmReassign = () => {
    if (!reassignTarget || !reassignToUserId) return;
    reassignMutation.mutate(
      {
        fromVendorUserId: reassignTarget.user_id,
        toVendorUserId: reassignToUserId,
        platformId: reassignPlatformId === 'all' ? undefined : reassignPlatformId,
      },
      {
        onSuccess: (data) => {
          toast({
            title: 'Cartera reasignada',
            description: `${data.prospectsMoved} prospecto(s) y ${data.invitationsMoved} invitación(es) en curso se movieron.`,
          });
          setReassignTarget(null);
        },
        onError: (error) => toast({ title: 'Error', description: error.message, variant: 'destructive' }),
      }
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mi Equipo</h1>
          <p className="text-muted-foreground">Vendedores con acceso al portal de Facil Apps Online.</p>
        </div>
        <InviteTeamMemberDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendedores</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Cargando...</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plataformas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((v) => (
                <TableRow key={v.user_id}>
                  <TableCell>{v.full_name || '—'}</TableCell>
                  <TableCell>{v.email}</TableCell>
                  <TableCell className="flex flex-wrap gap-1">
                    {v.platform_roles?.vendor?.map((p) => (
                      <Badge key={p.platform_id} variant="outline">{p.platform_name}</Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    {v.is_revoked ? (
                      <Badge variant="destructive">Revocado</Badge>
                    ) : v.is_pending ? (
                      <Badge variant="secondary">Pendiente</Badge>
                    ) : (
                      <Badge variant="outline">Activo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {v.is_revoked ? (
                      <Button size="sm" variant="ghost" onClick={() => handleReactivate(v.user_id, v.email)} disabled={reactivateMutation.isPending}>
                        <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reactivar
                      </Button>
                    ) : (
                      <>
                        {v.is_pending && (
                          <Button size="sm" variant="ghost" onClick={() => handleResend(v.user_id, v.email)} disabled={resendMutation.isPending}>
                            <Mail className="mr-1 h-3.5 w-3.5" /> Reenviar invitación
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setRevokeTarget(v)} disabled={revokeMutation.isPending}>
                          <Ban className="mr-1 h-3.5 w-3.5 text-destructive" /> Revocar
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => openReassignDialog(v)}>
                      <Repeat className="mr-1 h-3.5 w-3.5" /> Reasignar cartera
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {vendors.length === 0 && !isLoading && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Aún no has invitado a ningún vendedor.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!revokeTarget} onOpenChange={(isOpen) => !isOpen && setRevokeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Revocar el acceso de {revokeTarget?.full_name || revokeTarget?.email}?</AlertDialogTitle>
            <AlertDialogDescription>
              No podrá iniciar sesión hasta que lo reactives. Sus comisiones y plataformas asignadas se conservan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRevoke} disabled={revokeMutation.isPending}>
              {revokeMutation.isPending ? 'Revocando...' : 'Revocar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!reassignTarget} onOpenChange={(isOpen) => !isOpen && setReassignTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reasignar cartera de {reassignTarget?.full_name || reassignTarget?.email}</DialogTitle>
            <DialogDescription>
              Mueve sus prospectos e invitaciones que aún están en curso a otro vendedor. Lo ya
              convertido en cliente (comisiones, tenants activos) se queda con {reassignTarget?.full_name || 'él'} — esto solo mueve la cartera abierta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Vendedor destino</label>
              <Select value={reassignToUserId} onValueChange={setReassignToUserId}>
                <SelectTrigger><SelectValue placeholder="Selecciona un vendedor" /></SelectTrigger>
                <SelectContent>
                  {vendors.filter((v) => v.user_id !== reassignTarget?.user_id).map((v) => (
                    <SelectItem key={v.user_id} value={v.user_id}>{v.full_name || v.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Plataforma</label>
              <Select value={reassignPlatformId} onValueChange={setReassignPlatformId}>
                <SelectTrigger><SelectValue placeholder="Plataforma" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las plataformas</SelectItem>
                  {reassignTarget?.platform_roles?.vendor?.map((p) => (
                    <SelectItem key={p.platform_id} value={p.platform_id}>{p.platform_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReassignTarget(null)}>Cancelar</Button>
            <Button onClick={handleConfirmReassign} disabled={!reassignToUserId || reassignMutation.isPending}>
              {reassignMutation.isPending ? 'Reasignando...' : 'Reasignar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
