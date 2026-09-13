import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePlatformLevelAssignments } from '@/hooks/usePlatformLevelAssignments';
import { useResendTeamInvitation } from '@/hooks/useTeamInvite';
import { InviteTeamMemberDialog } from './InviteTeamMemberDialog';
import { Mail } from 'lucide-react';

export default function TeamPage() {
  const { data: assignments, isLoading } = usePlatformLevelAssignments();
  const { toast } = useToast();
  const resendMutation = useResendTeamInvitation();

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
                    {v.is_pending ? (
                      <Badge variant="secondary">Pendiente</Badge>
                    ) : (
                      <Badge variant="outline">Activo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {v.is_pending && (
                      <Button size="sm" variant="ghost" onClick={() => handleResend(v.user_id, v.email)} disabled={resendMutation.isPending}>
                        <Mail className="mr-1 h-3.5 w-3.5" /> Reenviar invitación
                      </Button>
                    )}
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
    </div>
  );
}
