
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientStatusBadge } from './ClientStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClientDetails } from '@/hooks/client/useClientDetails';
import { formatRelativeTime } from '@/lib/formatters';
import { Activity, AlignLeft, Clock, Edit2, Mail, Phone, User, Users } from 'lucide-react';

interface ClientDetailSheetProps {
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientDetailSheet({ 
  clientId, 
  isOpen, 
  onClose 
}: ClientDetailSheetProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { client, isLoading } = useClientDetails(clientId);

  // Reset active tab when client changes
  useEffect(() => {
    setActiveTab('overview');
  }, [clientId]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center justify-between">
            {isLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              <div className="flex flex-col">
                <div className="text-2xl font-bold">{client?.full_name || 'Client Details'}</div>
                <div className="text-sm text-muted-foreground">{client?.email || 'No email'}</div>
              </div>
            )}
            {!isLoading && client && (
              <div className="flex items-center gap-2">
                <ClientStatusBadge status={client.status} />
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4 mt-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : client ? (
          <>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Client Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Full Name</p>
                        <p className="text-sm">{client.full_name || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm">{client.email || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Company</p>
                        <p className="text-sm">{client.business_name || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm">{client.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Onboarding Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm">{Math.round((client.current_step / client.total_steps) * 100)}%</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Step {client.current_step} of {client.total_steps}</span>
                      </div>

                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500" 
                          style={{ width: `${(client.current_step / client.total_steps) * 100}%` }} 
                        />
                      </div>

                      <div className="space-y-2 mt-2">
                        {client.completed_steps && client.completed_steps.map((step, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                              <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <span className="text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <div className="w-0.5 h-full bg-purple-200"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Account Created</div>
                          <div className="text-xs text-muted-foreground">{formatRelativeTime(client.created_at)}</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <div className="w-0.5 h-full bg-purple-200"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Onboarding Started</div>
                          <div className="text-xs text-muted-foreground">{formatRelativeTime(client.created_at)}</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Last Updated</div>
                          <div className="text-xs text-muted-foreground">{formatRelativeTime(client.updated_at)}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <AlignLeft className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No projects found for this client.</p>
                      <Button variant="outline" className="mt-4">
                        Create New Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No recent activity recorded.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <AlignLeft className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No notes added for this client.</p>
                      <Button variant="outline" className="mt-4">
                        Add Note
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-center text-muted-foreground">Client not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
