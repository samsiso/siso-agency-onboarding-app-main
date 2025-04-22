
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useClientDetails } from '@/hooks/client';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { ClientDetailHeader } from '@/components/admin/clients/detail/ClientDetailHeader';
import { ClientDetailSkeleton } from '@/components/admin/clients/detail/ClientDetailSkeleton';
import { ClientDetailError } from '@/components/admin/clients/detail/ClientDetailError';
import { ClientDetailBreadcrumb } from '@/components/admin/clients/detail/ClientDetailBreadcrumb';
import { ClientDetailTabs } from '@/components/admin/clients/detail/ClientDetailTabs';
import { defaultChangelogData } from '@/data/changelogData';

export default function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { client, isLoading, error } = useClientDetails(clientId || null);
  
  // Use the default changelog data
  const changelogData = defaultChangelogData;

  // Show loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <ClientDetailSkeleton />
      </AdminLayout>
    );
  }

  // Show error state
  if (error || !client) {
    return (
      <AdminLayout>
        <ClientDetailError />
      </AdminLayout>
    );
  }

  // Show client details
  return (
    <AdminLayout>
      <div className="container mx-auto py-6 bg-black text-white min-h-screen">
        <ClientDetailBreadcrumb client={client} />
        <ClientDetailHeader client={client} />
        <ClientDetailTabs 
          client={client}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          changelogData={changelogData}
        />
      </div>
    </AdminLayout>
  );
}
