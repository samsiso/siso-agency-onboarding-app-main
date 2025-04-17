
import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { DailyPlannerHeader } from '@/components/admin/daily-planner/DailyPlannerHeader';
import { DailyPlannerTabs } from '@/components/admin/daily-planner/DailyPlannerTabs';

export default function AdminDailyPlanner() {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <DailyPlannerHeader />
        <DailyPlannerTabs />
      </div>
    </AdminLayout>
  );
}
