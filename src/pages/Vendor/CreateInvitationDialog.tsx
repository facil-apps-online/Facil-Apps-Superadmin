import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { usePlatforms } from '@/hooks/usePlatforms';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { useCreateVendorInvitation, VendorInvitation } from '@/hooks/useVendorInvitations';
import { PlusCircle, Copy, Send } from 'lucide-react';

const formSchema = z.object({
  platformId: z.string().min(1, 'Selecciona una plataforma'),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
  trialDaysOverride: z.coerce.number().int().min(1).optional().or(z.literal('' as any)),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateInvitationDialog({ vendorUserId }: { vendorUserId?: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState<VendorInvitation | null>(null);
  const { data: platforms } = usePlatforms();
  const { data: globalSettings } = useGlobalSettings();
  const createMutation = useCreateVendorInvitation();

  const productionPlatforms = (platforms || []).filter((p) => p.status === 'production');
  const maxTrialDays = globalSettings?.max_vendor_trial_days || 30;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platformId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyName: '',
      taxId: '',
      notes: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(
      {
        platformId: values.platformId,
        vendorUserId,
        prospect: {
          firstName: values.firstName,
          lastName: values.lastName || undefined,
          email: values.email || undefined,
          phone: values.phone || undefined,
          companyName: values.companyName || undefined,
          taxId: values.taxId || undefined,
        },
        trialDaysOverride: values.trialDaysOverride ? Number(values.trialDaysOverride) : undefined,
        notes: values.notes || undefined,
      },
      {
        onSuccess: (data) => {
          setCreated(data);
          toast({ title: 'Éxito', description: 'Invitación creada correctamente.' });
        },
        onError: (error) => {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        },
      }
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setCreated(null);
      form.reset();
    }
  };

  const copyLink = () => {
    if (!created) return;
    navigator.clipboard.writeText(created.invite_url);
    toast({ title: 'Copiado', description: 'Link de invitación copiado al portapapeles.' });
  };

  const whatsappHref = created
    ? `https://wa.me/?text=${encodeURIComponent(`¡Hola ${created.prospect_first_name}! Te comparto el link para probar la plataforma: ${created.invite_url}`)}`
    : '#';
  const mailtoHref = created
    ? `mailto:${created.prospect_email || ''}?subject=${encodeURIComponent('Invitación para probar la plataforma')}&body=${encodeURIComponent(`Hola ${created.prospect_first_name},\n\nTe comparto el link para crear tu cuenta: ${created.invite_url}`)}`
    : '#';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Nueva Invitación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {!created ? (
          <>
            <DialogHeader>
              <DialogTitle>Nueva Invitación</DialogTitle>
              <DialogDescription>
                Genera un link de invitación para un prospecto en una plataforma activa.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          {productionPlatforms.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Empresa</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIT / Tax ID</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="trialDaysOverride"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Días de Prueba (opcional)</FormLabel>
                      <FormControl><Input type="number" placeholder={`Por defecto de la plataforma`} {...field} /></FormControl>
                      <FormDescription>Máximo permitido: {maxTrialDays} días.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas</FormLabel>
                      <FormControl><Textarea rows={2} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creando...' : 'Crear Invitación'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Invitación creada</DialogTitle>
              <DialogDescription>Comparte este link con {created.prospect_first_name}.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/40">
              <code className="text-sm flex-1 truncate">{created.invite_url}</code>
              <Button size="icon" variant="ghost" onClick={copyLink}><Copy className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <a href={whatsappHref} target="_blank" rel="noreferrer"><Send className="mr-2 h-4 w-4" /> WhatsApp</a>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <a href={mailtoHref}><Send className="mr-2 h-4 w-4" /> Email</a>
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={() => handleOpenChange(false)}>Cerrar</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
