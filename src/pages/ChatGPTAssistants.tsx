
import { useState } from 'react';
import { AssistantDetails } from '@/components/assistants/AssistantDetails';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { HeaderTitle } from '@/components/assistants/layout/header/HeaderTitle';
import { HeaderAlerts } from '@/components/assistants/layout/header/HeaderAlerts';
import { SearchSection } from '@/components/assistants/layout/header/SearchSection';
import { StatsDisplay } from '@/components/assistants/layout/header/StatsDisplay';
import { Categories } from '@/components/assistants/layout/content/Categories';
import { AssistantGrid } from '@/components/assistants/layout/content/AssistantGrid';
import { useAssistants } from '@/components/assistants/hooks/useAssistants';
import { Assistant } from '@/components/assistants/types';
import { motion } from 'framer-motion';
import { FloatingOrbs } from '@/components/effects/FloatingOrbs';

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

  const totalConversations = assistants?.reduce((sum, assistant) => {
    if (assistant.num_conversations_str) {
      const num = parseInt(assistant.num_conversations_str);
      return isNaN(num) ? sum : sum + num;
    }
    return sum;
  }, 0) || 0;

  return (
    <MainLayout>
      <div className="space-y-8 px-6 py-8">
        <div className="relative">
          {/* Background effects */}
          <FloatingOrbs />
          <div className="absolute inset-0 bg-gradient-radial from-siso-orange/20 via-transparent to-transparent opacity-30 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-siso-red/10 via-transparent to-transparent animate-pulse" />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            <HeaderTitle />
            <StatsDisplay 
              totalAssistants={assistants?.length || 0}
              featuredCount={featuredCount}
              categoryCount={Object.keys(categoryCounts || {}).length}
              conversationsCount={totalConversations}
            />
            <SearchSection 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
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

        <AssistantGrid 
          assistants={filteredAssistants}
          onAssistantClick={setSelectedAssistant}
          isLoading={isLoading}
        />

        <AssistantDetails
          assistant={selectedAssistant}
          onClose={() => setSelectedAssistant(null)}
        />
      </div>
    </MainLayout>
  );
}
