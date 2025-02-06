import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tool } from '@/components/tools/types';
import { Bot } from 'lucide-react';
import { ChatBot } from '@/components/ChatBot';
import { Sidebar } from '@/components/Sidebar';
import { toast } from 'react-hot-toast';
import { ToolsPageHeader } from '@/components/tools/ToolsPageHeader';
import { ToolsCategories } from '@/components/tools/ToolsCategories';
import { ToolsFilters } from '@/components/tools/ToolsFilters';
import { ToolsGrid } from '@/components/tools/ToolsGrid';
import { motion } from 'framer-motion';
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from '@/components/ui/expandable-chat';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatInput } from '@/components/ui/chat-input';
import { Send, Paperclip, Mic } from 'lucide-react';

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');

  const categories = useMemo(() => [
    { id: 'all', label: 'All Tools' },
    { id: 'featured', label: 'Featured' },
    { id: 'development', label: 'Development' },
    { id: 'database', label: 'Database' },
    { id: 'automation', label: 'Automation' },
    { id: 'GPT Builder', label: 'GPT Builder' },
  ], []);

  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['core_tools'],
    queryFn: async () => {
      console.log('Fetching tools from core_tools table...');
      const { data, error } = await supabase
        .from('core_tools')
        .select('*');
      
      if (error) {
        console.error('Error fetching tools:', error);
        toast.error('Failed to load tools. Please try again later.');
        throw error;
      }
      
      return data.map(tool => ({
        ...tool,
        youtube_videos: tool.youtube_videos 
          ? JSON.parse(JSON.stringify(tool.youtube_videos))
          : null
      })) as Tool[];
    },
  });

  const sortTools = (tools: Tool[]) => {
    return [...tools].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'popular':
          return (b.downloads_count || 0) - (a.downloads_count || 0);
        default:
          return 0;
      }
    });
  };

  const filteredTools = useMemo(() => {
    if (!tools) return [];
    
    let filtered = tools.filter(tool => {
      const matchesSearch = !searchQuery || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || 
        (selectedCategory === 'featured' && tool.rating && tool.rating >= 4.5) ||
        tool.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    return sortTools(filtered);
  }, [tools, searchQuery, selectedCategory, sortBy]);

  const categoryStats = useMemo(() => {
    if (!tools) return {};
    return categories.reduce((acc, category) => {
      acc[category.label] = tools.filter(tool => 
        category.id === 'all' ? true : 
        category.id === 'featured' ? (tool.rating && tool.rating >= 4.5) :
        tool.category.toLowerCase() === category.id.toLowerCase()
      ).length;
      return acc;
    }, {} as { [key: string]: number });
  }, [tools, categories]);

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="p-8">
          <div className="text-red-500">
            Failed to load tools. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div 
          className="max-w-7xl mx-auto space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ToolsPageHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalTools={tools?.length}
            categoryStats={categoryStats}
          />

          <div className="flex items-center justify-between">
            <ToolsCategories 
              categories={categories.map(cat => ({
                ...cat,
                count: categoryStats[cat.label]
              }))}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              isLoading={isLoading}
            />
            <ToolsFilters
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          <ToolsGrid tools={filteredTools} isLoading={isLoading} />
        </motion.div>
      </div>

      <ExpandableChat
        size="lg"
        position="bottom-right"
        icon={<Bot className="h-6 w-6" />}
      >
        <ExpandableChatHeader className="flex-col text-center justify-center">
          <h1 className="text-xl font-semibold">Tools Assistant ✨</h1>
          <p className="text-sm text-muted-foreground">
            Ask me anything about our AI tools
          </p>
        </ExpandableChatHeader>

        <ExpandableChatBody>
          <ChatMessageList>
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="h-8 w-8"
                src="/lovable-uploads/c482563a-42db-4f47-83f2-c2e7771400b7.png"
                fallback="AI"
              />
              <ChatBubbleMessage>
                Hello! I'm your AI tools assistant. How can I help you find the right tools for your needs?
              </ChatBubbleMessage>
            </ChatBubble>
          </ChatMessageList>
        </ExpandableChatBody>

        <ExpandableChatFooter>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
          >
            <ChatInput
              placeholder="Type your message..."
              className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center p-3 pt-0 justify-between">
              <div className="flex">
                <button className="p-2 hover:bg-accent rounded-md">
                  <Paperclip className="size-4" />
                </button>
                <button className="p-2 hover:bg-accent rounded-md">
                  <Mic className="size-4" />
                </button>
              </div>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2">
                Send <Send className="size-4" />
              </button>
            </div>
          </form>
        </ExpandableChatFooter>
      </ExpandableChat>
    </div>
  );
}