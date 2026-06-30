
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

// --- Interfaces ---
export interface CreateUserPayload {
  email: string;
  password?: string; // Opcional, puede que se invite al usuario
  fullName: string;
  role: 'super_admin' | 'app_super_admin' | 'investor' | 'vendor';
  assignments?: any; // Dependerá del rol
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

// --- CREATE User ---
const createUser = async (payload: CreateUserPayload): Promise<any> => {
  return invokeSuperadminAction('create_user', payload);
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, CreateUserPayload>({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidar queries relevantes, por ejemplo, la lista de usuarios
      queryClient.invalidateQueries({ queryKey: ['platformLevelAssignments'] });
    },
  });
};
