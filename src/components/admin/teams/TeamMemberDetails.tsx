
import React from 'react';
import { 
  Sheet, SheetClose, SheetContent, SheetDescription, 
  SheetHeader, SheetTitle 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mail, Phone, MapPin, Calendar, Clock, MessageSquare,
  FileText, BarChart2, User, Shield, Edit
} from 'lucide-react';
import { TeamMember } from './TeamMemberList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMemberActivity } from './TeamMemberActivity';
import { TeamMemberTasks } from './TeamMemberTasks';

interface TeamMemberDetailsProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamMemberDetails({ member, open, onOpenChange }: TeamMemberDetailsProps) {
  if (!member) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': 
      default: return 'bg-gray-500';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-5">
          <SheetTitle>Team Member Details</SheetTitle>
          <SheetDescription>
            View and manage team member information
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="text-lg bg-primary/10">
                {member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {member.role}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {member.department}
              </Badge>
            </div>
          </div>
          
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="my-4" />

        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1">Tasks</TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${member.email}`} className="hover:underline">{member.email}</a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Remote</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Team Details</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Last active: {member.lastActive}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Access level: Standard</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-2">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center gap-1">
                    <FileText className="h-4 w-4" /> Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">5 active, 7 completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center gap-1">
                    <BarChart2 className="h-4 w-4" /> Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold">94%</div>
                  <p className="text-xs text-muted-foreground">Above team average</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" /> Message
              </Button>
              <Button variant="outline" className="flex-1">
                <User className="h-4 w-4 mr-2" /> Profile
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="pt-4">
            <TeamMemberTasks memberId={member.id} />
          </TabsContent>
          
          <TabsContent value="activity" className="pt-4">
            <TeamMemberActivity memberId={member.id} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
