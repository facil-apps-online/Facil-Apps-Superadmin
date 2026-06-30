import { useGlobalIntegrations } from '@/hooks/useGlobalIntegrations';
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Power, PowerOff, Mail, FolderKanban, Send, Globe, Settings, AlertTriangle, MessageSquare } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useTenantIntegrations, useDeleteIntegration } from '@/hooks/useTenantIntegrations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import IntegrationConfigDialog from '@/components/IntegrationConfigDialog';
import { Badge } from '@/components/ui/badge';
import { TenantIntegration } from '@/hooks/useTenantIntegrations';


// (El resto de los componentes auxiliares como useGoogleAuthUrl, IntegrationCard, etc., se mantienen igual)
type Provider = 'google_drive' | 'google_gmail' | string;

interface RpcResponseData {

  success: boolean;

  message?: string;

  url?: string;

}



const useGoogleAuthUrl = (tenantId: string, rpcName: 'get_google_auth_url' | 'get_gmail_auth_url') => {

  return useQuery<{ url: string, success: boolean } | null, Error>({

    queryKey: [rpcName, tenantId],

    queryFn: async () => {

      if (!tenantId) return null;

      const { data, error } = await supabase.rpc(rpcName, { p_tenant_id: tenantId });

      if (error) throw new Error(error.message);

      return data;

    },

    enabled: false,

    retry: false,

  });

};



const IntegrationCard = ({ title, icon, isConnected, accountEmail, onConnect, onDisconnect, isConnecting, isDisconnecting, onTest, isTesting }) => {

  return (

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4">

      <div className="flex items-center gap-4">

        {icon}

        <span className="font-semibold">{title}</span>

      </div>

      

      {isConnected ? (

        <div className="flex flex-col items-start sm:items-end gap-3">

          <div className="flex items-start gap-2 text-sm">

            <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />

            <div className="flex flex-col">

              <span className="text-muted-foreground">Conectado como:</span>

              <span className="font-bold text-foreground break-all">{accountEmail}</span>

            </div>

          </div>

          <div className="flex items-center gap-2">

            {onTest && (

              <Button onClick={onTest} variant="secondary" size="sm" disabled={isTesting}>

                <Send className="mr-2 h-4 w-4" />

                {isTesting ? 'Encolando...' : 'Enviar Prueba'}

              </Button>

            )}

            <Button onClick={onDisconnect} variant="destructive" size="sm" disabled={isDisconnecting}>

              <PowerOff className="mr-2 h-4 w-4" />

              {isDisconnecting ? 'Desconectando...' : 'Desconectar'}

            </Button>

          </div>

        </div>

      ) : (

        <Button onClick={onConnect} disabled={isConnecting}>

          <Power className="mr-2 h-4 w-4" />

          {isConnecting ? 'Conectar...' : `Conectar con ${title}`}

        </Button>

      )}

    </div>

  );

};



const formatProviderName = (provider: Provider | null): string => {

  if (!provider) return '';

  if (provider === 'google_drive') return 'Google Drive';

  if (provider === 'google_gmail') return 'Gmail';

  return provider.charAt(0).toUpperCase() + provider.slice(1);

};


const whatsappProvider = {
    id: 'whatsapp-provider-manual', // A dummy ID
    name: 'WhatsApp Business',
    slug: 'meta_whatsapp',
    logo_url: '', // I will use a Lucide icon instead
    config_schema: [
      { id: 'wa1', name: 'app_secret', label: 'Meta App Secret', type: 'password', required: true, helpText: 'El App Secret de tu aplicación de Meta.' },
      { id: 'wa2', name: 'verify_token', label: 'Verify Token', type: 'text', required: true, helpText: 'El token de verificación para el webhook.' },
      { id: 'wa3', name: 'access_token', label: 'Access Token', type: 'password', required: true, helpText: 'El token de acceso de la API de WhatsApp Business.' },
      { id: 'wa4', name: 'phone_number_id', label: 'Phone Number ID', type: 'text', required: true, helpText: 'El ID del número de teléfono de WhatsApp.' },
    ],
    // other properties to make it compatible with IntegrationConfigDialog
    country_id: '',
    category_id: '',
    status: 'active',
    endpoints: { test: '', production: '' },
    apiSchema: [],
  };


// Hook para la nueva mutación que activa una integración
const useSetActiveIntegration = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<null, Error, { integrationId: string; tenantId: string }> ({
    mutationFn: async ({ integrationId }) => {
      const { error } = await supabase.rpc('set_active_integration', {
        p_integration_id: integrationId,
      });

      if (error) throw error;
      return null;
    },
    onSuccess: (_, variables) => {
      toast({ title: "Éxito", description: "La integración activa ha sido actualizada." });
      queryClient.invalidateQueries({ queryKey: ['tenantIntegrations', variables.tenantId] });
    },
    onError: (error) => {
      toast({ title: "Error", description: `No se pudo cambiar la integración activa: ${error.message}`, variant: "destructive" });
    },
  });
};

const useGetGoogleAuthUrl = () => {
  const { toast } = useToast();

  return useMutation<
    { authUrl: string }, // Success response
    Error, // Error type
    { tenantId: string; provider: 'google_drive' | 'google_gmail'; finalRedirectUrl: string } // Variables
  >({
    mutationFn: async ({ tenantId, provider, finalRedirectUrl }) => {
      const { data, error } = await supabase.functions.invoke('core-actions', {
        body: {
          action: 'get-google-auth-url',
          payload: { tenantId, provider, finalRedirectUrl },
        },
      });

      if (error) throw new Error(error.message);
      if (!data.authUrl) throw new Error('Could not retrieve the authorization URL.');
      
      return data;
    },
    onError: (error) => {
      toast({
        title: 'Error de Conexión',
        description: `No se pudo obtener la URL de autorización de Google: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
};


export const TenantIntegrationManager = ({ tenantId, platformId }: { tenantId: string; platformId: string }) => {
  console.log('TenantIntegrationManager rendered. Props:', { tenantId, platformId }); // DEBUG
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: integrations, isLoading, isError, error } = useTenantIntegrations(tenantId);
  const { data: globalIntegrationsData, isLoading: isLoadingProviders } = useGlobalIntegrations();
  const availableProviders = globalIntegrationsData?.providers;
  const disconnectMutation = useDeleteIntegration();
  const setActiveMutation = useSetActiveIntegration();
  const getAuthUrlMutation = useGetGoogleAuthUrl();


  const [disconnectAlert, setDisconnectAlert] = useState<{ isOpen: boolean; provider: Provider | null; accountEmail: string | null; integrationId?: string }>({ isOpen: false, provider: null, accountEmail: null });
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [configProvider, setConfigProvider] = useState<any | null>(null);

  // Agrupar integraciones por proveedor
  const groupedIntegrations = integrations?.reduce((acc, int) => {
    if (int.provider.startsWith('google_')) return acc; // Excluir Google de la agrupación genérica
    if (!acc[int.provider]) {
      acc[int.provider] = [];
    }
    acc[int.provider].push(int);
    return acc;
  }, {} as Record<string, TenantIntegration[]>);

  const googleDriveIntegration = integrations?.find(int => int.provider === 'google_drive');
  const gmailIntegration = integrations?.find(int => int.provider === 'google_gmail');
  const whatsappIntegration = integrations?.find(int => int.provider === 'meta_whatsapp');


  const unconfiguredProviders = availableProviders?.filter(
    provider => {
      if (!provider.slug || provider.status !== 'active' || provider.slug.startsWith('google_')) return false;
      return !groupedIntegrations || !groupedIntegrations[provider.slug];
    }
  );

  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      // Security: Check the origin of the message
      if (event.origin !== window.location.origin) {
        console.warn(`Message from unexpected origin: ${event.origin}`);
        return;
      }

      const { type, provider, error } = event.data;
      const providerName = formatProviderName(provider);

      if (type === 'auth-success') {
          toast({ title: 'Éxito', description: `La integración con ${providerName} se ha completado.` });
          // The query is already invalidated by the callback page, but another invalidation here doesn't hurt
          // and ensures data is fresh if the user focuses the window.
          queryClient.invalidateQueries({ queryKey: ['tenantIntegrations', tenantId] });
      } else if (type === 'auth-error') {
          toast({ title: 'Error de Autenticación', description: `No se pudo completar la integración con ${providerName}: ${error || 'Error desconocido.'}`, variant: 'destructive' });
      }
    };

    window.addEventListener('message', handleAuthMessage);

    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, [queryClient, tenantId, toast]);


  const handleConnect = (provider: 'google_drive' | 'google_gmail') => {
    getAuthUrlMutation.mutate(
      { tenantId, provider, finalRedirectUrl: `${window.location.origin}/auth/callback` },
      {
        onSuccess: (data) => {
          const { authUrl } = data;
          const width = 600, height = 700, left = window.screen.width / 2 - width / 2, top = window.screen.height / 2 - height / 2;
          window.open(authUrl, 'googleAuth', `width=${width},height=${height},top=${top},left=${left}`);
        },
      }
    );
  };

  const handleDisconnectRequest = (integrationId: string, provider: Provider) => {
    setDisconnectAlert({ isOpen: true, provider, accountEmail: 'esta integración', integrationId });
  };
  const confirmDisconnect = () => {
    if (!disconnectAlert.integrationId) return;
    disconnectMutation.mutate(
      { tenantId, integrationId: disconnectAlert.integrationId! },
      {
        onSuccess: () => {
          toast({ title: 'Éxito', description: `La integración ha sido desconectada.` });
          queryClient.invalidateQueries({ queryKey: ['tenantIntegrations', tenantId] });
        },
        onError: (e: Error) => {
          toast({ title: 'Error', description: e.message, variant: 'destructive' });
        },
        onSettled: () => {
          setDisconnectAlert({ isOpen: false, provider: null, accountEmail: null });
        },
      }
    );
  };

interface EnqueueTestEmailResponse {
  success: boolean;
  message?: string;
  job?: Record<string, unknown>;
}

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    try {
      const { data: jobData, error: rpcError } = await supabase.rpc('enqueue_test_email') as { data: EnqueueTestEmailResponse, error: Error };

      if (rpcError) throw rpcError;
      if (!jobData.success) throw new Error(jobData.message);

      toast({
        title: "Correo Encolado",
        description: "El trabajo ha sido creado. Invocando al trabajador...",
      });

      const { error: functionError } = await supabase.functions.invoke('process-email-queue', {
        body: { record: jobData.job },
      });

      if (functionError) throw functionError;

      toast({
        title: "Trabajador Invocado",
        description: "El proceso de envío ha comenzado en segundo plano.",
      });

    } catch (error: Error) {
      console.error("Error en el proceso de envío de prueba:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo completar el proceso de envío.",
        variant: "destructive",
      });
    } finally {
      setIsSendingTest(false);
    }
  };


  if (isLoading) return <div className="p-4">Cargando integraciones...</div>;
  if (isError) return <div className="p-4 text-red-500">Error al cargar integraciones: {error?.message}</div>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Integraciones Globales</CardTitle>
          <CardDescription>Conecta los servicios de Google y WhatsApp para ampliar la funcionalidad de la plataforma.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <IntegrationCard
            title="Google Drive"
            icon={<FolderKanban className="h-8 w-8 text-blue-500" />}
            isConnected={!!googleDriveIntegration}
            accountEmail={googleDriveIntegration?.account_email}
            onConnect={() => handleConnect('google_drive')}
            onDisconnect={() => handleDisconnectRequest(googleDriveIntegration!.id, 'google_drive')}
            isConnecting={getAuthUrlMutation.isPending && getAuthUrlMutation.variables?.provider === 'google_drive'}
            isDisconnecting={disconnectMutation.isPending && disconnectMutation.variables?.integrationId === googleDriveIntegration?.id}
          />
          <IntegrationCard
            title="Gmail"
            icon={<Mail className="h-8 w-8 text-red-500" />}
            isConnected={!!gmailIntegration}
            accountEmail={gmailIntegration?.account_email}
            onConnect={() => handleConnect('google_gmail')}
            onDisconnect={() => handleDisconnectRequest(gmailIntegration!.id, 'google_gmail')}
            isConnecting={getAuthUrlMutation.isPending && getAuthUrlMutation.variables?.provider === 'google_gmail'}
            isDisconnecting={disconnectMutation.isPending && disconnectMutation.variables?.integrationId === gmailIntegration?.id}
            onTest={handleSendTestEmail}
            isTesting={isSendingTest}
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4">
            <div className="flex items-center gap-4">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <span className="font-semibold">WhatsApp Business</span>
            </div>
            <Button onClick={() => setConfigProvider(whatsappProvider)}>
              <Settings className="mr-2 h-4 w-4" />
              Configurar
            </Button>
          </div>
        </CardContent>
      </Card>

      { (groupedIntegrations && Object.keys(groupedIntegrations).length > 0) || (unconfiguredProviders && unconfiguredProviders.length > 0) ? (
        <Card>
          <CardHeader>
            <CardTitle>Otras Integraciones</CardTitle>
            <CardDescription>Conecta servicios de terceros para potenciar tu negocio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {groupedIntegrations && Object.entries(groupedIntegrations).map(([providerSlug, configs]) => {
              const providerInfo = availableProviders?.find(p => p.slug === providerSlug);
              return (
                <div key={providerSlug} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    {providerInfo?.logo_url ? (
                      <img src={providerInfo.logo_url} alt={`${providerInfo.name} logo`} className="h-8 w-8 object-contain" />
                    ) : (
                      <div className="h-8 w-8 bg-gray-200 rounded-md flex items-center justify-center"><Globe className="h-5 w-5 text-gray-500" /></div>
                    )}
                    <span className="font-semibold text-lg">{providerInfo?.name || providerSlug}</span>
                  </div>
                  <div className="space-y-3">
                    {configs.map((integration: TenantIntegration) => (
                      <div key={integration.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Badge variant={integration.environment === 'production' ? 'default' : 'secondary'}>{integration.environment}</Badge>
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`switch-${integration.id}`} className="cursor-pointer">Activo</Label>
                            <Switch
                              id={`switch-${integration.id}`}
                              checked={integration.is_active}
                              onCheckedChange={() => setActiveMutation.mutate({ integrationId: integration.id, tenantId })}
                              disabled={setActiveMutation.isPending}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setConfigProvider(providerInfo)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Gestionar
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDisconnectRequest(integration.id, integration.provider)}>
                            <PowerOff className="mr-2 h-4 w-4" />
                            Desconectar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {isLoadingProviders ? (
              <p className="text-sm text-muted-foreground">Cargando...</p>
            ) : unconfiguredProviders && unconfiguredProviders.length > 0 ? (
              unconfiguredProviders.map(provider => (
                <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                     {provider.logo_url ? <img src={provider.logo_url} alt={`${provider.name} logo`} className="h-8 w-8 object-contain" /> : <div className="h-8 w-8 bg-gray-200 rounded-md flex items-center justify-center"><Globe className="h-5 w-5 text-gray-500" /></div>}
                    <span className="font-semibold">{provider.name}</span>
                  </div>
                  <Button onClick={() => setConfigProvider(provider)}><Power className="mr-2 h-4 w-4" />Configurar</Button>
                </div>
              ))
            ) : (
              !groupedIntegrations && <p className="text-sm text-muted-foreground">No hay otras integraciones disponibles.</p>
            )}
          </CardContent>
        </Card>
      ) : null}

      <IntegrationConfigDialog
        isOpen={!!configProvider}
        onOpenChange={(isOpen) => !isOpen && setConfigProvider(null)}
        provider={configProvider}
        tenantId={tenantId}
        platformId={platformId}
      />

      <AlertDialog open={disconnectAlert.isOpen} onOpenChange={(isOpen) => setDisconnectAlert({ ...disconnectAlert, isOpen })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desconectará la integración. No podrás utilizar las funcionalidades asociadas hasta que vuelvas a configurarla.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisconnect} disabled={disconnectMutation.isPending}>
              {disconnectMutation.isPending ? 'Desconectando...' : 'Sí, desconectar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};