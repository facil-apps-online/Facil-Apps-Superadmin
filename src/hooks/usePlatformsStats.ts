import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface PlatformStats {
  platform_id: string;
  platform_name: string;
  mrr: number;
  active_subscriptions: number;
}

const fetchPlatformsStats = async (): Promise<PlatformStats[]> => {
  const { data, error } = await supabase.rpc('get_platforms_stats');

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const usePlatformsStats = () => {
  return useQuery<PlatformStats[], Error>({
    queryKey: ['platformsStats'],
    queryFn: fetchPlatformsStats,
    select: (data) => data.sort((a, b) => a.platform_name.localeCompare(b.platform_name)),
  });
};
