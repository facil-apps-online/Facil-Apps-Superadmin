import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface ApiHealthStats {
  avg_latency_ms: number;
  error_rate_percentage: number;
  high_latency_requests: number;
  high_latency_list: {
    path: string;
    total: number;
    avg_latency: number;
    max_latency: number;
  }[];
  requests_per_minute: {
    time_bucket: string;
    request_count: number;
  }[];
}

const fetchApiHealthStats = async (): Promise<ApiHealthStats> => {
  const { data, error } = await supabase.functions.invoke('superadmin-actions', {
    body: { action: 'get_api_health_stats' },
  });

  if (error) {
    throw new Error(`Error fetching API health stats: ${error.message}`);
  }

  return data as ApiHealthStats;
};

export const useApiHealthStats = () => {
  return useQuery<ApiHealthStats, Error>({
    queryKey: ['apiHealthStats'],
    queryFn: fetchApiHealthStats,
    refetchInterval: 5000, // Refresca cada 5 segundos
  });
};
