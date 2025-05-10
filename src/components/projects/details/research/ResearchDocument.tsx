import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Tag, ChevronUp, ChevronDown, Info, ArrowRight, Clock } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ResearchDocument } from '../types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ResearchDocumentProps {
  doc: ResearchDocument;
  isExpanded: boolean;
  onToggleExpand: () => void;
  categoryColors: Record<string, string>;
  onClick?: (doc: ResearchDocument) => void;
}

export function ResearchDocumentCard({ 
  doc, 
  isExpanded, 
  onToggleExpand,
  categoryColors,
  onClick
}: ResearchDocumentProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(doc);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      // Show relative time for recent dates
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else {
        return `${diffDays} days ago`;
      }
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Calculate time difference for highlighting recent updates
  const isRecent = () => {
    const date = new Date(doc.updated_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 3; // Consider "recent" if updated in the last 3 days
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
      <AnimatedCard 
        className={cn(
          "border h-full transition-all hover:shadow-lg relative",
          doc.isPinned 
            ? "border-white/20 hover:border-purple-400/50 bg-black/40" 
            : "border-white/10 hover:border-white/30 bg-black/20"
        )}
      >
        {doc.isPinned && (
          <div className="absolute -top-1 -right-1 w-0 h-0 border-t-[20px] border-r-[20px] border-purple-500 border-solid" />
        )}
        
        {isRecent() && (
          <div className="absolute top-2 right-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-green-600 hover:bg-green-700 text-white border-none p-1">
                    <Clock className="h-3 w-3" />
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Recently updated</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        <div 
          className="flex flex-col h-full p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`${categoryColors[doc.category] || ''} text-xs`}
            >
              {doc.category}
            </Badge>
            <div className="text-xs text-neutral-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> 
              {formatDate(doc.updated_at)}
            </div>
          </div>
          
          <h3 
            className="text-lg font-semibold text-white mb-2 hover:text-purple-300 transition-colors cursor-pointer"
            onClick={handleClick}
          >
            {doc.title}
          </h3>
          
          <p className="text-neutral-400 text-sm mb-4 line-clamp-3">{doc.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {doc.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />{tag}
              </Badge>
            ))}
            {doc.tags.length > 3 && (
              <Badge variant="outline" className="text-xs bg-black/50">
                +{doc.tags.length - 3} more
              </Badge>
            )}
          </div>
          
          <CollapsibleContent className="mb-4 text-sm">
            {doc.insights && doc.insights.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-white/80 mb-2 flex items-center">
                  <Info className="h-3 w-3 mr-1 text-purple-400" />
                  Key Insights
                </h4>
                <ul className="list-disc list-inside text-neutral-400 space-y-1 pl-2">
                  {doc.insights.slice(0, 2).map((insight, idx) => (
                    <li key={idx} className="text-xs">{insight}</li>
                  ))}
                  {doc.insights.length > 2 && (
                    <li className="text-xs text-purple-400">...and {doc.insights.length - 2} more insights</li>
                  )}
                </ul>
              </div>
            )}

            {doc.nextSteps && doc.nextSteps.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-white/80 mb-2 flex items-center">
                  <ArrowRight className="h-3 w-3 mr-1 text-teal-400" />
                  Next Steps
                </h4>
                <ul className="list-disc list-inside text-neutral-400 space-y-1 pl-2">
                  {doc.nextSteps.slice(0, 1).map((step, idx) => (
                    <li key={idx} className="text-xs">{step}</li>
                  ))}
                  {doc.nextSteps.length > 1 && (
                    <li className="text-xs text-teal-400">...and {doc.nextSteps.length - 1} more steps</li>
                  )}
                </ul>
              </div>
            )}
          </CollapsibleContent>
          
          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 p-0 h-8 flex items-center gap-1"
                onClick={handleClick}
              >
                View Details
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
              
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 p-0 text-xs text-neutral-400">
                  {isExpanded ? (
                    <div className="flex items-center">
                      <ChevronUp className="h-3 w-3 mr-1" /> Less
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ChevronDown className="h-3 w-3 mr-1" /> More
                    </div>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            {doc.fileUrl && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-neutral-400 hover:text-white"
                aria-label={`Download ${doc.title}`}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </AnimatedCard>
    </Collapsible>
  );
}
