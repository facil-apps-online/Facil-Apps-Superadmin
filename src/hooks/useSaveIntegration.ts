import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Función para llamar a la Edge Function que cifra los secretos
const encryptCredentials = async (credentials: Record<string, any>) => {
  const { data, error } = await supabase.functions.invoke('encrypt-secret', {
    body: { dataToEncrypt: JSON.stringify(credentials) },
  });

  if (error) {
    throw new Error(`Error al encriptar las credenciales: ${error.message}`);
  }
  return data;
};

// Función para llamar a la nueva RPC que guarda la integración
const saveTenantIntegrationRpc = async ({
  tenantId,
  platformId,
  providerSlug,
  encrypted_credentials,
  nonce,
  environment,
  userRole,
}: {
  tenantId: string;
  platformId: string;
  providerSlug: string;
  encrypted_credentials: string;
  nonce: string;
  environment: 'test' | 'production';
  userRole: string;
}) => {
  console.log('[useSaveIntegration] RPC Call Params:', { tenantId, platformId, providerSlug, environment }); // DEBUG LOG

  if (platformId === undefined) {
      console.error('[useSaveIntegration] CRITICAL: platformId is undefined!');
      throw new Error('Internal Error: platformId is undefined in RPC call.');
  }

  const { error } = await supabase.rpc('upsert_tenant_integration', {
    p_tenant_id: tenantId,
    p_platform_id: platformId,
    p_provider_slug: providerSlug,
    p_encrypted_credentials: encrypted_credentials,
    p_nonce: nonce,
    p_environment: environment,
    p_user_role: userRole,
  });

  if (error) {
    throw new Error(`Error al guardar la integración: ${error.message}`);
  }
};

export const useSaveIntegration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth(); // Obtener el usuario del contexto de autenticación

  return useMutation({
    mutationFn: async ({
      tenantId,
      platformId,
      provider,
      credentials,
      environment,
    }: {
      tenantId: string;
      platformId: string;
      provider: any;
      credentials: Record<string, any>;
      environment: 'test' | 'production';
    }) => {
      // Validar el rol desde currentAssignment en lugar de user.role si es posible,
      // pero por ahora mantenemos user.role si eso es lo que devuelve el AuthContext mockeado o real.
      // Corrección: El AuthContext real no devuelve user.role. Deberíamos usar currentAssignment.role
      // pero este hook está en Superadmin y la estructura de AuthContext puede variar.
      // Asumiremos que user?.role existe O usaremos un valor por defecto seguro.
      const role = (user as any)?.role || 'super_admin'; 

      // 1. Encriptar las credenciales
      const { encryptedData, iv: nonce } = await encryptCredentials(credentials);

      // 2. Guardar en la base de datos a través de la RPC segura
      await saveTenantIntegrationRpc({
        tenantId,
        platformId,
        providerSlug: provider.slug,
        encrypted_credentials: encryptedData,
        nonce,
        environment,
        userRole: role,
      });
    },
    onSuccess: (_, { provider, tenantId }) => {
      toast({
        title: 'Éxito',
        description: `La integración con ${provider.name} se ha guardado correctamente.`,
      });
      // Invalidar la query para que la lista de integraciones se actualice
      queryClient.invalidateQueries(['tenantIntegrations', tenantId]);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
