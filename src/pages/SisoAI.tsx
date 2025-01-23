import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { MessageSquare, Brain, Sparkles, Bot, Wrench, GraduationCap, Network } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { useToast } from '@/hooks/use-toast';

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

  const handleSubmit = async (message: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-assistant', {
        body: { 
          message,
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
                <button
                  key={id}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
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
                </button>
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
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    {messages.map((message, index) => (
                      <ChatMessage
                        key={index}
                        role={message.role}
                        content={message.content}
                        assistantType={assistantTypes.find(a => a.id === selectedAssistant)?.label}
                        isLoading={isLoading && index === messages.length - 1 && message.role === 'assistant'}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SisoAI;
