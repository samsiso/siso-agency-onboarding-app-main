import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectDoc {
  id: string;
  title: string;
  section: string;
  content: Record<string, any>;
  related_components: string[];
  implementation_status: string;
  priority: number;
}

export function ProjectDocumentation() {
  const { data: docs, isLoading } = useQuery({
    queryKey: ['project-documentation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_documentation')
        .select('*')
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data as ProjectDoc[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-siso-bg-alt animate-pulse rounded" />
        <div className="h-64 bg-siso-bg-alt animate-pulse rounded" />
      </div>
    );
  }

  const renderJsonContent = (content: Record<string, any>, depth = 0): JSX.Element => {
    return (
      <div className="space-y-2" style={{ marginLeft: `${depth * 16}px` }}>
        {Object.entries(content).map(([key, value]) => {
          if (Array.isArray(value)) {
            return (
              <div key={key} className="space-y-1">
                <div className="font-medium text-siso-text-bold">{key}:</div>
                <ul className="list-disc list-inside space-y-1">
                  {value.map((item, index) => (
                    <li key={index} className="text-siso-text/80">{item}</li>
                  ))}
                </ul>
              </div>
            );
          } else if (typeof value === 'object' && value !== null) {
            return (
              <div key={key} className="space-y-2">
                <div className="font-medium text-siso-text-bold">{key}:</div>
                {renderJsonContent(value, depth + 1)}
              </div>
            );
          } else {
            return (
              <div key={key} className="flex gap-2">
                <span className="font-medium text-siso-text-bold">{key}:</span>
                <span className="text-siso-text/80">{value}</span>
              </div>
            );
          }
        })}
      </div>
    );
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>YouTube Resources Page Documentation</CardTitle>
        <CardDescription>
          Comprehensive documentation for the YouTube Resources Page project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full">
            {docs?.map((doc) => (
              <TabsTrigger key={doc.id} value={doc.section}>
                {doc.section.replace('_', ' ').charAt(0).toUpperCase() + doc.section.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          {docs?.map((doc) => (
            <TabsContent key={doc.id} value={doc.section} className="mt-4">
              <ScrollArea className="h-[600px] w-full rounded-md border border-siso-border p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-siso-text-bold mb-2">{doc.title}</h3>
                    {renderJsonContent(doc.content)}
                  </div>
                  {doc.related_components && doc.related_components.length > 0 && (
                    <div>
                      <h4 className="font-medium text-siso-text-bold mb-2">Related Components:</h4>
                      <ul className="list-disc list-inside">
                        {doc.related_components.map((component, index) => (
                          <li key={index} className="text-siso-text/80">{component}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex gap-4 text-sm text-siso-text/60">
                    <span>Status: {doc.implementation_status}</span>
                    <span>Priority: {doc.priority}</span>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}