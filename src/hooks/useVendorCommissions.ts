import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export interface Commission {
  id: string;
  date: string;
  productName: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
}

const fetchVendorCommissions = async (userId: string): Promise<Commission[]> => {
  const { data, error } = await supabase.rpc('get_vendor_commissions', {
    p_user_id: userId,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useVendorCommissions = () => {
  const { user } = useAuth();
  return useQuery<Commission[], Error>({
    queryKey: ['vendorCommissions', user?.id],
    queryFn: () => fetchVendorCommissions(user!.id),
    enabled: !!user,
  });
};
