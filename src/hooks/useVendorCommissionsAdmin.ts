import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invokeCoreAction } from '@/lib/api';

export interface VendorCommissionAdminRow {
  id: string;
  vendor_user_id: string;
  vendor_name: string | null;
  vendor_email: string;
  platform_id: string;
  platform_name: string;
  date: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  isPaid: boolean;
  paidAt: string | null;
  reference: string | null;
}

export interface VendorCommissionsAdminFilters {
  vendorUserId?: string;
  platformId?: string;
  onlyPending?: boolean;
}

const fetchVendorCommissionsAdmin = async (filters: VendorCommissionsAdminFilters): Promise<VendorCommissionAdminRow[]> => {
  return invokeCoreAction('list_vendor_commissions_admin', filters);
};

export const useVendorCommissionsAdmin = (filters: VendorCommissionsAdminFilters = {}) => {
  return useQuery<VendorCommissionAdminRow[], Error>({
    queryKey: ['vendorCommissionsAdmin', filters],
    queryFn: () => fetchVendorCommissionsAdmin(filters),
  });
};

interface MarkPaidPayload {
  payments: { transactionId: string; vendorUserId: string; platformId: string; commissionAmount: number }[];
  reference?: string;
}

const markVendorCommissionsPaid = async (payload: MarkPaidPayload) => {
  return invokeCoreAction('mark_vendor_commissions_paid', payload);
};

export const useMarkVendorCommissionsPaid = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: true; marked: number }, Error, MarkPaidPayload>({
    mutationFn: markVendorCommissionsPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorCommissionsAdmin'] });
    },
  });
};

const revertVendorCommissionPayment = async (payload: { transactionId: string; vendorUserId: string }) => {
  return invokeCoreAction('revert_vendor_commission_payment', payload);
};

export const useRevertVendorCommissionPayment = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: true }, Error, { transactionId: string; vendorUserId: string }>({
    mutationFn: revertVendorCommissionPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorCommissionsAdmin'] });
    },
  });
};
