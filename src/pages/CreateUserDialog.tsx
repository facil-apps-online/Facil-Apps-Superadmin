import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { useCreateUser, CreateUserPayload } from '@/hooks/useCreateUser';
import { useToast } from '@/hooks/use-toast';
import { usePlatforms } from '@/hooks/usePlatforms';
import { Check, ChevronsUpDown, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateUserDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'super_admin' | 'app_super_admin' | 'investor' | 'vendor';
  appSuperAdminPlatforms: string[];
  investorPlatforms: { platformId: string; stake: number }[];
};

export function CreateUserDialog({ isOpen, onOpenChange }: CreateUserDialogProps) {
  const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      appSuperAdminPlatforms: [],
      investorPlatforms: [{ platformId: '', stake: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'investorPlatforms',
  });

  const { toast } = useToast();
  const createUserMutation = useCreateUser();
  const { data: platforms, isLoading: isLoadingPlatforms } = usePlatforms();
  const selectedRole = watch('role');

  const onSubmit = (data: FormData) => {
    let assignments: any;
    if (data.role === 'app_super_admin') {
      assignments = data.appSuperAdminPlatforms;
    } else if (data.role === 'investor') {
      assignments = data.investorPlatforms;
    }

    const payload: CreateUserPayload = {
      email: data.email,
      fullName: `${data.firstName} ${data.lastName}`,
      password: data.password,
      role: data.role,
      assignments,
    };

    createUserMutation.mutate(payload, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: 'Usuario creado correctamente.' });
        onOpenChange(false);
        reset();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: `No se pudo crear el usuario: ${error.message}`,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Completa los datos para crear un nuevo usuario en el sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" {...register('firstName', { required: 'El nombre es requerido' })} />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" {...register('lastName', { required: 'El apellido es requerido' })} />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email', { required: 'El email es requerido' })} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" {...register('password')} placeholder="Opcional: Dejar en blanco para invitar" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rol</Label>
              <Controller
                control={control}
                name="role"
                rules={{ required: 'El rol es requerido' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="app_super_admin">App Super Admin</SelectItem>
                      <SelectItem value="investor">Investor</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
            </div>

            {selectedRole === 'app_super_admin' && (
              <Card className="mt-4">
                <CardHeader><CardTitle>Plataformas para App Super Admin</CardTitle></CardHeader>
                <CardContent>
                  <Controller
                    control={control}
                    name="appSuperAdminPlatforms"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="w-full justify-between">
                            {field.value.length > 0 ? `${field.value.length} plataforma(s) seleccionada(s)` : "Selecciona plataformas..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar plataforma..." />
                            <CommandEmpty>No se encontraron plataformas.</CommandEmpty>
                            <CommandGroup>
                              {platforms?.map(platform => (
                                <CommandItem
                                  key={platform.id}
                                  onSelect={() => {
                                    const newValue = field.value.includes(platform.id)
                                      ? field.value.filter(id => id !== platform.id)
                                      : [...field.value, platform.id];
                                    field.onChange(newValue);
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", field.value.includes(platform.id) ? "opacity-100" : "opacity-0")} />
                                  {platform.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {selectedRole === 'investor' && (
              <Card className="mt-4">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Plataformas para Inversores</CardTitle>
                  <Button type="button" size="sm" onClick={() => append({ platformId: '', stake: 0 })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Controller
                        control={control}
                        name={`investorPlatforms.${index}.platformId`}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue placeholder="Plataforma" /></SelectTrigger>
                            <SelectContent>
                              {platforms?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Input
                        type="number"
                        placeholder="% de inversión"
                        {...register(`investorPlatforms.${index}.stake`, { required: true, valueAsNumber: true })}
                        className="w-48"
                      />
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}