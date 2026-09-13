import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invokeCoreAction } from '@/lib/api';

export interface InviteTeamMemberPlatform {
  platformId: string;
  firstPaymentCommissionRate: number;
  recurringPaymentCommissionRate: number;
}

export interface InviteTeamMemberPayload {
  email: string;
  fullName: string;
  platforms: InviteTeamMemberPlatform[];
}

const inviteTeamMember = async (payload: InviteTeamMemberPayload): Promise<{ success: true; userId: string }> => {
  return invokeCoreAction('invite_superadmin_team_member', payload);
};

export const useInviteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: true; userId: string }, Error, InviteTeamMemberPayload>({
    mutationFn: inviteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformLevelAssignments'] });
    },
  });
};

const resendTeamInvitation = async (userId: string): Promise<{ success: true }> => {
  return invokeCoreAction('resend_superadmin_team_invitation', { userId });
};

export const useResendTeamInvitation = () => {
  return useMutation<{ success: true }, Error, string>({
    mutationFn: resendTeamInvitation,
  });
};
