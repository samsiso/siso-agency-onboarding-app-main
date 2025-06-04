import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, User, X, ArrowLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageLoading } from '@/components/ui/message-loading';
import { useOnboardingAuth } from '@/hooks/useOnboardingAuth';
import { supabase } from '@/integrations/supabase/client';
import { SisoIcon } from '@/components/ui/icons/SisoIcon';
import { BusinessDataInput } from '@/components/app-plan/BusinessDataForm';
import { appPlanAgent } from '@/services/appPlanAgent';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  requiresAction?: boolean;
  actionComponent?: React.ReactNode;
}

const OnboardingChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'name' | 'company' | 'industry' | 'app_purpose' | 'target_audience' | 'desired_features' | 'budget' | 'timeline' | 'additional_requirements' | 'generating_plan' | 'complete'>('name');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    industry: '',
    app_purpose: '',
    target_audience: '',
    desired_features: '',
    budget: '',
    timeline: '',
    additional_requirements: '',
  });
  const [waitingForUserInput, setWaitingForUserInput] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { userId, isLoading: authLoading } = useOnboardingAuth();
  const { toast } = useToast();

  // Industry options for suggestions
  const industries = [
    'Retail & E-commerce',
    'Health & Fitness',
    'Finance & Banking',
    'Education & Learning',
    'Food & Beverage',
    'Travel & Hospitality',
    'Real Estate & Property',
    'Software & Technology',
    'Media & Entertainment',
    'Professional Services',
    'Manufacturing',
    'Healthcare',
    'Non-profit & Charity'
  ];

  // Timeline options
  const timelineOptions = [
    '1-2 months',
    '3-4 months',
    '5-6 months',
    '6-12 months',
    'Over 12 months',
    'Flexible'
  ];

  // Budget ranges
  const budgetRanges = [
    'Under £10,000',
    '£10,000 - £25,000',
    '£25,000 - £50,000',
    '£50,000 - £100,000',
    '£100,000+',
    'Flexible'
  ];

  // Initialize the chat with welcome message
  useEffect(() => {
    // Show typing indicator first
    setShowTypingIndicator(true);
    
    // Add first message after a short delay
    setTimeout(() => {
      setShowTypingIndicator(false);
      const welcomeMessage = {
        id: '1',
        role: 'assistant' as const,
        content: "👋 Hi there! I'm SISO, your personal assistant. I'll help you get started with our platform by asking a few quick questions to build your app plan."
      };
      
      setMessages([welcomeMessage]);
      
      // Show typing indicator again for second message
      setTimeout(() => {
        setShowTypingIndicator(true);
        
        // Add second message after a short delay
        setTimeout(() => {
          setShowTypingIndicator(false);
          const namePrompt = {
            id: '2',
            role: 'assistant' as const,
            content: "What's your name?",
            requiresAction: true
          };
          
          setMessages(prev => [...prev, namePrompt]);
          setWaitingForUserInput(true);
        }, 1000);
      }, 500);
    }, 1000);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTypingIndicator]);

  // Simulate progress for the app plan generation process
  useEffect(() => {
    if (isGeneratingPlan) {
      // First stage: Industry research (0-40%)
      const timer1 = setTimeout(() => {
        setGenerationStage('Researching industry trends and market data');
        setGenerationProgress(10);
      }, 300);
      
      const timer2 = setTimeout(() => {
        setGenerationProgress(20);
      }, 1200);
      
      const timer3 = setTimeout(() => {
        setGenerationProgress(30);
      }, 2000);
      
      // Second stage: Analyzing requirements (40-70%)
      const timer4 = setTimeout(() => {
        setGenerationStage('Analyzing requirements and identifying features');
        setGenerationProgress(40);
      }, 3000);
      
      const timer5 = setTimeout(() => {
        setGenerationProgress(50);
      }, 4000);
      
      const timer6 = setTimeout(() => {
        setGenerationProgress(60);
      }, 5000);
      
      // Third stage: Generating plan (70-90%)
      const timer7 = setTimeout(() => {
        setGenerationStage('Creating app plan with tailored features');
        setGenerationProgress(70);
      }, 6000);
      
      const timer8 = setTimeout(() => {
        setGenerationProgress(80);
      }, 7000);
      
      // Final stage: Finalizing (90-95%)
      const timer9 = setTimeout(() => {
        setGenerationStage('Finalizing and preparing results');
        setGenerationProgress(90);
      }, 8000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
        clearTimeout(timer6);
        clearTimeout(timer7);
        clearTimeout(timer8);
        clearTimeout(timer9);
      };
    }
  }, [isGeneratingPlan]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChatSubmit = async (message: string) => {
    if (!message.trim() || loading) return;
    
    setWaitingForUserInput(false);
    setInput('');
    
    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Process the user's message based on current step
    if (currentStep === 'name') {
      // Save the name and move to company step
      setFormData(prev => ({ ...prev, name: message }));
      
      // Show typing indicator
      setShowTypingIndicator(true);
      
      // Send next message after delay
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: `Thanks, ${message}! What company or organization are you with?`,
          requiresAction: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('company');
        setWaitingForUserInput(true);
      }, 1000);
    } 
    else if (currentStep === 'company') {
      // Save the company and move to industry step
      setFormData(prev => ({ ...prev, company: message }));
      
      // Show typing indicator
      setShowTypingIndicator(true);
      
      // Send next message after delay
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: `Great! What industry is ${message} in? (Choose from options or type your own)`,
          actionComponent: (
            <div className="mt-3 flex flex-wrap gap-2">
              {industries.slice(0, 6).map((industry) => (
                <Button 
                  key={industry}
                  variant="outline" 
                  size="sm"
                  onClick={() => handleIndustrySelect(industry)}
                  className="bg-black/30 border-siso-text/20 text-white"
                >
                  {industry}
                </Button>
              ))}
            </div>
          ),
          requiresAction: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('industry');
        setWaitingForUserInput(true);
      }, 1000);
    }
    else if (currentStep === 'industry') {
      // Handle industry selection
      handleIndustrySelect(message);
    }
    else if (currentStep === 'app_purpose') {
      // Save the app purpose and move to target audience step
      setFormData(prev => ({ ...prev, app_purpose: message }));
      
      // Show typing indicator
      setShowTypingIndicator(true);
      
      // Send next message after delay
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: "Who is the target audience for your app?",
          requiresAction: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('target_audience');
        setWaitingForUserInput(true);
      }, 1000);
    }
    else if (currentStep === 'target_audience') {
      // Save the target audience and move to desired features step
      setFormData(prev => ({ ...prev, target_audience: message }));
      
      // Show typing indicator
      setShowTypingIndicator(true);
      
      // Send next message after delay
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: "What specific features would you like in your app? (Separate with commas)",
          requiresAction: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('desired_features');
        setWaitingForUserInput(true);
      }, 1000);
    }
    else if (currentStep === 'desired_features') {
      // Save the desired features and move to budget step
      setFormData(prev => ({ ...prev, desired_features: message }));
      
      // Show typing indicator
      setShowTypingIndicator(true);
      
      // Send next message after delay
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: "What's your budget range for this project?",
          actionComponent: (
            <div className="mt-3 flex flex-wrap gap-2">
              {budgetRanges.map((budget) => (
                <Button 
                  key={budget}
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBudgetSelect(budget)}
                  className="bg-black/30 border-siso-text/20 text-white"
                >
                  {budget}
                </Button>
              ))}
            </div>
          ),
          requiresAction: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('budget');
        setWaitingForUserInput(true);
      }, 1000);
    }
    else if (currentStep === 'budget') {
      // Handle budget selection
      handleBudgetSelect(message);
    }
    else if (currentStep === 'timeline') {
      // Handle timeline selection
      handleTimelineSelect(message);
    }
    else if (currentStep === 'additional_requirements') {
      // Save additional requirements and generate app plan
      setFormData(prev => ({ ...prev, additional_requirements: message }));
      
      // Show typing indicator
      setShowTypingIndicator(true);
      
      // Send next message after delay
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: "Thanks for providing all the information! I'll now generate an app plan based on your requirements."
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('generating_plan');
        
        // Start generating the app plan
        generateAppPlan();
      }, 1000);
    }
  };

  const handleIndustrySelect = (industry: string) => {
    // Save the industry and move to app purpose step
    setFormData(prev => ({ ...prev, industry }));
    
    // Show typing indicator
    setShowTypingIndicator(true);
    
    // Send next message after delay
    setTimeout(() => {
      setShowTypingIndicator(false);
      const assistantMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: `Thank you! Now, please describe the main purpose of your app. What problem will it solve?`,
        requiresAction: true
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentStep('app_purpose');
      setWaitingForUserInput(true);
    }, 1000);
  };

  const handleBudgetSelect = (budget: string) => {
    // Save the budget and move to timeline step
    setFormData(prev => ({ ...prev, budget }));
    
    // Show typing indicator
    setShowTypingIndicator(true);
    
    // Send next message after delay
    setTimeout(() => {
      setShowTypingIndicator(false);
      const assistantMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: "What's your timeline for developing this app?",
        actionComponent: (
          <div className="mt-3 flex flex-wrap gap-2">
            {timelineOptions.map((timeline) => (
              <Button 
                key={timeline}
                variant="outline" 
                size="sm"
                onClick={() => handleTimelineSelect(timeline)}
                className="bg-black/30 border-siso-text/20 text-white"
              >
                {timeline}
              </Button>
            ))}
          </div>
        ),
        requiresAction: true
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentStep('timeline');
      setWaitingForUserInput(true);
    }, 1000);
  };

  const handleTimelineSelect = (timeline: string) => {
    // Save the timeline and move to additional requirements step
    setFormData(prev => ({ ...prev, timeline }));
    
    // Show typing indicator
    setShowTypingIndicator(true);
    
    // Send next message after delay
    setTimeout(() => {
      setShowTypingIndicator(false);
      const assistantMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: "Any additional requirements or constraints we should know about? (Type 'none' if there aren't any)",
        requiresAction: true
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentStep('additional_requirements');
      setWaitingForUserInput(true);
    }, 1000);
  };

  const generateAppPlan = async () => {
    setIsGeneratingPlan(true);
    setGenerationProgress(5);
    setGenerationStage('Initiating generation process');
    
    // Convert the form data to the format expected by the app plan generator
    const businessData: BusinessDataInput = {
      businessName: formData.company,
      appPurpose: formData.app_purpose,
      industry: formData.industry,
      targetAudience: formData.target_audience,
      desiredFeatures: formData.desired_features,
      budget: formData.budget,
      timeline: formData.timeline,
      additionalRequirements: formData.additional_requirements
    };
    
    try {
      // Save onboarding data to Supabase
      const { error: saveError } = await supabase.from('onboarding').insert({
        name: formData.name,
        organization: formData.company,
        app_idea: formData.app_purpose,
        user_id: userId,
        industry: formData.industry,
        target_audience: formData.target_audience,
        desired_features: formData.desired_features,
        budget: formData.budget,
        timeline: formData.timeline,
        additional_requirements: formData.additional_requirements
      });
      
      if (saveError) throw saveError;

      // Generate the app plan
      const plan = await appPlanAgent.generatePlan(businessData);
      
      // Set generation complete
      setGenerationProgress(100);
      setGenerationStage('Generation complete!');
      
      // Show plan generation completion message
      const assistantMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: `Great news! I've generated an app plan for ${formData.company} based on your requirements. You can view and customize it now.`,
        actionComponent: (
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={() => navigate('/app-plan')}
              className="bg-gradient-to-r from-siso-red to-siso-orange text-white"
            >
              View Your App Plan
            </Button>
          </div>
        )
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentStep('complete');
      
      toast({
        title: "App Plan Generated",
        description: "Your app plan has been successfully generated.",
      });
      
    } catch (error) {
      console.error('Error generating app plan:', error);
      
      const errorMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: "I'm sorry, there was an error generating your app plan. Please try again or contact support."
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "There was a problem generating your app plan.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-siso-bg to-black">
      {/* Show loading spinner while auth is loading, but don't block rendering */}
      {authLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-10 h-10 border-4 border-siso-orange/50 border-t-siso-orange rounded-full animate-spin" />
        </div>
      )}
      
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/thankyou')}
          className="text-siso-text hover:text-siso-text-bold hover:bg-black/20"
        >
          <X size={20} />
        </Button>
      </header>
      
      {/* Main chat container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-20 pb-6">
        {/* App Plan Generation Progress */}
        {isGeneratingPlan && (
          <div className="mb-6 bg-black/40 border border-siso-text/10 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="animate-pulse">
                <SisoIcon className="w-5 h-5 text-siso-orange" />
              </div>
              <h3 className="text-sm font-medium text-white">{generationStage}</h3>
            </div>
            <div className="space-y-2">
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-siso-red to-siso-orange rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-siso-text/70">
                <span>Research</span>
                <span>Analysis</span>
                <span>Generation</span>
                <span>Finalize</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Chat messages */}
        <div className="flex-1 space-y-4 py-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[90%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 ${
                    message.role === 'assistant' 
                      ? 'bg-gradient-to-r from-siso-red to-siso-orange' 
                      : 'bg-siso-text/30'
                  } ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                    {message.role === 'assistant' ? <SisoIcon className="w-6 h-6 text-white" /> : <User size={20} />}
                  </div>
                  
                  <div className="flex flex-col">
                    {message.role === 'assistant' && (
                      <span className="text-xs text-siso-text-muted ml-2 mb-1">SISO</span>
                    )}
                    <div className={`rounded-2xl p-4 ${
                      message.role === 'assistant'
                        ? 'bg-black/40 text-white border border-siso-text/10'
                        : 'bg-siso-orange/90 text-black'
                    }`}>
                      {message.content}
                      {message.actionComponent}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {showTypingIndicator && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex max-w-[80%] flex-row">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full shrink-0 bg-gradient-to-r from-siso-red to-siso-orange mr-3">
                    <SisoIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs text-siso-text-muted ml-2 mb-1">SISO</span>
                    <div className="rounded-2xl p-4 bg-black/40 text-white border border-siso-text/10">
                      <MessageLoading />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex max-w-[80%] flex-row">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full shrink-0 bg-gradient-to-r from-siso-red to-siso-orange mr-3">
                    <SisoIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs text-siso-text-muted ml-2 mb-1">SISO</span>
                    <div className="rounded-2xl p-4 bg-black/40 text-white border border-siso-text/10">
                      <MessageLoading />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Input field */}
            {waitingForUserInput && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end mt-4"
              >
                <div className="flex w-full max-w-[90%] flex-row-reverse">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full shrink-0 bg-siso-text/30 ml-3">
                    <User size={20} />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && input.trim()) {
                          handleChatSubmit(input);
                        }
                      }}
                      placeholder="Type your message..."
                      className="w-full rounded-2xl p-4 pr-12 bg-black/30 border border-siso-text/20 text-white placeholder:text-siso-text/50 focus:outline-none focus:ring-1 focus:ring-siso-red/50"
                      disabled={loading || !waitingForUserInput}
                    />
                    <button
                      onClick={() => handleChatSubmit(input)}
                      disabled={!input.trim() || loading || !waitingForUserInput}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-siso-text disabled:opacity-50 hover:text-siso-orange transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      {currentStep === 'complete' && (
        <div className="text-center mt-4 pb-6">
          <Button 
            onClick={() => navigate('/app-plan')} 
            variant="outline" 
            className="text-siso-text border-siso-text/30 hover:bg-siso-text/10"
          >
            View App Plan Details
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingChat;
