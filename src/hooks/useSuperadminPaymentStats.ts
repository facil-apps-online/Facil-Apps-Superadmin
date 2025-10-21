import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface InvestorPayout {
  platform_id: string;
  platform_name: string;
  investor_id: string;
  investor_email: string;
  total_payout: number;
}

export interface VendorCommission {
  platform_id: string;
  platform_name: string;
  vendor_id: string;
  vendor_email: string;
  total_commission: number;
}

export interface SuperadminPaymentStats {
  investor_payouts: InvestorPayout[];
  vendor_commissions: VendorCommission[];
}

const fetchSuperadminPaymentStats = async (): Promise<SuperadminPaymentStats> => {
  const { data, error } = await supabase.rpc('get_superadmin_payment_stats');

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useSuperadminPaymentStats = () => {
  return useQuery<SuperadminPaymentStats, Error>({
    queryKey: ['superadminPaymentStats'],
    queryFn: fetchSuperadminPaymentStats,
  });
};
