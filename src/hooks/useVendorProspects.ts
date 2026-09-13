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

/** Datos de negocio compartidos con vendor_invitations (mismo set que pide "Crear Tenant",
 * menos las credenciales del admin) — capturados desde el primer contacto. */
export interface ProspectBusinessDetails {
  legalName?: string;
  whatsappPhone?: string;
  billingAddress?: string;
  einvoicingEmail?: string;
  physicalAddressLine1?: string;
  physicalAddressLine2?: string;
  physicalCity?: string;
  physicalState?: string;
  physicalPostalCode?: string;
  website?: string;
}

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
  tax_id: string | null;
  legal_name: string | null;
  whatsapp_phone: string | null;
  billing_address: string | null;
  einvoicing_email: string | null;
  physical_address_line1: string | null;
  physical_address_line2: string | null;
  physical_city: string | null;
  physical_state: string | null;
  physical_postal_code: string | null;
  website: string | null;
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

export interface ProspectFormFields extends ProspectBusinessDetails {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  taxId?: string;
}

export interface CreateProspectPayload {
  platformId: string;
  vendorUserId?: string;
  prospect: ProspectFormFields;
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

interface UpdateProspectPayload {
  prospectId: string;
  prospect: Partial<ProspectFormFields>;
}

const updateVendorProspect = async (payload: UpdateProspectPayload): Promise<VendorProspect> => {
  return invokeCoreAction('update_vendor_prospect', payload);
};

export const useUpdateVendorProspect = () => {
  const queryClient = useQueryClient();
  return useMutation<VendorProspect, Error, UpdateProspectPayload>({
    mutationFn: updateVendorProspect,
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

export interface VendorConversionStats {
  vendorUserId: string;
  prospectsTotal: number;
  prospectsConverted: number;
  invitationsTotal: number;
  invitationsAccountCreated: number;
  invitationsActive: number;
  invitationsPaying: number;
  invitationsLostOrDuplicate: number;
}

interface ConversionReportFilters {
  vendorUserId?: string;
  platformId?: string;
}

const fetchVendorConversionReport = async (filters: ConversionReportFilters): Promise<VendorConversionStats[]> => {
  const data = await invokeCoreAction('get_vendor_conversion_report', filters);
  return data || [];
};

export const useVendorConversionReport = (filters: ConversionReportFilters = {}) => {
  return useQuery<VendorConversionStats[], Error>({
    queryKey: ['vendorConversionReport', filters],
    queryFn: () => fetchVendorConversionReport(filters),
  });
};
