import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ResearchDocument } from '../types';
import { Link, useParams } from 'react-router-dom';

interface PinnedResearchAssetProps {
  doc: ResearchDocument;
  categoryColors: Record<string, string>;
}

export function PinnedResearchAsset({ doc, categoryColors }: PinnedResearchAssetProps) {
  const { id: projectId } = useParams<{ id: string }>();
  
  return (
    <AnimatedCard key={doc.id} className="border border-purple-500/20 bg-purple-500/5">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-white mb-2">{doc.title}</h3>
        <p className="text-neutral-400 text-sm mb-3 flex-grow">{doc.description}</p>
        
        <div className="mt-auto">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <Link 
                to={`/projects/${projectId}/market-research/${doc.id}`}
                className="text-[#9b87f5] hover:text-[#8a76e4] flex items-center gap-1 text-sm font-medium"
              >
                View Details
                <ExternalLink className="h-3 w-3" />
              </Link>
              {doc.fileUrl && (
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white h-6 w-6">
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center justify-between border-t border-purple-500/20 pt-3">
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
  );
}
