
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TaskList } from '@/components/admin/tasks/TaskList';
import { TaskCategory } from '@/types/task.types';
import { Chip } from '@/components/ui/chip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

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

export function TasksList() {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('main');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Select 
          value={selectedCategory} 
          onValueChange={(value) => setSelectedCategory(value as TaskCategory)}
        >
          <SelectTrigger className="w-[200px]">
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
        
        <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'active' | 'completed')}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
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
    </div>
  );
}
