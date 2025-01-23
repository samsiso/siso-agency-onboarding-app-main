import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { MessageSquare, Send, Brain, Sparkles, Bot, Wrench, GraduationCap, Network } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

type AssistantType = 'general' | 'tools' | 'education' | 'automations' | 'assistants' | 'ai' | 'networking' | 'news';

const assistantTypes = [
  { id: 'general', label: 'General Assistant', icon: Bot },
  { id: 'tools', label: 'Tools Expert', icon: Wrench },
  { id: 'education', label: 'Education Guide', icon: GraduationCap },
  { id: 'automations', label: 'Automation Specialist', icon: Bot },
  { id: 'assistants', label: 'AI Assistant Expert', icon: MessageSquare },
  { id: 'networking', label: 'Networking Guide', icon: Network },
  { id: 'ai', label: 'AI Specialist', icon: Brain },
  { id: 'news', label: 'AI News Expert', icon: MessageSquare },
] as const;

const getAssistantPrompt = (type: AssistantType) => {
  switch (type) {
    case 'tools':
      return "You are a SISO Tools expert. Help users find and understand various tools, their features, pricing, and best use cases. Focus on providing practical advice about tool selection and implementation.";
    case 'education':
      return "You are a SISO Education specialist. Guide users through available courses, educational content, and learning paths. Help them find the most relevant educational resources for their needs.";
    case 'automations':
      return "You are a SISO Automation expert. Help users understand different automation workflows, integration possibilities, and best practices for implementing automations in their business.";
    case 'assistants':
      return "You are a SISO AI Assistants specialist. Guide users in selecting and implementing the right AI assistants for their specific needs, explaining capabilities and use cases.";
    case 'networking':
      return "You are a SISO Networking expert. Help users connect with relevant communities, find networking opportunities, and make the most of SISO's networking resources.";
    case 'ai':
      return "You are SISO's AI Implementation specialist. Guide users in leveraging AI technologies, understanding AI capabilities, and implementing AI solutions in their business.";
    case 'news':
      return "You are SISO's AI News specialist. Help users stay updated with the latest AI news, explain recent developments, and provide context about AI industry trends and breakthroughs.";
    default:
      return "You are SISO's general assistant. Help users navigate the platform, find resources, and answer general questions about SISO's services and features.";
  }
};

const SisoAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your SISO AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<AssistantType>('general');
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
        body: { 
          message: userMessage,
          systemPrompt: getAssistantPrompt(selectedAssistant)
        },
      });

      if (error) throw error;

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
      <div className="flex-1 flex">
        <div className="w-64 border-r border-siso-text/10 p-4 bg-black/20">
          <h2 className="text-lg font-semibold text-siso-text mb-4">Choose Assistant</h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-2">
              {assistantTypes.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${
                    selectedAssistant === id 
                      ? 'bg-siso-text/10 text-siso-text-bold'
                      : 'text-siso-text hover:bg-siso-text/5'
                  }`}
                  onClick={() => {
                    setSelectedAssistant(id as AssistantType);
                    setMessages([{ 
                      role: 'assistant', 
                      content: `Hello! I'm your ${label}. How can I help you today?` 
                    }]);
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="container mx-auto px-4 py-6 max-w-7xl flex-1 flex flex-col">
            <div className="space-y-6 flex-1 flex flex-col">
              <div className="flex items-center gap-4 border-b border-siso-text/10 pb-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-siso-red" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-siso-text-bold">
                    {assistantTypes.find(a => a.id === selectedAssistant)?.label}
                  </h1>
                  <p className="text-siso-text/70">
                    Ask me anything about {selectedAssistant === 'general' ? 'SISO' : selectedAssistant}
                  </p>
                </div>
              </div>
              
              <div className="bg-black/20 rounded-xl border border-siso-text/10 flex-1 flex flex-col">
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
                            {message.role === 'assistant' ? assistantTypes.find(a => a.id === selectedAssistant)?.label : 'You'}
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
    </div>
  );
};

export default SisoAI;