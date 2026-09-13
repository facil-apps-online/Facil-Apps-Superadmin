
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useGlobalSettings, useUpdateGlobalSettings } from '@/hooks/useGlobalSettings';
import { useBillingEntity, useUpsertBillingEntity, BillingEntity } from '@/hooks/useBillingEntity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const settingsSchema = z.object({
  company_name: z.string().min(1, 'El nombre de la empresa es requerido.'),
  contact_email: z.string().email('Debe ser un correo electrónico válido.'),
  address: z.string().optional(),
  trial_duration_days: z.coerce.number().int().min(1, 'La duración debe ser al menos 1 día.'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const billingEntitySchema = z.object({
  legal_name: z.string().min(1, 'El nombre legal es requerido.'),
  tax_id: z.string().optional(),
  billing_address_line1: z.string().optional(),
  billing_city: z.string().optional(),
  billing_postal_code: z.string().optional(),
  contact_email: z.string().email('Debe ser un correo electrónico válido.').optional().or(z.literal('')),
});

type BillingEntityFormValues = z.infer<typeof billingEntitySchema>;

export function GeneralCompanySettings() {
  const { data: settings, isLoading: isLoadingSettings } = useGlobalSettings();
  const { mutate: updateSettings, isPending: isUpdatingSettings } = useUpdateGlobalSettings();
  
  const { data: billingEntity, isLoading: isLoadingBillingEntity } = useBillingEntity();
  const { mutate: upsertBillingEntity, isPending: isUpsertingBillingEntity } = useUpsertBillingEntity();

  const { toast } = useToast();

  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      company_name: '',
      contact_email: '',
      address: '',
      trial_duration_days: 14,
    },
  });

  const billingForm = useForm<BillingEntityFormValues>({
    resolver: zodResolver(billingEntitySchema),
    defaultValues: {
        legal_name: '',
        tax_id: '',
        billing_address_line1: '',
        billing_city: '',
        billing_postal_code: '',
        contact_email: '',
    },
  });

  useEffect(() => {
    if (settings) {
      settingsForm.reset({
        company_name: settings.company_name || '',
        contact_email: settings.contact_email || '',
        address: settings.address || '',
        trial_duration_days: settings.trial_duration_days || 14,
      });
    }
  }, [settings, settingsForm]);

  useEffect(() => {
    if (billingEntity) {
        billingForm.reset({
            legal_name: billingEntity.legal_name || '',
            tax_id: billingEntity.tax_id || '',
            billing_address_line1: billingEntity.billing_address_line1 || '',
            billing_city: billingEntity.billing_city || '',
            billing_postal_code: billingEntity.billing_postal_code || '',
            contact_email: billingEntity.contact_email || '',
        });
    }
  }, [billingEntity, billingForm]);

  const onSettingsSubmit = (values: SettingsFormValues) => {
    updateSettings(values, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: 'Configuración guardada correctamente.', variant: 'success' });
      },
      onError: (error) => {
        toast({ title: 'Error', description: `No se pudo guardar: ${error.message}`, variant: 'destructive' });
      },
    });
  };

  const onBillingSubmit = (values: BillingEntityFormValues) => {
    const payload: Partial<BillingEntity> = {
        ...values,
        id: billingEntity?.id, // Pass the ID for upsert
    };
    upsertBillingEntity(payload);
  };

  if (isLoadingSettings || isLoadingBillingEntity) {
    return <Skeleton className="h-[40rem] w-full" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información de la Empresa y Pruebas</CardTitle>
          <CardDescription>Gestiona los datos de tu empresa y la duración del período de prueba para nuevos clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...settingsForm}>
            <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={settingsForm.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Empresa</FormLabel>
                      <FormControl><Input placeholder="Ej: Empresa S.A.S" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={settingsForm.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de Contacto</FormLabel>
                      <FormControl><Input placeholder="contacto@empresa.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={settingsForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Dirección</FormLabel>
                      <FormControl><Input placeholder="Calle 123, Ciudad" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={settingsForm.control}
                  name="trial_duration_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Días del Período de Prueba</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdatingSettings}>
                  {isUpdatingSettings ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entidad de Facturación</CardTitle>
          <CardDescription>Información fiscal de la empresa que emite las facturas a los clientes (tenants).</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...billingForm}>
            <form onSubmit={billingForm.handleSubmit(onBillingSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={billingForm.control}
                  name="legal_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Legal / Razón Social</FormLabel>
                      <FormControl><Input placeholder="Facil Apps Online S.A.S" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={billingForm.control}
                  name="tax_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID de Impuestos (NIT / CUIT / etc.)</FormLabel>
                      <FormControl><Input placeholder="900.123.456-7" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={billingForm.control}
                  name="billing_address_line1"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Dirección de Facturación</FormLabel>
                      <FormControl><Input placeholder="Carrera 1, #2-3" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={billingForm.control}
                  name="billing_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl><Input placeholder="Bogotá" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={billingForm.control}
                  name="billing_postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Postal</FormLabel>
                      <FormControl><Input placeholder="110111" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={billingForm.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de Facturación</FormLabel>
                      <FormControl><Input placeholder="facturacion@facilapps.co" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isUpsertingBillingEntity}>
                  {isUpsertingBillingEntity ? 'Guardando...' : 'Guardar Información de Facturación'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
