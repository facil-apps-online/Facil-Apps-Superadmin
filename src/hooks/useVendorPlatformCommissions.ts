import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface VendorPlatformCommission {
  id: string;
  user_id: string;
  platform_id: string;
  platform_name: string;
  first_payment_commission_rate: number;
  recurring_payment_commission_rate: number;
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

// GET
const fetchVendorPlatformCommissions = async (userId: string): Promise<VendorPlatformCommission[]> => {
    return invokeSuperadminAction('get_vendor_platform_commissions', { userId });
};

export const useVendorPlatformCommissions = (userId: string) => {
    return useQuery<VendorPlatformCommission[], Error>({
        queryKey: ['vendorPlatformCommissions', userId],
        queryFn: () => fetchVendorPlatformCommissions(userId),
        enabled: !!userId,
    });
};

// UPDATE
interface UpdatePayload {
    commissionId: string;
    updates: {
        first_payment_commission_rate?: number;
        recurring_payment_commission_rate?: number;
    }
}

const updateVendorPlatformCommission = async (payload: UpdatePayload) => {
    return invokeSuperadminAction('update_vendor_platform_commission', payload);
};

export const useUpdateVendorPlatformCommission = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, UpdatePayload>({
        mutationFn: updateVendorPlatformCommission,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['vendorPlatformCommissions'] });
        },
    });
};

// DELETE
const removeVendorPlatformCommission = async (commissionId: string) => {
    return invokeSuperadminAction('remove_vendor_platform_commission', { commissionId });
};

export const useRemoveVendorPlatformCommission = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, string>({
        mutationFn: removeVendorPlatformCommission,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendorPlatformCommissions'] });
        },
    });
};

// ADD
interface AssignPayload {
    userId: string;
    commissions: {
        platformId: string;
        first_payment_commission_rate: number;
        recurring_payment_commission_rate: number;
    }[];
}

const assignVendorPlatformCommissions = async (payload: AssignPayload) => {
    return invokeSuperadminAction('assign_vendor_platform_commissions', payload);
};

export const useAssignVendorPlatformCommissions = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, AssignPayload>({
        mutationFn: assignVendorPlatformCommissions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendorPlatformCommissions'] });
            queryClient.invalidateQueries({ queryKey: ['platformLevelAssignments'] });
        },
    });
};
