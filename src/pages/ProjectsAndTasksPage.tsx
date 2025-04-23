
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { TasksList } from '@/components/projects/TasksList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProjectsAndTasksPage() {
  const [activeTab, setActiveTab] = useState('projects');
  const navigate = useNavigate();

  const handleCreateNew = () => {
    if (activeTab === 'projects') {
      navigate('/plan-builder');
    } else {
      // Open a task creation modal or navigate to task creation page
      // This will be implemented later
      console.log('Create new task');
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient-to-r from-siso-red to-siso-orange mb-2">
              Projects & Tasks
            </h1>
            <p className="text-siso-text">
              Manage your application projects and related tasks in one place
            </p>
          </div>
          
          <Button 
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 flex items-center gap-2 mt-4 md:mt-0"
          >
            <PlusCircle size={16} />
            {activeTab === 'projects' ? 'New Project' : 'New Task'}
          </Button>
        </div>

        <Card className="p-6 bg-black/30 border border-siso-text/10">
          <Tabs 
            defaultValue="projects" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="space-y-4">
              <ProjectsList />
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-4">
              <TasksList />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
}
