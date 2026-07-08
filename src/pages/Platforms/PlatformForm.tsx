import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { usePlatformCategories } from '@/hooks/usePlatformCategories';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre es obligatorio." }),
  slug: z.string().optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  base_url: z.string().optional(),
  logo_url: z.string().optional(),
  status: z.string().optional(),
  social_facebook: z.string().optional(),
  social_instagram: z.string().optional(),
  display_order: z.coerce.number().int().optional(),
  is_public: z.boolean().optional(),
  category_id: z.string().optional().nullable(),
});

export type PlatformFormValues = z.infer<typeof formSchema>;

interface PlatformFormProps {
  initialData?: Partial<PlatformFormValues>;
  onSubmit: (values: PlatformFormValues) => void;
  isSubmitting?: boolean;
}

export const PlatformForm: React.FC<PlatformFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const { data: categories, isLoading: categoriesLoading } = usePlatformCategories();

  const form = useForm<PlatformFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      description: '',
      description_en: '',
      base_url: '',
      logo_url: '',
      status: 'production',
      social_facebook: '',
      social_instagram: '',
      display_order: 0,
      is_public: true,
      category_id: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      const values: Partial<PlatformFormValues> = {
        name: initialData.name || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        description_en: initialData.description_en || '',
        base_url: initialData.base_url || '',
        logo_url: initialData.logo_url || '',
        status: initialData.status || 'production',
        social_facebook: initialData.social_facebook || '',
        social_instagram: initialData.social_instagram || '',
        display_order: initialData.display_order ?? 0,
        is_public: initialData.is_public ?? true,
        category_id: initialData.category_id ?? null,
      };
      form.reset(values);
    }
  }, [initialData, form]);

  const selectedCategory = form.watch('category_id');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Información Básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Plataforma</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Glamtica" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: glamtica"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Identificador único para URL. Se genera automáticamente del nombre.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (ES)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción en español."
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (EN)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="English description."
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* URLs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">URLs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="base_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Base</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: https://glamtica.app"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Logo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: https://.../logo.png"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Status & Display */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Estado y Visualización</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'production'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="production">Producción</SelectItem>
                      <SelectItem value="development">Desarrollo</SelectItem>
                      <SelectItem value="planning">Planeación</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden de Visualización</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Número más bajo = aparece primero.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value || null)}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>Cargando...</SelectItem>
                      ) : (
                        categories?.map((cat) => {
                          const name =
                            cat.platform_category_translations?.find(
                              (t) => t.locale === 'es'
                            )?.name || cat.slug;
                          return (
                            <SelectItem key={cat.id} value={cat.id}>
                              {name}
                            </SelectItem>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Público</FormLabel>
                    <FormDescription>
                      Mostrar en el listado público del portal.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Social Networks */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Redes Sociales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="social_facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: https://facebook.com/glamtica"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="social_instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: https://instagram.com/glamtica.app"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
