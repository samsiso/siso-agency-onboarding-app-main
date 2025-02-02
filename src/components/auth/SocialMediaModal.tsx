import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Linkedin, Globe, Youtube, Instagram } from 'lucide-react';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip?: () => void;
}

export const SocialMediaModal = ({ isOpen, onClose, onSkip }: SocialMediaModalProps) => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getFilledLinksCount = () => {
    return [linkedinUrl, websiteUrl, youtubeUrl, instagramUrl]
      .filter(url => url.trim().length > 0).length;
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        throw new Error('No user found');
      }

      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          linkedin_url: linkedinUrl || null,
          website_url: websiteUrl || null,
          youtube_url: youtubeUrl || null,
          instagram_url: instagramUrl || null,
          has_completed_social_info: true,
          social_info_completed_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Thank you for providing your social media information!",
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-siso-bg border-siso-border">
        <DialogHeader>
          <DialogTitle className="text-siso-text">Connect Your Social Media</DialogTitle>
          <DialogDescription className="text-siso-text/70">
            Add your social media links to enhance your profile and connect with others. You can always update these later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Linkedin className="w-5 h-5 text-siso-text/70" />
            <Input
              placeholder="LinkedIn URL"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="bg-siso-bg-alt border-siso-border text-siso-text flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-siso-text/70" />
            <Input
              placeholder="Website URL"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="bg-siso-bg-alt border-siso-border text-siso-text flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-siso-text/70" />
            <Input
              placeholder="YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="bg-siso-bg-alt border-siso-border text-siso-text flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-siso-text/70" />
            <Input
              placeholder="Instagram URL"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="bg-siso-bg-alt border-siso-border text-siso-text flex-1"
            />
          </div>
        </div>
        <div className="flex justify-between gap-3">
          {onSkip && (
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-siso-text/70 hover:text-siso-text"
            >
              Skip for now
            </Button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-siso-border text-siso-text"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-siso-red hover:bg-siso-red/90 text-white"
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};