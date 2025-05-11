import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Tag, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link, useParams } from 'react-router-dom';
import { ResearchDocument } from '../types';

interface ResearchDocumentProps {
  doc: ResearchDocument;
  isExpanded: boolean;
  onToggleExpand: () => void;
  categoryColors: Record<string, string>;
}

export function ResearchDocumentCard({ 
  doc, 
  isExpanded, 
  onToggleExpand,
  categoryColors 
}: ResearchDocumentProps) {
  const { id: projectId } = useParams<{ id: string }>();
  
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
      <AnimatedCard className="border border-white/10 h-full">
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-white mb-2">{doc.title}</h3>
          <p className="text-neutral-400 text-sm mb-4">{doc.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {doc.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />{tag}
              </Badge>
            ))}
          </div>
          
          <CollapsibleContent className="mb-4 space-y-3">
            {doc.insights && doc.insights.length > 0 && (
              <div className="bg-black/30 rounded-md p-3">
                <h4 className="text-sm font-semibold text-[#FF9800] mb-2">Key Insights</h4>
                <ul className="list-disc list-inside text-xs text-neutral-300 space-y-1">
                  {doc.insights.map((insight, idx) => (
                    <li key={idx}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {doc.nextSteps && doc.nextSteps.length > 0 && (
              <div className="bg-black/30 rounded-md p-3">
                <h4 className="text-sm font-semibold text-[#FF9800] mb-2">Recommended Actions</h4>
                <ul className="list-disc list-inside text-xs text-neutral-300 space-y-1">
                  {doc.nextSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {doc.code_snippet && (
              <div className="bg-black/50 rounded-md p-3 font-mono">
                <h4 className="text-sm font-semibold text-[#FF9800] mb-2">Code Example</h4>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-neutral-300">
                  {doc.code_snippet}
                </pre>
              </div>
            )}
          </CollapsibleContent>
          
          <div className="flex mt-auto">
            <div className="flex flex-col w-full gap-3">
              <div className="flex justify-between items-center">
                <Link 
                  to={`/projects/${projectId}/market-research/${doc.id}`}
                  className="text-[#FF5722] hover:text-[#E64A19] flex items-center gap-1 text-sm font-medium"
                >
                  View Details
                  <ExternalLink className="h-3 w-3" />
                </Link>
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
              
              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <Badge 
                  variant="outline" 
                  className={`${categoryColors[doc.category] || ''} text-xs`}
                >
                  {doc.category}
                </Badge>
                <div className="text-xs text-neutral-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> 
                  {new Date(doc.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </Collapsible>
  );
}
