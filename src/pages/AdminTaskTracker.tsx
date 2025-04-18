
import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { TaskBank } from '@/components/admin/tasks/TaskBank';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMemberSelector } from '@/components/admin/tasks/TeamMemberSelector';
import TaskAnalytics from '@/components/admin/tasks/TaskAnalytics';
import { useSearchParams } from 'react-router-dom';

export default function AdminTaskTracker() {
  const [searchParams] = useSearchParams();
  const teamMember = searchParams.get('member');

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Task Tracker</h1>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Select a team member to view their tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamMemberSelector />
          </CardContent>
        </Card>
        
        {teamMember ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Task List</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskBank userId={teamMember} />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskAnalytics teamMember={teamMember} />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskAnalytics />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskBank />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
