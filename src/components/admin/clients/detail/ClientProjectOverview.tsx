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
      <Card className="bg-gray-900/50 border-gray-700/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-100">Project Overview</CardTitle>
          <CardDescription className="text-gray-400">
            Summary of {client.project_name || 'the project'} for {client.full_name || client.business_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-200">Project Completion</h3>
              <div className="flex items-center gap-4 mb-2">
                <Progress value={completionPercentage} className="h-2" />
                <span className="text-sm font-medium text-gray-300">{completionPercentage}%</span>
              </div>
              
              <h3 className="text-lg font-medium mt-4 mb-2 text-gray-200">Project Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Timeline</span>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    projectStatus.timeline.status === 'on-track' ? 'bg-blue-900/60 text-blue-300 border border-blue-700/30' :
                    projectStatus.timeline.status === 'warning' ? 'bg-yellow-900/60 text-yellow-300 border border-yellow-700/30' :
                    projectStatus.timeline.status === 'success' ? 'bg-green-900/60 text-green-300 border border-green-700/30' :
                    'bg-gray-800/60 text-gray-300 border border-gray-700/30'
                  }`}>
                    {projectStatus.timeline.status}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Budget</span>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-900/60 text-yellow-300 border border-yellow-700/30">
                    {projectStatus.budget.status}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Team</span>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/60 text-green-300 border border-green-700/30">
                    {projectStatus.team.status}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Deliverables</span>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800/60 text-gray-300 border border-gray-700/30">
                    {projectStatus.deliverables.status}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-200">Project Vitals</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Start Date:</span>
                  <span className="text-sm text-gray-400">{projectVitals.startDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Estimated Completion:</span>
                  <span className="text-sm text-gray-400">{projectVitals.estimatedCompletionDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Project Value:</span>
                  <span className="text-sm text-gray-400">{projectVitals.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Payment Status:</span>
                  <span className="text-sm text-gray-400">{projectVitals.paymentStatus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Next Milestone:</span>
                  <span className="text-sm text-gray-400">{projectVitals.nextMilestone} ({projectVitals.nextMilestoneDate})</span>
                </div>
              </div>
            </div>
          </div>

          {projectStatus.budget.status === 'warning' && (
            <Alert className="mt-6 border-yellow-700/40 bg-yellow-900/20 text-yellow-300">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertTitle className="text-yellow-300">Budget Warning</AlertTitle>
              <AlertDescription className="text-yellow-400">
                {projectStatus.budget.description}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="description">
        <TabsList className="bg-gray-800/50 border-gray-700/30">
          <TabsTrigger value="description" className="data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100 text-gray-400">Description</TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100 text-gray-400">Notes</TabsTrigger>
          <TabsTrigger value="requirements" className="data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100 text-gray-400">Requirements</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="p-4 border border-gray-700/30 rounded-md mt-2 bg-gray-900/30">
          <p className="text-sm text-gray-400">
            {client.bio || 'No project description available. Add details about the project scope, objectives, and key deliverables here.'}
          </p>
        </TabsContent>
        <TabsContent value="notes" className="p-4 border border-gray-700/30 rounded-md mt-2 bg-gray-900/30">
          <p className="text-sm text-gray-400">
            Client prefers communication via email. Initial consultation suggested a focus on mobile-first design.
            Follow-up meeting scheduled for next week to review wireframes.
          </p>
        </TabsContent>
        <TabsContent value="requirements" className="p-4 border border-gray-700/30 rounded-md mt-2 bg-gray-900/30">
          <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
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
