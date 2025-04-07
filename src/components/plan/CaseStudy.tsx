
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CaseStudyProps {
  title: string;
  description: string;
  imageUrl: string;
  notionUrl: string;
}

export const CaseStudy = ({
  title,
  description,
  imageUrl,
  notionUrl
}: CaseStudyProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-siso-text/10 bg-black/20">
      <div className="relative aspect-video w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>
      
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="mb-4 text-sm text-siso-text line-clamp-2">{description}</p>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full border-siso-orange/30 bg-black/50 text-siso-orange transition-all hover:bg-siso-orange/10"
          onClick={() => window.open(notionUrl, '_blank')}
        >
          View Case Study
          <ExternalLink className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
