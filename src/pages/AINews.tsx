import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Calendar, MessageSquare, Share2, Twitter, Instagram } from 'lucide-react';
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

const AINews = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('03');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, [selectedMonth, selectedYear]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_news')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching news",
          description: error.message,
        });
        return;
      }

      setNewsItems(data || []);

      // Fetch existing summaries
      const { data: summariesData, error: summariesError } = await supabase
        .from('ai_news_summaries')
        .select('news_id, summary');

      if (!summariesError && summariesData) {
        const summariesMap = summariesData.reduce((acc: Record<string, string>, curr) => {
          acc[curr.news_id] = curr.summary;
          return acc;
        }, {});
        setSummaries(summariesMap);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch news items",
      });
    }
  };

  const handleShare = (platform: string, summary: string, title: string) => {
    const text = `${title}\n\n${summary}`;
    const url = window.location.href;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
        break;
      case 'instagram':
      case 'skool':
        navigator.clipboard.writeText(text + '\n' + url);
        toast({
          title: "Copied to clipboard",
          description: `You can now paste this in ${platform}`,
        });
        break;
    }
  };

  const generateSummary = async (id: string) => {
    if (summaries[id]) return;
    
    setLoadingSummaries(prev => ({ ...prev, [id]: true }));
    const newsItem = newsItems.find(item => item.id === id);
    
    if (!newsItem) {
      setLoadingSummaries(prev => ({ ...prev, [id]: false }));
      return;
    }

    try {
      // First try to fetch an existing summary
      const { data: existingSummary, error: fetchError } = await supabase
        .from('ai_news_summaries')
        .select('summary')
        .eq('news_id', id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingSummary) {
        setSummaries(prev => ({ ...prev, [id]: existingSummary.summary }));
        setLoadingSummaries(prev => ({ ...prev, [id]: false }));
        return;
      }

      // If no existing summary, generate a new one
      const { data, error } = await supabase.functions.invoke('chat-with-bot', {
        body: { 
          message: `Please provide a brief 2-3 sentence summary of this news: ${newsItem.title}. ${newsItem.description}`,
          systemPrompt: "You are a concise news summarizer. Provide brief, factual summaries."
        },
      });

      if (error) throw error;

      const summary = data.response;

      // Store the new summary
      const { error: insertError } = await supabase
        .from('ai_news_summaries')
        .insert([{ news_id: id, summary }]);

      if (insertError) throw insertError;

      setSummaries(prev => ({ ...prev, [id]: summary }));
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
        <div className="flex-1 p-4 md:p-6 lg:p-8 max-h-screen overflow-y-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
                Latest AI News
              </h1>
              <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="03">March</SelectItem>
                    <SelectItem value="02">February</SelectItem>
                    <SelectItem value="01">January</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {newsItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card className="hover:bg-card/60 transition-colors duration-200">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="w-full sm:w-1/4 max-w-[300px] mx-auto sm:mx-0">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="rounded-lg object-cover w-full aspect-video"
                          />
                        </div>
                        <div className="flex-1 space-y-3 sm:space-y-4">
                          <div>
                            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-siso-text-bold hover:text-siso-red transition-colors line-clamp-2">
                              {item.title}
                            </h2>
                            <p className="text-sm sm:text-base text-siso-text/80 line-clamp-2">{item.description}</p>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-siso-text/60">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                            <span>{item.source}</span>
                            <span className="bg-siso-red/10 text-siso-red px-2 py-1 rounded text-xs">
                              {item.impact} Impact
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 sm:gap-4 pt-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => !summaries[item.id] && generateSummary(item.id)}
                                  className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors w-full sm:w-auto"
                                >
                                  {loadingSummaries[item.id] ? (
                                    "Generating Summary..."
                                  ) : (
                                    "View AI Summary"
                                  )}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>AI Summary & Share Options</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 sm:space-y-6 py-4">
                                  {summaries[item.id] ? (
                                    <div className="bg-card p-3 sm:p-4 rounded-lg border border-siso-red/20">
                                      <p className="text-sm sm:text-base">{summaries[item.id]}</p>
                                    </div>
                                  ) : (
                                    <div className="text-center text-muted-foreground">
                                      Generating summary...
                                    </div>
                                  )}
                                  
                                  <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleShare('twitter', summaries[item.id] || '', item.title)}
                                      className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
                                    >
                                      <Twitter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                      Share on X
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleShare('whatsapp', summaries[item.id] || '', item.title)}
                                      className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
                                    >
                                      <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                      Share on WhatsApp
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleShare('instagram', summaries[item.id] || '', item.title)}
                                      className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
                                    >
                                      <Instagram className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                      Share on Instagram
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleShare('skool', summaries[item.id] || '', item.title)}
                                      className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
                                    >
                                      <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                      Share on Skool
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
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