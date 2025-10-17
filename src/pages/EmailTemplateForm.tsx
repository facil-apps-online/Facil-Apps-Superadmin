// src/pages/Platforms/EmailTemplateForm.tsx
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmailTemplate } from '@/hooks/useEmailTemplates';
import EmailEditor from 'react-email-editor'; // Importar Unlayer

// Zod Schema para la validación del formulario
const templateSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  template_type: z.string().min(3, 'El tipo de plantilla es requerido.'),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres.'),
  body_html: z.string(), // El HTML lo genera Unlayer, no necesitamos validar su longitud aquí
  language_id: z.string().uuid('Debe seleccionar un idioma.'),
  is_active: z.boolean(),
  is_customizable: z.boolean(),
  is_disableable: z.boolean(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface EmailTemplateFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  template?: EmailTemplate | null;
  onSubmit: (values: TemplateFormValues) => void;
  languages: { id: string; name: string }[];
}

const defaultFormValues = {
  name: '',
  template_type: '',
  subject: '',
  body_html: '',
  language_id: '',
  is_active: true,
  is_customizable: true,
  is_disableable: true,
};

const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({
  isOpen,
  onOpenChange,
  template,
  onSubmit,
  languages,
}) => {
  const emailEditorRef = useRef<EmailEditor>(null);
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (isOpen) {
      if (template) {
        form.reset(template);
      } else {
        form.reset(defaultFormValues);
      }
    }
  }, [isOpen, template, form.reset]);

  const onEditorLoad = () => {
    // Cargar el diseño de la plantilla en el editor si estamos editando
    if (template && template.body_html && emailEditorRef.current) {
      try {
        const designJson = JSON.parse(template.body_html);
        emailEditorRef.current.editor.loadDesign(designJson);
      } catch (e) {
        console.error("Could not parse body_html as JSON, it might be plain HTML.", e);
      }
    }
  };

  const handleFormSubmit = () => {
    emailEditorRef.current?.editor.exportHtml((data) => {
      const { design, html } = data;
      const currentValues = form.getValues();
      onSubmit({
        ...currentValues,
        body_html: JSON.stringify(design), // Guardamos el JSON del diseño para poder re-editarlo
      });
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{template ? 'Editar Plantilla' : 'Crear Nueva Plantilla'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow overflow-hidden">
          {/* Columna del Formulario */}
          <div className="md:col-span-1 p-4 border-r overflow-y-auto">
            <Form {...form}>
              <form className="space-y-4">
                <FormField name="name" render={({ field }) => ( <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField name="template_type" render={({ field }) => ( <FormItem><FormLabel>Tipo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField name="subject" render={({ field }) => ( <FormItem><FormLabel>Asunto</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField name="language_id" render={({ field }) => ( <FormItem><FormLabel>Idioma</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger></FormControl><SelectContent>{languages.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
                <div className="space-y-2 pt-4">
                  <FormField name="is_active" render={({ field }) => ( <FormItem className="flex items-center space-x-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Activa</FormLabel></FormItem> )} />
                  <FormField name="is_customizable" render={({ field }) => ( <FormItem className="flex items-center space-x-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Personalizable</FormLabel></FormItem> )} />
                  <FormField name="is_disableable" render={({ field }) => ( <FormItem className="flex items-center space-x-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Desactivable</FormLabel></FormItem> )} />
                </div>
              </form>
            </Form>
          </div>
          {/* Columna del Editor */}
          <div className="md:col-span-3 flex-grow h-full overflow-hidden">
            <EmailEditor ref={emailEditorRef} onLoad={onEditorLoad} minHeight="100%" />
          </div>
        </div>
        <DialogFooter className="mt-auto p-4 border-t">
          <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
          <Button onClick={handleFormSubmit}>Guardar Plantilla</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailTemplateForm;
