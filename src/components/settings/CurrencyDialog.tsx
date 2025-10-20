import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Currency, useCreateCurrency, useUpdateCurrency } from '@/hooks/useCurrencies';
import { useToast } from '@/hooks/use-toast';

const currencySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  code: z.string().min(1, 'El código es requerido.'),
  symbol: z.string().min(1, 'El símbolo es requerido.'),
  decimal_places: z.coerce.number().int().min(0, 'Debe ser un número positivo.'),
  decimal_separator: z.string().min(1, 'El separador decimal es requerido.'),
  thousands_separator: z.string().min(1, 'El separador de miles es requerido.'),
  symbol_position: z.enum(['before', 'after']),
});

type CurrencyFormValues = z.infer<typeof currencySchema>;

interface CurrencyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currency?: Currency;
}

export function CurrencyDialog({ isOpen, onClose, currency }: CurrencyDialogProps) {
  const { toast } = useToast();
  const createMutation = useCreateCurrency();
  const updateMutation = useUpdateCurrency();

  const form = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencySchema),
    defaultValues: currency ? {
      ...currency,
      decimal_places: currency.decimal_places || 2,
      decimal_separator: currency.decimal_separator || '.',
      thousands_separator: currency.thousands_separator || ',',
      symbol_position: currency.symbol_position || 'before',
    } : {
      decimal_places: 2,
      decimal_separator: '.',
      thousands_separator: ',',
      symbol_position: 'before',
    },
  });

  useEffect(() => {
    if (currency) {
      form.reset(currency);
    }
  }, [currency, form]);

  const onSubmit = (values: CurrencyFormValues) => {
    const mutation = currency ? updateMutation : createMutation;
    const finalValues = currency ? { ...values, id: currency.id } : values;

    mutation.mutate(finalValues, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: `Moneda ${currency ? 'actualizada' : 'creada'} correctamente.` });
        onClose();
      },
      onError: (error) => {
        toast({ title: 'Error', description: `No se pudo guardar la moneda: ${error.message}`, variant: 'destructive' });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{currency ? 'Editar Moneda' : 'Añadir Moneda'}</DialogTitle>
          <DialogDescription>
            {currency ? 'Edita la información de la moneda.' : 'Añade una nueva moneda al sistema.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="currency-form" className="grid grid-cols-2 gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Símbolo</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="decimal_places"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decimales</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="symbol_position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posición del Símbolo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="before">Antes</SelectItem>
                      <SelectItem value="after">Después</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="decimal_separator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Separador Decimal</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thousands_separator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Separador de Miles</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="currency-form" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}