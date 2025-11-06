import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useScreenSize } from '@/hooks/useScreenSize';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AssetPurpose, useAssetPurposes, useCreateAssetPurpose, useUpdateAssetPurpose, useDeleteAssetPurpose } from '@/hooks/useAssetPurposes';
import { supabase } from '@/lib/supabaseClient'; // Assuming this path for Supabase client

// --- Zod Schema for Validation ---
const formSchema = z.object({
  purpose_key: z.string().min(1, { message: "La clave del propósito es requerida." }),
  description: z.string().nullable(),
});


// --- AssetPurposeDialog Component ---
interface AssetPurposeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  purpose?: AssetPurpose;
  onSuccess: () => void;
}

function AssetPurposeDialog({ isOpen, onClose, purpose, onSuccess }: AssetPurposeDialogProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose_key: purpose?.purpose_key || '',
      description: purpose?.description || '',
    },
  });

  const createMutation = useCreateAssetPurpose();
  const updateMutation = useUpdateAssetPurpose();

  useEffect(() => {
    if (isOpen) {
      reset({
        purpose_key: purpose?.purpose_key || '',
        description: purpose?.description || '',
      });
    }
  }, [isOpen, purpose, reset]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let result;
    if (purpose) {
      result = await updateMutation.mutate({ ...purpose, ...values });
    } else {
      result = await createMutation.mutate(values);
    }

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      // Handle error, e.g., show a toast
      console.error('Operation failed:', result.error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{purpose ? 'Editar Propósito de Asset' : 'Añadir Nuevo Propósito de Asset'}</DialogTitle>
          <DialogDescription>
            {purpose ? 'Edita los detalles del propósito del asset.' : 'Introduce los detalles para un nuevo propósito de asset.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="purpose_key">Clave del Propósito</Label>
            <Input id="purpose_key" {...register('purpose_key')} disabled={!!purpose} />
            {errors.purpose_key && <p className="text-red-500 text-sm">{errors.purpose_key.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...register('description')} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}>
              {isSubmitting || createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


// --- Main AssetPurposesSettings Component ---
export function AssetPurposesSettings() {
  const { data: purposes, isLoading, error, refetch } = useAssetPurposes();
  const deleteMutation = useDeleteAssetPurpose();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState<AssetPurpose | undefined>(undefined);
  const screenSize = useScreenSize();

  const handleEdit = (purpose: AssetPurpose) => {
    setSelectedPurpose(purpose);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este propósito de asset?')) {
      const result = await deleteMutation.mutate(id);
      if (result.success) {
        refetch();
      } else {
        console.error('Failed to delete purpose:', result.error);
      }
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Cargando propósitos de assets...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  const renderPurposeCard = (purpose: AssetPurpose) => (
    <Card key={purpose.id}>
      <CardHeader>
        <CardTitle>{purpose.purpose_key}</CardTitle>
        <CardDescription>{purpose.description || 'Sin descripción'}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => handleEdit(purpose)}>
          Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={() => handleDelete(purpose.id)}>
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );

  const renderPurposeRow = (purpose: AssetPurpose) => (
    <TableRow key={purpose.id}>
      <TableCell className="font-medium">{purpose.purpose_key}</TableCell>
      <TableCell>{purpose.description || 'Sin descripción'}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" onClick={() => handleEdit(purpose)}>
          Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={() => handleDelete(purpose.id)}>
          Eliminar
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Gestión de Propósitos de Assets</CardTitle>
            <CardDescription>Define y gestiona los propósitos genéricos para los assets de los planes.</CardDescription>
          </div>
          <Button onClick={() => { setSelectedPurpose(undefined); setIsDialogOpen(true); }}>
            Añadir Propósito
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {screenSize === 'mobile' ? (
          <div className="space-y-4">
            {purposes.map(renderPurposeCard)}
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Clave del Propósito</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purposes.map(renderPurposeRow)}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {isDialogOpen && (
        <AssetPurposeDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          purpose={selectedPurpose}
          onSuccess={() => refetch()}
        />
      )}
    </Card>
  );
}
