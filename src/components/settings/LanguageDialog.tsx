import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Language, useCreateLanguage, useUpdateLanguage } from '@/hooks/useLanguages';
import { useToast } from '@/hooks/use-toast';

const languageSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  iso_code: z.string().min(1, 'El código ISO es requerido.'),
  is_active: z.boolean(),
});

type LanguageFormValues = z.infer<typeof languageSchema>;

interface LanguageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export function LanguageDialog({ isOpen, onClose, language }: LanguageDialogProps) {
  const { toast } = useToast();
  const createMutation = useCreateLanguage();
  const updateMutation = useUpdateLanguage();

  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: language ? { ...language } : { name: '', iso_code: '', is_active: true },
  });

  useEffect(() => {
    if (language) {
      form.reset(language);
    } else {
      form.reset({ name: '', iso_code: '', is_active: true });
    }
  }, [language, form]);

  const onSubmit = (values: LanguageFormValues) => {
    const mutation = language ? updateMutation : createMutation;
    const finalValues = language ? { ...values, id: language.id } : values;

    mutation.mutate(finalValues, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: `Idioma ${language ? 'actualizado' : 'creado'} correctamente.` });
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
          <DialogTitle>{language ? 'Editar Idioma' : 'Añadir Idioma'}</DialogTitle>
          <DialogDescription>
            {language ? 'Edita la información del idioma.' : 'Añade un nuevo idioma al sistema.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="language-form" className="space-y-4 py-4">
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
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Activo</FormLabel>
                    <FormDescription>
                      Si está inactivo, el idioma no se podrá seleccionar.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="language-form" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
