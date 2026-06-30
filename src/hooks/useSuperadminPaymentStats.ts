import { useQuery } from '@tanstack/react-query';
import { invokeCoreAction } from '@/lib/api';

export interface Payout {
    platform_id: string;
    platform_name: string;
    investor_id: string;
    investor_email: string;
    total_payout: number;
}

export interface Commission {
    platform_id: string;
    platform_name: string;
    vendor_id: string;
    vendor_email: string;
    total_commission: number;
}

export interface SuperadminPaymentStats {
  investor_payouts: Payout[];
  vendor_commissions: Commission[];
}

const fetchSuperadminPaymentStats = async (): Promise<SuperadminPaymentStats> => {
  const data = await invokeCoreAction('get_superadmin_payment_stats');
  return data || { investor_payouts: [], vendor_commissions: [] };
};

export const useSuperadminPaymentStats = () => {
  return useQuery<SuperadminPaymentStats, Error>({
    queryKey: ['superadminPaymentStats'],
    queryFn: fetchSuperadminPaymentStats,
  });
};