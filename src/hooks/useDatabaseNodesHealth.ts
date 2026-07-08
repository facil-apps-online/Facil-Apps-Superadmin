import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface DatabaseNodeHealth {
  node_id: string;
  node_name: string;
  project_url: string;
  status: 'online' | 'warning' | 'error';
  latency_ms: number | null;
  details: string;
}

const fetchDatabaseNodesHealth = async (): Promise<DatabaseNodeHealth[]> => {
  const { data, error } = await supabase.functions.invoke('core-actions', {
    body: { action: 'get_infrastructure_metrics' },
  });

  if (error) {
    throw new Error(`Error fetching database nodes health: ${error.message}`);
  }

  return data as DatabaseNodeHealth[];
};

export const useDatabaseNodesHealth = () => {
  return useQuery<DatabaseNodeHealth[], Error>({
    queryKey: ['databaseNodesHealth'],
    queryFn: fetchDatabaseNodesHealth,
    refetchInterval: 10000, // Refresca cada 10 segundos
  });
};
