import { useQuery } from "@tanstack/react-query";

interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string;
}

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: (): Promise<Setting[]> => {
      // The 'settings' table does not exist, returning an empty array.
      // This hook is being kept to avoid breaking multiple components that use it.
      return Promise.resolve([]);
    },
  });
};

// The useUpdateSetting hook has been removed as it was interacting with the non-existent 'settings' table.