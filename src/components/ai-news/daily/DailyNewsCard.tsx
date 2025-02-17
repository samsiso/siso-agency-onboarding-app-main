
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, Share2, Eye, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

  return (
    <Card className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
      <motion.div
        layout
        className="p-4 space-y-4"
        animate={{ height: 'auto' }}
      >
        {/* Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getImpactColor(article.impact)}>
              {article.impact} Impact
            </Badge>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
              {article.technical_complexity}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-white line-clamp-2">
            {article.title}
          </h3>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-sm text-gray-300 line-clamp-2">
            {article.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.reading_time} min read
            </span>
            <span className="flex items-center gap-1">
              <ExternalLink className="h-4 w-4" />
              View Source
            </span>
          </div>
        </div>

        {/* Actions */}
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
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => setShowSources(!showSources)}
            >
              Sources
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

        {/* Expanded Content */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-4 border-t border-white/10"
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">AI Analysis</h4>
                <ul className="space-y-2">
                  {article.key_takeaways.map((takeaway, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-xs bg-white/10 rounded-full px-2 py-0.5 mt-0.5">
                        {index + 1}
                      </span>
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
};
