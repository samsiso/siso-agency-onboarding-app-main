
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ResearchDocument } from '../types';

interface PinnedResearchAssetProps {
  doc: ResearchDocument;
  categoryColors: Record<string, string>;
  onClick?: (doc: ResearchDocument) => void;
}

export function PinnedResearchAsset({ doc, categoryColors, onClick }: PinnedResearchAssetProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(doc);
    }
  };

  // Format date to be more compact
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AnimatedCard 
      key={doc.id} 
      className="border border-purple-500/20 bg-purple-500/5 cursor-pointer transition-all hover:border-purple-500/40 hover:shadow-lg"
    >
      <div className="h-full w-full p-1" onClick={handleClick}>
        <div className="flex flex-col h-full justify-between">
          {/* Top section with title */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{doc.title}</h3>
            <p className="text-neutral-400 text-sm line-clamp-3 mb-3">{doc.description}</p>
          </div>
          
          {/* Middle section - empty to create space */}
          <div className="flex-grow"></div>
          
          {/* Bottom section with details and metadata */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <Button 
                variant="ghost" 
                className="text-[#9b87f5] hover:text-[#8a76e4] p-0 h-7"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the card click
                  handleClick();
                }}
              >
                View Details
              </Button>
              {doc.fileUrl && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-neutral-400 hover:text-white h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    window.open(doc.fileUrl, '_blank');
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Category and date footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <Badge 
                variant="outline" 
                className={`${categoryColors[doc.category] || ''} text-xs h-6 px-2 flex items-center`}
              >
                {doc.category}
              </Badge>
              <div className="text-xs text-neutral-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> 
                {formatDate(doc.updated_at)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
