import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invokeCoreAction } from '@/lib/api';

export interface TenantVendorAssignment {
  userId: string;
  email: string;
  fullName: string;
}

const fetchTenantVendorAssignment = async (tenantId: string): Promise<TenantVendorAssignment | null> => {
  return invokeCoreAction('get_tenant_vendor_assignment', { tenantId });
};

export const useTenantVendorAssignment = (tenantId?: string) => {
  return useQuery<TenantVendorAssignment | null, Error>({
    queryKey: ['tenantVendorAssignment', tenantId],
    queryFn: () => fetchTenantVendorAssignment(tenantId!),
    enabled: !!tenantId,
  });
};

interface AssignPayload {
  userId: string;
  tenantId: string;
}

const assignVendorToTenant = async (payload: AssignPayload): Promise<{ success: true }> => {
  return invokeCoreAction('assign_vendor_role', payload);
};

export const useAssignVendorToTenant = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: true }, Error, AssignPayload>({
    mutationFn: assignVendorToTenant,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenantVendorAssignment', variables.tenantId] });
    },
  });
};

const removeVendorFromTenant = async (payload: AssignPayload): Promise<{ success: true }> => {
  return invokeCoreAction('remove_vendor_tenant_assignment', payload);
};

export const useRemoveVendorFromTenant = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: true }, Error, AssignPayload>({
    mutationFn: removeVendorFromTenant,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenantVendorAssignment', variables.tenantId] });
    },
  });
};
