
import React from 'react';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BulkPlanCreation } from '@/components/admin/BulkPlanCreation';

export default function AdminTemplates() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Plan Templates</h1>
        <div className="space-y-6">
          <BulkPlanCreation />
        </div>
      </div>
    </MainLayout>
  );
}
