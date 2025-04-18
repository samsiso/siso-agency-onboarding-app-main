
import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { TeamTaskView } from '@/components/admin/teams/TeamTaskView';

export default function TeamMemberTasksPage() {
  const { memberId } = useParams();

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <TeamTaskView memberId={memberId} />
      </div>
    </AdminLayout>
  );
}
