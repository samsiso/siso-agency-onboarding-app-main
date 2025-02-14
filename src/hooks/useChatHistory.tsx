
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

interface ChatHistoryEntry {
  id: string;
  conversation_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
}

export const useChatHistory = () => {
  const [history, setHistory] = useState<ChatHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error: any) {
      toast({
        title: "Failed to load history",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveConversation = async (messages: ChatMessage[]) => {
    try {
      const title = messages[0]?.content.slice(0, 50) + '...';
      
      const { error } = await supabase
        .from('chat_history')
        .insert({
          conversation_id: crypto.randomUUID(),
          title,
          messages
        });

      if (error) throw error;
      await loadHistory();
    } catch (error: any) {
      toast({
        title: "Failed to save conversation",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    history,
    isLoading,
    saveConversation,
    loadHistory
  };
};
