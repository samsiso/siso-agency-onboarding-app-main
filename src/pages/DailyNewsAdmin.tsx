
import { useState } from 'react';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import GenerateDailyNews from '@/components/ai-news/admin/GenerateDailyNews';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function DailyNewsAdmin() {
  const [activeTab, setActiveTab] = useState('generate');

  // [Analysis] Fetch recent daily briefs
  const { data: recentBriefs, isLoading } = useQuery({
    queryKey: ['recent-daily-briefs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_news')
        .select('id, title, date, created_at')
        .eq('article_type', 'daily_brief')
        .order('date', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      return data;
    }
  });

  return (
    <MainLayout>
      <div className="flex-1 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-siso-text-bold">AI News Admin</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-siso-bg">
              <TabsTrigger value="generate">Generate Daily News</TabsTrigger>
              <TabsTrigger value="history">Recent Briefs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-4">
              <GenerateDailyNews />
            </TabsContent>
            
            <TabsContent value="history">
              <div className="bg-siso-bg-alt p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Recent Daily Briefs</h2>
                
                {isLoading ? (
                  <div className="py-4 text-center">Loading recent briefs...</div>
                ) : recentBriefs?.length ? (
                  <div className="space-y-2">
                    {recentBriefs.map((brief) => (
                      <div 
                        key={brief.id} 
                        className="flex justify-between items-center py-3 px-4 bg-siso-bg hover:bg-siso-bg-alt rounded-md transition-colors"
                      >
                        <div>
                          <h3 className="font-medium">{brief.title}</h3>
                          <p className="text-sm text-gray-500">Created: {new Date(brief.created_at).toLocaleString()}</p>
                        </div>
                        <a 
                          href={`/ai-news/daily/${brief.date}`}
                          className="text-siso-red hover:text-siso-red/80 text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Brief
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500">No daily briefs found.</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
