
import React from 'react';
import { ClientData } from '@/types/client.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientProjectOverview } from '@/components/admin/clients/detail/ClientProjectOverview';
import { ClientProjectTimeline } from '@/components/admin/clients/detail/ClientProjectTimeline';
import { ClientInteractionLog } from '@/components/admin/clients/detail/ClientInteractionLog';
import { ClientTasksList } from '@/components/admin/clients/detail/ClientTasksList';
import { ClientFinancialSummary } from '@/components/admin/clients/detail/ClientFinancialSummary';
import { ClientDocuments } from '@/components/admin/clients/detail/ClientDocuments';
import { Timeline } from '@/components/ui/timeline';

interface ClientDetailTabsProps {
  client: ClientData;
  activeTab: string;
  setActiveTab: (value: string) => void;
  changelogData: any[];
}

export function ClientDetailTabs({ client, activeTab, setActiveTab, changelogData }: ClientDetailTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="interactions">Interactions</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="financials">Financials</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="changelog">Changelog</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <ClientProjectOverview client={client} />
      </TabsContent>
      
      <TabsContent value="timeline" className="space-y-4">
        <ClientProjectTimeline client={client} />
      </TabsContent>
      
      <TabsContent value="interactions" className="space-y-4">
        <ClientInteractionLog client={client} />
      </TabsContent>
      
      <TabsContent value="tasks" className="space-y-4">
        <ClientTasksList client={client} />
      </TabsContent>
      
      <TabsContent value="financials" className="space-y-4">
        <ClientFinancialSummary client={client} />
      </TabsContent>
      
      <TabsContent value="documents" className="space-y-4">
        <ClientDocuments client={client} />
      </TabsContent>

      <TabsContent value="changelog" className="space-y-4">
        <Timeline data={changelogData} />
      </TabsContent>
    </Tabs>
  );
}
