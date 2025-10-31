import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { UserAssignment } from '@/contexts/AuthContext';

export interface InvestorDashboardData {
  currentMonthSales: number;
  previousMonthSales: number;
  currentMonthCommission: number;
  previousMonthCommission: number;
  platforms: {
    id: string;
    name: string;
    stake_percentage: number;
  }[];
}

const fetchInvestorDashboardData = async (assignments: UserAssignment[]): Promise<InvestorDashboardData> => {
  const platformData = assignments.map(a => ({
    platform_id: a.platform_id,
    stake_percentage: a.stake_percentage
  }));

  const { data, error } = await supabase.functions.invoke('superadmin-actions', {
    body: { action: 'get_investor_dashboard_data', payload: { platformData } },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useInvestorDashboardData = (assignments: UserAssignment[]) => {
  return useQuery<InvestorDashboardData, Error>({
    queryKey: ['investorDashboardData', assignments.map(a => a.platform_id).join('-')],
    queryFn: () => fetchInvestorDashboardData(assignments),
    enabled: assignments && assignments.length > 0 && assignments.every(a => a.platform_id && a.stake_percentage !== undefined),
  });
};
