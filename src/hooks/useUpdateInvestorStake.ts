import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface UpdateInvestorStakePayload {
  userId: string;
  platformId: string;
  stake: number;
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

const updateInvestorStake = async (payload: UpdateInvestorStakePayload): Promise<any> => {
  return invokeSuperadminAction('update_investor_stake', payload);
};

export const useUpdateInvestorStake = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, UpdateInvestorStakePayload>({
    mutationFn: updateInvestorStake,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformLevelAssignments'] });
    },
  });
};
