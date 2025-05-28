import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { BulkPlanCreation } from '@/components/admin/BulkPlanCreation';
import { ShareablePlansSection } from '@/components/admin/templates/ShareablePlansSection';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Loader2, FileStack } from 'lucide-react';
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle';

export default function AdminTemplates() {
  const { isAdmin, isLoading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-siso-orange" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <AdminPageTitle
          icon={FileStack}
          title="Plan Templates"
          subtitle="Bulk-create or manage your plan templates for efficient onboarding"
        />
        <div className="space-y-8">
          <BulkPlanCreation />
          <ShareablePlansSection />
        </div>
      </div>
    </AdminLayout>
  );
}

