import { useQuery } from '@tanstack/react-query';
import { invokeCoreAction } from '@/lib/api';

export interface FinancialStats {
  mrr: number;
  arr: number;
  total_revenue_last_30_days: number;
  new_tenants_last_30_days: number;
  active_subscriptions: number;
  payments_last_30_days: number;
}

const fetchFinancialStats = async (platformId: string | null): Promise<FinancialStats> => {
  // Si platformId es 'all', pasamos null a la RPC para obtener las estadísticas de todas las plataformas.
  const p_platform_id = platformId === 'all' ? null : platformId;
  
  const data = await invokeCoreAction('get_platform_financial_stats', { p_platform_id });

  // La RPC devuelve un array con un solo objeto, así que lo extraemos.
  // Si no hay datos, devolvemos un objeto por defecto.
  return data?.[0] ?? {
    mrr: 0,
    arr: 0,
    total_revenue_last_30_days: 0,
    new_tenants_last_30_days: 0,
    active_subscriptions: 0,
    payments_last_30_days: 0,
  };
};

export const useFinancialStats = (platformId: string | null) => {
  return useQuery<FinancialStats, Error>({
    // La query key incluye el platformId para que se refresque automáticamente cuando cambie.
    queryKey: ['financialStats', platformId || 'all'],
    queryFn: () => fetchFinancialStats(platformId),
  });
};
