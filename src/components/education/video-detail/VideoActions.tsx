import { Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const VideoActions = () => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" className="gap-2 bg-white/5 hover:bg-white/10">
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      <Button variant="secondary" size="sm" className="gap-2 bg-white/5 hover:bg-white/10">
        <Download className="w-4 h-4" />
        Download
      </Button>
    </div>
  );
};