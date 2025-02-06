
import { useState } from 'react';
import { AssistantDetails } from '@/components/assistants/AssistantDetails';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { HeaderTitle } from '@/components/assistants/layout/header/HeaderTitle';
import { HeaderAlerts } from '@/components/assistants/layout/header/HeaderAlerts';
import { SearchSection } from '@/components/assistants/layout/header/SearchSection';
import { Categories } from '@/components/assistants/layout/content/Categories';
import { AssistantGrid } from '@/components/assistants/layout/content/AssistantGrid';
import { useAssistants } from '@/components/assistants/hooks/useAssistants';
import { Assistant } from '@/components/assistants/types';
import { motion } from 'framer-motion';

export default function ChatGPTAssistants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: assistants, isLoading } = useAssistants();

  const categoryCounts = assistants?.reduce((acc, assistant) => {
    const category = assistant.category === 'gpt builder' ? 'gpt' : (assistant.assistant_type || 'gpt');
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredAssistants = assistants?.filter(assistant => {
    const matchesSearch = !searchQuery || 
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      (selectedCategory === 'featured' && (assistant.rating >= 4.5 || assistant.review_average >= 4.5)) ||
      (selectedCategory === 'gpt' && assistant.category === 'gpt builder') ||
      (selectedCategory !== 'gpt' && assistant.assistant_type === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'featured', 'software', 'coding', 'actions', 'gpt'];
  const featuredCount = assistants?.filter(a => 
    (a.rating && a.rating >= 4.5) || (a.review_average && a.review_average >= 4.5)
  ).length || 0;

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <HeaderTitle />
          <SearchSection 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        <HeaderAlerts />

        <Categories 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categoryCounts={categoryCounts || {}}
          assistantsCount={assistants?.length || 0}
          featuredCount={featuredCount}
        />
      </motion.div>

      <AssistantGrid 
        assistants={filteredAssistants}
        onAssistantClick={setSelectedAssistant}
        isLoading={isLoading}
      />

      <AssistantDetails
        assistant={selectedAssistant}
        onClose={() => setSelectedAssistant(null)}
      />
    </MainLayout>
  );
}
