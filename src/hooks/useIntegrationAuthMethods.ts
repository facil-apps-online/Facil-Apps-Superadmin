import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface IntegrationAuthMethod {
  id: string;
  method: string;
  description?: string;
  config_schema?: Record<string, unknown>;
}

const fetchIntegrationAuthMethods = async (): Promise<IntegrationAuthMethod[]> => {
  const { data, error } = await supabase.functions.invoke('core-actions', {
    body: { action: 'get_integration_auth_methods' },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useIntegrationAuthMethods = () => {
  return useQuery<IntegrationAuthMethod[], Error>({
    queryKey: ['integrationAuthMethods'],
    queryFn: fetchIntegrationAuthMethods,
  });
};
