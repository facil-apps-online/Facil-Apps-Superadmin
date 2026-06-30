import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { invokeCoreAction } from '@/lib/api'; // Import the new centralized helper

// --- Interfaces ---
// Esta interfaz define la estructura de datos que el componente espera.
export interface PlatformAssignment {
  user_id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  platform_roles: {
    app_super_admin?: { platform_id: string; platform_name: string; }[];
    investor?: { platform_id: string; platform_name: string; stake_percentage: number; }[];
    vendor?: { 
        id: string;
        platform_id: string; 
        platform_name: string;
        first_payment_commission_rate: number;
        recurring_payment_commission_rate: number;
    }[];
  };
}

interface AssignRolePayload {
  userId: string;
  role: 'investor' | 'app_super_admin';
  assignments: any[]; // El payload puede variar dependiendo del rol
}

interface RemoveAssignmentPayload {
  userId: string;
  role: 'investor' | 'app_super_admin';
  platformId: string;
}

// --- GET Assignments ---
const fetchPlatformLevelAssignments = async (): Promise<PlatformAssignment[]> => {
  return invokeCoreAction('get_platform_level_assignments');
};

export const usePlatformLevelAssignments = () => {
  return useQuery<PlatformAssignment[], Error>({
    queryKey: ['platformLevelAssignments'],
    queryFn: fetchPlatformLevelAssignments,
  });
};

// --- ASSIGN Role ---
const assignPlatformRole = async (payload: AssignRolePayload): Promise<any> => {
  return invokeCoreAction('assign_platform_role', payload);
};

export const useAssignPlatformRole = () => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();
  return useMutation<any, Error, AssignRolePayload>({
    mutationFn: assignPlatformRole,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['platformLevelAssignments'] });
      await refreshUser();
    },
  });
};

// --- REMOVE Assignment ---
const removePlatformAssignment = async (payload: RemoveAssignmentPayload): Promise<any> => {
  return invokeCoreAction('remove_platform_assignment', payload);
};

export const useRemovePlatformAssignment = () => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();
  return useMutation<any, Error, RemoveAssignmentPayload>({
    mutationFn: removePlatformAssignment,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['platformLevelAssignments'] });
      await refreshUser();
    },
  });
};