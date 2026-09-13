import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { usePlatforms } from '@/hooks/usePlatforms';
import { usePlatformLevelAssignments } from '@/hooks/usePlatformLevelAssignments';
import {
  PROSPECT_STATUSES,
  VendorProspect,
  useVendorProspects,
  useDeleteVendorProspect,
  useConvertVendorProspectToInvitation,
} from '@/hooks/useVendorProspects';
import { useToast } from '@/hooks/use-toast';
import { CreateProspectDialog } from './CreateProspectDialog';
import { ProspectVisitsDialog } from './ProspectVisitsDialog';
import { Trash2, ArrowRightCircle } from 'lucide-react';

function ProspectCard({ prospect }: { prospect: VendorProspect }) {
  const { toast } = useToast();
  const deleteMutation = useDeleteVendorProspect();
  const convertMutation = useConvertVendorProspectToInvitation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleConvert = () => {
    convertMutation.mutate(
      { prospectId: prospect.id },
      {
        onSuccess: (invitation) => {
          navigator.clipboard.writeText(invitation.invite_url).catch(() => {});
          toast({ title: 'Convertido a invitación', description: 'Link copiado al portapapeles. Búscalo en Invitaciones.' });
        },
        onError: (error) => toast({ title: 'Error', description: error.message, variant: 'destructive' }),
      }
    );
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium truncate">{prospect.first_name} {prospect.last_name}</p>
            {prospect.company_name && <p className="text-xs text-muted-foreground truncate">{prospect.company_name}</p>}
          </div>
          <Badge variant="outline" className="shrink-0">{prospect.platform_name}</Badge>
        </div>
        {(prospect.email || prospect.phone) && (
          <p className="text-xs text-muted-foreground truncate">
            {prospect.email} {prospect.phone && `· ${prospect.phone}`}
          </p>
        )}
        {prospect.last_visit_at && (
          <p className="text-xs text-muted-foreground">Última visita: {new Date(prospect.last_visit_at).toLocaleDateString('es-CO')}</p>
        )}
        <div className="flex items-center gap-1">
          <ProspectVisitsDialog prospect={prospect} />
          <CreateProspectDialog prospect={prospect} />
          {prospect.status !== 'convertido' && (
            <Button size="sm" variant="ghost" onClick={handleConvert} disabled={convertMutation.isPending}>
              <ArrowRightCircle className="mr-1 h-3.5 w-3.5" /> Invitar
            </Button>
          )}
          <Button size="icon" variant="ghost" className="h-8 w-8 ml-auto" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar prospecto?</AlertDialogTitle>
            <AlertDialogDescription>Se perderá también su historial de visitas. No se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutate(prospect.id)}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default function ProspectsPage() {
  const { currentAssignment } = useAuth();
  const role = currentAssignment?.role;
  const isAdmin = role === 'super_admin' || role === 'app_super_admin' || role === 'comercial_admin';

  const [platformId, setPlatformId] = useState<string>('all');
  const [vendorUserId, setVendorUserId] = useState<string>('all');
  const [q, setQ] = useState('');

  const { data: platforms } = usePlatforms();
  const { data: assignments } = usePlatformLevelAssignments();

  const vendors = useMemo(() => {
    if (!isAdmin || !assignments) return [];
    return assignments.filter((a) => (a.platform_roles?.vendor?.length || 0) > 0);
  }, [assignments, isAdmin]);

  const { data: prospects, isLoading } = useVendorProspects({
    platformId: platformId === 'all' ? undefined : platformId,
    vendorUserId: isAdmin && vendorUserId !== 'all' ? vendorUserId : undefined,
    q: q || undefined,
  });

  const grouped = useMemo(() => {
    const map: Record<string, VendorProspect[]> = {};
    for (const s of PROSPECT_STATUSES) map[s.id] = [];
    for (const p of prospects || []) {
      (map[p.status] ||= []).push(p);
    }
    return map;
  }, [prospects]);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{isAdmin ? 'CRM Comercial — Prospectos' : 'Mis Prospectos'}</h1>
          <p className="text-muted-foreground">Seguimiento comercial antes de enviar una invitación.</p>
        </div>
        <CreateProspectDialog vendorUserId={isAdmin && vendorUserId !== 'all' ? vendorUserId : undefined} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="Buscar prospecto o empresa..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Select value={platformId} onValueChange={setPlatformId}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Plataforma" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las plataformas</SelectItem>
            {platforms?.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isAdmin && (
          <Select value={vendorUserId} onValueChange={setVendorUserId}>
            <SelectTrigger className="w-56"><SelectValue placeholder="Vendedor" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los vendedores</SelectItem>
              {vendors.map((v) => (
                <SelectItem key={v.user_id} value={v.user_id}>{v.full_name || v.email}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {isLoading && <p className="text-muted-foreground">Cargando prospectos...</p>}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PROSPECT_STATUSES.map((s) => (
          <div key={s.id} className="w-72 shrink-0">
            <Card>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  {s.label}
                  <Badge variant="secondary">{grouped[s.id]?.length || 0}</Badge>
                </CardTitle>
              </CardHeader>
            </Card>
            <div className="mt-2">
              {grouped[s.id]?.map((p) => (
                <ProspectCard key={p.id} prospect={p} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
