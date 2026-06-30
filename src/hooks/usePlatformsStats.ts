import { useQuery } from '@tanstack/react-query';
import { invokeCoreAction } from '@/lib/api';

export interface PlatformStats {
  platform_id: string;
  platform_name: string;
  mrr: number;
  active_subscriptions: number;
}

const fetchPlatformsStats = async (): Promise<PlatformStats[]> => {
  const data = await invokeCoreAction('get_platforms_stats');
  return data || [];
};

export const usePlatformsStats = () => {
  return useQuery<PlatformStats[], Error>({
    queryKey: ['platformsStats'],
    queryFn: fetchPlatformsStats,
    // Sort the data alphabetically by platform name before returning it to the component.
    select: (data) => [...data].sort((a, b) => a.platform_name.localeCompare(b.platform_name)),
  });
};
