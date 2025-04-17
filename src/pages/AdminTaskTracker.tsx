
import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { TaskBank } from '@/components/admin/tasks/TaskBank';
import { TaskHeader } from '@/components/admin/tasks/TaskHeader';

export default function AdminTaskTracker() {
  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <TaskHeader />
        <TaskBank />
      </div>
    </AdminLayout>
  );
}
