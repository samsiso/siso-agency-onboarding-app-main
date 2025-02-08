
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { Bot, Command, Search, Mic } from 'lucide-react';
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
import { FloatingOrbs } from '@/components/effects/FloatingOrbs';
import { Card } from '@/components/ui/card';
import { 
  ExpandableChat, 
  ExpandableChatHeader, 
  ExpandableChatBody, 
  ExpandableChatFooter 
} from '@/components/ui/expandable-chat';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatInput } from '@/components/ui/chat-input';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { supabase } from '@/integrations/supabase/client';

export default function ChatGPTAssistants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { data: assistants, isLoading } = useAssistants();

  useHotkeys('mod+k', (event) => {
    event.preventDefault();
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      await supabase.from('user_search_history').insert({
        query: searchQuery,
        result_type: 'assistant'
      });
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-[#1A1F2C] to-siso-bg/95">
        <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-8 py-8">
          <Card className="relative border-siso-border bg-black/20 backdrop-blur-lg overflow-hidden
            hover:bg-black/25 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5]/5 via-[#7E69AB]/5 to-transparent" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" />
            <FloatingOrbs />
            
            <motion.div 
              className="relative z-10 space-y-8 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
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
                isSearchFocused={isSearchFocused}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </Card>

          {!isSearchFocused && (
            <>
              <HeaderAlerts />
              <Categories 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categoryCounts={categoryCounts || {}}
                assistantsCount={assistants?.length || 0}
                featuredCount={featuredCount}
              />
            </>
          )}

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

          <ExpandableChat
            size="lg"
            position="bottom-right"
            icon={<Bot className="h-6 w-6" />}
          >
            <ExpandableChatHeader className="flex-col text-center justify-center">
              <h1 className="text-xl font-semibold">Assistant Helper</h1>
              <p className="text-sm text-muted-foreground">
                Ask me anything about our AI assistants
              </p>
            </ExpandableChatHeader>

            <ExpandableChatBody>
              <ChatMessageList>
                <ChatBubble variant="received">
                  <ChatBubbleAvatar
                    src="/path-to-ai-avatar.png"
                    fallback="AI"
                  />
                  <ChatBubbleMessage>
                    Hello! I'm your Assistant Helper. How can I help you find the perfect AI assistant today?
                  </ChatBubbleMessage>
                </ChatBubble>
              </ChatMessageList>
            </ExpandableChatBody>

            <ExpandableChatFooter>
              <ChatInput
                placeholder="Type your message..."
                onSubmit={(value) => {
                  console.log('Message submitted:', value);
                }}
              />
            </ExpandableChatFooter>
          </ExpandableChat>
        </div>
      </div>
    </MainLayout>
  );
}
