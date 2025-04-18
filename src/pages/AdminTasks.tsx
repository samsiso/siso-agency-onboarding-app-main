
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskHeader } from '@/components/admin/tasks/TaskHeader';
import { TeamMemberTasksView } from '@/components/admin/tasks/TeamMemberTasksView';
import { TaskList } from '@/components/admin/tasks/TaskList';
import { TaskAnalytics } from '@/components/admin/tasks/TaskAnalytics';
import { TaskBank } from '@/components/admin/tasks/TaskBank';

export default function AdminTasks() {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <TaskHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team-tasks">Team Tasks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="task-bank">Task Bank</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team-tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Member Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <TeamMemberTasksView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <TaskAnalytics />
          </TabsContent>

          <TabsContent value="task-bank" className="space-y-6">
            <TaskBank />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
