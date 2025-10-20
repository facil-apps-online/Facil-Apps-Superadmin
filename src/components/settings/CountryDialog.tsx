import React, { useEffect, useMemo } from 'react';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateCountry, useUpdateCountry, Country, useTimezones } from '@/hooks/useLocalization';
import { useCurrencies } from '@/hooks/useCurrencies';
import { useLocalizations } from '@/hooks/useLocalization';
import { usePhonePrefixes } from '@/hooks/usePhonePrefixes';
import { useToast } from '@/hooks/use-toast';
import { MultiSearchableSelect } from '@/components/ui/multi-searchable-select';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';

// Schemas for validation
const placeholderSchema = z.object({
  label: z.string().min(1, "La etiqueta es requerida."),
  value: z.string().min(1, "El valor es requerido."),
});

const placeholderGroupSchema = z.object({
  key: z.string().min(1, "La clave es requerida."),
  placeholders: z.array(placeholderSchema),
});

const countrySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  iso_code: z.string().length(2, 'El código ISO debe tener 2 caracteres.'),
  default_currency_id: z.string().min(1, 'La moneda es requerida.'),
  default_localization_id: z.string().min(1, 'El idioma es requerido.'),
  phone_prefix_id: z.string().min(1, 'El prefijo telefónico es requerido.'),
  timezone_ids: z.array(z.string()).min(1, 'Debe seleccionar al menos una zona horaria.'),
  placeholders_array: z.array(placeholderGroupSchema).optional(),
});

type CountryFormValues = z.infer<typeof countrySchema>;

// Nested Field Array Component for Placeholders
function PlaceholderValues({ groupIndex, control, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `placeholders_array.${groupIndex}.placeholders`,
  });

  return (
    <div className="pl-4 mt-2 space-y-2">
      {fields.map((item, placeholderIndex) => (
        <div key={item.id} className="flex items-center gap-2">
          <Input
            {...register(`placeholders_array.${groupIndex}.placeholders.${placeholderIndex}.label`)}
            placeholder="Etiqueta (ej. Móvil)"
            className="flex-1"
          />
          <Input
            {...register(`placeholders_array.${groupIndex}.placeholders.${placeholderIndex}.value`)}
            placeholder="Valor (ej. +57 300...)"
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(placeholderIndex)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ label: '', value: '' })}
      >
        Añadir Valor
      </Button>
    </div>
  );
}


interface CountryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  country?: Country;
}

export function CountryDialog({ isOpen, onClose, country }: CountryDialogProps) {
  const { toast } = useToast();
  const createMutation = useCreateCountry();
  const updateMutation = useUpdateCountry();

  const { data: currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  const { data: localizations, isLoading: isLoadingLocalizations } = useLocalizations();
  const { data: phonePrefixes, isLoading: isLoadingPrefixes } = usePhonePrefixes();
  const { data: timezones, isLoading: isLoadingTimezones } = useTimezones();

  const form = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: { placeholders_array: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "placeholders_array",
  });

  useEffect(() => {
    if (country) {
      const placeholders = country.field_placeholders || {};
      const placeholders_array = Object.entries(placeholders).map(([key, values]) => ({
        key,
        placeholders: Array.isArray(values) ? values : [],
      }));

      form.reset({
        name: country.name,
        iso_code: country.iso_code,
        default_currency_id: String(country.default_currency_id),
        default_localization_id: String(country.default_localization_id),
        phone_prefix_id: String(country.phone_prefix_id),
        timezone_ids: country.timezones.map(tz => tz.id),
        placeholders_array,
      });
    } else {
      form.reset({
        name: '',
        iso_code: '',
        default_currency_id: undefined,
        default_localization_id: undefined,
        phone_prefix_id: undefined,
        timezone_ids: [],
        placeholders_array: [],
      });
    }
  }, [country, form]);

  const timezoneOptions = useMemo(() => {
    return timezones?.map(tz => ({ value: tz.id, label: tz.name })) || [];
  }, [timezones]);

  const onSubmit = (values: CountryFormValues) => {
    const mutation = country ? updateMutation : createMutation;

    const { placeholders_array, ...restOfValues } = values;
    const field_placeholders = (placeholders_array || []).reduce((acc, group) => {
      if (group.key) {
        acc[group.key] = group.placeholders;
      }
      return acc;
    }, {});

    const finalValues = country
      ? { ...restOfValues, id: country.id, field_placeholders }
      : { ...restOfValues, field_placeholders };

    mutation.mutate(finalValues, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: `País ${country ? 'actualizado' : 'creado'} correctamente.` });
        onClose();
      },
      onError: (error) => {
        toast({ title: 'Error', description: `No se pudo guardar el país: ${error.message}`, variant: 'destructive' });
      },
    });
  };

  const isLoading = isLoadingCurrencies || isLoadingLocalizations || isLoadingPrefixes || isLoadingTimezones;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{country ? 'Editar País' : 'Añadir País'}</DialogTitle>
          <DialogDescription>
            {country ? 'Edita la información del país.' : 'Añade un nuevo país al sistema.'}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? <p>Cargando...</p> : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="country-form" className="space-y-4">
              {/* Other fields remain the same */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nombre del País</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="iso_code" render={({ field }) => (<FormItem><FormLabel>Código ISO2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="default_currency_id" render={({ field }) => (<FormItem><FormLabel>Moneda por Defecto</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona una moneda" /></SelectTrigger></FormControl><SelectContent>{currencies?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="default_localization_id" render={({ field }) => (<FormItem><FormLabel>Idioma por Defecto</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un idioma" /></SelectTrigger></FormControl><SelectContent>{localizations?.map(l => <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="phone_prefix_id" render={({ field }) => (<FormItem><FormLabel>Prefijo Telefónico</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un prefijo" /></SelectTrigger></FormControl><SelectContent>{phonePrefixes?.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.prefix}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="timezone_ids" render={({ field }) => (<FormItem><FormLabel>Zonas Horarias</FormLabel><FormControl><MultiSearchableSelect options={timezoneOptions} value={timezoneOptions.filter(opt => field.value?.includes(opt.value))} onChange={(selected) => { field.onChange(selected ? selected.map(s => s.value) : []); }} placeholder="Selecciona una o más zonas horarias" /></FormControl><FormMessage /></FormItem>)} />

              {/* Generic Placeholders Section */}
              <div className="space-y-4 rounded-lg border p-4">
                <Label className="text-base font-medium">Grupos de Placeholders</Label>
                <div className="space-y-4">
                  {fields.map((group, groupIndex) => (
                    <div key={group.id} className="p-3 border rounded-md space-y-2">
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`placeholders_array.${groupIndex}.key`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Clave del Grupo</FormLabel>
                              <FormControl><Input {...field} placeholder="ej. phone" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(groupIndex)} className="mt-8">
                           <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <PlaceholderValues groupIndex={groupIndex} control={form.control} register={form.register} />
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ key: '', placeholders: [] })}
                >
                  Añadir Grupo de Placeholders
                </Button>
              </div>

            </form>
          </Form>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="country-form" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}