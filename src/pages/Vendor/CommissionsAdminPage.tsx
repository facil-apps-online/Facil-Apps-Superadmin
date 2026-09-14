import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatsCard } from '@/components/StatsCard';
import { useToast } from '@/hooks/use-toast';
import { usePlatforms } from '@/hooks/usePlatforms';
import { usePlatformLevelAssignments } from '@/hooks/usePlatformLevelAssignments';
import {
  useVendorCommissionsAdmin,
  useMarkVendorCommissionsPaid,
  useRevertVendorCommissionPayment,
} from '@/hooks/useVendorCommissionsAdmin';
import { DollarSign, Clock, CheckCircle2, RotateCcw } from 'lucide-react';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

export default function CommissionsAdminPage() {
  const { toast } = useToast();
  const [vendorUserId, setVendorUserId] = useState<string>('all');
  const [platformId, setPlatformId] = useState<string>('all');
  const [onlyPending, setOnlyPending] = useState(true);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [reference, setReference] = useState('');

  const { data: allPlatforms } = usePlatforms();
  const platforms = useMemo(() => (allPlatforms || []).filter((p) => p.status === 'production'), [allPlatforms]);
  const { data: assignments } = usePlatformLevelAssignments(true);
  const vendors = useMemo(() => (assignments || []).filter((a) => (a.platform_roles?.vendor?.length || 0) > 0), [assignments]);

  const { data: commissions, isLoading } = useVendorCommissionsAdmin({
    vendorUserId: vendorUserId === 'all' ? undefined : vendorUserId,
    platformId: platformId === 'all' ? undefined : platformId,
    onlyPending,
  });

  const markPaidMutation = useMarkVendorCommissionsPaid();
  const revertMutation = useRevertVendorCommissionPayment();

  const selectedRows = useMemo(() => (commissions || []).filter((c) => selected[c.id]), [commissions, selected]);
  const selectedTotal = useMemo(() => selectedRows.reduce((acc, c) => acc + c.commissionAmount, 0), [selectedRows]);
  const totalPending = useMemo(
    () => (commissions || []).filter((c) => !c.isPaid).reduce((acc, c) => acc + c.commissionAmount, 0),
    [commissions]
  );

  const toggleAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    if (checked) (commissions || []).forEach((c) => { if (!c.isPaid) next[c.id] = true; });
    setSelected(next);
  };

  const handleMarkPaid = () => {
    if (selectedRows.length === 0) return;
    markPaidMutation.mutate(
      {
        payments: selectedRows.map((c) => ({
          transactionId: c.id,
          vendorUserId: c.vendor_user_id,
          platformId: c.platform_id,
          commissionAmount: c.commissionAmount,
        })),
        reference: reference || undefined,
      },
      {
        onSuccess: (data) => {
          toast({ title: 'Comisiones liquidadas', description: `${data.marked} comisión(es) marcadas como pagadas.` });
          setSelected({});
          setReference('');
        },
        onError: (e) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
      }
    );
  };

  const handleRevert = (transactionId: string, vendorUserId2: string) => {
    revertMutation.mutate(
      { transactionId, vendorUserId: vendorUserId2 },
      {
        onSuccess: () => toast({ title: 'Pago revertido', description: 'La comisión vuelve a quedar pendiente.' }),
        onError: (e) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
      }
    );
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Liquidación de Comisiones</h1>
        <p className="text-muted-foreground">Marca como pagadas las comisiones ya liquidadas al vendedor.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={vendorUserId} onValueChange={setVendorUserId}>
          <SelectTrigger className="w-56"><SelectValue placeholder="Vendedor" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los vendedores</SelectItem>
            {vendors.map((v) => (
              <SelectItem key={v.user_id} value={v.user_id}>{v.full_name || v.email}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={platformId} onValueChange={setPlatformId}>
          <SelectTrigger className="w-56"><SelectValue placeholder="Plataforma" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las plataformas</SelectItem>
            {platforms?.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={onlyPending} onCheckedChange={(v) => setOnlyPending(!!v)} />
          Solo pendientes
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Pendiente por pagar" value={formatCurrency(totalPending)} icon={Clock} />
        <StatsCard title="Seleccionado" value={formatCurrency(selectedTotal)} icon={DollarSign} />
        <StatsCard title="Filas seleccionadas" value={selectedRows.length} icon={CheckCircle2} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comisiones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedRows.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-md border p-3">
              <Input
                placeholder="Referencia del pago (opcional, ej. transferencia #1234)"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="max-w-sm"
              />
              <Button onClick={handleMarkPaid} disabled={markPaidMutation.isPending}>
                Marcar {selectedRows.length} como pagada(s)
              </Button>
            </div>
          )}

          {isLoading && <p className="text-muted-foreground">Cargando...</p>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox onCheckedChange={(v) => toggleAll(!!v)} />
                </TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Monto Venta</TableHead>
                <TableHead>Tasa</TableHead>
                <TableHead>Comisión</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(commissions || []).map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    {!c.isPaid && (
                      <Checkbox
                        checked={!!selected[c.id]}
                        onCheckedChange={(v) => setSelected((prev) => ({ ...prev, [c.id]: !!v }))}
                      />
                    )}
                  </TableCell>
                  <TableCell>{new Date(c.date).toLocaleDateString('es-CO')}</TableCell>
                  <TableCell>{c.vendor_name || c.vendor_email}</TableCell>
                  <TableCell>{c.platform_name}</TableCell>
                  <TableCell>{formatCurrency(c.saleAmount)}</TableCell>
                  <TableCell>{c.commissionRate}%</TableCell>
                  <TableCell>{formatCurrency(c.commissionAmount)}</TableCell>
                  <TableCell>
                    {c.isPaid ? (
                      <Badge variant="outline">Pagada{c.paidAt ? ` — ${new Date(c.paidAt).toLocaleDateString('es-CO')}` : ''}</Badge>
                    ) : (
                      <Badge variant="secondary">Pendiente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {c.isPaid && (
                      <Button size="sm" variant="ghost" onClick={() => handleRevert(c.id, c.vendor_user_id)} disabled={revertMutation.isPending}>
                        <RotateCcw className="mr-1 h-3.5 w-3.5" /> Revertir
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(commissions || []).length === 0 && !isLoading && (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground">Sin comisiones para estos filtros.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
