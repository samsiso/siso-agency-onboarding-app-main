
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MessageCircle, Edit, Trash2, MoreVertical, Mail, AlertCircle,
  CheckCircle, Clock, User, ShieldCheck, Palette, Code, LineChart 
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { TeamMemberDetails } from './TeamMemberDetails';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'active' | 'busy' | 'offline' | 'away';
  lastActive: string;
  department: string;
  joinDate: string;
}

interface TeamMemberListProps {
  searchQuery: string;
  roleFilter: string | null;
}

export function TeamMemberList({ searchQuery, roleFilter }: TeamMemberListProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  // Mock data - in a real app, this would come from your database
  const mockTeamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'Admin',
      avatar: '',
      status: 'active',
      lastActive: 'Just now',
      department: 'Management',
      joinDate: '2023-01-15'
    },
    {
      id: '2',
      name: 'Sam Rodriguez',
      email: 'sam@example.com',
      role: 'Developer',
      avatar: '',
      status: 'busy',
      lastActive: '5m ago',
      department: 'Engineering',
      joinDate: '2023-03-22'
    },
    {
      id: '3',
      name: 'Jamie Taylor',
      email: 'jamie@example.com',
      role: 'Designer',
      avatar: '',
      status: 'offline',
      lastActive: '2h ago',
      department: 'Design',
      joinDate: '2023-02-10'
    },
    {
      id: '4',
      name: 'Morgan Lee',
      email: 'morgan@example.com',
      role: 'Marketing',
      avatar: '',
      status: 'away',
      lastActive: '15m ago',
      department: 'Marketing',
      joinDate: '2023-04-05'
    },
    {
      id: '5',
      name: 'Casey Wilson',
      email: 'casey@example.com',
      role: 'Manager',
      avatar: '',
      status: 'active',
      lastActive: '1m ago',
      department: 'Management',
      joinDate: '2022-11-18'
    },
  ];

  // Filter members based on search and role
  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === null || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <ShieldCheck className="h-4 w-4 text-purple-500" />;
      case 'Manager':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'Developer':
        return <Code className="h-4 w-4 text-green-500" />;
      case 'Designer':
        return <Palette className="h-4 w-4 text-orange-500" />;
      case 'Marketing':
        return <LineChart className="h-4 w-4 text-pink-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'away':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'offline':
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const handleSendMessage = (member: TeamMember) => {
    toast.success(`Message dialog would open for ${member.name}`);
  };

  const handleEditMember = (member: TeamMember) => {
    toast.info(`Edit dialog would open for ${member.name}`);
  };

  const handleDeleteMember = (member: TeamMember) => {
    toast.warning(
      `Are you sure you want to remove ${member.name}?`,
      {
        action: {
          label: 'Confirm',
          onClick: () => toast.success(`${member.name} removed from team`)
        },
      }
    );
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No team members found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map(member => (
                <TableRow 
                  key={member.id} 
                  className="cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-primary/10">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getRoleIcon(member.role)}
                      <span>{member.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(member.status)}
                      <span className="capitalize">{member.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleSendMessage(member);
                        }}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${member.email}`;
                        }}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleEditMember(member);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMember(member);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TeamMemberDetails 
        member={selectedMember} 
        open={!!selectedMember} 
        onOpenChange={() => setSelectedMember(null)}
      />
    </>
  );
}
