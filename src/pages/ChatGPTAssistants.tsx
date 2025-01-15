import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { Bot, ExternalLink, Heart, Search, Star, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface Assistant {
  id: string;
  name: string;
  description: string | null;
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
}

export default function ChatGPTAssistants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['All', 'Featured', 'Software', 'Coding', 'Actions'];

  const { data: assistants, isLoading, error } = useQuery({
    queryKey: ['assistants'],
    queryFn: async () => {
      console.log('Fetching assistants...');
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('category', 'assistant');
      
      if (error) {
        console.error('Error fetching assistants:', error);
        throw error;
      }
      
      console.log('Fetched assistants:', data);
      return data as Assistant[];
    },
  });

  const filteredAssistants = assistants?.filter(assistant => {
    const matchesSearch = !searchQuery || 
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || 
      (selectedCategory === 'Software' && assistant.assistant_type === 'software') ||
      (selectedCategory === 'Coding' && assistant.assistant_type === 'coding') ||
      (selectedCategory === 'Actions' && assistant.assistant_type === 'actions') ||
      (selectedCategory === 'Featured' && assistant.rating && assistant.rating >= 4.5);

    return matchesSearch && matchesCategory;
  });

  if (error) {
    console.error('Error in component:', error);
    return <div className="text-red-500">Error loading assistants. Please try again later.</div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-4xl font-bold text-siso-text-bold">
                ChatGPT Assistants
              </h1>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/60" />
                <Input
                  placeholder="Search assistants..."
                  className="pl-10 bg-siso-text/5 border-siso-text/10 focus-visible:ring-siso-orange"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className={`${
                    selectedCategory === category || (category === 'All' && !selectedCategory)
                      ? 'bg-siso-orange text-white hover:bg-siso-orange/90'
                      : 'bg-siso-text/5 hover:bg-siso-text/10'
                  } text-sm`}
                  onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-siso-text">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssistants?.map((assistant) => (
                <Card 
                  key={assistant.id} 
                  className="group bg-card/50 backdrop-blur border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedAssistant(assistant)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-siso-orange" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-siso-text-bold truncate">{assistant.name}</h3>
                        <p className="text-xs text-siso-text/80">{assistant.assistant_type || 'AI Assistant'}</p>
                      </div>
                    </div>
                    {assistant.description && (
                      <p className="mt-2 text-xs text-siso-text line-clamp-2">
                        {assistant.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-siso-orange" />
                        <span className="text-xs text-siso-text">
                          {assistant.rating?.toFixed(1) || '-'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-siso-red" />
                        <span className="text-xs text-siso-text">{assistant.likes_count || '0'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Sheet open={!!selectedAssistant} onOpenChange={() => setSelectedAssistant(null)}>
            <SheetContent className="bg-siso-bg border-l border-siso-text/10 w-full sm:max-w-xl">
              {selectedAssistant && (
                <>
                  <SheetHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
                          <Bot className="w-6 h-6 text-siso-orange" />
                        </div>
                        <div>
                          <SheetTitle className="text-2xl font-bold text-siso-text-bold">
                            {selectedAssistant.name}
                          </SheetTitle>
                          <p className="text-sm text-siso-text/80">
                            {selectedAssistant.assistant_type || 'AI Assistant'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setSelectedAssistant(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <SheetDescription className="text-siso-text">
                      {selectedAssistant.description}
                    </SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 space-y-6">
                    {selectedAssistant.prompt_template && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-siso-text-bold">Prompt Template</h3>
                        <pre className="p-4 rounded-lg bg-siso-text/5 text-sm text-siso-text overflow-x-auto">
                          {selectedAssistant.prompt_template}
                        </pre>
                      </div>
                    )}

                    {selectedAssistant.use_cases && selectedAssistant.use_cases.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-siso-text-bold">Use Cases</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedAssistant.use_cases.map((useCase, index) => (
                            <span 
                              key={index}
                              className="text-sm px-3 py-1 rounded-full bg-siso-text/10 text-siso-text"
                            >
                              {useCase}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedAssistant.input_variables && selectedAssistant.input_variables.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-siso-text-bold">Input Variables</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedAssistant.input_variables.map((variable, index) => (
                            <span 
                              key={index}
                              className="text-sm px-3 py-1 rounded-full bg-siso-orange/10 text-siso-orange"
                            >
                              {variable}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-siso-text-bold">Technical Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-siso-text/5">
                          <div className="text-sm font-medium text-siso-text-bold">Model</div>
                          <div className="text-sm text-siso-text">{selectedAssistant.model_type || '-'}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-siso-text/5">
                          <div className="text-sm font-medium text-siso-text-bold">Response Format</div>
                          <div className="text-sm text-siso-text">{selectedAssistant.response_format || '-'}</div>
                        </div>
                      </div>
                    </div>

                    {selectedAssistant.website_url && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-siso-text-bold">Quick Actions</h3>
                        <Button
                          className="w-full justify-start gap-2"
                          onClick={() => window.open(selectedAssistant.website_url!, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Try Assistant
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}