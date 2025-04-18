
import React from 'react';
import { Card } from '@/components/ui/card';
import { TaskList } from './TaskList';
import { Chip } from '@/components/ui/chip';
import { TaskCategory } from '@/hooks/useTasks';

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

export function TaskBank() {
  return (
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
            <TaskList category={category} />
          </Card>
        </section>
      ))}
    </div>
  );
}
