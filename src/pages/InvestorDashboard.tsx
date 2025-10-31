import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useInvestorDashboardData } from '@/hooks/useInvestorDashboardData';

const InvestorDashboard: React.FC = () => {
  console.log('InvestorDashboard: Component rendered');

  const { assignments } = useAuth();
  console.log('InvestorDashboard: assignments from useAuth', assignments);

  const investorAssignments = useMemo(() => {
    console.log('InvestorDashboard: Calculating investorAssignments');
    if (!assignments) return [];
    const result = assignments.filter(a => a.role === 'investor' && a.platform_id);
    console.log('InvestorDashboard: investorAssignments result', result);
    return result;
  }, [assignments]);

  const { data: dashboardData, isLoading: isLoadingDashboardData, isError: isErrorDashboardData, error: errorDashboardData } = useInvestorDashboardData(investorAssignments);
  console.log('InvestorDashboard: from useInvestorDashboardData', { dashboardData, isLoadingDashboardData, isErrorDashboardData, errorDashboardData });

  if (isLoadingDashboardData) {
    console.log('InvestorDashboard: Showing loading state for dashboard data');
    return <div>Cargando datos del dashboard...</div>;
  }

  if (isErrorDashboardData) {
    console.log('InvestorDashboard: Showing error state for dashboard data', errorDashboardData);
    return <div className="text-red-500">Error al cargar datos del dashboard: {errorDashboardData?.message}</div>;
  }

  console.log('InvestorDashboard: Rendering main content with dashboard data');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard de Inversor</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Mis Inversiones</CardTitle>
          <CardDescription>Plataformas en las que tienes inversión.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plataforma</TableHead>
                <TableHead>Mi Participación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData?.platforms && dashboardData.platforms.length > 0 ? (
                dashboardData.platforms.map(platform => (
                  <TableRow key={platform.id}>
                    <TableCell>{platform.name || 'Nombre no encontrado'}</TableCell>
                    <TableCell>{platform.stake_percentage}%</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">No tienes plataformas asignadas.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas del Mes Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${dashboardData?.currentMonthSales.toFixed(2) || '0.00'}</p>
            <p className="text-sm text-muted-foreground">Comisión estimada: ${dashboardData?.currentMonthCommission.toFixed(2) || '0.00'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ventas del Mes Pasado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${dashboardData?.previousMonthSales.toFixed(2) || '0.00'}</p>
            <p className="text-sm text-muted-foreground">Comisión estimada: ${dashboardData?.previousMonthCommission.toFixed(2) || '0.00'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorDashboard;