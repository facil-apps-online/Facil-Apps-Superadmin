import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

// 'Language' ahora representa una Localización, ej. Español (Colombia)
export interface Localization {
  id: string;
  name: string;
  iso_code: string; // ej. es-CO
}

export interface Timezone {
  id: string;
  name: string;
  offset_str: string;
  is_active: boolean;
}

export interface Country {
  id: string;
  name: string;
  iso_code: string;
  default_currency_id?: string | null;
  default_localization_id?: string | null;
  phone_prefix_id?: string | null;
  default_latitude?: number; // Añadido
  default_longitude?: number; // Añadido
  currencies?: { name: string; code: string };
  languages?: { name: string };
  phone_prefixes?: { prefix: string };
  timezones: Timezone[];
}

// Hook para obtener todas las localizaciones (antes idiomas)
export const useLocalizations = () => {
  return useQuery<Localization[], Error>({
    queryKey: ['localizations'],
    queryFn: async () => {
      const { data, error } = await supabase.from('languages').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });
};

// Hook para crear una nueva localización
export const useCreateLocalization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newLocalization: Omit<Localization, 'id'>) => {
      const { data, error } = await supabase.from('languages').insert(newLocalization).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['localizations'] });
      toast({ title: 'Éxito', description: 'Localización creada.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

// Hook para actualizar una localización
export const useUpdateLocalization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedLocalization: Partial<Localization> & { id: string }) => {
      const { id, ...updateData } = updatedLocalization;
      const { data, error } = await supabase.from('languages').update(updateData).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['localizations'] });
      toast({ title: 'Éxito', description: 'Localización actualizada.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

// Hook to get all timezones
export const useTimezones = () => {
  return useQuery<Timezone[], Error>({
    queryKey: ['timezones'],
    queryFn: async () => {
      const { data, error } = await supabase.from('timezones').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });
};


// --- Hooks para Países ---

export const useCountries = () => {
  return useQuery<Country[], Error>({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select(`
          *,
          currencies!default_currency_id(name, code),
          languages!default_localization_id(name),
          phone_prefixes!phone_prefix_id(prefix),
          timezones(*)
        `)
        .order('name');
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCountry: Omit<Country, 'id' | 'timezones'> & { timezone_ids: string[] }) => {
      const { timezone_ids, ...countryData } = newCountry;
      const { data: country, error } = await supabase.from('countries').insert(countryData).select().single();
      if (error) throw error;

      if (timezone_ids && timezone_ids.length > 0) {
        const countryTimezones = timezone_ids.map(tzId => ({ country_id: country.id, timezone_id: tzId }));
        const { error: joinError } = await supabase.from('country_timezones').insert(countryTimezones);
        if (joinError) throw joinError;
      }

      return country;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      toast({ title: 'Éxito', description: 'País creado.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedCountry: Partial<Omit<Country, 'timezones'>> & { id: string; timezone_ids?: string[] }) => {
      const { id, timezone_ids, ...updateData } = updatedCountry;
      const { data, error } = await supabase.from('countries').update(updateData).eq('id', id);
      if (error) throw error;

      if (timezone_ids) {
        const { error: deleteError } = await supabase.from('country_timezones').delete().eq('country_id', id);
        if (deleteError) throw deleteError;

        if (timezone_ids.length > 0) {
          const countryTimezones = timezone_ids.map(tzId => ({ country_id: id, timezone_id: tzId }));
          const { error: insertError } = await supabase.from('country_timezones').insert(countryTimezones);
          if (insertError) throw insertError;
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      toast({ title: 'Éxito', description: 'País actualizado.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
};