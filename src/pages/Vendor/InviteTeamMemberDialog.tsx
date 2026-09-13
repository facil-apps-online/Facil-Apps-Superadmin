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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { usePlatforms } from '@/hooks/usePlatforms';
import { useInviteTeamMember } from '@/hooks/useTeamInvite';
import { UserPlus } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  platformId: z.string().min(1, 'Selecciona una plataforma'),
  firstPaymentCommissionRate: z.coerce.number().min(0).max(100),
  recurringPaymentCommissionRate: z.coerce.number().min(0).max(100),
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
    defaultValues: { fullName: '', email: '', platformId: '', firstPaymentCommissionRate: 50, recurringPaymentCommissionRate: 10 },
  });

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
      <DialogContent className="sm:max-w-md">
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
            <FormField control={form.control} name="platformId" render={({ field }) => (
              <FormItem>
                <FormLabel>Plataforma que puede vender</FormLabel>
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
                <FormDescription>Podrás agregarle más plataformas después desde Roles.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="firstPaymentCommissionRate" render={({ field }) => (
                <FormItem><FormLabel>% Comisión 1er Pago</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="recurringPaymentCommissionRate" render={({ field }) => (
                <FormItem><FormLabel>% Comisión Recurrente</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
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
