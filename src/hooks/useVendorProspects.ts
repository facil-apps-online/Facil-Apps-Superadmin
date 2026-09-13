import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invokeCoreAction } from '@/lib/api';
import { VendorInvitation } from './useVendorInvitations';

export type ProspectStatus =
  | 'nuevo'
  | 'en_contacto'
  | 'interesado'
  | 'no_interesado'
  | 'reagendar'
  | 'convertido';

export const PROSPECT_STATUSES: { id: ProspectStatus; label: string }[] = [
  { id: 'nuevo', label: 'Nuevo' },
  { id: 'en_contacto', label: 'En contacto' },
  { id: 'interesado', label: 'Interesado' },
  { id: 'no_interesado', label: 'No interesado' },
  { id: 'reagendar', label: 'Reagendar' },
  { id: 'convertido', label: 'Convertido' },
];

export interface VendorProspect {
  id: string;
  vendor_user_id: string;
  platform_id: string;
  platform_name: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  company_name: string | null;
  status: ProspectStatus;
  last_visit_at: string | null;
  invitation_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorProspectVisit {
  id: string;
  prospect_id: string;
  vendor_user_id: string;
  visit_date: string;
  status: ProspectStatus;
  notes: string | null;
  created_at: string;
}

interface ListFilters {
  vendorUserId?: string;
  platformId?: string;
  status?: ProspectStatus;
  q?: string;
}

const fetchVendorProspects = async (filters: ListFilters): Promise<VendorProspect[]> => {
  const data = await invokeCoreAction('list_vendor_prospects', filters);
  return data || [];
};

export const useVendorProspects = (filters: ListFilters = {}) => {
  return useQuery<VendorProspect[], Error>({
    queryKey: ['vendorProspects', filters],
    queryFn: () => fetchVendorProspects(filters),
  });
};

export interface CreateProspectPayload {
  platformId: string;
  vendorUserId?: string;
  prospect: {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    companyName?: string;
  };
}

const createVendorProspect = async (payload: CreateProspectPayload): Promise<VendorProspect> => {
  return invokeCoreAction('create_vendor_prospect', payload);
};

export const useCreateVendorProspect = () => {
  const queryClient = useQueryClient();
  return useMutation<VendorProspect, Error, CreateProspectPayload>({
    mutationFn: createVendorProspect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorProspects'] });
    },
  });
};

const deleteVendorProspect = async (prospectId: string): Promise<{ success: true }> => {
  return invokeCoreAction('delete_vendor_prospect', { prospectId });
};

export const useDeleteVendorProspect = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: true }, Error, string>({
    mutationFn: deleteVendorProspect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorProspects'] });
    },
  });
};

const fetchVendorProspectVisits = async (prospectId: string): Promise<VendorProspectVisit[]> => {
  const data = await invokeCoreAction('list_vendor_prospect_visits', { prospectId });
  return data || [];
};

export const useVendorProspectVisits = (prospectId?: string) => {
  return useQuery<VendorProspectVisit[], Error>({
    queryKey: ['vendorProspectVisits', prospectId],
    queryFn: () => fetchVendorProspectVisits(prospectId!),
    enabled: !!prospectId,
  });
};

interface LogVisitPayload {
  prospectId: string;
  status: ProspectStatus;
  notes?: string;
  visitDate?: string;
}

const logVendorProspectVisit = async (payload: LogVisitPayload): Promise<VendorProspectVisit> => {
  return invokeCoreAction('log_vendor_prospect_visit', payload);
};

export const useLogVendorProspectVisit = () => {
  const queryClient = useQueryClient();
  return useMutation<VendorProspectVisit, Error, LogVisitPayload>({
    mutationFn: logVendorProspectVisit,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendorProspects'] });
      queryClient.invalidateQueries({ queryKey: ['vendorProspectVisits', variables.prospectId] });
    },
  });
};

interface ConvertPayload {
  prospectId: string;
  trialDaysOverride?: number;
}

const convertVendorProspectToInvitation = async (payload: ConvertPayload): Promise<VendorInvitation> => {
  return invokeCoreAction('convert_vendor_prospect_to_invitation', payload);
};

export const useConvertVendorProspectToInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation<VendorInvitation, Error, ConvertPayload>({
    mutationFn: convertVendorProspectToInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorProspects'] });
      queryClient.invalidateQueries({ queryKey: ['vendorInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['vendorInvitationFunnel'] });
    },
  });
};
