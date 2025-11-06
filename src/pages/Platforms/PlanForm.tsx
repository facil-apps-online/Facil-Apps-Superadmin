import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { usePlanPricing } from '@/hooks/usePlanPricing';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DatePickerWrapper } from '@/components/ui/DatePicker';
import { useCurrencies } from '@/hooks/useCurrencies';
import { useAssetPurposes, AssetPurpose } from '@/hooks/useAssetPurposes'; // NEW IMPORT


// --- Type Definitions ---

interface PlanAsset {
  id: string;
  name: string;
  description: string | null;
  data_type: 'boolean' | 'numeric';
  asset_purpose_id?: string; // NEW FIELD
  asset_purpose_key?: string; // NEW FIELD
}

interface Country {
  id: string;
  name: string;
}

interface PlanDetails {
  id: string;
  name: string;
  description: string;
}

interface Bonus {
  id?: string;
  bonus_asset_id: string;
  quantity: number;
}

interface AssetLimit {
  id?: string;
  asset_id: string;
  value: string;
  extra_unit_price: number;
  overage_unit_price: number;
  bonuses?: Bonus[];
}

interface CountryConfiguration {
  id: string | null;
  plan_id: string;
  country_id: string;
  features: string[];
  asset_limits: AssetLimit[];
}

// --- Zod Schemas ---
const newPriceSchema = z.object({
  base_price: z.coerce.number().positive("El precio debe ser mayor a cero."),
  effective_date: z.date({ required_error: "Debe seleccionar una fecha." }),
});


// --- Sub-Components ---

const PriceHistoryCard = ({ planId }: { planId: string }) => {
  const { tariffs, isLoadingTariffs } = usePlanPricing(planId);

  const getStatus = (date: string, index: number) => {
    const effectiveDate = new Date(date);
    const now = new Date();
    if (effectiveDate > now) return <Badge variant="warning">Programado</Badge>;
    // The first tariff in the list returned by the query (ordered by effective_date desc) is the current one
    if (index === 0) return <Badge variant="success">Vigente</Badge>;
    return <Badge variant="secondary">Archivado</Badge>;
  };

  if (isLoadingTariffs) return <Card><CardHeader><CardTitle>Historial de Precios</CardTitle></CardHeader><CardContent>Cargando historial...</CardContent></Card>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Precios Base (COP)</CardTitle>
        <CardDescription>Muestra los precios base programados, vigentes y archivados para este plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha de Vigencia</TableHead>
              <TableHead>Precio Base</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tariffs && tariffs.length > 0 ? (
              tariffs.map((tariff, index) => (
                <TableRow key={tariff.id}>
                  <TableCell>{format(new Date(tariff.effective_date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(tariff.base_price)}</TableCell>
                  <TableCell>{getStatus(tariff.effective_date, index)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No hay historial de precios para este plan.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const ScheduleNewPriceCard = ({ planId, configurations, selectedCountryId }: { planId: string, configurations: Record<string, CountryConfiguration>, selectedCountryId: string }) => {
  const { toast } = useToast();
  const { scheduleNewTariff, isScheduling } = usePlanPricing(planId);
  const { data: currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  
  const form = useForm<z.infer<typeof newPriceSchema>>({
    resolver: zodResolver(newPriceSchema),
    defaultValues: { base_price: 0, effective_date: new Date() },
  });

  const onAddNewPrice = (values: z.infer<typeof newPriceSchema>) => {
    if (!selectedCountryId) {
      toast({ title: 'Error', description: 'Por favor, selecciona un país antes de programar un precio.', variant: 'destructive' });
      return;
    }

    const copCurrency = currencies?.find(c => c.code === 'COP');
    if (!copCurrency) {
      toast({ title: 'Error de configuración', description: 'No se encontró la moneda COP en el sistema. Contacte a soporte.', variant: 'destructive' });
      return;
    }

    // NOTE: We use the asset limits from the currently selected country as the template for the new tariff.
    const currentAssetLimits = configurations[selectedCountryId]?.asset_limits || [];
    const assetPricesData = currentAssetLimits.map(limit => ({
      asset_id: limit.asset_id,
      extra_unit_price: limit.extra_unit_price || 0,
      overage_unit_price: limit.overage_unit_price || 0,
    }));

    const tariffData = {
      subscription_plan_id: planId,
      base_price: values.base_price,
      effective_date: format(values.effective_date, 'yyyy-MM-dd'),
      currency_id: copCurrency.id, // Use dynamic ID
    };

    scheduleNewTariff({ tariffData, assetPricesData }, {
      onSuccess: () => {
        toast({ title: 'Éxito', description: 'Nuevo precio programado correctamente.' });
        form.reset();
      },
      onError: (err) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Programar Nuevo Precio Base</CardTitle>
        <CardDescription>Define un nuevo precio base en COP y la fecha en que se hará efectivo. Los límites de activos se copiarán de la configuración del país seleccionado actualmente.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAddNewPrice)} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <FormField control={form.control} name="base_price" render={({ field }) => (
              <FormItem><FormLabel>Nuevo Precio Base (COP)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="effective_date" render={({ field }) => (
              <FormItem className="flex flex-col"><FormLabel>Fecha de Vigencia</FormLabel><FormControl><DatePickerWrapper selected={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="self-end" disabled={isScheduling || isLoadingCurrencies}><PlusCircle className="mr-2 h-4 w-4" /> Programar</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


export default function PlanForm() {
  const { platformId, planId } = useParams<{ platformId: string; planId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!planId;

  // --- State Management ---
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<PlanDetails | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [availableAssets, setAvailableAssets] = useState<PlanAsset[]>([]);
  const [configurations, setConfigurations] = useState<Record<string, CountryConfiguration>>({});
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [bonusDialogState, setBonusDialogState] = useState({ isOpen: false, sourceAssetId: '' });
  const [currentBonus, setCurrentBonus] = useState<{ bonus_asset_id: string; quantity: number } | null>(null);

  const { data: assetPurposes, isLoading: isLoadingAssetPurposes } = useAssetPurposes(); // NEW HOOK CALL

  useEffect(() => {
    const fetchData = async () => {
      if (!planId || !platformId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [{ data: planDetails, error: planError }, { data: assets, error: assetsError }] = await Promise.all([
          supabase.functions.invoke('superadmin-actions', { body: { action: 'get_plan_details', payload: { planId } } }),
          supabase.functions.invoke('superadmin-actions', { body: { action: 'get_plan_assets_by_platform', payload: { platformId } } })
        ]);

        if (planError) throw planError;
        if (assetsError) throw assetsError;

        setPlan(planDetails.plan);
        const allCountries = planDetails.countries || [];
        setCountries(allCountries);
        setAvailableAssets(assets || []);

        const backendConfigs = planDetails.configurations || {};
        const newConfigs: Record<string, CountryConfiguration> = {};

        allCountries.forEach((country: Country) => {
          const countryId = country.id;
          const existingConfig = backendConfigs[countryId];
          let countryConfig;

          if (existingConfig && existingConfig.id) {
            countryConfig = JSON.parse(JSON.stringify(existingConfig)); // Deep copy
          } else {
            countryConfig = {
              id: null,
              plan_id: planId,
              country_id: countryId,
              features: [],
              asset_limits: []
            };
          }

          const existingLimits = countryConfig.asset_limits || [];
          const existingAssetIds = new Set(existingLimits.map((l: AssetLimit) => l.asset_id));
          const missingAssets = (assets || []).filter((asset: PlanAsset) => !existingAssetIds.has(asset.id));

          countryConfig.asset_limits = [
            ...existingLimits,
            ...missingAssets.map((asset: PlanAsset) => ({
              asset_id: asset.id,
              value: asset.data_type === 'boolean' ? 'false' : '0',
              extra_unit_price: 0,
              overage_unit_price: 0,
              bonuses: [],
            }))
          ];
          
          newConfigs[countryId] = countryConfig;
        });

        setConfigurations(newConfigs);

        if (allCountries.length > 0) {
          setSelectedCountryId(allCountries[0].id);
        }

      } catch (err: any) {
        toast({ title: "Error al cargar datos", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [planId, platformId, toast]);

  const handlePlanDetailsChange = (field: keyof PlanDetails, value: any) => {
    if (plan) {
      setPlan(prev => ({ ...prev!, [field]: value }));
    }
  };

  const handleCountryConfigChange = (countryId: string, field: keyof CountryConfiguration, value: any) => {
    setConfigurations(prev => ({
      ...prev,
      [countryId]: { ...prev[countryId], [field]: value },
    }));
  };

  const handleFeatureChange = (countryId: string, featureIndex: number, value: string) => {
    const newFeatures = [...configurations[countryId].features];
    newFeatures[featureIndex] = value;
    handleCountryConfigChange(countryId, 'features', newFeatures);
  };

  const addFeature = (countryId: string) => {
    const newFeatures = [...configurations[countryId].features, ''];
    handleCountryConfigChange(countryId, 'features', newFeatures);
  };

  const removeFeature = (countryId: string, featureIndex: number) => {
    const newFeatures = configurations[countryId].features.filter((_, i) => i !== featureIndex);
    handleCountryConfigChange(countryId, 'features', newFeatures);
  };

  const handleAssetLimitChange = (countryId: string, assetId: string, field: keyof AssetLimit, value: any) => {
    const newLimits = configurations[countryId].asset_limits.map(limit => {
      if (limit.asset_id === assetId) {
        return { ...limit, [field]: value };
      }
      return limit;
    });
    handleCountryConfigChange(countryId, 'asset_limits', newLimits);
  };

  const openBonusDialog = (sourceAssetId: string) => {
    setCurrentBonus({ bonus_asset_id: '', quantity: 1 });
    setBonusDialogState({ isOpen: true, sourceAssetId });
  };

  const handleSaveBonus = () => {
    if (!currentBonus || !currentBonus.bonus_asset_id || !bonusDialogState.sourceAssetId || !selectedCountryId) return;

    const newLimits = configurations[selectedCountryId].asset_limits.map(limit => {
      if (limit.asset_id === bonusDialogState.sourceAssetId) {
        const newBonuses = [...(limit.bonuses || []), currentBonus];
        return { ...limit, bonuses: newBonuses };
      }
      return limit;
    });

    handleCountryConfigChange(selectedCountryId, 'asset_limits', newLimits);
    setBonusDialogState({ isOpen: false, sourceAssetId: '' });
    setCurrentBonus(null);
  };

  const handleRemoveBonus = (sourceAssetId: string, bonusIndex: number) => {
    const newLimits = configurations[selectedCountryId].asset_limits.map(limit => {
      if (limit.asset_id === sourceAssetId) {
        const newBonuses = limit.bonuses?.filter((_, i) => i !== bonusIndex);
        return { ...limit, bonuses: newBonuses };
      }
      return limit;
    });
    handleCountryConfigChange(selectedCountryId, 'asset_limits', newLimits);
  };

  const onSubmit = async () => {
    if (!planId || !plan) return;
    setLoading(true);
    try {
      await supabase.functions.invoke('superadmin-actions', { body: { action: 'update_subscription_plan', payload: { planId, planData: { name: plan.name, description: plan.description } } } });

      await supabase.functions.invoke('superadmin-actions', { body: { action: 'update_plan_details', payload: { planId, configurations } } });

      toast({ title: "Plan actualizado con éxito" });
      navigate(`/platforms/${platformId}/plans`);

    } catch (err: any) {
      toast({ title: "Error al guardar el plan", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!plan) return <div>No se encontró el plan.</div>;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/platforms/${platformId}/plans`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEditMode ? `Editar Plan: ${plan.name}` : 'Crear Nuevo Plan'}</h1>
          <p className="text-muted-foreground">Gestiona las configuraciones de este plan para cada país.</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Detalles Generales</CardTitle>
            <CardDescription>El nombre y la descripción son compartidos en todos los países.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Nombre del Plan</Label>
              <Input 
                id="plan-name"
                value={plan.name}
                onChange={(e) => handlePlanDetailsChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-description">Descripción</Label>
              <Textarea 
                id="plan-description"
                value={plan.description}
                onChange={(e) => handlePlanDetailsChange('description', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {isEditMode && <PriceHistoryCard planId={planId} />}
        
        {isEditMode && <ScheduleNewPriceCard planId={planId} configurations={configurations} selectedCountryId={selectedCountryId} />}

        <Card>
          <CardHeader>
            <CardTitle>Configuraciones por País</CardTitle>
            <CardDescription>Selecciona un país para ver y editar la configuración del plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select value={selectedCountryId} onValueChange={setSelectedCountryId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un país..." />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCountryId && configurations[selectedCountryId] && (
              <div className="space-y-6 pt-6">
                {/* Features Section */}
                <div className="p-4 border rounded-md">
                  <h4 className="font-semibold mb-4">Características (Features) para {countries.find(c => c.id === selectedCountryId)?.name}</h4>
                  <div className="space-y-2">
                    {configurations[selectedCountryId].features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input 
                          value={feature}
                          onChange={(e) => handleFeatureChange(selectedCountryId, index, e.target.value)}
                          placeholder="Ej: Soporte 24/7"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeFeature(selectedCountryId, index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => addFeature(selectedCountryId)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Añadir Característica
                  </Button>
                </div>

                {/* Asset Limits Section */}
                <div className="p-4 border rounded-md">
                  <h4 className="font-semibold mb-4">Límites de Activos para {countries.find(c => c.id === selectedCountryId)?.name}</h4>
                  <div className="space-y-4">
                    {configurations[selectedCountryId].asset_limits.map(limit => {
                      const asset = availableAssets.find(a => a.id === limit.asset_id);
                      if (!asset) return null;

                      return (
                        <div key={asset.id} className="p-3 border rounded-md bg-white space-y-4">
                          <div>
                            <p className="font-medium">{asset.name}</p>
                            {asset.description && <p className="text-sm text-muted-foreground mb-2">{asset.description}</p>}
                            {asset.data_type === 'boolean' ? (
                              <div className="flex items-center gap-2 pt-2">
                                <Checkbox 
                                  checked={limit.value === 'true'}
                                  onCheckedChange={(checked) => handleAssetLimitChange(selectedCountryId, asset.id, 'value', String(checked))}
                                />
                                <Label>Habilitado</Label>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                <div className="space-y-1">
                                  <Label>Límite Incluido</Label>
                                  <Input 
                                    type="number"
                                    value={limit.value}
                                    onChange={(e) => handleAssetLimitChange(selectedCountryId, asset.id, 'value', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label>Precio Unitario Extra</Label>
                                  <Input 
                                    type="number"
                                    step="0.01"
                                    value={limit.extra_unit_price}
                                    onChange={(e) => handleAssetLimitChange(selectedCountryId, asset.id, 'extra_unit_price', parseFloat(e.target.value) || 0)}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label>Precio Excedente</Label>
                                  <Input 
                                    type="number"
                                    step="0.0001"
                                    value={limit.overage_unit_price}
                                    onChange={(e) => handleAssetLimitChange(selectedCountryId, asset.id, 'overage_unit_price', parseFloat(e.target.value) || 0)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Bonus Management for Numeric Assets */}
                          {asset.data_type === 'numeric' && (
                            <div className="pt-4 space-y-2">
                              <h5 className="font-semibold text-sm">Bonificaciones por compra extra</h5>
                              {limit.bonuses && limit.bonuses.length > 0 ? (
                                <div className="space-y-2 pl-2 border-l-2">
                                  {limit.bonuses.map((bonus, index) => {
                                    const bonusAsset = availableAssets.find(a => a.id === bonus.bonus_asset_id);
                                    return (
                                      <div key={index} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded-md">
                                        <span>
                                          +<span className="font-bold">{bonus.quantity}</span> de <span className="font-bold">{bonusAsset?.name || 'Activo no encontrado'}</span>
                                        </span>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveBonus(asset.id, index)}>
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground pl-2">No hay bonificaciones configuradas.</p>
                              )}
                              <Button variant="outline" size="sm" className="mt-2" onClick={() => openBonusDialog(asset.id)}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Añadir Bonificación
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            <Dialog open={bonusDialogState.isOpen} onOpenChange={(isOpen) => setBonusDialogState({ ...bonusDialogState, isOpen })}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Añadir Bonificación</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Activo a Bonificar</Label>
                    <Select 
                      value={currentBonus?.bonus_asset_id}
                      onValueChange={(value) => setCurrentBonus(prev => prev ? { ...prev, bonus_asset_id: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un activo..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAssets
                          .filter(asset => asset.data_type === 'numeric' && asset.id !== bonusDialogState.sourceAssetId)
                          .map(asset => (
                            <SelectItem key={asset.id} value={asset.id}>
                              {asset.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cantidad a Otorgar</Label>
                    <Input 
                      type="number"
                      value={currentBonus?.quantity}
                      onChange={(e) => setCurrentBonus(prev => prev ? { ...prev, quantity: parseInt(e.target.value) || 1 } : null)}
                      min={1}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Cancelar</Button>
                  </DialogClose>
                  <Button onClick={handleSaveBonus}>Guardar Bonificación</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSubmit} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  );
}