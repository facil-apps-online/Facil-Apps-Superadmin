import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface Country {
  id: string;
  name: string;
  iso_code: string;
  currency_id: string;
  timezone: string;
  default_language_iso_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IntegrationCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

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
  http_method_id?: string;
  body_format_id?: string;
  auth_method_id?: string;
  http_headers?: HttpHeader[];
  authentication_config?: Record<string, unknown>;
  body_template?: string;
  response_mapping?: Record<string, unknown>;
  country: Country;
  category: IntegrationCategory;
}

export interface GlobalIntegrationsData {
  providers: IntegrationProvider[];
  countries: Country[];
  categories: IntegrationCategory[];
}


// Hook para obtener todos los proveedores, países y categorías
export const useGlobalIntegrations = () => {
  return useQuery<GlobalIntegrationsData, Error>({
    queryKey: ['globalIntegrations'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('core-actions', {
        body: { action: 'get_global_integrations' },
      });

      if (error) {
        throw new Error(`Error fetching global integrations: ${error.message}`);
      }
      
      // La edge function devuelve un objeto con providers, countries y categories
      return data;
    },
  });
};
