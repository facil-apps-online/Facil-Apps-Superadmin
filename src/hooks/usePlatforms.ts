import { useQuery } from '@tanstack/react-query';
import { invokeCoreAction } from '@/lib/api';
import { Platform } from './useSuperadminTenants'; // Re-using the interface from useTenants

const fetchPlatforms = async (searchTerm?: string): Promise<Platform[]> => {
  const data = await invokeCoreAction('get_platforms', { searchTerm });
  return data || []; // Ensure we return an array even if data is null/undefined
};

export const usePlatforms = (searchTerm?: string) => {
  return useQuery<Platform[], Error>({
    queryKey: ['platforms', searchTerm],
    queryFn: () => fetchPlatforms(searchTerm),
  });
};