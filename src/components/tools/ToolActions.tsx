import { Button } from "@/components/ui/button";
import { ExternalLink, Youtube, Info, Share2, Twitter } from 'lucide-react';
import { Tool } from './types';

interface ToolActionsProps {
  tool: Tool;
  onShare: () => void;
  onTwitterShare: () => void;
}

export function ToolActions({ tool, onShare, onTwitterShare }: ToolActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
      {tool.website_url && (
        <Button
          className="w-full justify-center gap-2 bg-gradient-to-r from-siso-red/90 to-siso-orange/90 hover:from-siso-red hover:to-siso-orange transition-all duration-300"
          onClick={() => window.open(tool.website_url!, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
          Visit Website
        </Button>
      )}
      {tool.youtube_url && (
        <Button
          variant="outline"
          className="w-full justify-center gap-2 border-siso-text/20 hover:bg-siso-text/5"
          onClick={() => window.open(tool.youtube_url!, '_blank')}
        >
          <Youtube className="h-4 w-4 text-red-500" />
          Watch on YouTube
        </Button>
      )}
      <Button
        variant="outline"
        className="w-full justify-center gap-2 border-siso-text/20 hover:bg-siso-text/5"
        onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(tool.name)}`, '_blank')}
      >
        <Info className="h-4 w-4 text-siso-text/80" />
        Learn More
      </Button>
      <Button
        variant="outline"
        className="w-full justify-center gap-2 border-siso-text/20 hover:bg-siso-text/5"
        onClick={onTwitterShare}
      >
        <Twitter className="h-4 w-4 text-blue-400" />
        Share on X
      </Button>
      <Button
        variant="outline"
        className="w-full justify-center gap-2 border-siso-text/20 hover:bg-siso-text/5"
        onClick={onShare}
      >
        <Share2 className="h-4 w-4 text-siso-text/80" />
        Share
      </Button>
    </div>
  );
}