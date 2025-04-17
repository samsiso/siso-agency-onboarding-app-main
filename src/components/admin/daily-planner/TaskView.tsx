
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Circle, Clock, PlusCircle, Filter, MoreHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample tasks for demonstration
const sampleTasks = [
  {
    id: '1',
    name: 'Review Client X MVP',
    category: 'Client Work',
    dueDate: new Date(),
    status: 'In Progress',
    priority: 'High'
  },
  {
    id: '2',
    name: 'Send invoice to Client Y',
    category: 'Admin',
    dueDate: new Date(),
    status: 'Not Started',
    priority: 'Medium'
  },
  {
    id: '3',
    name: 'Schedule marketing meeting',
    category: 'Internal',
    dueDate: new Date(Date.now() + 86400000), // tomorrow
    status: 'Not Started',
    priority: 'Low'
  },
  {
    id: '4',
    name: 'Follow up on potential leads',
    category: 'Outreach',
    dueDate: new Date(Date.now() + 172800000), // day after tomorrow
    status: 'Not Started',
    priority: 'Medium'
  }
];

export function TaskView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter tasks based on search query and status filter
  const filteredTasks = sampleTasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'completed' && task.status === 'Completed') ||
                          (statusFilter === 'in-progress' && task.status === 'In Progress') ||
                          (statusFilter === 'not-started' && task.status === 'Not Started');
                          
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Task Manager</CardTitle>
            <CardDescription>
              Manage your daily to-do list and tasks
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        {task.status === 'Completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : task.status === 'In Progress' ? (
                          <Clock className="h-5 w-5 text-amber-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-300" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {task.category}
                        </span>
                      </TableCell>
                      <TableCell>{task.dueDate.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : task.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No tasks found. Try adjusting your filters or add a new task.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
