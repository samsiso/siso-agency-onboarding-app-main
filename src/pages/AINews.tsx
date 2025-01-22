import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Globe, Newspaper, Sparkles, Calendar, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleAskAI = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-bot', {
        body: { 
          message: chatInput,
          systemPrompt: "You are an AI news analyst. Summarize and analyze AI news, providing insights and context about recent developments in artificial intelligence."
        },
      });

      if (error) throw error;
      setChatResponse(data.response);
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 bg-siso-bg p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
                Significant AI News
              </h1>
              <p className="text-lg text-siso-text/80 max-w-2xl">
                Stay updated with the latest breakthroughs, policy changes, and significant developments in the AI industry.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return (
                        <SelectItem key={month} value={month}>
                          {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {['2024', '2023', '2022'].map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={isAIChatOpen} onOpenChange={setIsAIChatOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask AI About News
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-siso-bg border-siso-text/10">
                  <DialogHeader>
                    <DialogTitle className="text-siso-text-bold">AI News Analysis</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-4">
                      {chatResponse && (
                        <div className="p-4 rounded-lg bg-siso-text/5 text-siso-text">
                          {chatResponse}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask about recent AI news..."
                          className="flex-1 bg-siso-text/5 border border-siso-text/10 rounded-lg px-4 py-2 text-siso-text placeholder:text-siso-text/50 focus:outline-none focus:ring-2 focus:ring-siso-orange/50"
                        />
                        <Button 
                          onClick={handleAskAI}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            "Ask"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <motion.div 
              className="grid gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {newsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={item.id} 
                    variants={itemVariants}
                  >
                    <Card className="glow-card group hover:scale-[1.01] transition-all duration-300 border-siso-text/5">
                      <CardHeader className="flex flex-row items-start gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold text-siso-text-bold group-hover:text-siso-red transition-colors">
                              {item.title}
                            </CardTitle>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.impact === 'High' 
                                ? 'bg-siso-red/10 text-siso-red' 
                                : 'bg-siso-orange/10 text-siso-orange'
                            }`}>
                              {item.impact} Impact
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-siso-text/70">
                            <Icon className="w-5 h-5 text-siso-orange" />
                            <span className="font-medium">{item.source}</span>
                            <span className="w-1 h-1 rounded-full bg-siso-text/30" />
                            <span>{item.date}</span>
                            <span className="w-1 h-1 rounded-full bg-siso-text/30" />
                            <span className="text-siso-orange">{item.category}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <p className="text-siso-text/90 leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AINews;