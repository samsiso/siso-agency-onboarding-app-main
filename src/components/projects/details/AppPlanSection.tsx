
import { useState, useRef, useEffect } from 'react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientDocument } from '@/types/client.types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { 
  FileCheck, ChevronRight, Clock, ArrowRight, CheckCircle, 
  ExternalLink, Search, File, FileArchive, FilePlus, Image,
  FileSpreadsheet, Framer, Code, TestTube, CloudCog, ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion } from 'framer-motion';

type PhaseSection = {
  id: string;
  title: string;
  description: string;
  subsections: {
    id: string;
    title: string;
    content: React.ReactNode;
    bestPractices?: string[];
    actionableSteps?: string[];
  }[];
};

export function AppPlanSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activePhaseId, setActivePhaseId] = useState("phase-1");
  
  const phaseSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const phases: PhaseSection[] = [
    {
      id: "phase-1",
      title: "1. Product Management",
      description: "AI-Enhanced Ideation & Planning",
      subsections: [
        {
          id: "phase-1-1",
          title: "1.1 Ideation and Market Research with AI",
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <FileSpreadsheet className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">AI Brainstorming</h5>
                      <p className="text-neutral-300 text-sm">
                        Use AI tools like Ideamap or GPT-based assistants to generate ideas for the crypto app. 
                        Prompt the AI with: "Generate innovative features for a crypto app targeting retail investors." 
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <Search className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">Market Analysis</h5>
                      <p className="text-neutral-300 text-sm">
                        Deploy NLP-driven tools to analyze user reviews of existing crypto apps (e.g., Coinbase, Binance) 
                        and support tickets.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <FileCheck className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">Data-Backed Validation</h5>
                      <p className="text-neutral-300 text-sm">
                        Use generative AI to analyze crypto market reports and predict trends 
                        (e.g., growing demand for DeFi integration).
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-md">
                    <h5 className="text-md font-medium text-purple-400 mb-2">Expected Outcomes:</h5>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-300 text-sm">
                      <li>Innovative feature ideas aligned with market trends</li>
                      <li>Comprehensive understanding of user pain points</li>
                      <li>Data-driven validation of top features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ),
          actionableSteps: [
            "Run AI brainstorming sessions to list 20+ feature ideas, then cluster them by user value.",
            "Analyze 5,000+ user reviews and support tickets from competitor apps to identify top 5 pain points.",
            "Validate top 3 features using AI-driven market trend analysis and user adoption modeling."
          ]
        },
        {
          id: "phase-1-2",
          title: "1.2 Roadmapping and Requirements Gathering",
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <FileSpreadsheet className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">AI-Powered Prioritization</h5>
                      <p className="text-neutral-300 text-sm">
                        Use Zeda.io's AI roadmap planner to prioritize features based on user impact, 
                        business value, and development effort.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <File className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">Automated Requirements</h5>
                      <p className="text-neutral-300 text-sm">
                        Input high-level feature ideas (e.g., "portfolio tracker") into AI tools to generate 
                        detailed user stories and functional specifications.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <ArrowRight className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">Continuous Feedback Loop</h5>
                      <p className="text-neutral-300 text-sm">
                        Set up AI to analyze user feedback and usage data every sprint, 
                        dynamically adjusting the roadmap as needed.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-md">
                    <h5 className="text-md font-medium text-purple-400 mb-2">Expected Outcomes:</h5>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-300 text-sm">
                      <li>Data-driven feature prioritization</li>
                      <li>Comprehensive user stories and requirements</li>
                      <li>Adaptive roadmap that evolves with user feedback</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ),
          bestPractices: [
            "Use AI brainstorming to explore diverse feature ideas and reduce bias.",
            "Leverage NLP to mine user feedback for actionable insights.",
            "Auto-generate PRDs with AI, then validate with human review.",
            "Maintain a continuous feedback loop to keep the roadmap data-driven."
          ]
        }
      ]
    },
    {
      id: "phase-2",
      title: "2. UX/UI Design",
      description: "AI-Assisted Design and Usability",
      subsections: [
        {
          id: "phase-2-1",
          title: "2.1 AI-Driven Wireframing & Prototyping",
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <Framer className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">Instant Prototypes</h5>
                      <p className="text-neutral-300 text-sm">
                        Use Uizard or Lovable to convert sketches or descriptions into high-fidelity wireframes. 
                        AI outputs React or HTML/CSS code for rapid front-end development.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <CheckCircle className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">Design Best Practices Built-In</h5>
                      <p className="text-neutral-300 text-sm">
                        Ensure AI enforces accessibility (e.g., high-contrast price charts for vision-impaired users) 
                        and UX standards.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <Code className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">Lovable & Bolt for UI</h5>
                      <p className="text-neutral-300 text-sm">
                        Use Lovable to generate a functional UI with components like price tickers 
                        and transaction forms.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-md">
                    <h5 className="text-md font-medium text-purple-400 mb-2">Expected Outcomes:</h5>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-300 text-sm">
                      <li>Rapid creation of high-fidelity wireframes</li>
                      <li>Accessible and user-friendly designs</li>
                      <li>Functional UI components ready for development</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ),
          actionableSteps: [
            "Create initial wireframes for 3 key screens (dashboard, portfolio, transaction) using AI tools.",
            "Run AI accessibility checks to ensure compliance with WCAG standards.",
            "Generate a functional UI prototype with Lovable, then customize for brand consistency."
          ]
        },
        {
          id: "phase-2-2",
          title: "2.2 AI in User Research & Usability Testing",
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <Search className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">Synthetic User Testing</h5>
                      <p className="text-neutral-300 text-sm">
                        Use AI agents to simulate user interactions and identify friction points, 
                        like unclear wallet connection steps.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <FileCheck className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">Automated Feedback Analysis</h5>
                      <p className="text-neutral-300 text-sm">
                        Analyze beta tester feedback with NLP to categorize themes 
                        (e.g., "confusing transaction flow").
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <ArrowRight className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">AI-Augmented A/B Testing</h5>
                      <p className="text-neutral-300 text-sm">
                        Generate design variants and analyze A/B test results to optimize 
                        for user segments (e.g., novice vs. expert traders).
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-md">
                    <h5 className="text-md font-medium text-purple-400 mb-2">Expected Outcomes:</h5>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-300 text-sm">
                      <li>Identification of UX issues before launch</li>
                      <li>Actionable insights from user feedback</li>
                      <li>Optimized designs for different user segments</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ),
          bestPractices: [
            "Use AI prototyping for rapid mocks, then refine with human creativity.",
            "Ensure accessibility with AI checks, verified by designers.",
            "Leverage AI for synthetic and real user feedback analysis.",
            "Embrace A/B testing with AI to optimize designs iteratively."
          ]
        }
      ]
    },
    {
      id: "phase-3",
      title: "3. Development",
      description: "AI-Augmented Coding and Collaboration",
      subsections: [
        {
          id: "phase-3-1",
          title: "3.1 Coding with AI Assistance",
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <Code className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">AI Pair Programming</h5>
                      <p className="text-neutral-300 text-sm">
                        Integrate GitHub Copilot or Cursor into the IDE to autocomplete code for features 
                        like real-time price APIs or wallet integration.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <FileCheck className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">Code Generation Platforms</h5>
                      <p className="text-neutral-300 text-sm">
                        Use Bolt.new to scaffold a full-stack crypto app from a prompt like 
                        "build a crypto price tracker with portfolio."
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <ArrowRight className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">Version Control & Merging</h5>
                      <p className="text-neutral-300 text-sm">
                        Use AI to write commit messages, resolve simple merge conflicts, 
                        and enforce conventional commit standards.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 p-4 rounded-md">
                    <h5 className="text-md font-medium text-purple-400 mb-2">Expected Outcomes:</h5>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-300 text-sm">
                      <li>Increased developer productivity and code quality</li>
                      <li>Rapid prototyping and development</li>
                      <li>Standardized codebase with consistent practices</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ),
          actionableSteps: [
            "Set up Copilot or Cursor for all developers to boost coding speed by 20%.",
            "Generate a full-stack prototype with Bolt.new, then refine for production use.",
            "Implement AI-driven commit message generation and merge conflict resolution in Git workflow."
          ]
        }
      ]
    }
  ];
  
  // Initialize all sections to be expanded by default
  useEffect(() => {
    const allSectionIds = phases.flatMap(phase => 
      phase.subsections.map(subsection => subsection.id)
    );
    setExpandedSections(allSectionIds);
  }, []);
  
  // Scroll to the active phase section when activePhaseId changes
  useEffect(() => {
    const sectionRef = phaseSectionRefs.current[activePhaseId];
    if (sectionRef) {
      sectionRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activePhaseId]);
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prevSections => 
      prevSections.includes(sectionId)
        ? prevSections.filter(id => id !== sectionId)
        : [...prevSections, sectionId]
    );
  };
  
  const isExpanded = (sectionId: string) => expandedSections.includes(sectionId);
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">App Development Plan</h2>
          <p className="text-neutral-400">Comprehensive roadmap for Ubahcrypt's development lifecycle.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#FF5722] hover:bg-[#E64A19] text-white">
            Export Plan
          </Button>
          <Button variant="outline" className="border-white/10 text-white">
            Edit Plan
          </Button>
        </div>
      </div>

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky top-4 z-10 mb-4"
        >
          <div className="bg-black/50 backdrop-blur-md rounded-lg border border-white/10 p-4">
            <div className="flex flex-wrap gap-2">
              {phases.map(phase => (
                <Button 
                  key={phase.id}
                  variant={activePhaseId === phase.id ? "default" : "outline"}
                  className={activePhaseId === phase.id 
                    ? "bg-[#FF5722] hover:bg-[#E64A19] text-white border-transparent" 
                    : "bg-transparent border-white/10 text-white hover:bg-white/5"
                  }
                  onClick={() => setActivePhaseId(phase.id)}
                >
                  {phase.title}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-8 space-y-12">
          {phases.map(phase => (
            <div 
              key={phase.id} 
              id={phase.id}
              ref={el => phaseSectionRefs.current[phase.id] = el}
              className="scroll-mt-20"
            >
              <AnimatedCard className="mb-8 border border-white/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{phase.title}</h3>
                    <p className="text-lg text-[#FF9800]">{phase.description}</p>
                  </div>
                  <Badge variant="outline" className="bg-[#FF5722]/10 text-[#FF9800] border-[#FF5722]/20 px-3 py-1">
                    {phase.id.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-6">
                  {phase.subsections.map(subsection => (
                    <Collapsible 
                      key={subsection.id} 
                      open={isExpanded(subsection.id)} 
                      onOpenChange={() => toggleSection(subsection.id)}
                      className="border border-white/10 rounded-lg overflow-hidden"
                    >
                      <CollapsibleTrigger className="w-full p-4 flex items-center justify-between bg-black/20 hover:bg-black/30 transition-colors">
                        <h4 className="text-md font-medium text-white text-left">{subsection.title}</h4>
                        <div className="flex items-center">
                          <Badge className="mr-2 bg-[#FF5722] hover:bg-[#E64A19]">Details</Badge>
                          <ChevronDown 
                            className={`h-5 w-5 text-[#FF9800] transition-transform duration-200 ${isExpanded(subsection.id) ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 bg-black/10">
                        {subsection.content}
                        
                        <div className="mt-6 space-y-4">
                          {subsection.actionableSteps && (
                            <div className="bg-[#FF5722]/5 border border-[#FF5722]/20 p-4 rounded-md">
                              <h5 className="text-md font-medium text-[#FF9800] mb-3 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                Actionable Steps
                              </h5>
                              <ul className="list-disc pl-5 space-y-2 text-neutral-300 text-sm">
                                {subsection.actionableSteps.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {subsection.bestPractices && (
                            <div className="bg-black/30 p-4 rounded-md">
                              <h5 className="text-md font-medium text-[#FF9800] mb-3 flex items-center gap-2">
                                <FileCheck className="h-5 w-5" />
                                Best Practices
                              </h5>
                              <ul className="list-disc pl-5 space-y-2 text-neutral-300 text-sm">
                                {subsection.bestPractices.map((practice, idx) => (
                                  <li key={idx}>{practice}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </AnimatedCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
