import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface PlatformCategoryTranslation {
  locale: string;
  name: string;
}

export interface PlatformCategory {
  id: string;
  slug: string;
  display_order: number;
  platform_category_translations: PlatformCategoryTranslation[] | null;
}

export const usePlatformCategories = () => {
  return useQuery<PlatformCategory[], Error>({
    queryKey: ['platformCategories'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('core-actions', {
        body: { action: 'get_platform_categories' },
      });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
};
