import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface AssignSuperAdminPayload {
  userId: string;
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

const assignSuperAdminRole = async (payload: AssignSuperAdminPayload): Promise<any> => {
  return invokeSuperadminAction('assign_super_admin_role', payload);
};

export const useAssignSuperAdminRole = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, AssignSuperAdminPayload>({
    mutationFn: assignSuperAdminRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformLevelAssignments'] });
    },
  });
};
