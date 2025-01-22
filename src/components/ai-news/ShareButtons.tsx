import { Button } from '@/components/ui/button';
import { Twitter, Share2, Instagram } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  summary: string;
  title: string;
}

export const ShareButtons = ({ summary, title }: ShareButtonsProps) => {
  const { toast } = useToast();

  const handleShare = (platform: string) => {
    const text = `${title}\n\n${summary}`;
    const url = window.location.href;

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
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
      >
        <Twitter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
        Share on X
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('whatsapp')}
        className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
      >
        <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
        Share on WhatsApp
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('instagram')}
        className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
      >
        <Instagram className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
        Share on Instagram
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('skool')}
        className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
      >
        <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
        Share on Skool
      </Button>
    </div>
  );
};