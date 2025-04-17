
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMembersSection } from '@/components/admin/teams/TeamMembersSection';
import { TeamTasksSection } from '@/components/admin/teams/TeamTasksSection';
import { TeamMessagingSection } from '@/components/admin/teams/TeamMessagingSection';
import { TeamAnalyticsSection } from '@/components/admin/teams/TeamAnalyticsSection';
import { Button } from '@/components/ui/button';
import { Users, ListTodo, MessageCircle, BarChart3 } from 'lucide-react';

export default function AdminTeams() {
  const [activeTab, setActiveTab] = useState('members');

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Team Management</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center mb-6 overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="members" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Members</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-1">
                <ListTodo className="h-4 w-4" />
                <span>Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>Communication</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="members">
            <TeamMembersSection />
          </TabsContent>
          
          <TabsContent value="tasks">
            <TeamTasksSection />
          </TabsContent>
          
          <TabsContent value="communication">
            <TeamMessagingSection />
          </TabsContent>
          
          <TabsContent value="analytics">
            <TeamAnalyticsSection />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
