import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

export interface Language {
  id: string;
  name: string;
  iso_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const fetchLanguages = async (): Promise<Language[]> => {
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useLanguages = () => {
  return useQuery<Language[], Error>({
    queryKey: ['languages'],
    queryFn: fetchLanguages,
  });
};

export const useCreateLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newLanguage: Omit<Language, 'id' | 'created_at' | 'updated_at' | 'is_active'>) => {
      const { data, error } = await supabase.from('languages').insert(newLanguage).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      toast({ title: 'Éxito', description: 'Idioma creado.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedLanguage: Partial<Language> & { id: string }) => {
      const { id, ...updateData } = updatedLanguage;
      const { data, error } = await supabase.from('languages').update(updateData).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      toast({ title: 'Éxito', description: 'Idioma actualizado.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};
