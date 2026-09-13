import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { usePlatforms } from '@/hooks/usePlatforms';
import { useInviteTeamMember } from '@/hooks/useTeamInvite';
import { UserPlus, PlusCircle, Trash2 } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  platforms: z.array(z.object({
    platformId: z.string().min(1, 'Selecciona una plataforma'),
    firstPaymentCommissionRate: z.coerce.number().min(0).max(100),
    recurringPaymentCommissionRate: z.coerce.number().min(0).max(100),
  })).min(1, 'Agrega al menos una plataforma'),
});

type FormValues = z.infer<typeof formSchema>;

export function InviteTeamMemberDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { data: allPlatforms } = usePlatforms();
  const platforms = (allPlatforms || []).filter((p) => p.status === 'production');
  const inviteMutation = useInviteTeamMember();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      platforms: [{ platformId: '', firstPaymentCommissionRate: 50, recurringPaymentCommissionRate: 10 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'platforms' });

  const onSubmit = (values: FormValues) => {
    inviteMutation.mutate(values, {
      onSuccess: () => {
        toast({ title: 'Invitación enviada', description: `Se envió un correo a ${values.email} para crear su contraseña.` });
        setOpen(false);
        form.reset();
      },
      onError: (error) => toast({ title: 'Error', description: error.message, variant: 'destructive' }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Invitar Vendedor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invitar Vendedor</DialogTitle>
          <DialogDescription>
            Le enviaremos un correo para que cree su propia contraseña y entre al portal de Facil Apps Online.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="fullName" render={({ field }) => (
              <FormItem><FormLabel>Nombre Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Plataformas que puede vender</Label>
                <Button type="button" size="sm" variant="outline" onClick={() => append({ platformId: '', firstPaymentCommissionRate: 50, recurringPaymentCommissionRate: 10 })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                </Button>
              </div>
              {fields.map((item, index) => (
                <div key={item.id} className="flex flex-wrap items-end gap-3 p-2 border rounded-md">
                  <div className="flex-grow grid gap-1.5 min-w-[150px]">
                    <Label className="text-xs text-muted-foreground">Plataforma</Label>
                    <Controller
                      control={form.control}
                      name={`platforms.${index}.platformId`}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Plataforma" /></SelectTrigger>
                          <SelectContent>
                            {platforms?.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs text-muted-foreground">% 1er Pago</Label>
                    <Input type="number" className="w-24" {...form.register(`platforms.${index}.firstPaymentCommissionRate`, { valueAsNumber: true })} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs text-muted-foreground">% Recurrente</Label>
                    <Input type="number" className="w-24" {...form.register(`platforms.${index}.recurringPaymentCommissionRate`, { valueAsNumber: true })} />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {form.formState.errors.platforms?.message && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.platforms.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={inviteMutation.isPending}>
                {inviteMutation.isPending ? 'Enviando...' : 'Enviar Invitación'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
