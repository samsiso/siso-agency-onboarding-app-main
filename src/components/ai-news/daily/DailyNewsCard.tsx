
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Share2, 
  Eye, 
  Clock, 
  TrendingUp,
  Zap,
  Target,
  BookOpen,
  ArrowRight,
  Code,
  Link,
  FileText,
  Database,
  BarChart4,
  Lightbulb,
  ScrollText,
  MessagesSquare,
  Brain
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AIAnalysisDialog } from '../AIAnalysisDialog';

interface DailyNewsCardProps {
  article: {
    id: string;
    title: string;
    description: string;
    image_url?: string;
    date: string;
    category: string;
    impact: string;
    technical_complexity: string;
    source: string;
    key_takeaways: string[];
    reading_time: number;
    technical_details?: Record<string, any>;
    source_credibility?: string;
    sources: { title: string; url: string }[];
  };
}

export const DailyNewsCard = ({ article }: DailyNewsCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  // [Analysis] Mock research data for the deep research features
  const researchData = {
    performance: 85,
    adoption: 62,
    impact: 73,
    technologies: ['AI', 'Machine Learning', 'Neural Networks'],
    researchSignificance: 88,
    implementationFeasibility: 76,
    industryAdoption: 65,
    innovationIndex: 82,
    primarySources: [
      { title: 'Original Research Paper', url: 'https://example.com/paper' },
      { title: 'Technical Documentation', url: 'https://example.com/docs' },
      { title: 'Implementation Guide', url: 'https://example.com/guide' }
    ],
    methodology: {
      approach: 'Quantitative Analysis',
      sampleSize: '10,000 data points',
      timeframe: '12 months',
      validationMethod: 'Cross-validation'
    }
  };

  return (
    <Card className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
      <motion.div
        layout
        className="p-4 space-y-4"
        animate={{ height: 'auto' }}
      >
        {/* Research Context Header */}
        <div className="space-y-4">
          {/* Credibility & Impact Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className={cn(
                    getImpactColor(article.impact),
                    "flex items-center gap-1"
                  )}>
                    <Zap className="h-3 w-3" />
                    {article.impact} Impact
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Research impact assessment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    {article.technical_complexity}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Technical implementation complexity</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.reading_time}m read
            </Badge>
          </div>

          {/* Title & Quick Actions */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-gray-300 line-clamp-2">
              {article.description}
            </p>
          </div>

          {/* Research Metrics Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/20 rounded-lg p-3">
            {/* Performance Metrics */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Research Impact</span>
                <span>{researchData.researchSignificance}%</span>
              </div>
              <Progress value={researchData.researchSignificance} className="h-1" 
                indicatorClassName="bg-orange-500" />
            </div>
            {/* Implementation Feasibility */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Feasibility</span>
                <span>{researchData.implementationFeasibility}%</span>
              </div>
              <Progress value={researchData.implementationFeasibility} className="h-1" 
                indicatorClassName="bg-green-500" />
            </div>
            {/* Industry Adoption */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Industry Adoption</span>
                <span>{researchData.industryAdoption}%</span>
              </div>
              <Progress value={researchData.industryAdoption} className="h-1" 
                indicatorClassName="bg-blue-500" />
            </div>
            {/* Innovation Index */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Innovation</span>
                <span>{researchData.innovationIndex}%</span>
              </div>
              <Progress value={researchData.innovationIndex} className="h-1" 
                indicatorClassName="bg-purple-500" />
            </div>
          </div>

          {/* Research Content Sections */}
          <Accordion type="single" collapsible className="w-full space-y-2">
            {/* Methodology Section */}
            <AccordionItem value="methodology" className="border border-white/10 rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4 text-blue-400" />
                  <span>Research Methodology</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-300 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-gray-400">Approach</p>
                    <p>{researchData.methodology.approach}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400">Sample Size</p>
                    <p>{researchData.methodology.sampleSize}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400">Timeframe</p>
                    <p>{researchData.methodology.timeframe}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400">Validation</p>
                    <p>{researchData.methodology.validationMethod}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Technologies Section */}
            <AccordionItem value="technologies" className="border border-white/10 rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-purple-400" />
                  <span>Technologies & Implementation</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {researchData.technologies.map((tech, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="bg-white/5 text-gray-300 border-white/10"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Key Findings Section */}
            <AccordionItem value="findings" className="border border-white/10 rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-400" />
                  <span>Key Findings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {article.key_takeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-xs bg-white/10 rounded-full px-2 py-0.5 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-300 text-sm">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Sources Section */}
            <AccordionItem value="sources" className="border border-white/10 rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-green-400" />
                  <span>Sources & References</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {article.sources?.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {source.title}
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Show More
                </>
              )}
            </Button>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                      onClick={() => setShowAIAnalysis(true)}
                    >
                      <Brain className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI Analysis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                    >
                      <MessagesSquare className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Discuss this research</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share research</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </motion.div>
      <AIAnalysisDialog 
        open={showAIAnalysis} 
        onOpenChange={setShowAIAnalysis}
        newsId={article.id}
      />
    </Card>
  );
};
