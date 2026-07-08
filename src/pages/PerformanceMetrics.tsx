import React from 'react';
import { useApiHealthStats } from '@/hooks/useApiHealthStats';
import { useServerHealthStats } from '@/hooks/useServerHealthStats';
import { useDatabaseNodesHealth } from '@/hooks/useDatabaseNodesHealth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Activity, AlertCircle, BarChart, HardDrive, MemoryStick, Cpu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StatCard = ({ title, value, unit, description, icon, isLoading }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-3/4" />
      ) : (
        <div className="text-2xl font-bold">{value} <span className="text-base font-normal text-muted-foreground">{unit}</span></div>
      )}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

const ChartCard = ({ title, description, children, isLoading }) => (
    <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
            {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    {children}
                </ResponsiveContainer>
            )}
        </CardContent>
    </Card>
);

export default function PerformanceMetrics() {
  const { data: apiStats, isLoading: isLoadingApi, isError: isErrorApi, error: errorApi } = useApiHealthStats();
  const { data: serverStats, isLoading: isLoadingServer, isError: isErrorServer, error: errorServer } = useServerHealthStats();
  const { data: nodesHealth, isLoading: isLoadingNodes } = useDatabaseNodesHealth();
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 5;

  const formattedRpmData = React.useMemo(() => {
    return apiStats?.requests_per_minute.map(d => ({
      ...d,
      time_bucket: format(new Date(d.time_bucket), 'HH:mm'),
    })) || [];
  }, [apiStats]);

  const paginatedHighLatencyList = React.useMemo(() => {
    if (!apiStats?.high_latency_list) return [];
    const startIndex = (page - 1) * itemsPerPage;
    return apiStats.high_latency_list.slice(startIndex, startIndex + itemsPerPage);
  }, [apiStats, page]);

  const totalPages = Math.ceil((apiStats?.high_latency_list?.length || 0) / itemsPerPage);

  const isError = isErrorApi || isErrorServer;
  const error = errorApi || errorServer;

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 p-4 border border-red-500 rounded-md flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Error al cargar las métricas: {error?.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:p-6">
      {/* Nodes Health Section */}
      <div className="pt-2">
        <h2 className="text-xl font-bold">Estado de Nodos de Bases de Datos</h2>
        <p className="text-muted-foreground">Monitor de salud de todas las bases de datos de Supabase registradas.</p>
      </div>
      <Card className="col-span-1 lg:col-span-3">
        <CardContent className="pt-6">
          {isLoadingNodes ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nodo</TableHead>
                  <TableHead>URL de Proyecto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Latencia</TableHead>
                  <TableHead>Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(nodesHealth || []).map((node) => (
                  <TableRow key={node.node_id}>
                    <TableCell className="font-medium">{node.node_name}</TableCell>
                    <TableCell className="font-mono text-xs">{node.project_url}</TableCell>
                    <TableCell>
                      {node.status === 'online' ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Online
                        </span>
                      ) : node.status === 'warning' ? (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          Warning
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Error
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {node.latency_ms !== null ? `${node.latency_ms} ms` : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]" title={node.details}>
                      {node.details}
                    </TableCell>
                  </TableRow>
                ))}
                {(!nodesHealth || nodesHealth.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                      No hay nodos de infraestructura registrados activos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* API Health Section */}
      <div className="pt-4">
        <h2 className="text-xl font-bold">Métricas de Consultas (Core DB)</h2>
        <p className="text-muted-foreground">Datos de los últimos 60 minutos. Se actualiza automáticamente.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Latencia Promedio"
          value={apiStats?.avg_latency_ms.toFixed(0) ?? '...'}
          unit="ms"
          description="Tiempo de respuesta de la API."
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingApi}
        />
        <StatCard
          title="Peticiones > 1s"
          value={apiStats?.high_latency_requests ?? '...'}
          unit="reqs"
          description="Consultas con latencia superior a 1000 ms en el último mes."
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingApi}
        />
        <StatCard
          title="Tasa de Errores (5xx)"
          value={apiStats?.error_rate_percentage.toFixed(2) ?? '...'}
          unit="%"
          description="Porcentaje de peticiones fallidas."
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingApi}
        />
        <StatCard
          title="Peticiones Totales"
          value={apiStats?.requests_per_minute.reduce((acc, curr) => acc + curr.request_count, 0) ?? '...'}
          unit="reqs"
          description="En la última hora."
          icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingApi}
        />
      </div>

      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
            title="Peticiones por Minuto (RPM)"
            description="Volumen de tráfico que maneja el Backend."
            isLoading={isLoadingApi}
        >
            <LineChart data={formattedRpmData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time_bucket" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))"
                    }}
                />
                <Line type="monotone" dataKey="request_count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Peticiones con Alta Latencia</CardTitle>
            <CardDescription>
              Lista de las peticiones más lentas en el último mes, agrupadas por acción.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingApi ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Acción</TableHead>
                      <TableHead className="text-right">Total Peticiones</TableHead>
                      <TableHead className="text-right">Latencia Promedio (ms)</TableHead>
                      <TableHead className="text-right">Latencia Máxima (ms)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHighLatencyList.map((req, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{req.path}</TableCell>
                        <TableCell className="text-right">{req.total}</TableCell>
                        <TableCell className="text-right">{req.avg_latency.toFixed(0)}</TableCell>
                        <TableCell className="text-right">{req.max_latency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Server Health Section */}
      <div className="pt-4">
        <h2 className="text-xl font-bold">Salud de la Infraestructura (Servidor)</h2>
        <p className="text-muted-foreground">Monitor en tiempo real (Se actualiza automáticamente).</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Carga de CPU (1 min)"
          value={serverStats?.cpu_load_1m.toFixed(2) ?? '...'}
          unit="load"
          description="Promedio de carga del sistema."
          icon={<Cpu className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingServer}
        />
        <StatCard
          title="Uso de Memoria (RAM)"
          value={serverStats?.memory.usage_percent.toFixed(2) ?? '...'}
          unit="%"
          description={`${serverStats?.memory.used_gb.toFixed(2) ?? '...'} GB de ${serverStats?.memory.total_gb.toFixed(2) ?? '...'} GB`}
          icon={<MemoryStick className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingServer}
        />
        <StatCard
          title="Uso de Disco"
          value={serverStats?.disk.usage_percent.toFixed(2) ?? '...'}
          unit="%"
          description={`${serverStats?.disk.used_gb.toFixed(2) ?? '...'} GB de ${serverStats?.disk.total_gb.toFixed(2) ?? '...'} GB`}
          icon={<HardDrive className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingServer}
        />
      </div>


    </div>
  );
}