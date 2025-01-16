import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { MessageSquare, Send, Brain, Sparkles, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const SisoAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your SISO AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-assistant', {
        body: { message: userMessage, threadId },
      });

      if (error) throw error;

      setThreadId(data.threadId);
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response from assistant. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-siso-text/10 pb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-siso-red" />
              </div>
              <h1 className="text-4xl font-bold text-siso-text-bold">SISO AI Assistant</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Alert className="bg-gradient-to-br from-siso-text/5 to-siso-text/10 border border-siso-text/10 hover:border-siso-red/30 transition-colors">
                <Brain className="h-5 w-5 text-siso-red" />
                <AlertDescription className="text-siso-text/90 text-sm mt-1">
                  <span className="font-semibold text-siso-text-bold block mb-1">Smart Navigation</span>
                  Get instant guidance on finding tools, resources, and community members across the SISO platform.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-gradient-to-br from-siso-text/5 to-siso-text/10 border border-siso-text/10 hover:border-siso-orange/30 transition-colors">
                <Bot className="h-5 w-5 text-siso-orange" />
                <AlertDescription className="text-siso-text/90 text-sm mt-1">
                  <span className="font-semibold text-siso-text-bold block mb-1">Personalized Help</span>
                  Ask questions about tools, automations, or get recommendations tailored to your needs.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-gradient-to-br from-siso-text/5 to-siso-text/10 border border-siso-text/10 hover:border-siso-red/30 transition-colors">
                <Sparkles className="h-5 w-5 text-siso-red" />
                <AlertDescription className="text-siso-text/90 text-sm mt-1">
                  <span className="font-semibold text-siso-text-bold block mb-1">Expert Knowledge</span>
                  Access detailed information about SISO's features, community resources, and best practices.
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="bg-black/20 rounded-xl border border-siso-text/10 h-[calc(100vh-20rem)] flex flex-col">
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        message.role === 'assistant' 
                          ? 'bg-gradient-to-br from-siso-red to-siso-orange' 
                          : 'bg-gradient-to-br from-siso-text/20 to-siso-text/30'
                      }`}>
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-siso-text-bold mb-2">
                          {message.role === 'assistant' ? 'SISO AI' : 'You'}
                        </p>
                        <div className="bg-siso-text/5 rounded-lg p-4 text-siso-text">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="border-t border-siso-text/10 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-black/20 border border-siso-text/10 rounded-lg px-4 py-3 text-siso-text placeholder:text-siso-text/50 focus:outline-none focus:ring-2 focus:ring-siso-red/50 transition-all"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-siso-red to-siso-orange text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SisoAI;