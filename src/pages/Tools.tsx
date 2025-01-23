import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ToolsHeader } from '@/components/tools/ToolsHeader';
import { ToolsGrid } from '@/components/tools/ToolsGrid';
import { ToolsCategories } from '@/components/tools/ToolsCategories';
import { FloatingOrbs } from '@/components/effects/FloatingOrbs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Tools() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tools, isLoading } = useQuery({
    queryKey: ['tools', selectedCategory, searchQuery],
    queryFn: async () => {
      let query = supabase.from('tools').select('*');
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-b from-siso-bg via-black to-siso-bg relative overflow-hidden">
        <FloatingOrbs />
        
        <div className="container mx-auto p-6 relative z-10">
          <ToolsHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <ToolsCategories
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          
          <ToolsGrid
            tools={tools || []}
            isLoading={isLoading}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
}