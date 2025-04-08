import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  BarChart, 
  CheckCircle, 
  Loader2, 
  Sparkles, 
  Heart, 
  DollarSign, 
  Calendar, 
  Clock, 
  ArrowRight,
  FastForward,
  Trophy,
  TrendingUp,
  ExternalLink,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import '../components/ai-news/animations.css';
import { WelcomeBackground } from '@/components/plan/BackgroundElements';
import { ClickThroughPrompt } from '@/components/plan/ClickThroughPrompt';
import { InteractiveCallout } from '@/components/plan/InteractiveCallout';
import { PainPointsModal, PainPointDetailProps } from '@/components/plan/PainPointsModal';

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 md:h-2 md:w-2 rounded-full bg-siso-orange/20"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%", 
            opacity: 0.1 + Math.random() * 0.3 
          }}
          animate={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`,
            opacity: [0.1 + Math.random() * 0.3, 0.2 + Math.random() * 0.4, 0.1 + Math.random() * 0.3]
          }}
          transition={{ 
            duration: 10 + Math.random() * 20, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
    </div>
  );
};

const ProblemSolutionCard = ({ problem, solution, statistic, icon, active, delay, onClick }) => {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: active ? 1 : 0.4, 
        x: 0,
        transition: { delay: delay * 0.15 }
      }}
      className={`flex flex-col gap-3 bg-black/20 rounded-lg p-3 border ${active ? 'border-siso-orange/30' : 'border-siso-text/10'} cursor-pointer hover:bg-black/30 hover:border-siso-orange/20 transition-all hover:translate-y-[-2px]`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${active ? 'bg-siso-orange/20' : 'bg-siso-text/5'}`}>
          {active ? (
            <Icon className="h-5 w-5 text-siso-orange" />
          ) : (
            <div className="h-5 w-5 rounded-full bg-siso-text/20" />
          )}
        </div>
        <div>
          <h3 className={`font-medium ${active ? 'text-white' : 'text-siso-text/50'}`}>{problem}</h3>
          <p className={`text-sm mt-1 ${active ? 'text-siso-text' : 'text-siso-text/30'}`}>{solution}</p>
        </div>
      </div>
      <p className={`text-xs ${active ? 'text-siso-orange' : 'text-siso-text/30'}`}>{statistic}</p>
    </motion.div>
  );
};

interface AnalysisStepProps {
  step: {
    icon: React.ReactNode;
    text: string;
    tooltip: string;
  };
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}

const AnalysisStep = ({ step, isActive, isCompleted, index }: AnalysisStepProps) => {
  const steps = [
    { icon: <Users className="h-5 w-5 text-siso-orange" />, text: "Analyzing client management needs...", tooltip: "Manage multiple creators efficiently" },
    { icon: <Calendar className="h-5 w-5 text-siso-orange" />, text: "Optimizing content scheduling...", tooltip: "Automate content planning and posting" },
    { icon: <MessageSquare className="h-5 w-5 text-siso-orange" />, text: "Enhancing communication tools...", tooltip: "Streamline creator interactions" },
    { icon: <BarChart className="h-5 w-5 text-siso-orange" />, text: "Finalizing analytics dashboard...", tooltip: "Track performance in real-time" },
    { icon: <DollarSign className="h-5 w-5 text-siso-orange" />, text: "Calculating revenue potential...", tooltip: "Identify new income opportunities" }
  ];
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isActive ? 1 : isCompleted ? 0.8 : 0.3,
              y: 0 
            }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="flex items-center gap-3 cursor-help"
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              isCompleted ? 'bg-siso-orange/20' : isActive ? 'bg-siso-orange/10' : 'bg-siso-text/5'
            }`}>
              {isCompleted ? (
                <CheckCircle className="h-4 w-4 text-siso-orange" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 text-siso-orange animate-spin" />
              ) : (
                step.icon
              )}
            </div>
            <p className={`text-sm ${
              isActive || isCompleted ? 'text-siso-text' : 'text-siso-text/50'
            }`}>
              {step.text}
            </p>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-black/90 border-siso-orange/20 text-white">
          {step.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const DecoraPlan = () => {
  const navigate = useNavigate();
  const [loadingStep, setLoadingStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showClickThroughPrompt, setShowClickThroughPrompt] = useState(true);
  const [showProblemSolution, setShowProblemSolution] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [agencyName] = useState("Decora");
  const [skipAnimation, setSkipAnimation] = useState(false);
  
  const [activeSolutions, setActiveSolutions] = useState([true, true, true, true]);
  
  const [selectedPainPoint, setSelectedPainPoint] = useState<PainPointDetailProps | null>(null);
  const [isPainPointModalOpen, setIsPainPointModalOpen] = useState(false);
  
  const analysisSteps = [
    { icon: <Users className="h-5 w-5 text-siso-orange" />, text: "Analyzing client management needs...", tooltip: "Manage multiple creators efficiently" },
    { icon: <Calendar className="h-5 w-5 text-siso-orange" />, text: "Optimizing content scheduling...", tooltip: "Automate content planning and posting" },
    { icon: <MessageSquare className="h-5 w-5 text-siso-orange" />, text: "Enhancing communication tools...", tooltip: "Streamline creator interactions" },
    { icon: <BarChart className="h-5 w-5 text-siso-orange" />, text: "Finalizing analytics dashboard...", tooltip: "Track performance in real-time" },
    { icon: <DollarSign className="h-5 w-5 text-siso-orange" />, text: "Calculating revenue potential...", tooltip: "Identify new income opportunities" }
  ];
  
  const handleGetStarted = () => {
    setShowClickThroughPrompt(false);
    startOnboardingSequence();
  };
  
  const startOnboardingSequence = () => {
    if (skipAnimation) {
      navigate('/plan/decora');
      return;
    }
    
    setShowProblemSolution(true);
    
    setLoadingStep(2);
    
    const stepTimer = setTimeout(() => {
      setLoadingStep(5);
      
      setTimeout(() => {
        navigate('/plan/decora');
      }, 2000);
    }, 1500);
    
    return () => {
      clearTimeout(stepTimer);
    };
  };
  
  const handleSkip = () => {
    setSkipAnimation(true);
    navigate('/plan/decora');
  };
  
  const problemSolutions = [
    { 
      problem: "Client Retention Issues", 
      solution: "40% improved client retention with transparent reporting",
      statistic: "80% of agencies report the average model lifecycle with an agency is 3-6 months",
      icon: Users
    },
    { 
      problem: "Content Disorganization", 
      solution: "Save 15+ hours weekly with centralized management",
      statistic: "60% of agencies miss at least one content deadline per week due to disorganization",
      icon: Calendar
    },
    { 
      problem: "Inefficient Onboarding", 
      solution: "Cut onboarding time by 60% with automated flows",
      statistic: "Agencies spend an average of 10 hours per new client on manual onboarding tasks",
      icon: Clock
    },
    { 
      problem: "Communication Breakdowns", 
      solution: "Never miss important messages with unified inbox",
      statistic: "75% of agencies experience miscommunication that leads to client dissatisfaction monthly",
      icon: MessageSquare
    }
  ];
  
  const detailedPainPoints: PainPointDetailProps[] = [
    {
      problem: "Client Retention Issues",
      statistic: "80% of agencies report the average model lifecycle with an agency is 3-6 months",
      solution: "40% improved client retention with transparent reporting",
      detailedSolution: "OnlyFans agencies often struggle with client churn due to lack of transparency and unclear performance metrics. Our platform solves this by providing real-time dashboards showing creator performance, revenue tracking, and activity metrics that agencies can share with clients. This transparency builds trust and demonstrates the agency's value, keeping creators loyal to your services.",
      benefits: [
        "Build trust through transparent performance reporting",
        "Demonstrate your agency's value with clear metrics",
        "Establish longer-term relationships with creators",
        "Reduce churn and stabilize your revenue"
      ],
      metrics: [
        { label: "Average Retention Increase", value: "40%", icon: <TrendingUp className="h-4 w-4 text-siso-orange" /> },
        { label: "Client Satisfaction Score", value: "92%", icon: <Heart className="h-4 w-4 text-siso-orange" /> },
        { label: "Revenue Growth", value: "35%", icon: <DollarSign className="h-4 w-4 text-siso-orange" /> },
        { label: "Client Lifetime Value", value: "2.4x higher", icon: <Users className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/c7ac43fd-bc3e-478d-8b4f-809beafb6838.png", caption: "Client retention dashboard showing performance metrics" },
        { url: "/lovable-uploads/1f9eba1e-c2af-4ed8-84e7-a375872c9182.png", caption: "Transparent reporting shared with creators" }
      ],
      caseStudyLink: "https://notion.so/case-study/client-retention",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      researchSources: [
        {
          title: "Creator Economy Retention Research Report 2023",
          url: "https://example.com/research/creator-economy-2023",
          description: "A comprehensive study of 250+ OnlyFans agencies showing the correlation between transparency and client retention rates."
        },
        {
          title: "The Value of Analytics in Creator Management",
          url: "https://example.com/analytics-value",
          description: "Research demonstrating how performance visibility leads to 40% longer client relationships in creator management."
        }
      ],
      testimonials: [
        {
          content: "Before using this platform, we lost 30% of our creators every quarter. Now our retention rate has improved dramatically, and our creators appreciate seeing exactly how we're helping them grow.",
          author: "Sarah Johnson",
          company: "Elite Creators Agency",
          imageUrl: "/lovable-uploads/c7ac43fd-bc3e-478d-8b4f-809beafb6838.png"
        },
        {
          content: "The transparent reporting has transformed our relationships with creators. They can see their growth in real-time, which has eliminated the trust issues we used to face.",
          author: "Michael Rodriguez",
          company: "Creator Success Partners",
          imageUrl: "/lovable-uploads/1f9eba1e-c2af-4ed8-84e7-a375872c9182.png"
        }
      ]
    },
    {
      problem: "Content Disorganization",
      statistic: "60% of agencies miss at least one content deadline per week due to disorganization",
      solution: "Save 15+ hours weekly with centralized management",
      detailedSolution: "Managing content for multiple creators across different platforms leads to confusion, missed posts, and inefficient workflows. Our centralized content library and scheduling system allows your team to organize assets by creator, content type, and posting date. The visual calendar interface makes it easy to spot gaps in your content schedule and ensure consistent posting for all your clients.",
      benefits: [
        "Keep all content organized in a central, searchable library",
        "Never miss a posting deadline with visual scheduling tools",
        "Maintain consistency across multiple creator accounts",
        "Reduce time spent locating and organizing content"
      ],
      metrics: [
        { label: "Time Saved Weekly", value: "15+ hours", icon: <Clock className="h-4 w-4 text-siso-orange" /> },
        { label: "Posting Consistency", value: "98%", icon: <CheckCircle className="h-4 w-4 text-siso-orange" /> },
        { label: "Content Organization", value: "100%", icon: <Calendar className="h-4 w-4 text-siso-orange" /> },
        { label: "Team Productivity", value: "62% increase", icon: <Users className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/19ca8c73-3736-4506-bfb2-de867b272e12.png", caption: "Content calendar with drag-and-drop functionality" }
      ],
      caseStudyLink: "https://notion.so/case-study/content-management",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      comparisonChart: {
        title: "Content Management Efficiency",
        description: "Key improvements after implementing centralized content management",
        items: [
          { metric: "Missed Deadlines", before: "5-8 weekly", after: "0-1 weekly" },
          { metric: "Time Spent Organizing", before: "18 hours/week", after: "3 hours/week" },
          { metric: "Content Approval Time", before: "36 hours", after: "4 hours" },
          { metric: "Content Findability", before: "42% success rate", after: "98% success rate" }
        ]
      }
    },
    {
      problem: "Inefficient Onboarding",
      statistic: "Agencies spend an average of 10 hours per new client on manual onboarding tasks",
      solution: "Cut onboarding time by 60% with automated flows",
      detailedSolution: "Traditional onboarding processes for new creators are manual, time-consuming, and often inconsistent. Our platform provides customizable onboarding workflows with automated reminders, document collection, and progress tracking. New creators are guided through each step of the process, ensuring all necessary information and assets are collected without overwhelming them with paperwork all at once.",
      benefits: [
        "Streamline client setup with guided multi-step workflows",
        "Collect all necessary documents and information efficiently",
        "Create a professional first impression for new creators",
        "Free up staff time previously spent on manual onboarding"
      ],
      metrics: [
        { label: "Onboarding Time Reduction", value: "60%", icon: <Clock className="h-4 w-4 text-siso-orange" /> },
        { label: "Information Accuracy", value: "95%", icon: <CheckCircle className="h-4 w-4 text-siso-orange" /> },
        { label: "Document Completion Rate", value: "100%", icon: <FileText className="h-4 w-4 text-siso-orange" /> },
        { label: "Time to First Content", value: "40% faster", icon: <Calendar className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/66b63935-28a0-4212-8e2a-ab375279b188.png", caption: "Multi-step onboarding workflow" }
      ],
      implementationSteps: [
        { 
          title: "Workflow Design", 
          description: "Map out your ideal onboarding process including all required documents and information.",
          icon: <FileText className="h-4 w-4 text-siso-orange" />
        },
        { 
          title: "Form Creation", 
          description: "Build intuitive, branded forms for creator information collection.",
          icon: <CheckCircle className="h-4 w-4 text-siso-orange" />
        },
        { 
          title: "Automation Setup", 
          description: "Configure automatic reminders and progress tracking to keep creators moving forward.",
          icon: <Clock className="h-4 w-4 text-siso-orange" />
        }
      ]
    },
    {
      problem: "Communication Breakdowns",
      statistic: "75% of agencies experience miscommunication that leads to client dissatisfaction monthly",
      solution: "Never miss important messages with unified inbox",
      detailedSolution: "Communication scattered across emails, texts, and DMs leads to missed messages and delayed responses. Our unified inbox consolidates all communications in one place, with thread organization by creator and topic. Automated prioritization ensures urgent messages get immediate attention, while notification systems alert team members to new messages in their assigned areas.",
      benefits: [
        "Track all client conversations in one centralized system",
        "Respond faster with prioritized messages and notifications",
        "Maintain clear communication records for accountability",
        "Eliminate crossed wires between team members and clients"
      ],
      metrics: [
        { label: "Response Time", value: "75% faster", icon: <MessageSquare className="h-4 w-4 text-siso-orange" /> },
        { label: "Message Organization", value: "100%", icon: <CheckCircle className="h-4 w-4 text-siso-orange" /> },
        { label: "Client Satisfaction", value: "88%", icon: <Heart className="h-4 w-4 text-siso-orange" /> },
        { label: "Missed Messages", value: "0%", icon: <Users className="h-4 w-4 text-siso-orange" /> }
      ],
      images: [
        { url: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png", caption: "Unified messaging interface with priority sorting" }
      ],
      caseStudyLink: "https://notion.so/case-study/communication",
      testimonials: [
        {
          content: "The unified inbox has eliminated the communication chaos we were dealing with. Our team can now collaborate efficiently, and our creators always get timely responses.",
          author: "Jessica Martinez",
          company: "Creator Collective Agency",
          imageUrl: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
        }
      ]
    }
  ];
  
  const handlePainPointClick = (index: number) => {
    setSelectedPainPoint(detailedPainPoints[index]);
    setIsPainPointModalOpen(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4 relative overflow-hidden">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleSkip} 
        className="absolute top-4 right-4 text-siso-text hover:text-white hover:bg-black/20 z-10"
      >
        <FastForward className="w-4 h-4 mr-1" />
        Skip
      </Button>
      
      <WelcomeBackground />
      {!showWelcome && !showClickThroughPrompt && <ParticleBackground />}
      
      <AnimatePresence>
        {showWelcome && showClickThroughPrompt && (
          <ClickThroughPrompt 
            agencyName={agencyName} 
            onContinue={handleGetStarted} 
          />
        )}
        
        {showProblemSolution && (
          <motion.div 
            key="problem-solution"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-xl w-full"
          >
            <div className="bg-black/40 border border-siso-text/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="mb-4 flex justify-between items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <Heart className="h-5 w-5 text-siso-orange" />
                  <h2 className="text-white text-lg font-semibold">Tailored for OnlyFans Agencies</h2>
                </motion.div>
                
                <motion.div className="flex items-center gap-1 text-sm text-siso-orange" initial={{opacity: 0}} animate={{opacity: 1}}>
                  <Trophy className="h-4 w-4" />
                  <span>500+ Agencies</span>
                </motion.div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <InteractiveCallout 
                  title="Agency Niche" 
                  value="OnlyFans Management" 
                  type="niche"
                  description="Our platform is specifically designed for agencies managing OnlyFans creators, with features tailored to the unique needs of content management and creator relationships in this space."
                />
                
                <InteractiveCallout 
                  title="Company Name" 
                  value={agencyName} 
                  type="company"
                  description="Your agency dashboard will be fully customized with your branding, workflows, and specific requirements to ensure it perfectly aligns with how Decora operates."
                />
                
                <InteractiveCallout 
                  title="Product" 
                  value="Agency Dashboard" 
                  type="product"
                  description="A comprehensive dashboard that combines client management, content scheduling, communication tools, and analytics in one seamless platform designed specifically for OnlyFans agency operations."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {problemSolutions.map((item, index) => (
                  <ProblemSolutionCard 
                    key={index} 
                    problem={item.problem} 
                    solution={item.solution}
                    statistic={item.statistic}
                    icon={item.icon}
                    active={activeSolutions[index]}
                    delay={index}
                    onClick={() => handlePainPointClick(index)}
                  />
                ))}
              </div>
              
              <motion.div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-siso-text">Building your plan</span>
                  <span className="text-sm text-siso-orange">{Math.min(20 * loadingStep, 100)}%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-siso-red to-siso-orange"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(20 * loadingStep, 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
              
              <div className="space-y-4">
                {analysisSteps.map((step, index) => (
                  <AnalysisStep
                    key={index}
                    step={step}
                    index={index}
                    isActive={loadingStep === index + 1}
                    isCompleted={loadingStep > index + 1}
                  />
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: loadingStep >= 3 ? 1 : 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-6 rounded-lg bg-siso-orange/5 border border-siso-orange/20 p-4 text-sm text-siso-text"
              >
                <p className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-siso-orange shrink-0" />
                  <span>Agencies using our platform see a <span className="font-semibold text-white">40% increase</span> in revenue within 90 days</span>
                </p>
              </motion.div>
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={() => navigate('/plan/decora')}
                  className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white px-6 py-2"
                >
                  View Your Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <PainPointsModal
        painPoint={selectedPainPoint}
        open={isPainPointModalOpen}
        onOpenChange={setIsPainPointModalOpen}
      />
    </div>
  );
};

export default DecoraPlan;
