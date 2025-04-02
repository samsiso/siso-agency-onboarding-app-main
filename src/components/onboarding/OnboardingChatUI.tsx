
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { ChatInput } from '@/components/chat/ChatInput';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi there! 👋 I'm SISO AI, your assistant for agency growth. I can help with tools, education, and networking to scale your business. What would you like to explore today?",
    timestamp: new Date(),
  },
];

const PREDEFINED_QUESTIONS = [
  'How can AI help my agency grow?',
  'What tools do you recommend for small agencies?',
  'How do I get started with AI for my business?',
  'What educational resources do you offer?',
];

export function OnboardingChatUI() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response = '';
      
      if (content.toLowerCase().includes('grow') || content.toLowerCase().includes('scale')) {
        response = "SISO offers a suite of AI-powered tools specifically designed for agencies. Our platform helps you automate repetitive tasks, optimize workflows, and deliver better client results with less effort. When you create an account, you'll get access to our full resource hub with tools, education, and networking opportunities tailored to your agency's needs.";
      } else if (content.toLowerCase().includes('tools')) {
        response = "Our platform includes tools for content creation, client management, project automation, and performance analytics. These tools are curated specifically for agency needs and integrate seamlessly with popular platforms. Sign up for a full account to access our complete tools directory with detailed guides and integration support.";
      } else if (content.toLowerCase().includes('education') || content.toLowerCase().includes('learn')) {
        response = "SISO provides educational resources from industry experts, including video courses, tutorials, and best practice guides. Our content covers everything from AI implementation to agency scaling strategies. To access the full education library, you'll need to create an account.";
      } else {
        response = "Thanks for your interest! SISO is designed to be your all-in-one platform for agency growth. To get the most out of our platform, including personalized recommendations and access to our full resource hub, I recommend creating an account. Would you like to learn more about any specific aspect of growing your agency?";
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    handleSendMessage(question);
  };

  const handleCreateAccount = () => {
    navigate('/auth');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ChatMessageList smooth>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.role === 'assistant' ? 'received' : 'sent'}
            >
              <ChatBubbleAvatar
                fallback={message.role === 'assistant' ? 'AI' : 'You'}
                src={message.role === 'assistant' ? undefined : undefined}
              />
              <div className="flex-1">
                <ChatBubbleMessage variant={message.role === 'assistant' ? 'received' : 'sent'}>
                  <p className="text-sm">{message.content}</p>
                </ChatBubbleMessage>
                
                {message.role === 'assistant' && message.id === messages[messages.length - 1].id && (
                  <div className="mt-4">
                    <Button 
                      className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white"
                      onClick={handleCreateAccount}
                    >
                      Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </ChatBubble>
          ))}
        </ChatMessageList>
      </div>

      <div className="p-4 border-t border-white/10">
        {messages.length < 3 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <p className="w-full text-sm text-siso-text mb-2">Try asking:</p>
            {PREDEFINED_QUESTIONS.map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                className="text-xs bg-black/30 border-white/10 hover:bg-black/50"
                onClick={() => handleQuestionClick(question)}
                disabled={isLoading || selectedQuestion === question}
              >
                {question}
              </Button>
            ))}
          </div>
        )}
        
        <ChatInput
          onSubmit={handleSendMessage}
          isLoading={isLoading}
          placeholder="Type a message or ask a question..."
        />
      </div>
    </div>
  );
}
