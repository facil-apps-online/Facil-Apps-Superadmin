import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface DeleteUserPayload {
  userId: string;
}

const invokeSuperadminAction = async (action: string, payload?: any) => {
  const { data, error } = await supabase.functions.invoke('core-actions', {
    body: { action, payload },
  });
  if (error) throw new Error(error.message);
  if (data.success === false) {
    throw new Error(data.message);
  }
  return data;
};

const deleteUser = async (payload: DeleteUserPayload): Promise<any> => {
  return invokeSuperadminAction('delete_user', payload);
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, DeleteUserPayload>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformLevelAssignments'] });
    },
  });
};
