import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { AddressAutocompleteInput } from '@/components/AddressAutocompleteInput';
import { MapDisplay } from '@/components/MapDisplay';
import { useToast } from '@/hooks/use-toast';
import { usePlatforms } from '@/hooks/usePlatforms';
import { useCreateVendorProspect, useUpdateVendorProspect, VendorProspect } from '@/hooks/useVendorProspects';
import { UserPlus, Pencil } from 'lucide-react';

// El negocio de Facil Apps opera en Colombia; se restringe el autocompletado a ese país,
// igual que se haría con el país del tenant en "Crear Tenant" (el prospecto aún no tiene uno).
const PROSPECT_COUNTRY_RESTRICTION = 'CO';

const formSchema = z.object({
  platformId: z.string().min(1, 'Selecciona una plataforma'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
  legalName: z.string().optional(),
  whatsappPhone: z.string().optional(),
  website: z.string().optional(),
  billingAddress: z.string().optional(),
  einvoicingEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  physicalAddressLine1: z.string().optional(),
  physicalAddressLine2: z.string().optional(),
  physicalCity: z.string().optional(),
  physicalState: z.string().optional(),
  physicalPostalCode: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const emptyValues: FormValues = {
  platformId: '', firstName: '', lastName: '', email: '', phone: '', companyName: '', taxId: '',
  legalName: '', whatsappPhone: '', website: '', billingAddress: '', einvoicingEmail: '',
  physicalAddressLine1: '', physicalAddressLine2: '', physicalCity: '', physicalState: '', physicalPostalCode: '',
  latitude: null, longitude: null,
};

function prospectToFormValues(p: VendorProspect): FormValues {
  return {
    platformId: p.platform_id,
    firstName: p.first_name,
    lastName: p.last_name || '',
    email: p.email || '',
    phone: p.phone || '',
    companyName: p.company_name || '',
    taxId: p.tax_id || '',
    legalName: p.legal_name || '',
    whatsappPhone: p.whatsapp_phone || '',
    website: p.website || '',
    billingAddress: p.billing_address || '',
    einvoicingEmail: p.einvoicing_email || '',
    physicalAddressLine1: p.physical_address_line1 || '',
    physicalAddressLine2: p.physical_address_line2 || '',
    physicalCity: p.physical_city || '',
    physicalState: p.physical_state || '',
    physicalPostalCode: p.physical_postal_code || '',
    latitude: p.latitude,
    longitude: p.longitude,
  };
}

interface Props {
  vendorUserId?: string;
  /** Si se pasa, el diálogo edita este prospecto en vez de crear uno nuevo. */
  prospect?: VendorProspect;
}

export function CreateProspectDialog({ vendorUserId, prospect }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { data: allPlatforms } = usePlatforms();
  const platforms = (allPlatforms || []).filter((p) => p.status === 'production');
  const createMutation = useCreateVendorProspect();
  const updateMutation = useUpdateVendorProspect();
  const isEdit = !!prospect;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: prospect ? prospectToFormValues(prospect) : emptyValues,
  });

  useEffect(() => {
    if (open) form.reset(prospect ? prospectToFormValues(prospect) : emptyValues);
  }, [open, prospect]);

  const watchedLat = form.watch('latitude');
  const watchedLng = form.watch('longitude');

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    const get = (type: string) => place.address_components?.find((c) => c.types.includes(type))?.long_name || '';
    form.setValue('physicalAddressLine1', `${get('route')} ${get('street_number')}`.trim());
    form.setValue('physicalCity', get('locality'));
    form.setValue('physicalState', get('administrative_area_level_1'));
    form.setValue('physicalPostalCode', get('postal_code'));
    if (place.geometry?.location) {
      form.setValue('latitude', place.geometry.location.lat());
      form.setValue('longitude', place.geometry.location.lng());
    }
  };

  const onSubmit = (values: FormValues) => {
    const prospectData = {
      firstName: values.firstName,
      lastName: values.lastName || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
      companyName: values.companyName || undefined,
      taxId: values.taxId || undefined,
      legalName: values.legalName || undefined,
      whatsappPhone: values.whatsappPhone || undefined,
      website: values.website || undefined,
      billingAddress: values.billingAddress || undefined,
      einvoicingEmail: values.einvoicingEmail || undefined,
      physicalAddressLine1: values.physicalAddressLine1 || undefined,
      physicalAddressLine2: values.physicalAddressLine2 || undefined,
      physicalCity: values.physicalCity || undefined,
      physicalState: values.physicalState || undefined,
      physicalPostalCode: values.physicalPostalCode || undefined,
      latitude: values.latitude ?? undefined,
      longitude: values.longitude ?? undefined,
    };

    const onSuccess = () => {
      toast({ title: 'Éxito', description: isEdit ? 'Prospecto actualizado.' : 'Prospecto registrado.' });
      setOpen(false);
    };
    const onError = (error: Error) => toast({ title: 'Error', description: error.message, variant: 'destructive' });

    if (isEdit) {
      updateMutation.mutate({ prospectId: prospect.id, prospect: prospectData }, { onSuccess, onError });
    } else {
      createMutation.mutate({ platformId: values.platformId, vendorUserId, prospect: prospectData }, { onSuccess, onError });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button size="sm" variant="ghost">
            <Pencil className="mr-1 h-3.5 w-3.5" /> Editar
          </Button>
        ) : (
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" /> Nuevo Prospecto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Prospecto' : 'Nuevo Prospecto'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Completa los datos de negocio para no volver a digitarlos al invitarlo.'
              : 'Registra un prospecto en proceso comercial, antes de invitarlo.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isEdit && (
              <FormField
                control={form.control}
                name="platformId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plataforma</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Selecciona una plataforma" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {platforms?.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem><FormLabel>Apellido</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="whatsappPhone" render={({ field }) => (
                <FormItem><FormLabel>WhatsApp</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="companyName" render={({ field }) => (
                <FormItem><FormLabel>Empresa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <Separator />
            <p className="text-sm font-medium text-muted-foreground">Datos de facturación (opcional)</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="legalName" render={({ field }) => (
                <FormItem><FormLabel>Razón Social</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="taxId" render={({ field }) => (
                <FormItem><FormLabel>NIT / Tax ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="einvoicingEmail" render={({ field }) => (
                <FormItem><FormLabel>Email Facturación Electrónica</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="website" render={({ field }) => (
                <FormItem><FormLabel>Sitio Web</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="billingAddress" render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Dirección de Facturación</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <Separator />
            <p className="text-sm font-medium text-muted-foreground">Dirección física (opcional)</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="physicalAddressLine1" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <AddressAutocompleteInput
                      onPlaceSelected={handlePlaceSelected}
                      defaultValue={field.value}
                      countryRestriction={PROSPECT_COUNTRY_RESTRICTION}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {(watchedLat && watchedLng) ? (
                <div className="col-span-2 h-48">
                  <MapDisplay latitude={watchedLat} longitude={watchedLng} />
                </div>
              ) : null}
              <FormField control={form.control} name="physicalAddressLine2" render={({ field }) => (
                <FormItem className="col-span-2"><FormLabel>Dirección (línea 2)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="physicalCity" render={({ field }) => (
                <FormItem><FormLabel>Ciudad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="physicalState" render={({ field }) => (
                <FormItem><FormLabel>Departamento/Estado</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="physicalPostalCode" render={({ field }) => (
                <FormItem><FormLabel>Código Postal</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Registrar Prospecto'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
