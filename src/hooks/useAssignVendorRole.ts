import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface AssignVendorPayload {
  userId: string;
  tenantId: string;
}

const invokeSuperadminAction = async (action: string, payload?: any) => {
  const { data, error } = await supabase.functions.invoke('superadmin-actions', {
    body: { action, payload },
  });
  if (error) throw new Error(error.message);
  if (data.success === false) {
    throw new Error(data.message);
  }
  return data;
};

const assignVendorRole = async (payload: AssignVendorPayload): Promise<any> => {
  return invokeSuperadminAction('assign_vendor_role', payload);
};

export const useAssignVendorRole = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, AssignVendorPayload>({
    mutationFn: assignVendorRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformLevelAssignments'] });
    },
  });
};
