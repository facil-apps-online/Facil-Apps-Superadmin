
import React from 'react';
import { useTimezones } from '@/hooks/useTimezones';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export function TimezonesSettings() {
  const { data: timezones, isLoading } = useTimezones();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zonas Horarias</CardTitle>
        <CardDescription>Gestiona las zonas horarias disponibles en el sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button>Agregar Zona Horaria</Button>
        </div>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Offset</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timezones?.map((timezone) => (
                <TableRow key={timezone.id}>
                  <TableCell>{timezone.name}</TableCell>
                  <TableCell>{timezone.offset}</TableCell>
                  <TableCell>
                    {/* Acciones de edición y eliminación */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
