
import React from 'react';
import { ClientData } from '@/types/client.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarCheck, FileText, Clock, DollarSign, Users, AlertTriangle } from 'lucide-react';

interface ClientProjectOverviewProps {
  client: ClientData;
}

export function ClientProjectOverview({ client }: ClientProjectOverviewProps) {
  const completionPercentage = client.total_steps ? 
    Math.round((client.current_step / client.total_steps) * 100) : 0;

  // This would typically come from the database, hardcoding for the demonstration
  const projectStatus = {
    timeline: { status: 'on-track', description: 'Project is currently on schedule' },
    budget: { status: 'warning', description: 'Budget is 15% over projection' },
    team: { status: 'success', description: 'All team members assigned' },
    deliverables: { status: 'pending', description: '2 deliverables awaiting client approval' }
  };

  // Project vitals would also come from the database in a real implementation
  const projectVitals = {
    startDate: client.start_date ? new Date(client.start_date).toLocaleDateString() : 'Not started',
    estimatedCompletionDate: client.estimated_completion_date ? 
      new Date(client.estimated_completion_date).toLocaleDateString() : 'Not set',
    price: client.estimated_price ? `$${client.estimated_price.toLocaleString()}` : 'Not set',
    paymentStatus: client.payment_status || 'Not specified',
    nextMilestone: 'Wireframe Approval',
    nextMilestoneDate: '2023-06-15'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>
            Summary of {client.project_name || 'the project'} for {client.full_name || client.business_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Project Completion</h3>
              <div className="flex items-center gap-4 mb-2">
                <Progress value={completionPercentage} className="h-2" />
                <span className="text-sm font-medium">{completionPercentage}%</span>
              </div>
              
              <h3 className="text-lg font-medium mt-4 mb-2">Project Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Timeline</span>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    projectStatus.timeline.status === 'on-track' ? 'bg-blue-100 text-blue-800' :
                    projectStatus.timeline.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    projectStatus.timeline.status === 'success' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {projectStatus.timeline.status}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Budget</span>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {projectStatus.budget.status}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Team</span>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {projectStatus.team.status}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Deliverables</span>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {projectStatus.deliverables.status}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Project Vitals</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Start Date:</span>
                  <span className="text-sm">{projectVitals.startDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Estimated Completion:</span>
                  <span className="text-sm">{projectVitals.estimatedCompletionDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Project Value:</span>
                  <span className="text-sm">{projectVitals.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Payment Status:</span>
                  <span className="text-sm">{projectVitals.paymentStatus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Next Milestone:</span>
                  <span className="text-sm">{projectVitals.nextMilestone} ({projectVitals.nextMilestoneDate})</span>
                </div>
              </div>
            </div>
          </div>

          {projectStatus.budget.status === 'warning' && (
            <Alert className="mt-6 border-yellow-200 bg-yellow-50 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Budget Warning</AlertTitle>
              <AlertDescription>
                {projectStatus.budget.description}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="p-4 border rounded-md mt-2">
          <p className="text-sm text-muted-foreground">
            {client.bio || 'No project description available. Add details about the project scope, objectives, and key deliverables here.'}
          </p>
        </TabsContent>
        <TabsContent value="notes" className="p-4 border rounded-md mt-2">
          <p className="text-sm text-muted-foreground">
            Client prefers communication via email. Initial consultation suggested a focus on mobile-first design.
            Follow-up meeting scheduled for next week to review wireframes.
          </p>
        </TabsContent>
        <TabsContent value="requirements" className="p-4 border rounded-md mt-2">
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Responsive design for all devices</li>
            <li>Integration with payment gateway</li>
            <li>Custom CMS for content management</li>
            <li>SEO optimization</li>
            <li>Social media integration</li>
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
