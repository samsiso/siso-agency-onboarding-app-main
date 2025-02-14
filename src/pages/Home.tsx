import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Sidebar";
import { Waves } from '@/components/ui/waves-background';
import { PreChatState } from '@/components/home/PreChatState';
import { EnhancedChatState } from '@/components/home/EnhancedChatState';
import { ChatMessage, ProcessingStage, AgentCategory } from '@/types/chat';

// [Analysis] Separated concerns for better maintainability
export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;

    if (!isExpanded) {
      setIsExpanded(true);
    }

    // Add user message to the beginning
    setMessages(prev => [{ role: 'user', content: message }, ...prev]);
    
    // Initialize assistant message with first stage at the beginning
    setMessages(prev => [{
      role: 'assistant',
      content: '',
      loading: true,
      processingStage: {
        current: 'initial',
        progress: 0
      },
      agentResponses: {
        'ai-tools': { category: 'ai-tools', content: '', status: 'pending', relevance: 0 },
        'videos': { category: 'videos', content: '', status: 'pending', relevance: 0 },
        'networking': { category: 'networking', content: '', status: 'pending', relevance: 0 },
        'assistants': { category: 'assistants', content: '', status: 'pending', relevance: 0 },
        'educators': { category: 'educators', content: '', status: 'pending', relevance: 0 },
        'news': { category: 'news', content: '', status: 'pending', relevance: 0 }
      }
    }, ...prev]);
    
    setIsLoading(true);

    try {
      // Simulate the multi-stage processing
      const stages: ProcessingStage[] = ['initial', 'context', 'agents', 'synthesis'];
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      // Initial understanding stage
      await delay(1000);
      updateProcessingStage('initial');

      // Company context stage
      await delay(1000);
      updateProcessingStage('context');

      // Agent processing stage
      await delay(1000);
      updateProcessingStage('agents');

      // Simulate individual agent processing
      const agentCategories: AgentCategory[] = ['ai-tools', 'videos', 'networking', 'assistants', 'educators', 'news'];
      for (const category of agentCategories) {
        await delay(800);
        updateAgentStatus(category, 'processing');
        await delay(1200);
        updateAgentStatus(category, 'complete');
      }

      // Final synthesis stage
      await delay(1000);
      updateProcessingStage('synthesis');

      // Get the final response from the edge function
      const { data, error } = await supabase.functions.invoke('chat-with-assistant', {
        body: { message }
      });

      if (error) throw error;

      // Update with final response at the beginning
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[0] = { 
          role: 'assistant', 
          content: data.response,
          loading: false
        };
        return newMessages;
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
      setMessages(prev => prev.slice(1)); // Remove the loading message
    } finally {
      setIsLoading(false);
    }
  };

  const updateProcessingStage = (stage: ProcessingStage) => {
    setMessages(prev => {
      const lastMessage = prev[0];
      if (lastMessage.role === 'assistant') {
        return [{
          ...lastMessage,
          processingStage: {
            ...lastMessage.processingStage!,
            current: stage
          }
        }, ...prev.slice(1)];
      }
      return prev;
    });
  };

  const updateAgentStatus = (category: AgentCategory, status: 'pending' | 'processing' | 'complete') => {
    setMessages(prev => {
      const lastMessage = prev[0];
      if (lastMessage.role === 'assistant' && lastMessage.agentResponses) {
        return [{
          ...lastMessage,
          agentResponses: {
            ...lastMessage.agentResponses,
            [category]: {
              ...lastMessage.agentResponses[category],
              status
            }
          }
        }, ...prev.slice(1)];
      }
      return prev;
    });
  };

  return (
    <div className="relative flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Waves 
          lineColor="rgba(255, 87, 34, 0.2)"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>

      <Sidebar />
      <div className="relative z-10 flex-1 p-4 md:p-8">
        <div className="h-[calc(100vh-4rem)]">
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <PreChatState handleSubmit={handleSubmit} isLoading={isLoading} />
            ) : (
              <EnhancedChatState 
                messages={messages} 
                handleSubmit={handleSubmit} 
                isLoading={isLoading} 
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
