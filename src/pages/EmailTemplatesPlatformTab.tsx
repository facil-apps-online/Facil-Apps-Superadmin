import React, { useState } from 'react';
import { 
  usePlatformEmailTemplates,
  useSuperadminCreateEmailTemplate, 
  useSuperadminUpdateEmailTemplate, 
  useDeleteEmailTemplate, 
  EmailTemplate 
} from '@/hooks/useEmailTemplates';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmailTemplateForm from './EmailTemplateForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Platform {
  id: string;
  owner_id: string;
  // ... otras propiedades de la plataforma
}

interface EmailTemplatesPlatformTabProps {
  platform: Platform;
}

const fetchLanguages = async () => {
  const { data, error } = await supabase.from('languages').select('id, name');
  if (error) throw new Error(error.message);
  return data;
};

const EmailTemplatesPlatformTab: React.FC<EmailTemplatesPlatformTabProps> = ({ platform }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  const { data: templates, isLoading, error } = usePlatformEmailTemplates(platform.id);
  const { data: languages, isLoading: isLoadingLanguages } = useQuery({ queryKey: ['languages'], queryFn: fetchLanguages });
  
  const createTemplate = useSuperadminCreateEmailTemplate();
  const updateTemplate = useSuperadminUpdateEmailTemplate();
  const deleteTemplate = useDeleteEmailTemplate();
  const { toast } = useToast();

  const handleCreate = () => {
    setSelectedTemplate(null);
    setIsFormOpen(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsFormOpen(true);
  };

  const handleDelete = (template: EmailTemplate) => {
    const payload = { templateId: template.id, platformId: platform.id };
    deleteTemplate.mutate(payload, {
      onSuccess: () => toast({ title: 'Éxito', description: 'Plantilla eliminada correctamente.' }),
      onError: (err) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
    });
  };

  const handleSubmit = (values: any) => {
    if (selectedTemplate) {
      const payload = {
        templateId: selectedTemplate.id,
        templateData: values,
      };
      updateTemplate.mutate(payload, {
        onSuccess: () => {
          toast({ title: 'Éxito', description: 'Plantilla actualizada correctamente.' });
          setIsFormOpen(false);
        },
        onError: (err) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
      });
    } else {
      const payload = {
        templateData: { ...values, platform_id: platform.id },
        ownerTenantId: platform.owner_id,
      };
      createTemplate.mutate(payload, {
        onSuccess: () => {
          toast({ title: 'Éxito', description: 'Plantilla creada correctamente.' });
          setIsFormOpen(false);
        },
        onError: (err) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
      });
    }
  };

  if (isLoading || isLoadingLanguages) return <div>Cargando...</div>;
  if (error) return <div className="text-red-500">Error al cargar las plantillas: {error.message}</div>;
  if (!platform) return <div>Seleccione una plataforma.</div>;

  return (
    <div>
      <div className="flex justify-end items-center mb-6">
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Plantilla
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Idioma</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Opciones</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates && templates.length > 0 ? (
              templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell><Badge variant="outline">{template.template_type}</Badge></TableCell>
                  <TableCell>{languages?.find(l => l.id === template.language_id)?.name || template.language_id}</TableCell>
                  <TableCell><Badge variant={template.is_active ? 'default' : 'secondary'}>{template.is_active ? 'Activa' : 'Inactiva'}</Badge></TableCell>
                  <TableCell className="space-x-2">
                    {template.is_customizable && <Badge variant="secondary">Personalizable</Badge>}
                    {template.is_disableable && <Badge variant="secondary">Desactivable</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la plantilla.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(template)}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No se encontraron plantillas.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EmailTemplateForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        template={selectedTemplate}
        onSubmit={handleSubmit}
        languages={languages || []}
      />
    </div>
  );
};

export default EmailTemplatesPlatformTab;
