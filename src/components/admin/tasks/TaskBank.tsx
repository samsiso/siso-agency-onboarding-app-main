
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { TaskList } from './TaskList';
import { Chip } from '@/components/ui/chip';
import { TaskCategory } from '@/hooks/useTasks';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'react-router-dom';

const categories: TaskCategory[] = [
  'siso_app_dev',
  'onboarding_app',
  'instagram',
  'main',
  'weekly',
  'daily'
];

const formatCategoryName = (category: string) => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface TaskBankProps {
  userId?: string;
  showAllTasks?: boolean;
}

export function TaskBank({ userId, showAllTasks = true }: TaskBankProps) {
  const [activeView, setActiveView] = useState<'byCategory' | 'analytics'>('byCategory');
  const [searchParams] = useSearchParams();
  const teamMember = searchParams.get('member');
  
  const displayName = teamMember === 'siso' ? 'SISO' : 
                       teamMember === 'sam' ? 'Sam' : 
                       null;

  return (
    <div className="space-y-6">
      {displayName && (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h1 className="text-xl font-bold text-purple-800">
            {displayName}'s Tasks
          </h1>
          <p className="text-sm text-purple-600">
            Viewing tasks assigned to {displayName}
          </p>
        </div>
      )}

      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'byCategory' | 'analytics')}>
        <TabsList>
          <TabsTrigger value="byCategory">By Category</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeView === 'byCategory' ? (
        <div className="space-y-8">
          {categories.map((category) => (
            <section key={category} className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {formatCategoryName(category)}
                </h2>
                <Chip variant="outline" size="sm" className="bg-purple-100 text-purple-800 border-purple-200">
                  {category}
                </Chip>
              </div>
              <Card className="p-4">
                <TaskList category={category} userId={userId || teamMember || undefined} />
              </Card>
            </section>
          ))}
        </div>
      ) : (
        <TaskAnalytics teamMember={teamMember} />
      )}
    </div>
  );
}
