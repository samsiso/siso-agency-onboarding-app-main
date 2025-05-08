
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ResearchDocument } from '../types';

interface PinnedResearchAssetProps {
  doc: ResearchDocument;
  categoryColors: Record<string, string>;
}

export function PinnedResearchAsset({ doc, categoryColors }: PinnedResearchAssetProps) {
  return (
    <AnimatedCard key={doc.id} className="border border-purple-500/20 bg-purple-500/5">
      <div className="flex flex-col h-full">
        <div className="mb-2 flex items-center justify-between">
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
        
        <h3 className="text-lg font-semibold text-white mb-2">{doc.title}</h3>
        <p className="text-neutral-400 text-sm mb-3 flex-grow">{doc.description}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <Button variant="ghost" className="text-[#9b87f5] hover:text-[#8a76e4] p-0">
              View Details
            </Button>
            {doc.fileUrl && (
              <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
