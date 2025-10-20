import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Localization, useCreateLocalization, useUpdateLocalization } from '@/hooks/useLocalization';
import { useToast } from '@/hooks/use-toast';

const localizationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  iso_code: z.string().min(1, 'El código ISO es requerido.'),
});

type LocalizationFormValues = z.infer<typeof localizationSchema>;

interface LocalizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  localization?: Localization;
}

export function LocalizationDialog({ isOpen, onClose, localization }: LocalizationDialogProps) {
  const { toast } = useToast();
  const createMutation = useCreateLocalization();
  const updateMutation = useUpdateLocalization();

  const form = useForm<LocalizationFormValues>({
    resolver: zodResolver(localizationSchema),
    defaultValues: localization || { name: '', iso_code: '' },
  });

  useEffect(() => {
    if (localization) {
      form.reset(localization);
    }
  }, [localization, form]);

  const onSubmit = (values: LocalizationFormValues) => {
    const mutation = localization ? updateMutation : createMutation;
    const finalValues = localization ? { ...values, id: localization.id } : values;

    mutation.mutate(finalValues, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: `Idioma ${localization ? 'actualizado' : 'creado'} correctamente.` });
        onClose();
      },
      onError: (error) => {
        toast({ title: 'Error', description: `No se pudo guardar el idioma: ${error.message}`, variant: 'destructive' });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{localization ? 'Editar Idioma' : 'Añadir Idioma'}</DialogTitle>
          <DialogDescription>
            {localization ? 'Edita la información del idioma.' : 'Añade un nuevo idioma al sistema.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="localization-form" className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
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
              name="iso_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código ISO</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="localization-form" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}