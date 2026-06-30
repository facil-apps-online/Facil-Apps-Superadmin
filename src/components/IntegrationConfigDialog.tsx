import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import DynamicIntegrationForm from './DynamicIntegrationForm';
import { useSaveIntegration } from '@/hooks/useSaveIntegration';
import { useTenantIntegrations } from '@/hooks/useTenantIntegrations';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { ConfigField } from '@/hooks/useIntegrationProviders';

interface IntegrationProvider {
  id: string;
  name: string;
  slug: string;
  config_schema: ConfigField[];
}

interface IntegrationConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  provider: IntegrationProvider | null;
  tenantId: string;
  platformId: string; // Added prop
}

const IntegrationConfigDialog: React.FC<IntegrationConfigDialogProps> = ({
  isOpen,
  onOpenChange,
  provider,
  tenantId,
  platformId,
}) => {
  const [isTestMode, setIsTestMode] = useState(false);
  const [decryptedCredentials, setDecryptedCredentials] = useState<Record<string, any> | null>(null);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);
  const { toast } = useToast();
  
  const environment = isTestMode ? 'test' : 'production';
  const { data: existingIntegrations } = useTenantIntegrations(tenantId); // Reverted environment filter here as hook doesn't support it yet
  const saveIntegrationMutation = useSaveIntegration();

  useEffect(() => {
    const decryptAndSetCredentials = async () => {
      if (!provider || !existingIntegrations) {
        setDecryptedCredentials(null);
        return;
      }

      // Filter locally
      const existingConfig = existingIntegrations.find(
        int => int.provider === provider.slug && int.environment === environment
      );
      
      if (existingConfig && existingConfig.encrypted_credentials && existingConfig.nonce) {
        setIsLoadingCredentials(true);
        try {
          const { data, error } = await supabase.functions.invoke('decrypt-secret', {
            body: {
              encryptedData: existingConfig.encrypted_credentials,
              iv: existingConfig.nonce,
            },
          });

          if (error) throw error;

          const creds = JSON.parse(data.decryptedText);
          setDecryptedCredentials(creds);
        } catch (e: any) {
          toast({ title: 'Error', description: `No se pudieron cargar las credenciales existentes: ${e.message}`, variant: 'destructive' });
          setDecryptedCredentials(null);
        } finally {
          setIsLoadingCredentials(false);
        }
      } else {
        setDecryptedCredentials(null);
      }
    };

    decryptAndSetCredentials();
  }, [isOpen, provider, existingIntegrations, isTestMode, environment, toast]); // Added dependencies

  const handleSave = async (data: Record<string, any>) => {
    if (!provider) return;
    saveIntegrationMutation.mutate(
      { tenantId, platformId, provider, credentials: data, environment },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  if (!provider) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar {provider.name}</DialogTitle>
          <DialogDescription>
            Introduce las credenciales para conectar {provider.name} a este tenant.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="test-mode-switch"
              checked={isTestMode}
              onCheckedChange={setIsTestMode}
            />
            <Label htmlFor="test-mode-switch">Modo de Prueba</Label>
          </div>
          {isLoadingCredentials ? (
            <p>Cargando credenciales...</p>
          ) : (
            <DynamicIntegrationForm
              key={environment + JSON.stringify(decryptedCredentials)} // Forzar re-render del form
              configSchema={provider.config_schema}
              onSubmit={handleSave}
              isSaving={saveIntegrationMutation.isLoading}
              initialData={decryptedCredentials}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationConfigDialog;
