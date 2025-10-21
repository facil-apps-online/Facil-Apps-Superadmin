import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePlatforms } from '@/hooks/usePlatforms';
import { useTenants } from '@/hooks/useSuperadminTenants';
import { useCreateUser, CreateUserPayload } from '@/hooks/useCreateUser';
import { Check, ChevronsUpDown, PlusCircle, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function UserManagementPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<CreateUserPayload['role'] | '' >('');

  // State for app_super_admin
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // State for investor
  const [investorPlatforms, setInvestorPlatforms] = useState<{ platformId: string; stake: number }[]>([]);

  // State for vendor
  const [vendorPlatform, setVendorPlatform] = useState<string>('');
  const [vendorTenant, setVendorTenant] = useState<string>('');

  const { data: platforms, isLoading: isLoadingPlatforms } = usePlatforms();
  const { data: tenants, isLoading: isLoadingTenants } = useTenants(vendorPlatform);

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) ? prev.filter(id => id !== platformId) : [...prev, platformId]
    );
  };

  const handleAddInvestorPlatform = () => {
    setInvestorPlatforms([...investorPlatforms, { platformId: '', stake: 0 }]);
  };

  const handleRemoveInvestorPlatform = (index: number) => {
    setInvestorPlatforms(investorPlatforms.filter((_, i) => i !== index));
  };

  const handleInvestorPlatformChange = (index: number, platformId: string) => {
    const newPlatforms = [...investorPlatforms];
    newPlatforms[index].platformId = platformId;
    setInvestorPlatforms(newPlatforms);
  };

  const handleInvestorStakeChange = (index: number, stake: number) => {
    const newPlatforms = [...investorPlatforms];
    newPlatforms[index].stake = stake;
    setInvestorPlatforms(newPlatforms);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast({ title: 'Error', description: 'Debes seleccionar un rol.', variant: 'destructive' });
      return;
    }

    let assignments: any;
    if (role === 'app_super_admin') {
      assignments = selectedPlatforms;
    } else if (role === 'investor') {
      assignments = investorPlatforms;
    } else if (role === 'vendor') {
      assignments = { tenantId: vendorTenant };
    }

    const payload: CreateUserPayload = { email, password, fullName, role, assignments };

    createUserMutation.mutate(payload, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: 'Usuario creado correctamente.' });
        navigate('/access-management');
      },
      onError: (error) => {
        toast({ title: 'Error', description: `No se pudo crear el usuario: ${error.message}`, variant: 'destructive' });
      }
    });
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Crear Nuevo Usuario</h1>
        <p className="text-muted-foreground">Completa el formulario para crear un nuevo usuario.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rol</Label>
              <Select onValueChange={setRole} value={role}>
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
            </div>

            {role === 'app_super_admin' && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Plataformas para App Super Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedPlatforms.length > 0
                          ? `${selectedPlatforms.length} plataforma(s) seleccionada(s)`
                          : "Selecciona plataformas..."}
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
                              onSelect={() => handlePlatformSelect(platform.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedPlatforms.includes(platform.id) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {platform.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>
            )}

            {role === 'investor' && (
              <Card className="mt-4">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Plataformas para Inversores</CardTitle>
                  <Button type="button" size="sm" onClick={handleAddInvestorPlatform}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir Plataforma
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {investorPlatforms.map((p, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Select onValueChange={(value) => handleInvestorPlatformChange(index, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms?.map(platform => (
                            <SelectItem key={platform.id} value={platform.id}>{platform.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="% de inversión"
                        value={p.stake}
                        onChange={(e) => handleInvestorStakeChange(index, parseFloat(e.target.value))}
                        className="w-48"
                      />
                      <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveInvestorPlatform(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {role === 'vendor' && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Tenant para Vendedor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="grid gap-2">
                      <Label>Plataforma</Label>
                      <Select onValueChange={setVendorPlatform} value={vendorPlatform}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms?.map(platform => (
                            <SelectItem key={platform.id} value={platform.id}>{platform.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {vendorPlatform && (
                       <div className="grid gap-2">
                          <Label>Tenant</Label>
                          <Select onValueChange={setVendorTenant} value={vendorTenant} disabled={isLoadingTenants}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tenant" />
                            </Trigger>
                            <SelectContent>
                              {tenants?.map(tenant => (
                                <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                    )}
                </CardContent>
              </Card>
            )}

            <Button type="submit" className="w-full">Crear Usuario</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
