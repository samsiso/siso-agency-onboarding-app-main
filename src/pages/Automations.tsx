import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from '@/components/Sidebar';
import { AutomationDetails } from '@/components/automations/AutomationDetails';
import { Automation, AutomationCategory } from '@/components/automations/types';
import { AutomationHeader } from '@/components/automations/AutomationHeader';
import { AutomationList } from '@/components/automations/AutomationList';

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
          <AutomationHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            getCategoryCount={getCategoryCount}
          />

          <AutomationList
            automations={filteredAutomations}
            isLoading={isLoading}
            onSelectAutomation={setSelectedAutomation}
          />

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