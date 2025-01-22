import { useQuery } from '@tanstack/react-query';
import { Bot, Zap, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sidebar } from '@/components/Sidebar';
import { AutomationCard } from '@/components/automations/AutomationCard';
import { AutomationDetails } from '@/components/automations/AutomationDetails';
import { AutomationFilters } from '@/components/automations/AutomationFilters';
import { Automation, AutomationCategory } from '@/components/automations/types';

export default function Automations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AutomationCategory>('all');

  const { data: automations, isLoading, error } = useQuery({
    queryKey: ['automations'],
    queryFn: async () => {
      console.log('Fetching automations...');
      const { data, error } = await supabase
        .from('automations')
        .select('*');
      
      if (error) {
        console.error('Error fetching automations:', error);
        throw error;
      }
      
      console.log('Fetched automations:', data);
      return data as Automation[];
    },
  });

  const filteredAutomations = automations?.filter(automation => {
    const matchesSearch = !searchQuery || 
      automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'featured') {
      return matchesSearch && automation.platform === 'Multiple';
    }
    return matchesSearch && 
      (automation.platform?.toLowerCase() === selectedCategory);
  });

  const getCategoryCount = (category: AutomationCategory) => {
    if (!automations) return 0;
    
    if (category === 'all') return automations.length;
    if (category === 'featured') {
      return automations.filter(a => a.platform === 'Multiple').length;
    }
    return automations.filter(a => a.platform?.toLowerCase() === category).length;
  };

  if (error) {
    console.error('Error in Automations component:', error);
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-8">
          <Alert variant="destructive">
            <AlertDescription>
              Error loading automations. Please try again later. {error.message}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
                SISO Automations
              </h1>
              <AutomationFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                getCategoryCount={getCategoryCount}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <Alert className="bg-siso-text/5 border border-siso-text/10">
                <Bot className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Automation Library:</span> Browse our collection of pre-built automations for various social media platforms and general tasks.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-siso-text/5 border border-siso-text/10">
                <Zap className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Quick Setup:</span> Click on any automation to view details, use cases, and setup instructions.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-siso-text/5 border border-siso-text/10">
                <ArrowRight className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Get Started:</span> Filter by platform, browse featured automations, or search for specific tasks you want to automate.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {isLoading ? (
            <div className="text-siso-text flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-siso-orange"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAutomations?.map((automation) => (
                <AutomationCard
                  key={automation.id}
                  automation={automation}
                  onClick={setSelectedAutomation}
                />
              ))}
              {filteredAutomations?.length === 0 && (
                <div className="col-span-full text-center text-siso-text/80 py-8">
                  No automations found matching your criteria.
                </div>
              )}
            </div>
          )}

          <Sheet open={!!selectedAutomation} onOpenChange={() => setSelectedAutomation(null)}>
            <SheetContent className="bg-siso-bg border-l border-siso-text/10 w-full sm:max-w-xl">
              {selectedAutomation && (
                <AutomationDetails automation={selectedAutomation} />
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}