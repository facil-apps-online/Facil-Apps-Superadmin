import React, { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import {
  INVITATION_STATUSES,
  InvitationStatus,
  VendorInvitation,
  useVendorInvitations,
  useUpdateVendorInvitationStatus,
  useDeleteVendorInvitation,
} from '@/hooks/useVendorInvitations';
import { useToast } from '@/hooks/use-toast';
import { CreateProspectDialog } from './CreateProspectDialog';
import { CreateInvitationDialog } from './CreateInvitationDialog';
import { ProspectVisitsDialog } from './ProspectVisitsDialog';
import { Trash2, ArrowRightCircle, Clock, Copy } from 'lucide-react';

const isOverdue = (isoDate: string) => new Date(isoDate) < new Date(new Date().toDateString());

const STATUS_BADGE_VARIANT: Record<string, 'outline' | 'secondary' | 'destructive'> = {
  convertido: 'outline',
  activo: 'outline',
  activo_con_plan: 'outline',
  cuenta_creada: 'outline',
  no_interesado: 'destructive',
  perdido: 'destructive',
  duplicado: 'destructive',
};

function ProspectRow({ prospect }: { prospect: VendorProspect }) {
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
          toast({ title: 'Invitación enviada', description: 'Link copiado al portapapeles.' });
        },
        onError: (error) => toast({ title: 'Error', description: error.message, variant: 'destructive' }),
      }
    );
  };

  const statusLabel = PROSPECT_STATUSES.find((s) => s.id === prospect.status)?.label || prospect.status;

  return (
    <TableRow>
      <TableCell>
        <p className="font-medium">{prospect.first_name} {prospect.last_name}</p>
        {prospect.company_name && <p className="text-xs text-muted-foreground">{prospect.company_name}</p>}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {prospect.email}{prospect.email && prospect.phone && ' · '}{prospect.phone}
      </TableCell>
      <TableCell><Badge variant="outline">{prospect.platform_name}</Badge></TableCell>
      <TableCell>
        {prospect.next_visit_at ? (
          <Badge variant={isOverdue(prospect.next_visit_at) ? 'destructive' : 'secondary'} className="gap-1">
            <Clock className="h-3 w-3" />
            {new Date(prospect.next_visit_at).toLocaleDateString('es-CO')}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={STATUS_BADGE_VARIANT[prospect.status] || 'secondary'}>{statusLabel}</Badge>
      </TableCell>
      <TableCell className="text-right space-x-1 whitespace-nowrap">
        <ProspectVisitsDialog prospect={prospect} />
        <CreateProspectDialog prospect={prospect} />
        <Button size="sm" variant="ghost" onClick={handleConvert} disabled={convertMutation.isPending}>
          <ArrowRightCircle className="mr-1 h-3.5 w-3.5" /> Invitar
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setConfirmDelete(true)}>
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </TableCell>

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
    </TableRow>
  );
}

function InvitationRow({ invitation }: { invitation: VendorInvitation }) {
  const { toast } = useToast();
  const updateStatus = useUpdateVendorInvitationStatus();
  const deleteMutation = useDeleteVendorInvitation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(invitation.invite_url);
    toast({ title: 'Copiado', description: 'Link copiado al portapapeles.' });
  };

  return (
    <TableRow>
      <TableCell>
        <p className="font-medium">{invitation.prospect_first_name} {invitation.prospect_last_name}</p>
        {invitation.company_name && <p className="text-xs text-muted-foreground">{invitation.company_name}</p>}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {invitation.prospect_email}{invitation.prospect_email && invitation.prospect_phone && ' · '}{invitation.prospect_phone}
      </TableCell>
      <TableCell><Badge variant="outline">{invitation.platform_name}</Badge></TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {invitation.trial_days_override ? `Trial: ${invitation.trial_days_override}d` : '—'}
      </TableCell>
      <TableCell>
        <Select
          value={invitation.status}
          onValueChange={(status) => updateStatus.mutate({ invitationId: invitation.id, status: status as InvitationStatus })}
        >
          <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {INVITATION_STATUSES.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-right space-x-1 whitespace-nowrap">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopy}>
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setConfirmDelete(true)}>
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </TableCell>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar invitación?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutate(invitation.id)}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TableRow>
  );
}

export default function ProspectsPage() {
  const { currentAssignment } = useAuth();
  const role = currentAssignment?.role;
  const isAdmin = role === 'super_admin' || role === 'app_super_admin' || role === 'comercial_admin';

  const [platformId, setPlatformId] = useState<string>('all');
  const [vendorUserId, setVendorUserId] = useState<string>('all');
  const [q, setQ] = useState('');
  const [dueOnly, setDueOnly] = useState(false);

  const { data: allPlatforms } = usePlatforms();
  const platforms = useMemo(() => (allPlatforms || []).filter((p) => p.status === 'production'), [allPlatforms]);
  const { data: assignments } = usePlatformLevelAssignments(isAdmin);

  const vendors = useMemo(() => {
    if (!isAdmin || !assignments) return [];
    return assignments.filter((a) => (a.platform_roles?.vendor?.length || 0) > 0);
  }, [assignments, isAdmin]);

  const scopedVendorUserId = isAdmin && vendorUserId !== 'all' ? vendorUserId : undefined;
  const commonFilters = {
    platformId: platformId === 'all' ? undefined : platformId,
    vendorUserId: scopedVendorUserId,
    q: q || undefined,
  };

  const { data: prospects, isLoading: loadingProspects } = useVendorProspects({ ...commonFilters, dueOnly: dueOnly || undefined });
  const { data: invitations, isLoading: loadingInvitations } = useVendorInvitations(commonFilters, !dueOnly);

  const openProspects = useMemo(() => (prospects || []).filter((p) => p.status !== 'convertido'), [prospects]);
  const isLoading = loadingProspects || loadingInvitations;
  const isEmpty = openProspects.length === 0 && (invitations || []).length === 0;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{isAdmin ? 'CRM Comercial — Prospectos' : 'Mis Prospectos'}</h1>
          <p className="text-muted-foreground">Desde captar el contacto hasta enviarle la invitación a la plataforma.</p>
        </div>
        <div className="flex gap-2">
          <CreateProspectDialog vendorUserId={scopedVendorUserId} />
          <CreateInvitationDialog vendorUserId={scopedVendorUserId} />
        </div>
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
        <div className="flex items-center gap-2 ml-auto">
          <Switch id="due-only" checked={dueOnly} onCheckedChange={setDueOnly} />
          <Label htmlFor="due-only" className="text-sm cursor-pointer">Solo pendientes de hoy</Label>
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground">Cargando...</p>}

      <div className="w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Plataforma</TableHead>
              <TableHead>Próx. visita / Trial</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {openProspects.map((p) => (
              <ProspectRow key={`prospect-${p.id}`} prospect={p} />
            ))}
            {!dueOnly && (invitations || []).map((inv) => (
              <InvitationRow key={`invitation-${inv.id}`} invitation={inv} />
            ))}
            {isEmpty && !isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  {dueOnly ? 'No hay visitas pendientes para hoy. 🎉' : 'Aún no hay prospectos ni invitaciones.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
