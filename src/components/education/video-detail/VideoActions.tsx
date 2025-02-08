
import { Share2, Download, ThumbsUp, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const VideoActions = () => {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: document.title,
        url: window.location.href
      });
    } catch (err) {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <motion.div 
      className="flex flex-wrap items-center gap-2"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        variant="secondary" 
        size="sm" 
        className="gap-2 bg-white/5 hover:bg-white/10 transition-all duration-300"
        onClick={() => toast.success('Video saved!')}
      >
        <ThumbsUp className="w-4 h-4" />
        Like
      </Button>
      
      <Button 
        variant="secondary" 
        size="sm" 
        className="gap-2 bg-white/5 hover:bg-white/10 transition-all duration-300"
        onClick={() => toast.success('Video bookmarked!')}
      >
        <Bookmark className="w-4 h-4" />
        Save
      </Button>

      <Button 
        variant="secondary" 
        size="sm" 
        className="gap-2 bg-white/5 hover:bg-white/10 transition-all duration-300"
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      <Button 
        variant="secondary" 
        size="sm" 
        className="gap-2 bg-white/5 hover:bg-white/10 transition-all duration-300"
        onClick={() => toast.success('Download started!')}
      >
        <Download className="w-4 h-4" />
        Download
      </Button>
    </motion.div>
  );
};
