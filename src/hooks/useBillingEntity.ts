import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from './use-toast';

export interface BillingEntity {
  id?: string;
  legal_name: string;
  tax_id?: string | null;
  billing_address_line1?: string | null;
  billing_address_line2?: string | null;
  billing_city?: string | null;
  billing_state?: string | null;
  billing_postal_code?: string | null;
  billing_country_id?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

const fetchBillingEntity = async (): Promise<BillingEntity | null> => {
  const { data, error } = await supabase.functions.invoke('core-actions', {
    body: {
      action: 'get_billing_entity',
    },
  });

  if (error) throw new Error(error.message);
  return data;
};

export const useBillingEntity = () => {
  return useQuery<BillingEntity | null, Error>({
    queryKey: ['billing-entity'],
    queryFn: fetchBillingEntity,
  });
};

const upsertBillingEntity = async (entityData: Partial<BillingEntity>): Promise<BillingEntity> => {
    const { data, error } = await supabase.functions.invoke('core-actions', {
        body: {
        action: 'upsert_billing_entity',
        payload: { entityData },
        },
    });
    
    if (error) throw new Error(error.message);
    return data;
};

export const useUpsertBillingEntity = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation<BillingEntity, Error, Partial<BillingEntity>>({
        mutationFn: upsertBillingEntity,
        onSuccess: () => {
            toast({
                title: 'Éxito',
                description: 'La información de facturación ha sido guardada.',
            });
            queryClient.invalidateQueries({ queryKey: ['billing-entity'] });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `No se pudo guardar la información: ${error.message}`,
                variant: 'destructive',
            });
        },
    });
};
