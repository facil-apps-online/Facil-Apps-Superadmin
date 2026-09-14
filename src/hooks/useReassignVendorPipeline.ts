import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invokeCoreAction } from '@/lib/api';

interface ReassignVendorPipelinePayload {
  fromVendorUserId: string;
  toVendorUserId: string;
  platformId?: string;
}

const reassignVendorPipeline = async (payload: ReassignVendorPipelinePayload) => {
  return invokeCoreAction('reassign_vendor_pipeline', payload);
};

export const useReassignVendorPipeline = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: true; prospectsMoved: number; invitationsMoved: number }, Error, ReassignVendorPipelinePayload>({
    mutationFn: reassignVendorPipeline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorProspects'] });
      queryClient.invalidateQueries({ queryKey: ['vendorInvitations'] });
    },
  });
};
