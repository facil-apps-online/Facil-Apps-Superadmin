import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFinancialStats } from '@/hooks/useFinancialStats';
import { useSuperadminPaymentStats } from '@/hooks/useSuperadminPaymentStats';
import { usePlatformsStats } from '@/hooks/usePlatformsStats';
import { StatsCard } from '@/components/StatsCard';
import { DollarSign, TrendingUp, CalendarClock, Users, PieChart, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { usePlatformLevelAssignments } from '@/hooks/usePlatformLevelAssignments';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigate } from 'react-router-dom';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function SuperadminStats() {
  const { platformId: platformIdFromParams } = useParams<{ platformId: string }>();
  const { user, currentAssignment } = useAuth();
  const role = currentAssignment?.role;
  const { data: allAssignments } = usePlatformLevelAssignments();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(platformIdFromParams || null);

  const { data: paymentStats, isLoading: isLoadingPaymentStats } = useSuperadminPaymentStats();
  const { data: platformsStats, isLoading: isLoadingPlatformsStats } = usePlatformsStats();

  if (role === 'vendor') {
    return <Navigate to="/commissions" replace />;
  }

  const assignedPlatforms = useMemo(() => {
    if (role === 'super_admin') return [];
    if (!user || !allAssignments) return [];
    const currentUserAssignments = allAssignments?.find(a => a.user_id === user?.id);
    if (!currentUserAssignments) return [];

    const appSuperAdminPlatforms = currentUserAssignments.platform_roles?.app_super_admin || [];
    const investorPlatforms = currentUserAssignments.platform_roles?.investor || [];
    
    const allPlatforms = [
        ...appSuperAdminPlatforms.map(p => ({ id: p.platform_id, name: p.platform_name })),
        ...investorPlatforms.map(p => ({ id: p.platform_id, name: p.platform_name }))
    ];

    const uniquePlatforms = allPlatforms.filter((p, index, self) => 
        index === self.findIndex((t) => t.id === p.id)
    );

    return uniquePlatforms;
  }, [user, allAssignments, role]);

  useEffect(() => {
    if (platformIdFromParams) {
      setSelectedPlatform(platformIdFromParams);
    } else if (role !== 'super_admin' && assignedPlatforms.length === 1) {
      setSelectedPlatform(assignedPlatforms[0].id);
    }
  }, [assignedPlatforms, role, platformIdFromParams]);

  const platformIdToFetch = role === 'super_admin' ? (platformIdFromParams || selectedPlatform) : selectedPlatform;
  const { data: stats, isLoading, isError, error } = useFinancialStats(platformIdToFetch);

  const shouldShowStats = role === 'super_admin' || (selectedPlatform && stats);

  return (
    <div className="flex flex-col gap-8">
        <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">Dashboard Financiero</h1>
            <p className="text-muted-foreground">Métricas clave del rendimiento económico de la plataforma.</p>
        </div>

        {role !== 'super_admin' && !platformIdFromParams && (
            <div className="mb-4">
                <Select onValueChange={setSelectedPlatform} value={selectedPlatform || ''}>
                    <SelectTrigger className="w-full md:w-[280px]">
                        <SelectValue placeholder="Selecciona una plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                        {assignedPlatforms.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        )}

        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center justify-center h-full text-muted-foreground">Cargando datos...</motion.div>
            )}

            {isError && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="text-red-500 p-4 border border-red-500 rounded-md">
                    <div className="flex items-center gap-2 font-bold"><AlertTriangle className="h-5 w-5" /> Error al Cargar el Dashboard</div>
                    <p className="mt-2 text-sm">{error.message}</p>
                </motion.div>
            )}

            {!isLoading && !isError && !shouldShowStats && role !== 'super_admin' && (
                 <motion.div key="no-selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="text-center text-muted-foreground py-12">
                    <p>Por favor, selecciona una plataforma para ver sus estadísticas.</p>
                </motion.div>
            )}

            {!isLoading && !isError && shouldShowStats && (
                <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col gap-8">
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <StatsCard title="Ingresos Mensuales (MRR)" value={formatCurrency(stats?.mrr ?? 0)} icon={DollarSign} />
                        <StatsCard title="Ingresos Anuales (ARR)" value={formatCurrency(stats?.arr ?? 0)} icon={TrendingUp} />
                        <StatsCard title="Nuevos Tenants (30 días)" value={stats?.new_tenants_last_30_days ?? 0} icon={Users} />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <StatsCard title="Proyectado (7 días)" value={formatCurrency(stats?.projected_revenue_next_7_days ?? 0)} icon={CalendarClock} />
                        <StatsCard title="Proyectado (30 días)" value={formatCurrency(stats?.projected_revenue_next_30_days ?? 0)} icon={CalendarClock} />
                        <StatsCard title="Renovado (Últimos 30 días)" value={formatCurrency(stats?.renewed_revenue_last_30_days ?? 0)} icon={CalendarClock} />
                    </div>
                    
                    {role === 'super_admin' && (
                        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                            <Card>
                                <CardHeader><CardTitle>Pagos a Inversionistas</CardTitle></CardHeader>
                                <CardContent>
                                    {isLoadingPaymentStats ? <p>Cargando...</p> : (
                                        <Table>
                                            <TableHeader><TableRow><TableHead>Plataforma</TableHead><TableHead>Inversionista</TableHead><TableHead>Total a Pagar</TableHead></TableRow></TableHeader>
                                            <TableBody>
                                                {paymentStats?.investor_payouts.map(payout => (
                                                    <TableRow key={`${payout.platform_id}-${payout.investor_id}`}>
                                                        <TableCell>{payout.platform_name}</TableCell>
                                                        <TableCell>{payout.investor_email}</TableCell>
                                                        <TableCell>{formatCurrency(payout.total_payout)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Comisiones de Vendedores</CardTitle></CardHeader>
                                <CardContent>
                                    {isLoadingPaymentStats ? <p>Cargando...</p> : (
                                        <Table>
                                            <TableHeader><TableRow><TableHead>Plataforma</TableHead><TableHead>Vendedor</TableHead><TableHead>Total a Pagar</TableHead></TableRow></TableHeader>
                                            <TableBody>
                                                {paymentStats?.vendor_commissions.map(commission => (
                                                    <TableRow key={`${commission.platform_id}-${commission.vendor_id}`}>
                                                        <TableCell>{commission.platform_name}</TableCell>
                                                        <TableCell>{commission.vendor_email}</TableCell>
                                                        <TableCell>{formatCurrency(commission.total_commission)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Rendimiento por Plataforma</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={platformsStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="platform_name" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                    <Tooltip formatter={(value, name) => name === 'mrr' ? formatCurrency(value as number) : value} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="mrr" fill="#8884d8" name="MRR" />
                                    <Bar yAxisId="right" dataKey="active_subscriptions" fill="#82ca9d" name="Suscripciones Activas" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
