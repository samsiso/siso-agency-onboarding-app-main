import { Button } from '@/components/ui/button';
import { Twitter, Share2, Instagram } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { usePoints } from '@/hooks/usePoints';

interface ShareButtonsProps {
  summary: string;
  title: string;
}

export const ShareButtons = ({ summary, title }: ShareButtonsProps) => {
  const { toast } = useToast();
  const { awardPoints } = usePoints();

  const handleShare = async (platform: string) => {
    const text = `${title}\n\n${summary}`;
    const url = window.location.href;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Award points for sharing
        await awardPoints('share_article');
        toast({
          title: "Points awarded!",
          description: `You earned 5 points for sharing on ${platform}!`,
        });
      }

      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
          break;
        case 'instagram':
        case 'skool':
          navigator.clipboard.writeText(text + '\n' + url);
          toast({
            title: "Copied to clipboard",
            description: `You can now paste this in ${platform}`,
          });
          break;
      }
    } catch (error: any) {
      console.error('Error handling share:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process sharing action",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
      >
        <Twitter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
        <span className="hidden sm:inline">Share on</span> X
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('whatsapp')}
        className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
      >
        <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
        <span className="hidden sm:inline">Share on</span> WhatsApp
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('instagram')}
        className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
      >
        <Instagram className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
        <span className="hidden sm:inline">Share on</span> Instagram
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('skool')}
        className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
      >
        <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
        <span className="hidden sm:inline">Share on</span> Skool
      </Button>
    </div>
  );
};