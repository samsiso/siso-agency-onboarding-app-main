
import React from 'react';
import { Helmet } from 'react-helmet';
import { ClientDashboardLayout } from '@/components/client/ClientDashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, MoreHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function ClientProjectTasksPage() {
  const { projectId } = useParams<{ projectId: string }>();
  
  // In a real app, you would fetch project details from an API
  const projectName = projectId === 'ubahcrypt' ? 'UbahCrypt Project' : 
                     projectId === 'nftmarket' ? 'NFT Marketplace' : 
                     projectId === 'defiapp' ? 'DeFi Trading App' : 'Unknown Project';

  return (
    <ProtectedRoute>
      <Helmet>
        <title>{projectName} Tasks | SISO Agency</title>
      </Helmet>
      <ClientDashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{projectName} Tasks</h1>
            <div className="flex gap-2">
              <Button variant="outline" className="border-siso-border">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          {/* Search and Tabs */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-siso-text" />
              <Input placeholder="Search tasks..." className="pl-10 bg-black/20" />
            </div>
            
            <Tabs defaultValue="awaiting">
              <TabsList className="bg-black/30">
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="awaiting">Awaiting Action</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Tasks List */}
          <TabsContent value="awaiting" className="mt-0">
            <div className="space-y-4">
              <Card className="bg-black/30 border-siso-border">
                <CardContent className="p-0">
                  <div className="p-6 space-y-4">
                    {/* Task 1 */}
                    <div className="p-4 bg-black/20 rounded-lg border-l-4 border-siso-orange">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">Review UI Design Mockups</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Medium Priority</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mt-2 text-siso-text">
                        Please review the latest UI mockups for the trading interface and provide feedback.
                      </p>
                      <div className="flex justify-between mt-3">
                        <div className="flex items-center gap-2 text-xs text-siso-text">
                          <span className="bg-black/30 px-2 py-1 rounded">Due: April 10, 2025</span>
                          <span className="bg-siso-orange/20 text-siso-orange px-2 py-1 rounded">Action Required</span>
                        </div>
                        <div>
                          <Button size="sm">Review Now</Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Task 2 */}
                    <div className="p-4 bg-black/20 rounded-lg border-l-4 border-red-500">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">Approve Payment for Development Phase 1</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded">High Priority</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mt-2 text-siso-text">
                        Development Phase 1 is complete. Please review the milestone and approve payment to continue.
                      </p>
                      <div className="flex justify-between mt-3">
                        <div className="flex items-center gap-2 text-xs text-siso-text">
                          <span className="bg-black/30 px-2 py-1 rounded">Due: April 5, 2025</span>
                          <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded">Payment Pending</span>
                        </div>
                        <div>
                          <Button size="sm">Review & Pay</Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Task 3 */}
                    <div className="p-4 bg-black/20 rounded-lg border-l-4 border-siso-orange">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">Provide Content for About Page</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Medium Priority</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mt-2 text-siso-text">
                        We need your company information and team bios for the About page.
                      </p>
                      <div className="flex justify-between mt-3">
                        <div className="flex items-center gap-2 text-xs text-siso-text">
                          <span className="bg-black/30 px-2 py-1 rounded">Due: April 15, 2025</span>
                          <span className="bg-siso-orange/20 text-siso-orange px-2 py-1 rounded">Content Needed</span>
                        </div>
                        <div>
                          <Button size="sm">Submit Content</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </ClientDashboardLayout>
    </ProtectedRoute>
  );
}
