import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface IntegrationHttpMethod {
  id: string;
  method: string;
  description?: string;
}

const fetchIntegrationHttpMethods = async (): Promise<IntegrationHttpMethod[]> => {
  const { data, error } = await supabase.functions.invoke('core-actions', {
    body: { action: 'get_integration_http_methods' },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useIntegrationHttpMethods = () => {
  return useQuery<IntegrationHttpMethod[], Error>({
    queryKey: ['integrationHttpMethods'],
    queryFn: fetchIntegrationHttpMethods,
  });
};
