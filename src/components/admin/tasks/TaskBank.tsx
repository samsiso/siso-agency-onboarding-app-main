
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskList } from './TaskList';
import { Card } from '@/components/ui/card';

export function TaskBank() {
  const [activeTab, setActiveTab] = useState('main');

  return (
    <Card className="p-4">
      <Tabs defaultValue="main" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="main">Main Tasks</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Tasks</TabsTrigger>
          <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main">
          <TaskList category="main" />
        </TabsContent>
        
        <TabsContent value="weekly">
          <TaskList category="weekly" />
        </TabsContent>
        
        <TabsContent value="daily">
          <TaskList category="daily" />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
