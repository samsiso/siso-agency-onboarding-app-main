
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { AssistantDetails } from '@/components/assistants/AssistantDetails';
import { AssistantsHeader } from '@/components/assistants/layout/header/AssistantsHeader';
import { AssistantGrid } from '@/components/assistants/layout/content/AssistantGrid';
import { AssistantsLayout } from '@/components/assistants/layout/AssistantsLayout';
import { ChatAssistantHelper } from '@/components/assistants/ChatAssistantHelper';
import { useFilteredAssistants } from '@/components/assistants/hooks/useFilteredAssistants';
import { Assistant } from '@/components/assistants/types';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

export default function ChatGPTAssistants() {
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredAssistants,
    categoryCounts,
    featuredCount,
    totalConversations,
    isLoading,
    assistantsCount
  } = useFilteredAssistants();

  useHotkeys('mod+k', (event) => {
    event.preventDefault();
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('user_search_history').insert({
          query: searchQuery,
          result_type: 'assistant',
          user_id: session.user.id
        });
      } else {
        console.log('User not logged in, search history not saved');
      }
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const categories = ['all', 'featured', 'software', 'coding', 'actions', 'gpt'];

  return (
    <AssistantsLayout>
      <AssistantsHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchFocused={isSearchFocused}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryCounts={categoryCounts || {}}
        assistantsCount={assistantsCount}
        featuredCount={featuredCount}
        totalConversations={totalConversations}
        onSearchSubmit={handleSubmit}
        categories={categories}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCategory}-${searchQuery}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <AssistantGrid 
            assistants={filteredAssistants}
            onAssistantClick={setSelectedAssistant}
            isLoading={isLoading}
          />
        </motion.div>
      </AnimatePresence>

      <AssistantDetails
        assistant={selectedAssistant}
        onClose={() => setSelectedAssistant(null)}
      />

      <ChatAssistantHelper />
    </AssistantsLayout>
  );
}
