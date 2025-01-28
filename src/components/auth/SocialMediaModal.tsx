import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const SocialMediaModal = ({ isOpen, onClose, userId }: SocialMediaModalProps) => {
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
      if (getFilledLinksCount() < 2) {
        toast({
          variant: "destructive",
          title: "Please provide at least 2 social media links",
          description: "This helps us optimize your search experience.",
        });
        return;
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
        .eq('id', userId);

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
          <DialogTitle className="text-siso-text">Complete Your Profile</DialogTitle>
          <DialogDescription className="text-siso-text/70">
            Please provide at least 2 social media links to help us optimize your search experience and connect you with relevant resources.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="LinkedIn URL"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="bg-siso-bg-alt border-siso-border text-siso-text"
            />
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="Website URL"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="bg-siso-bg-alt border-siso-border text-siso-text"
            />
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="bg-siso-bg-alt border-siso-border text-siso-text"
            />
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="Instagram URL"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="bg-siso-bg-alt border-siso-border text-siso-text"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-siso-border text-siso-text"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || getFilledLinksCount() < 2}
            className="bg-siso-red hover:bg-siso-red/90 text-white"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};