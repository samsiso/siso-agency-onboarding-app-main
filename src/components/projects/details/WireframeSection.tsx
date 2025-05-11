import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useProjectWireframes } from '@/hooks/useProjectWireframes';
import { WireframeCard } from '@/components/projects/wireframes/WireframeCard';
import { Skeleton } from '@/components/ui/skeleton';

export function WireframeSection() {
  const { id: projectId } = useParams();
  const { wireframes, loading, error, activeWireframeId, setActiveWireframeId } = useProjectWireframes();

  // Log state for debugging
  useEffect(() => {
    console.log("WireframeSection rendered with:", { 
      projectId, 
      wireframesCount: wireframes.length,
      loading,
      error 
    });
  }, [projectId, wireframes, loading, error]);

  if (loading) {
    return (
      <div className="space-y-6 text-gray-900 dark:text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Wireframes</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Wireframe
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="planned">Planned</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-5 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Error loading wireframes</h3>
        <p className="text-gray-500 mb-4">We couldn't load the wireframes. Please try again later.</p>
        <p className="text-red-500 mb-4 text-sm">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (wireframes.length === 0) {
    return (
      <div className="p-6 text-center border rounded-lg border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No wireframes found</h3>
        <p className="text-gray-500 mb-4">Get started by creating your first wireframe</p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Wireframe
        </Button>
      </div>
    );
  }

  console.log("Rendering wireframes:", wireframes);

  // Group wireframes by status for tabs
  const complete = wireframes.filter(w => w.wireframeStatus === 'complete');
  const inProgress = wireframes.filter(w => w.wireframeStatus === 'in-progress');
  const planned = wireframes.filter(w => w.wireframeStatus === 'planned');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Wireframes ({wireframes.length})</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Wireframe
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({wireframes.length})</TabsTrigger>
          <TabsTrigger value="complete">Complete ({complete.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgress.length})</TabsTrigger>
          <TabsTrigger value="planned">Planned ({planned.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wireframes.map((wireframe) => (
              <WireframeCard
                key={wireframe.id}
                wireframe={wireframe}
                projectId={projectId || 'ubahcrypt'}
                isActive={wireframe.id === activeWireframeId}
                onClick={() => setActiveWireframeId(wireframe.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="complete" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {complete.map((wireframe) => (
              <WireframeCard
                key={wireframe.id}
                wireframe={wireframe}
                projectId={projectId || 'ubahcrypt'}
                isActive={wireframe.id === activeWireframeId}
                onClick={() => setActiveWireframeId(wireframe.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inProgress.map((wireframe) => (
              <WireframeCard
                key={wireframe.id}
                wireframe={wireframe}
                projectId={projectId || 'ubahcrypt'}
                isActive={wireframe.id === activeWireframeId}
                onClick={() => setActiveWireframeId(wireframe.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="planned" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {planned.map((wireframe) => (
              <WireframeCard
                key={wireframe.id}
                wireframe={wireframe}
                projectId={projectId || 'ubahcrypt'}
                isActive={wireframe.id === activeWireframeId}
                onClick={() => setActiveWireframeId(wireframe.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
