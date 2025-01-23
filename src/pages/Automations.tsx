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
      const { data, error } = await supabase
        .from('automations')
        .select('*');
      
      if (error) throw error;
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
    return <div className="text-red-500">Error loading automations. Please try again later.</div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8 relative overflow-hidden">
        {/* Glowing orbs in the background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-siso-red/20 to-siso-orange/20 rounded-full blur-3xl animate-float opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-siso-orange/20 to-siso-red/20 rounded-full blur-3xl animate-float-delayed opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto relative">
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
              <Alert className="bg-siso-text/5 border border-siso-text/10 backdrop-blur-sm">
                <Bot className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Automation Library:</span> Browse our collection of pre-built automations for various social media platforms and general tasks.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-siso-text/5 border border-siso-text/10 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Quick Setup:</span> Click on any automation to view details, use cases, and setup instructions.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-siso-text/5 border border-siso-text/10 backdrop-blur-sm">
                <ArrowRight className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Get Started:</span> Filter by platform, browse featured automations, or search for specific tasks you want to automate.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-siso-text/5 rounded-lg border border-siso-text/10" />
              ))}
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
            </div>
          )}

          <Sheet open={!!selectedAutomation} onOpenChange={() => setSelectedAutomation(null)}>
            <SheetContent className="bg-siso-bg border-l border-siso-text/10 w-full sm:max-w-xl backdrop-blur-xl bg-opacity-95">
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