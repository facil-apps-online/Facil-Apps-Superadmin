import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatsCard } from '@/components/StatsCard';
import { useAuth } from '@/contexts/AuthContext';
import { usePlatforms } from '@/hooks/usePlatforms';
import { usePlatformLevelAssignments } from '@/hooks/usePlatformLevelAssignments';
import { useVendorConversionReport } from '@/hooks/useVendorProspects';
import { Users, ArrowRightCircle, DollarSign } from 'lucide-react';

const pct = (n: number, total: number) => (total === 0 ? '—' : `${Math.round((n / total) * 100)}%`);

export default function ConversionReportPage() {
  const { currentAssignment } = useAuth();
  const role = currentAssignment?.role;
  const isAdmin = role === 'super_admin' || role === 'app_super_admin' || role === 'comercial_admin';

  const [platformId, setPlatformId] = useState<string>('all');
  const { data: allPlatforms } = usePlatforms();
  const platforms = useMemo(() => (allPlatforms || []).filter((p) => p.status === 'production'), [allPlatforms]);
  const { data: assignments } = usePlatformLevelAssignments();

  const vendorNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of assignments || []) map.set(a.user_id, a.full_name || a.email);
    return map;
  }, [assignments]);

  const { data: stats, isLoading } = useVendorConversionReport({
    platformId: platformId === 'all' ? undefined : platformId,
  });

  const totals = useMemo(() => {
    return (stats || []).reduce(
      (acc, s) => ({
        prospectsTotal: acc.prospectsTotal + s.prospectsTotal,
        prospectsConverted: acc.prospectsConverted + s.prospectsConverted,
        invitationsTotal: acc.invitationsTotal + s.invitationsTotal,
        invitationsAccountCreated: acc.invitationsAccountCreated + s.invitationsAccountCreated,
        invitationsPaying: acc.invitationsPaying + s.invitationsPaying,
      }),
      { prospectsTotal: 0, prospectsConverted: 0, invitationsTotal: 0, invitationsAccountCreated: 0, invitationsPaying: 0 }
    );
  }, [stats]);

  const sorted = useMemo(() => [...(stats || [])].sort((a, b) => b.invitationsPaying - a.invitationsPaying), [stats]);

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{isAdmin ? 'Conversión del Equipo Comercial' : 'Mi Conversión'}</h1>
        <p className="text-muted-foreground">Prospecto → invitación → cliente activo, por vendedor.</p>
      </div>

      {isAdmin && (
        <Select value={platformId} onValueChange={setPlatformId}>
          <SelectTrigger className="w-56"><SelectValue placeholder="Plataforma" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las plataformas</SelectItem>
            {platforms?.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {isLoading && <p className="text-muted-foreground">Cargando...</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Prospectos" value={totals.prospectsTotal} icon={Users} />
        <StatsCard title="Convertidos a Invitación" value={`${totals.prospectsConverted} (${pct(totals.prospectsConverted, totals.prospectsTotal)})`} icon={ArrowRightCircle} />
        <StatsCard title="Cuentas Creadas" value={`${totals.invitationsAccountCreated} (${pct(totals.invitationsAccountCreated, totals.invitationsTotal)})`} icon={Users} />
        <StatsCard title="Clientes Pagando" value={`${totals.invitationsPaying} (${pct(totals.invitationsPaying, totals.invitationsTotal)})`} icon={DollarSign} />
      </div>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Ranking por Vendedor</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Prospectos</TableHead>
                  <TableHead>% Convertidos</TableHead>
                  <TableHead>Invitaciones</TableHead>
                  <TableHead>% Cuenta Creada</TableHead>
                  <TableHead>Clientes Pagando</TableHead>
                  <TableHead>Perdidos/Duplicados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((s) => (
                  <TableRow key={s.vendorUserId}>
                    <TableCell>{vendorNames.get(s.vendorUserId) || s.vendorUserId}</TableCell>
                    <TableCell>{s.prospectsTotal}</TableCell>
                    <TableCell>{pct(s.prospectsConverted, s.prospectsTotal)}</TableCell>
                    <TableCell>{s.invitationsTotal}</TableCell>
                    <TableCell>{pct(s.invitationsAccountCreated, s.invitationsTotal)}</TableCell>
                    <TableCell>{s.invitationsPaying}</TableCell>
                    <TableCell>{s.invitationsLostOrDuplicate}</TableCell>
                  </TableRow>
                ))}
                {sorted.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Sin datos todavía.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
