
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
  Code
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  };
}

export const DailyNewsCard = ({ article }: DailyNewsCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSources, setShowSources] = useState(false);

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

  // [Analysis] Mock data for demo purposes - would come from API in production
  const metrics = {
    performance: 85,
    adoption: 62,
    impact: 73,
    technologies: ['AI', 'Machine Learning', 'Neural Networks', 'Computer Vision']
  };

  return (
    <Card className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
      <motion.div
        layout
        className="p-4 space-y-4"
        animate={{ height: 'auto' }}
      >
        {/* Enhanced Header with Metrics */}
        <div className="space-y-4">
          {/* Top Badges Row */}
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
                  <p>Impact level based on industry significance</p>
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
                  <p>Technical complexity level</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.reading_time}m
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-white line-clamp-2">
            {article.title}
          </h3>

          {/* Metrics Dashboard */}
          <div className="grid grid-cols-3 gap-4 bg-black/20 rounded-lg p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Performance</span>
                <span>{metrics.performance}%</span>
              </div>
              <Progress value={metrics.performance} className="h-1" 
                indicatorClassName="bg-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Adoption</span>
                <span>{metrics.adoption}%</span>
              </div>
              <Progress value={metrics.adoption} className="h-1" 
                indicatorClassName="bg-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Impact</span>
                <span>{metrics.impact}%</span>
              </div>
              <Progress value={metrics.impact} className="h-1" 
                indicatorClassName="bg-orange-500" />
            </div>
          </div>

          {/* Technology Tags */}
          <div className="space-y-2">
            <div className="text-xs text-gray-400">Technologies</div>
            <div className="flex flex-wrap gap-2">
              {metrics.technologies.map((tech, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 line-clamp-2">
            {article.description}
          </p>

          {/* Quick Actions */}
          <div className="flex items-center justify-between">
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
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Target className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-4 border-t border-white/10"
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Key Takeaways</h4>
                <ul className="space-y-2">
                  {article.key_takeaways.map((takeaway, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                      <span className="text-xs bg-white/10 rounded-full px-2 py-0.5 mt-0.5">
                        {index + 1}
                      </span>
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 text-white border-white/10 hover:bg-white/10"
                onClick={() => window.open(article.source, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Article
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
};
