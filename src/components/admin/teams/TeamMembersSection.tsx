
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { TeamMemberList } from './TeamMemberList';
import { AddTeamMemberDialog } from './AddTeamMemberDialog';
import { Badge } from '@/components/ui/badge';

export function TeamMembersSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" /> 
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="whitespace-nowrap">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap mb-2">
        <Badge 
          variant={selectedRole === null ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setSelectedRole(null)}
        >
          All Roles
        </Badge>
        {['Admin', 'Manager', 'Developer', 'Designer', 'Marketing'].map(role => (
          <Badge 
            key={role} 
            variant={selectedRole === role ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedRole(role === selectedRole ? null : role)}
          >
            {role}
          </Badge>
        ))}
      </div>

      <TeamMemberList searchQuery={searchQuery} roleFilter={selectedRole} />
      <AddTeamMemberDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
}
