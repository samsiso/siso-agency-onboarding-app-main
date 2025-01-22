<lov-code>
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
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
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
    const newsItem = newsItems.find(item => item