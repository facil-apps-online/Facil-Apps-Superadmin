import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useVendorCommissions } from '@/hooks/useVendorCommissions';
import { INVITATION_STATUSES, useVendorInvitationFunnel } from '@/hooks/useVendorInvitations';
import { StatsCard } from '@/components/StatsCard';
import { DollarSign, Mail } from 'lucide-react';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  };

export default function VendorDashboard() {
  const { data: commissions, isLoading, isError, error } = useVendorCommissions();
  const { data: funnel } = useVendorInvitationFunnel();

  const totalCommission = useMemo(() => {
    if (!commissions) return 0;
    return commissions.reduce((acc, commission) => acc + commission.commissionAmount, 0);
  }, [commissions]);

  const totalInvitations = useMemo(() => {
    if (!funnel) return 0;
    return Object.values(funnel).reduce((acc, n) => acc + n, 0);
  }, [funnel]);

  const wonInvitations = (funnel?.activo || 0) + (funnel?.activo_con_plan || 0);

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-bold">Dashboard de Vendedor</h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Comisiones Totales (este mes)" value={formatCurrency(totalCommission)} icon={DollarSign} />
        <StatsCard title="Invitaciones Totales" value={totalInvitations} icon={Mail} />
        <StatsCard title="Clientes Ganados" value={wonInvitations} icon={Mail} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Embudo de Invitaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {INVITATION_STATUSES.map((s) => (
              <div key={s.id} className="flex-1 min-w-[8rem] rounded-md border p-3 text-center">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{funnel?.[s.id] || 0}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desglose de Comisiones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Cargando comisiones...</p>}
          {isError && <p className="text-red-500">Error al cargar comisiones: {error.message}</p>}
          {commissions && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Producto/Servicio</TableHead>
                  <TableHead>Monto Venta</TableHead>
                  <TableHead>Tasa Comisión</TableHead>
                  <TableHead>Monto Comisión</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>{commission.date}</TableCell>
                    <TableCell>{commission.productName}</TableCell>
                    <TableCell>{formatCurrency(commission.saleAmount)}</TableCell>
                    <TableCell>{commission.commissionRate}%</TableCell>
                    <TableCell>{formatCurrency(commission.commissionAmount)}</TableCell>
                    <TableCell>
                      {commission.isPaid ? (
                        <Badge variant="outline">Pagada</Badge>
                      ) : (
                        <Badge variant="secondary">Pendiente</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}