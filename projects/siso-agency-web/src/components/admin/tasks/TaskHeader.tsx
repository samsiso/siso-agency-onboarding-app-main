
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function TaskHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold">Task Tracker</h1>
        <p className="text-muted-foreground">Manage and organize team tasks</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="main">Main Tasks</SelectItem>
            <SelectItem value="weekly">Weekly Tasks</SelectItem>
            <SelectItem value="daily">Daily Tasks</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
