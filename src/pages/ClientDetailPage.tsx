import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientDetails } from '@/hooks/client';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { ClientDetailHeader } from '@/components/admin/clients/detail/ClientDetailHeader';
import { ClientProjectOverview } from '@/components/admin/clients/detail/ClientProjectOverview';
import { ClientProjectTimeline } from '@/components/admin/clients/detail/ClientProjectTimeline';
import { ClientInteractionLog } from '@/components/admin/clients/detail/ClientInteractionLog';
import { ClientTasksList } from '@/components/admin/clients/detail/ClientTasksList';
import { ClientFinancialSummary } from '@/components/admin/clients/detail/ClientFinancialSummary';
import { ClientTeamAssignments } from '@/components/admin/clients/detail/ClientTeamAssignments';
import { ClientRelatedDocuments } from '@/components/admin/clients/detail/ClientRelatedDocuments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ClientDocuments } from '@/components/admin/clients/detail/ClientDocuments';

export default function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { client, isLoading, error } = useClientDetails(clientId || null);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/clients">Clients</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <Skeleton className="h-4 w-32" />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg text-muted-foreground">Loading client details...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !client) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/clients">Clients</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Client Not Found</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <h2 className="text-xl font-bold text-destructive mb-2">Client Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The client you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <button 
                onClick={() => navigate('/admin/clients')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Return to Clients List
              </button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/clients">Clients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{client.full_name || client.business_name || 'Client Details'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <ClientDetailHeader client={client} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
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
          
          <TabsContent value="team" className="space-y-4">
            <ClientTeamAssignments client={client} />
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <ClientDocuments client={client} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
