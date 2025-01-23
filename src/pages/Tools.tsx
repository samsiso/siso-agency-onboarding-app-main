import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ToolsHeader } from '@/components/tools/ToolsHeader';
import { ToolsGrid } from '@/components/tools/ToolsGrid';
import { ToolsCategories } from '@/components/tools/ToolsCategories';
import { FloatingOrbs } from '@/components/effects/FloatingOrbs';

export default function Tools() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-b from-siso-bg via-black to-siso-bg relative overflow-hidden">
        <FloatingOrbs />
        
        <div className="container mx-auto p-6 relative z-10">
          <ToolsHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <ToolsCategories
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          
          <ToolsGrid
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
}