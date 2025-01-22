import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Globe, Newspaper, Sparkles, Calendar, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Mock data for now - in a real app, this would come from an API or database
const newsItems = [
  {
    id: 1,
    title: "OpenAI Releases GPT-5",
    description: "Latest breakthrough in language models pushes boundaries of AI capabilities with unprecedented reasoning abilities and multimodal understanding. Researchers highlight significant improvements in context handling and reduced hallucinations.",
    date: "2024-03-15",
    source: "AI Weekly",
    category: "Technology",
    icon: Brain,
    impact: "High",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "AI Regulation Framework Proposed",
    description: "Global initiative to standardize AI development and deployment gains traction as major tech companies and governments collaborate on comprehensive guidelines for responsible AI implementation.",
    date: "2024-03-14",
    source: "Tech News",
    category: "Policy",
    icon: Globe,
    impact: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "New AI Research Centers Announced",
    description: "Leading universities launch dedicated AI research facilities focusing on ethical AI development, machine learning optimization, and practical applications in healthcare and climate science.",
    date: "2024-03-13",
    source: "Education Times",
    category: "Research",
    icon: Sparkles,
    impact: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
  },
];

const AINews = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('03');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summaries, setSummaries] = useState<Record<number, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const suggestedQuestions = [
    "What are the most significant AI developments this month?",
    "How will these news items impact the AI industry?",
    "What are the potential implications for businesses?"
  ];

  const handleAskAI = async () => {
    if (!chatInput.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-bot', {
        body: { 
          message: chatInput,
          systemPrompt: "You are an AI news analyst. Provide concise, factual analysis of AI industry news and developments."
        },
      });

      if (error) throw error;

      setChatResponse(data.response);
      setChatInput('');
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setChatInput(question);
  };

  const generateSummary = async (id: number) => {
    if (summaries[id]) return; // Don't generate if we already have it
    
    setLoadingSummaries(prev => ({ ...prev, [id]: true }));
    const newsItem = newsItems.find(item => item.id === id);
    
    if (!newsItem) {
      setLoadingSummaries(prev => ({ ...prev, [id]: false }));
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-bot', {
        body: { 
          message: `Please provide a brief 2-3 sentence summary of this news: ${newsItem.title}. ${newsItem.description}`,
          systemPrompt: "You are a concise news summarizer. Provide brief, factual summaries."
        },
      });

      if (error) throw error;

      setSummaries(prev => ({ ...prev, [id]: data.response }));
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate summary. Please try again.",
      });
    } finally {
      setLoadingSummaries(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">AI News</h1>
              <div className="flex gap-4">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="03">March</SelectItem>
                    <SelectItem value="02">February</SelectItem>
                    <SelectItem value="01">January</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {newsItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-2xl font-bold">{item.title}</CardTitle>
                      <item.icon className="h-6 w-6" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-6">
                        <div className="w-1/4">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="rounded-lg object-cover w-full h-48"
                          />
                        </div>
                        <div className="flex-1 space-y-4">
                          <p className="text-muted-foreground">{item.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {item.date}
                            </span>
                            <span>{item.source}</span>
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                              {item.impact} Impact
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateSummary(item.id)}
                              disabled={loadingSummaries[item.id]}
                            >
                              {loadingSummaries[item.id] ? (
                                "Generating Summary..."
                              ) : (
                                "Generate AI Summary"
                              )}
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  Chat about this news
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Chat about {item.title}</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col h-[500px]">
                                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {summaries[item.id] && (
                                      <div className="bg-primary/10 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">AI Summary:</h4>
                                        <p>{summaries[item.id]}</p>
                                      </div>
                                    )}
                                    {chatResponse && (
                                      <div className="bg-secondary/10 p-4 rounded-lg">
                                        <p>{chatResponse}</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="border-t p-4 space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                      {suggestedQuestions.map((question, index) => (
                                        <Button
                                          key={index}
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleSuggestedQuestion(question)}
                                        >
                                          {question}
                                        </Button>
                                      ))}
                                    </div>
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                                        placeholder="Type your question..."
                                        className="flex-1 px-3 py-2 bg-background border rounded-md"
                                      />
                                      <Button
                                        onClick={handleAskAI}
                                        disabled={isLoading}
                                        className="flex items-center gap-2"
                                      >
                                        <Send className="h-4 w-4" />
                                        {isLoading ? "Sending..." : "Send"}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          {summaries[item.id] && (
                            <div className="bg-primary/10 p-4 rounded-lg mt-4">
                              <h4 className="font-semibold mb-2">AI Summary:</h4>
                              <p>{summaries[item.id]}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AINews;