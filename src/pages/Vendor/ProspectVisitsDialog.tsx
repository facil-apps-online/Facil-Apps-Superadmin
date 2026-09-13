import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  PROSPECT_STATUSES,
  ProspectStatus,
  VendorProspect,
  useVendorProspectVisits,
  useLogVendorProspectVisit,
} from '@/hooks/useVendorProspects';
import { History } from 'lucide-react';

export function ProspectVisitsDialog({ prospect }: { prospect: VendorProspect }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ProspectStatus>(prospect.status);
  const [notes, setNotes] = useState('');

  const { data: visits, isLoading } = useVendorProspectVisits(open ? prospect.id : undefined);
  const logVisit = useLogVendorProspectVisit();

  const handleLog = () => {
    logVisit.mutate(
      { prospectId: prospect.id, status, notes: notes || undefined },
      {
        onSuccess: () => {
          toast({ title: 'Éxito', description: 'Visita registrada.' });
          setNotes('');
        },
        onError: (error) => toast({ title: 'Error', description: error.message, variant: 'destructive' }),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>
        <History className="mr-1 h-3.5 w-3.5" /> Visitas
      </Button>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{prospect.first_name} {prospect.last_name}</DialogTitle>
          <DialogDescription>{prospect.company_name || prospect.platform_name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 border rounded-md p-3">
          <p className="text-sm font-medium">Registrar nueva visita</p>
          <Select value={status} onValueChange={(v) => setStatus(v as ProspectStatus)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PROSPECT_STATUSES.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea placeholder="Notas de la visita..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          <Button size="sm" onClick={handleLog} disabled={logVisit.isPending} className="w-full">
            {logVisit.isPending ? 'Guardando...' : 'Registrar Visita'}
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          <p className="text-sm font-medium">Historial</p>
          {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}
          {visits?.length === 0 && <p className="text-sm text-muted-foreground">Sin visitas registradas.</p>}
          {visits?.map((v) => (
            <div key={v.id} className="flex flex-col gap-1 border rounded-md p-2 text-sm">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{PROSPECT_STATUSES.find((s) => s.id === v.status)?.label || v.status}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(v.visit_date).toLocaleString('es-CO')}</span>
              </div>
              {v.notes && <p className="text-muted-foreground">{v.notes}</p>}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
