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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-6 py-12">
          {/* Enhanced Page Header */}
          <div className="mb-12">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
              <AdminPageTitle
                icon={FileStack}
                title="Plan Templates"
                subtitle="Bulk-create or manage your plan templates for efficient client onboarding"
              />
              <div className="mt-6 flex items-center space-x-6 text-sm">
                <div className="flex items-center text-slate-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span>Bulk Creation Tools</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span>Shareable Plans Management</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="space-y-12">
            <BulkPlanCreation />
            <ShareablePlansSection />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

