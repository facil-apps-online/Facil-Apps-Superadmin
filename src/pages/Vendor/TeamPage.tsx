import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { usePlatformLevelAssignments } from '@/hooks/usePlatformLevelAssignments';
import { InviteTeamMemberDialog } from './InviteTeamMemberDialog';

export default function TeamPage() {
  const { data: assignments, isLoading } = usePlatformLevelAssignments();

  const vendors = useMemo(
    () => (assignments || []).filter((a) => (a.platform_roles?.vendor?.length || 0) > 0),
    [assignments]
  );

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
                </TableRow>
              ))}
              {vendors.length === 0 && !isLoading && (
                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Aún no has invitado a ningún vendedor.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
