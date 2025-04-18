
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskBank } from '../tasks/TaskBank';

export function TaskView() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Task Overview</CardTitle>
          <CardDescription>
            View and manage all your tasks across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskBank />
        </CardContent>
      </Card>
    </div>
  );
}
