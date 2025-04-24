
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TaskList } from '@/components/admin/tasks/TaskList';
import { TaskCategory } from '@/types/task.types';
import { Chip } from '@/components/ui/chip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ActiveTasksView } from './ActiveTasksView';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const taskCategories: TaskCategory[] = [
  'main', 
  'weekly', 
  'daily', 
  'siso_app_dev', 
  'onboarding_app',
  'instagram'
];

const formatCategoryName = (category: string) => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface TasksListProps {
  viewMode: "table" | "cards";
}

export function TasksList({ viewMode }: TasksListProps) {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('main');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select 
            value={selectedCategory} 
            onValueChange={(value) => setSelectedCategory(value as TaskCategory)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {taskCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {formatCategoryName(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-[250px] bg-black/20"
            />
          </div>
        </div>
        
        <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'active' | 'completed')}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {viewMode === "table" ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">
              {formatCategoryName(selectedCategory)} Tasks
            </h2>
            <Chip variant="outline" size="sm" className="bg-purple-100 text-purple-800 border-purple-200">
              {selectedCategory}
            </Chip>
          </div>
          
          <Card className="p-4 bg-black/30 border border-siso-text/10">
            <TaskList category={selectedCategory} />
          </Card>
        </div>
      ) : (
        <ActiveTasksView />
      )}
    </div>
  );
}
