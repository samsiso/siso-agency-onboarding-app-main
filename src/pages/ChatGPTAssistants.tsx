import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { Search, Bot, Sparkles, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { AssistantCard } from '@/components/assistants/AssistantCard';
import { AssistantDetails } from '@/components/assistants/AssistantDetails';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from 'framer-motion';

interface Assistant {
  id: string;
  name: string;
  description: string | null;
  category: string;
  assistant_type: string | null;
  prompt_template: string | null;
  use_cases: string[] | null;
  input_variables: string[] | null;
  model_type: string | null;
  response_format: string | null;
  rating: number | null;
  likes_count: number | null;
  downloads_count: number | null;
  website_url: string | null;
  gpt_url: string | null;
  review_average: number | null;
  review_count: number | null;
  num_conversations_str: string | null;
}

export default function ChatGPTAssistants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: assistants, isLoading, error } = useQuery({
    queryKey: ['assistants'],
    queryFn: async () => {
      console.log('Fetching assistants...');
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .or('category.eq.assistant,category.eq.gpt builder');
      
      if (error) {
        console.error('Error fetching assistants:', error);
        throw error;
      }
      
      console.log('Fetched assistants:', data);
      return data as Assistant[];
    },
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

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
                  ChatGPT Assistants & Tools
                </h1>
                <p className="mt-4 text-lg text-siso-text/80 leading-relaxed max-w-3xl">
                  Discover our curated collection of ChatGPT assistants and GPT builder tools 
                  that help streamline your workflow and boost productivity.
                </p>
              </div>
              <div className="w-full md:w-72">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/60" />
                  <Input
                    placeholder="Search assistants..."
                    className="pl-10 bg-siso-text/5 border-siso-text/10 focus-visible:ring-siso-orange transition-all duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Alert className="bg-gradient-to-br from-siso-text/5 to-transparent border border-siso-text/10 backdrop-blur-sm">
                  <Bot className="h-4 w-4 text-siso-orange" />
                  <AlertDescription className="text-siso-text/90">
                    <span className="font-semibold text-siso-text">AI Assistants:</span> Browse specialized AI assistants for tasks like code generation and workflow optimization.
                  </AlertDescription>
                </Alert>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Alert className="bg-gradient-to-br from-siso-text/5 to-transparent border border-siso-text/10 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-siso-orange" />
                  <AlertDescription className="text-siso-text/90">
                    <span className="font-semibold text-siso-text">GPT Tools:</span> Explore popular GPT builder tools with millions of conversations.
                  </AlertDescription>
                </Alert>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Alert className="bg-gradient-to-br from-siso-text/5 to-transparent border border-siso-text/10 backdrop-blur-sm">
                  <Filter className="h-4 w-4 text-siso-orange" />
                  <AlertDescription className="text-siso-text/90">
                    <span className="font-semibold text-siso-text">Quick Access:</span> Filter by type or browse featured assistants to find the perfect AI helper.
                  </AlertDescription>
                </Alert>
              </motion.div>
            </div>

            <ScrollArea className="w-full">
              <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
                <TabsList className="h-auto flex-wrap bg-gradient-to-r from-siso-text/5 to-siso-text/10 border border-siso-text/10 p-2 rounded-xl">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="m-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-siso-red/20 data-[state=active]:to-siso-orange/20 data-[state=active]:text-siso-orange transition-all duration-300"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                      <span className="ml-2 text-sm text-siso-text/60">
                        {category === 'all' 
                          ? assistants?.length || 0 
                          : category === 'featured'
                            ? assistants?.filter(a => (a.rating && a.rating >= 4.5) || (a.review_average && a.review_average >= 4.5)).length || 0
                            : categoryCounts?.[category] || 0}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </ScrollArea>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="h-[200px] rounded-lg bg-gradient-to-br from-siso-text/5 to-transparent animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssistants?.map((assistant, index) => (
                <AssistantCard
                  key={assistant.id}
                  assistant={assistant}
                  onClick={() => setSelectedAssistant(assistant)}
                  index={index}
                />
              ))}
            </div>
          )}

          <AssistantDetails
            assistant={selectedAssistant}
            onClose={() => setSelectedAssistant(null)}
          />
        </div>
      </div>
    </div>
  );
}
