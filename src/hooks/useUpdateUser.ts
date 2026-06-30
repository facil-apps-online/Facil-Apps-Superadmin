import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

// --- Interfaces ---
export interface UpdateUserPayload {
  userId: string;
  firstName: string;
  lastName: string;
}

// --- Helper Function ---
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

// --- UPDATE User ---
const updateUser = async (payload: UpdateUserPayload): Promise<any> => {
  return invokeSuperadminAction('update_user_name', payload);
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, UpdateUserPayload>({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformLevelAssignments'] });
    },
  });
};
