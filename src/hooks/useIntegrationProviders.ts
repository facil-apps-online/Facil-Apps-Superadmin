import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

// --- Interfaces ---
export interface ApiSchemaNode {
  id: string;
  key: string;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  systemMap: string;
  children?: ApiSchemaNode[];
}
export interface ConfigField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'password' | 'checkbox';
  required: boolean;
  helpText?: string;
  sandboxValue: string; 
}
export interface ApiEndpoints {
  test: string;
  production: string;
}
export interface HttpHeader {
  id: string;
  name: string;
  value: string;
}
export interface IntegrationProvider {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  country_id: string;
  category_id: string;
  status: 'active' | 'inactive';
  endpoints: ApiEndpoints;
  configSchema: ConfigField[];
  apiSchema: ApiSchemaNode[];
  // Nuevos campos para la lógica de construcción de solicitudes
  http_method_id?: string;
  body_format_id?: string;
  auth_method_id?: string;
  http_headers?: HttpHeader[];
  authentication_config?: Record<string, unknown>;
  body_template?: string;
  response_mapping?: Record<string, unknown>;
}

// --- Hooks ---

// Hook para obtener un proveedor por ID

export const useIntegrationProvider = (id: string | undefined) => {

  return useQuery<IntegrationProvider | undefined, Error>({

    queryKey: ['integrationProvider', id],

    queryFn: async () => {

      if (!id) return undefined;

      const { data, error } = await supabase.functions.invoke('superadmin-actions', {

        body: { action: 'get_integration_provider', payload: { id } },

      });

      if (error) throw new Error(error.message);

      return data as IntegrationProvider;

    },

    enabled: !!id,

  });

};



// Hook para crear/actualizar un proveedor

export const useUpsertIntegrationProvider = () => {

  const queryClient = useQueryClient();

  const { toast } = useToast();



  return useMutation({

    mutationFn: async (provider: Partial<IntegrationProvider>) => {

      const { data, error } = await supabase.functions.invoke('superadmin-actions', {

        body: { action: 'upsert_integration_provider', payload: { provider } },

      });



      if (error) throw new Error(error.message);

      return data;

    },

    onSuccess: (data, variables) => {

      toast({ title: `Proveedor ${variables.id ? 'actualizado' : 'creado'} con éxito.` });

      queryClient.invalidateQueries({ queryKey: ['globalIntegrations'] });

      queryClient.invalidateQueries({ queryKey: ['integrationProvider', data.id] });

    },

    onError: (error) => {

      toast({ title: 'Error al guardar', description: error.message, variant: 'destructive' });

    },

  });

};
