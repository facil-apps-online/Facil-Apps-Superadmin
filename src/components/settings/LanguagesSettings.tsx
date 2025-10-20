import React, { useState, useMemo } from 'react';
import { useLanguages, useUpdateLanguage, Language } from '@/hooks/useLanguages';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { LanguageDialog } from './LanguageDialog';

export function LanguagesSettings() {
  const { data: languages, isLoading } = useLanguages();
  const updateMutation = useUpdateLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | undefined>(undefined);

  const sortedLanguages = useMemo(() => {
    if (!languages) return [];
    return [...languages].sort((a, b) => a.name.localeCompare(b.name));
  }, [languages]);

  const handleEdit = (language: Language) => {
    setSelectedLanguage(language);
    setIsDialogOpen(true);
  };

  const handleStatusChange = (language: Language, newStatus: boolean) => {
    updateMutation.mutate({ id: language.id, is_active: newStatus });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Idiomas</CardTitle>
            <CardDescription>Gestiona los idiomas disponibles en el sistema.</CardDescription>
          </div>
          <Button onClick={() => { setSelectedLanguage(undefined); setIsDialogOpen(true); }}>
            Agregar Idioma
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLanguages.map((language) => (
                  <TableRow key={language.id}>
                    <TableCell>{language.name}</TableCell>
                    <TableCell>{language.iso_code}</TableCell>
                    <TableCell>
                      <Switch
                        checked={language.is_active}
                        onCheckedChange={(newStatus) => handleStatusChange(language, newStatus)}
                        disabled={updateMutation.isPending}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(language)}>
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {isDialogOpen && (
        <LanguageDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          language={selectedLanguage}
        />
      )}
    </Card>
  );
}
