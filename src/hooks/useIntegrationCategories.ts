import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export interface IntegrationCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export const useIntegrationCategories = () => {
  return useQuery<IntegrationCategory[], Error>({
    queryKey: ['integrationCategories'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('core-actions', {
        body: { action: 'get_integration_categories' },
      });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useUpsertIntegrationCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (category: Partial<IntegrationCategory>) => {
      const { data, error } = await supabase.functions.invoke('core-actions', {
        body: { action: 'upsert_integration_category', payload: { category } },
      });

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data, variables) => {
      toast({ title: `Categoría ${variables.id ? 'actualizada' : 'creada'} con éxito.` });
      queryClient.invalidateQueries({ queryKey: ['integrationCategories'] });
      queryClient.invalidateQueries({ queryKey: ['globalIntegrations'] });
    },
    onError: (error) => {
      toast({ title: 'Error al guardar la categoría', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteIntegrationCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.functions.invoke('core-actions', {
        body: { action: 'delete_integration_category', payload: { id } },
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: 'Categoría eliminada con éxito.' });
      queryClient.invalidateQueries({ queryKey: ['integrationCategories'] });
      queryClient.invalidateQueries({ queryKey: ['globalIntegrations'] });
    },
    onError: (error) => {
      toast({ title: 'Error al eliminar la categoría', description: error.message, variant: 'destructive' });
    },
  });
};
