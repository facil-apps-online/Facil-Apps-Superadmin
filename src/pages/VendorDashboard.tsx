import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useVendorCommissions } from '@/hooks/useVendorCommissions';
import { StatsCard } from '@/components/StatsCard';
import { DollarSign } from 'lucide-react';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  };

export default function VendorDashboard() {
  const { data: commissions, isLoading, isError, error } = useVendorCommissions();

  const totalCommission = useMemo(() => {
    if (!commissions) return 0;
    return commissions.reduce((acc, commission) => acc + commission.commissionAmount, 0);
  }, [commissions]);

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-bold">Dashboard de Vendedor</h1>
      
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Comisiones Totales (este mes)" value={formatCurrency(totalCommission)} icon={DollarSign} />
      </div>

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