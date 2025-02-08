
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
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const searchPlaceholders = [
    "Search for AI assistants...",
    "Find coding helpers...",
    "Discover automation tools...",
    "Explore GPT assistants..."
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-8 py-8">
        <div className="relative">
          <FloatingOrbs />
          <div className="absolute inset-0 bg-gradient-radial from-siso-orange/20 via-transparent to-transparent opacity-30 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-siso-red/10 via-transparent to-transparent animate-pulse" />
          </div>

          <div className="relative z-10 space-y-6">
            <HeaderTitle />
            <StatsDisplay 
              totalAssistants={assistants?.length || 0}
              featuredCount={featuredCount}
              categoryCount={Object.keys(categoryCounts || {}).length}
              conversationsCount={totalConversations}
            />
            
            <div className="relative w-full max-w-2xl mx-auto">
              <PlaceholdersAndVanishInput
                placeholders={searchPlaceholders}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onSubmit={handleSubmit}
                className="w-full h-14 pl-12 pr-24 bg-gradient-to-r from-siso-text/5 to-siso-text/10 
                  border border-siso-text/10 rounded-xl text-lg
                  focus:ring-2 focus:ring-siso-orange/30 focus:border-siso-orange/50
                  hover:border-siso-text/20 hover:bg-siso-text/10
                  transition-all duration-300 backdrop-blur-sm"
              />
              
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-siso-text/50 
                group-hover:text-siso-text/70 transition-colors" />
              
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-siso-text/50">
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border 
                  border-siso-text/20 bg-siso-text/5 px-1.5 font-mono text-[10px] font-medium">
                  <span className="text-xs"><Command className="h-3 w-3" /></span>K
                </kbd>
                <Mic className="w-5 h-5 cursor-pointer hover:text-siso-orange transition-colors" />
              </div>
            </div>
          </div>
        </div>

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
          isOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
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
    </MainLayout>
  );
}
