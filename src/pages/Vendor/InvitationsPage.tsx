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
  INVITATION_STATUSES,
  InvitationStatus,
  VendorInvitation,
  useVendorInvitations,
  useUpdateVendorInvitationStatus,
  useDeleteVendorInvitation,
} from '@/hooks/useVendorInvitations';
import { useToast } from '@/hooks/use-toast';
import { CreateInvitationDialog } from './CreateInvitationDialog';
import { Copy, Trash2 } from 'lucide-react';

function InvitationCard({ invitation }: { invitation: VendorInvitation }) {
  const { toast } = useToast();
  const updateStatus = useUpdateVendorInvitationStatus();
  const deleteMutation = useDeleteVendorInvitation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(invitation.invite_url);
    toast({ title: 'Copiado', description: 'Link copiado al portapapeles.' });
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium truncate">
              {invitation.prospect_first_name} {invitation.prospect_last_name}
            </p>
            {invitation.company_name && (
              <p className="text-xs text-muted-foreground truncate">{invitation.company_name}</p>
            )}
          </div>
          <Badge variant="outline" className="shrink-0">{invitation.platform_name}</Badge>
        </div>
        {(invitation.prospect_email || invitation.prospect_phone) && (
          <p className="text-xs text-muted-foreground truncate">
            {invitation.prospect_email} {invitation.prospect_phone && `· ${invitation.prospect_phone}`}
          </p>
        )}
        {invitation.trial_days_override && (
          <p className="text-xs">Trial: {invitation.trial_days_override} días</p>
        )}
        <div className="flex items-center gap-1">
          <Select
            value={invitation.status}
            onValueChange={(status) => updateStatus.mutate({ invitationId: invitation.id, status: status as InvitationStatus })}
          >
            <SelectTrigger className="h-8 text-xs flex-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {INVITATION_STATUSES.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCopy}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      </CardContent>

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
    </Card>
  );
}

export default function InvitationsPage() {
  const { currentAssignment } = useAuth();
  const role = currentAssignment?.role;
  const isAdmin = role === 'super_admin' || role === 'app_super_admin';

  const [platformId, setPlatformId] = useState<string>('all');
  const [vendorUserId, setVendorUserId] = useState<string>('all');
  const [q, setQ] = useState('');

  const { data: platforms } = usePlatforms();
  const { data: assignments } = usePlatformLevelAssignments();

  const vendors = useMemo(() => {
    if (!isAdmin || !assignments) return [];
    return assignments.filter((a) => (a.platform_roles?.vendor?.length || 0) > 0);
  }, [assignments, isAdmin]);

  const { data: invitations, isLoading } = useVendorInvitations({
    platformId: platformId === 'all' ? undefined : platformId,
    vendorUserId: isAdmin && vendorUserId !== 'all' ? vendorUserId : undefined,
    q: q || undefined,
  });

  const grouped = useMemo(() => {
    const map: Record<string, VendorInvitation[]> = {};
    for (const s of INVITATION_STATUSES) map[s.id] = [];
    for (const inv of invitations || []) {
      (map[inv.status] ||= []).push(inv);
    }
    return map;
  }, [invitations]);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{isAdmin ? 'CRM Comercial — Invitaciones' : 'Mis Invitaciones'}</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Pipeline de invitaciones de todo el equipo comercial.' : 'Gestiona tus invitaciones a prospectos.'}
          </p>
        </div>
        <CreateInvitationDialog vendorUserId={isAdmin && vendorUserId !== 'all' ? vendorUserId : undefined} />
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

      {isLoading && <p className="text-muted-foreground">Cargando invitaciones...</p>}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {INVITATION_STATUSES.map((s) => (
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
              {grouped[s.id]?.map((inv) => (
                <InvitationCard key={inv.id} invitation={inv} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
