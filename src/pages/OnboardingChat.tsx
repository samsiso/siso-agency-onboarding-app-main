
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, User, Send, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageLoading } from '@/components/ui/message-loading';
import { useOnboardingAuth } from '@/hooks/useOnboardingAuth';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

interface PlanOption {
  id: string;
  title: string;
  description: string;
  price: string;
}

const planOptions: PlanOption[] = [
  {
    id: 'basic',
    title: 'Basic Plan',
    description: 'Perfect for individuals just getting started',
    price: '$19/month'
  },
  {
    id: 'pro',
    title: 'Pro Plan',
    description: 'For professionals with advanced needs',
    price: '$49/month'
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    description: 'For teams and organizations with custom requirements',
    price: 'Custom pricing'
  }
];

const OnboardingChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'welcome' | 'questions' | 'plans'>('welcome');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { userId, isLoading: authLoading } = useOnboardingAuth();

  useEffect(() => {
    // Initialize chat with welcome message
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "👋 Welcome to SISO! I'm your personal assistant, and I'll guide you through setting up your account. Let's start by understanding your needs so I can recommend the best plan for you."
      }
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim() || loading) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simulate assistant response after a delay
    setTimeout(() => {
      let assistantResponse = "Thanks for sharing that! Could you tell me a bit more about your specific needs?";
      
      // Logic to determine appropriate responses based on user input and current step
      if (step === 'welcome') {
        assistantResponse = "Great! I'd like to know more about your business. What industry are you in and what are your main goals with our platform?";
        setStep('questions');
      } else if (step === 'questions' && messages.length > 3) {
        assistantResponse = "Based on what you've told me, I have some plan recommendations that would be perfect for your needs. Please take a look:";
        setStep('plans');
      }
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: assistantResponse
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    
    const planMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: `I'm interested in the ${planOptions.find(p => p.id === planId)?.title}.`
    };
    
    setMessages(prev => [...prev, planMessage]);
    
    setTimeout(() => {
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `Excellent choice! The ${planOptions.find(p => p.id === planId)?.title} is perfect for your needs. Let's get you set up right away.`
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  const handleContinue = () => {
    navigate('/thankyou');
  };

  const handleBack = () => {
    navigate('/');
  };

  const renderPlans = () => {
    if (step !== 'plans') return null;
    
    return (
      <div className="w-full space-y-4 my-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {planOptions.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                selectedPlan === plan.id 
                  ? 'border-siso-orange bg-gradient-to-r from-siso-red/10 to-siso-orange/10' 
                  : 'border-siso-text/10 hover:border-siso-text/30 bg-black/20'
              }`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              <h3 className="font-semibold text-lg text-siso-text-bold">{plan.title}</h3>
              <p className="text-sm text-siso-text/80 mt-1">{plan.description}</p>
              <div className="mt-3 text-siso-orange font-medium">{plan.price}</div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-black via-siso-bg to-black">
        <div className="w-10 h-10 border-4 border-siso-orange/50 border-t-siso-orange rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-siso-bg to-black">
      {/* Header */}
      <header className="p-4 border-b border-siso-text/10 flex items-center justify-between bg-black/30 backdrop-blur-sm fixed top-0 left-0 right-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-siso-text hover:text-siso-text-bold hover:bg-black/20"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold text-white">SISO Onboarding</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleContinue}
          className="text-siso-text hover:text-siso-text-bold hover:bg-black/20"
        >
          <X size={20} />
        </Button>
      </header>
      
      {/* Main chat container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-20 pb-24">
        {/* Chat messages */}
        <div className="flex-1 space-y-6 py-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 ${
                    message.role === 'assistant' 
                      ? 'bg-gradient-to-r from-siso-red to-siso-orange' 
                      : 'bg-siso-text/30'
                  } ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                    {message.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  
                  <div className={`rounded-2xl p-4 ${
                    message.role === 'assistant'
                      ? 'bg-black/40 text-white border border-siso-text/10'
                      : 'bg-siso-orange/90 text-black'
                  }`}>
                    {message.content}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex max-w-[80%] flex-row">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full shrink-0 bg-gradient-to-r from-siso-red to-siso-orange mr-3">
                    <Bot size={20} />
                  </div>
                  
                  <div className="rounded-2xl p-4 bg-black/40 text-white border border-siso-text/10">
                    <MessageLoading />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {renderPlans()}
          
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      {/* Input area */}
      <div className="p-4 border-t border-siso-text/10 bg-black/30 backdrop-blur-sm fixed bottom-0 left-0 right-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-black/30 border border-siso-text/20 rounded-lg p-3 text-white placeholder:text-siso-text/50 focus:outline-none focus:ring-2 focus:ring-siso-orange/50 resize-none min-h-[50px] max-h-[100px]"
              disabled={loading || step === 'plans' && selectedPlan !== null}
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim() || (step === 'plans' && selectedPlan !== null)}
              className="bg-gradient-to-r from-siso-red to-siso-orange text-white rounded-full h-12 w-12 p-0 flex items-center justify-center"
            >
              <Send size={20} />
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              onClick={handleContinue} 
              variant="outline" 
              className="text-siso-text border-siso-text/30 hover:bg-siso-text/10"
            >
              Skip Onboarding
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingChat;
