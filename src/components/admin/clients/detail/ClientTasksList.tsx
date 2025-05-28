
import React from 'react';
import { ClientData } from '@/types/client.types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Clock, CalendarCheck, AlertCircle, AlertTriangle, Plus, 
  ChevronDown, MoreHorizontal, User, Calendar 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientTasksListProps {
  client: ClientData;
}

export function ClientTasksList({ client }: ClientTasksListProps) {
  // In a real implementation, these would be fetched from the database
  const tasks = {
    active: [
      {
        id: 1,
        title: 'Finalize homepage design',
        description: 'Complete the UI for the homepage based on client feedback',
        due_date: '2023-06-20',
        priority: 'high',
        assigned_to: 'Michael Chen',
        status: 'in_progress'
      },
      {
        id: 2,
        title: 'API integration for product catalog',
        description: 'Connect to client\'s product API and implement data sync',
        due_date: '2023-06-25',
        priority: 'medium',
        assigned_to: 'Sarah Williams',
        status: 'pending'
      },
      {
        id: 3,
        title: 'Setup payment gateway',
        description: 'Integrate Stripe and implement checkout flow',
        due_date: '2023-07-05',
        priority: 'high',
        assigned_to: 'David Kim',
        status: 'pending'
      }
    ],
    completed: [
      {
        id: 4,
        title: 'Initial project setup',
        description: 'Create repository and setup development environment',
        due_date: '2023-05-10',
        priority: 'high',
        assigned_to: 'Sarah Williams',
        status: 'completed'
      },
      {
        id: 5,
        title: 'Wireframe design',
        description: 'Create wireframes for all main pages',
        due_date: '2023-05-20',
        priority: 'medium',
        assigned_to: 'Michael Chen',
        status: 'completed'
      }
    ]
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <CalendarCheck className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Project Tasks</CardTitle>
            <CardDescription>
              Tasks and to-do items for {client.project_name || 'this project'}
            </CardDescription>
          </div>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="active">
          <div className="border-b px-6">
            <TabsList className="bg-transparent -mb-px">
              <TabsTrigger 
                value="active" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                Active ({tasks.active.length})
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                Completed ({tasks.completed.length})
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="active" className="p-0 m-0">
            <div className="divide-y">
              {tasks.active.map((task) => (
                <div key={task.id} className="p-4 hover:bg-muted/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Checkbox id={`task-${task.id}`} />
                      <div>
                        <label 
                          htmlFor={`task-${task.id}`}
                          className="font-medium cursor-pointer flex items-center gap-2"
                        >
                          {task.title}
                          {getPriorityBadge(task.priority)}
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                            {task.assigned_to}
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            {getStatusIcon(task.status)}
                            <span className={task.status === 'in_progress' ? 'text-blue-600' : 'text-muted-foreground'}>
                              {task.status === 'in_progress' ? 'In Progress' : 
                                task.status === 'pending' ? 'Not Started' : 
                                task.status === 'completed' ? 'Completed' : 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                        <DropdownMenuItem>Change Assignee</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="p-0 m-0">
            <div className="divide-y">
              {tasks.completed.map((task) => (
                <div key={task.id} className="p-4 hover:bg-muted/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Checkbox id={`task-${task.id}`} checked={true} />
                      <div>
                        <label 
                          htmlFor={`task-${task.id}`}
                          className="font-medium cursor-pointer text-muted-foreground line-through flex items-center gap-2"
                        >
                          {task.title}
                          {getPriorityBadge(task.priority)}
                        </label>
                        <p className="text-sm text-muted-foreground mt-1 line-through">
                          {task.description}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                            {task.assigned_to}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CalendarCheck className="h-3.5 w-3.5" />
                            <span>Completed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm">
          Filter Tasks <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
        <Button variant="link" size="sm">
          View All Tasks
        </Button>
      </CardFooter>
    </Card>
  );
}
