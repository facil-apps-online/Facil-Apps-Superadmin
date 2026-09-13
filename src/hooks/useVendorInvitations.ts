import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invokeCoreAction } from '@/lib/api';

export type InvitationStatus =
  | 'nuevo'
  | 'en_contacto'
  | 'interesado'
  | 'onboarding_enviado'
  | 'cuenta_creada'
  | 'activo'
  | 'activo_con_plan'
  | 'perdido'
  | 'duplicado';

export const INVITATION_STATUSES: { id: InvitationStatus; label: string }[] = [
  { id: 'nuevo', label: 'Nuevo' },
  { id: 'en_contacto', label: 'En contacto' },
  { id: 'interesado', label: 'Interesado' },
  { id: 'onboarding_enviado', label: 'Onboarding enviado' },
  { id: 'cuenta_creada', label: 'Cuenta creada' },
  { id: 'activo', label: 'Activo' },
  { id: 'activo_con_plan', label: 'Activo con plan' },
  { id: 'perdido', label: 'Perdido' },
  { id: 'duplicado', label: 'Duplicado' },
];

export interface VendorInvitation {
  id: string;
  vendor_user_id: string;
  platform_id: string;
  platform_name: string;
  prospect_first_name: string;
  prospect_last_name: string | null;
  prospect_email: string | null;
  prospect_phone: string | null;
  company_name: string | null;
  tax_id: string | null;
  invite_token: string;
  invite_url: string;
  status: InvitationStatus;
  trial_days_override: number | null;
  tenant_id: string | null;
  notes: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

interface ListFilters {
  vendorUserId?: string;
  platformId?: string;
  status?: InvitationStatus;
  q?: string;
}

const fetchVendorInvitations = async (filters: ListFilters): Promise<VendorInvitation[]> => {
  const data = await invokeCoreAction('list_vendor_invitations', filters);
  return data || [];
};

export const useVendorInvitations = (filters: ListFilters = {}) => {
  return useQuery<VendorInvitation[], Error>({
    queryKey: ['vendorInvitations', filters],
    queryFn: () => fetchVendorInvitations(filters),
  });
};

const fetchVendorInvitationFunnel = async (filters: Pick<ListFilters, 'vendorUserId' | 'platformId'>): Promise<Record<string, number>> => {
  return invokeCoreAction('get_vendor_invitation_funnel', filters);
};

export const useVendorInvitationFunnel = (filters: Pick<ListFilters, 'vendorUserId' | 'platformId'> = {}) => {
  return useQuery<Record<string, number>, Error>({
    queryKey: ['vendorInvitationFunnel', filters],
    queryFn: () => fetchVendorInvitationFunnel(filters),
  });
};

export interface PlatformTrialPlan {
  planId: string | null;
  durationDays: number | null;
}

const fetchPlatformTrialPlan = async (platformId: string): Promise<PlatformTrialPlan> => {
  return invokeCoreAction('get_platform_trial_plan', { platformId });
};

/** Días máximos de trial que un vendedor puede otorgar: el duration_days del plan
 * is_default_trial de la plataforma. El vendedor solo puede pedir menos, nunca más. */
export const usePlatformTrialPlan = (platformId?: string) => {
  return useQuery<PlatformTrialPlan, Error>({
    queryKey: ['platformTrialPlan', platformId],
    queryFn: () => fetchPlatformTrialPlan(platformId!),
    enabled: !!platformId,
  });
};

export interface CreateInvitationPayload {
  platformId: string;
  vendorUserId?: string;
  prospect: {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    companyName?: string;
    taxId?: string;
  };
  trialDaysOverride?: number;
  notes?: string;
}

const createVendorInvitation = async (payload: CreateInvitationPayload): Promise<VendorInvitation> => {
  return invokeCoreAction('create_vendor_invitation', payload);
};

export const useCreateVendorInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation<VendorInvitation, Error, CreateInvitationPayload>({
    mutationFn: createVendorInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['vendorInvitationFunnel'] });
    },
  });
};

interface UpdateStatusPayload {
  invitationId: string;
  status: InvitationStatus;
  notes?: string;
}

const updateVendorInvitationStatus = async (payload: UpdateStatusPayload): Promise<VendorInvitation> => {
  return invokeCoreAction('update_vendor_invitation_status', payload);
};

export const useUpdateVendorInvitationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<VendorInvitation, Error, UpdateStatusPayload>({
    mutationFn: updateVendorInvitationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['vendorInvitationFunnel'] });
    },
  });
};

const deleteVendorInvitation = async (invitationId: string): Promise<{ success: true }> => {
  return invokeCoreAction('delete_vendor_invitation', { invitationId });
};

export const useDeleteVendorInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: true }, Error, string>({
    mutationFn: deleteVendorInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['vendorInvitationFunnel'] });
    },
  });
};
