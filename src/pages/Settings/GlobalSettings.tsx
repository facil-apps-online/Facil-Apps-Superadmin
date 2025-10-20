import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralCompanySettings } from '@/components/settings/GeneralCompanySettings';
import { CountriesSettings } from '@/components/settings/CountriesSettings';
import { CurrenciesSettings } from '@/components/settings/CurrenciesSettings';
import { LanguagesSettings } from '@/components/settings/LanguagesSettings';
import { TimezonesSettings } from '@/components/settings/TimezonesSettings';

export default function GlobalSettings() {
  return (
    <div className="w-full py-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold px-4 md:px-0 text-primary">Configuración Global</h1>
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="countries">Países</TabsTrigger>
          <TabsTrigger value="currencies">Monedas</TabsTrigger>
          <TabsTrigger value="languages">Idiomas</TabsTrigger>
          <TabsTrigger value="timezones">Zonas Horarias</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralCompanySettings />
        </TabsContent>
        <TabsContent value="countries">
          <CountriesSettings />
        </TabsContent>
        <TabsContent value="currencies">
          <CurrenciesSettings />
        </TabsContent>
        <TabsContent value="languages">
          <LanguagesSettings />
        </TabsContent>
        <TabsContent value="timezones">
          <TimezonesSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}