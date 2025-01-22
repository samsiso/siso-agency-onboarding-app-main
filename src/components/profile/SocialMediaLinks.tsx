import { Briefcase, Linkedin, Globe, Youtube, Instagram, Twitter } from 'lucide-react';
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SocialMediaLinksProps {
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  youtubeUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  isEditing: boolean;
  formData: {
    linkedinUrl: string;
    websiteUrl: string;
    youtubeUrl: string;
    instagramUrl: string;
    twitterUrl: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export const SocialMediaLinks = ({
  linkedinUrl,
  websiteUrl,
  youtubeUrl,
  instagramUrl,
  twitterUrl,
  isEditing,
  formData,
  onFormChange,
}: SocialMediaLinksProps) => {
  return (
    <CardContent>
      <p className="text-sm text-siso-text/70 flex items-center gap-2 mb-2">
        <Briefcase className="w-4 h-4" />
        Social Media & Links
      </p>
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-siso-text/70" />
            <Input
              placeholder="LinkedIn URL"
              value={formData.linkedinUrl}
              onChange={(e) => onFormChange('linkedinUrl', e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-siso-text/70" />
            <Input
              placeholder="Website URL"
              value={formData.websiteUrl}
              onChange={(e) => onFormChange('websiteUrl', e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Youtube className="w-4 h-4 text-siso-text/70" />
            <Input
              placeholder="YouTube URL"
              value={formData.youtubeUrl}
              onChange={(e) => onFormChange('youtubeUrl', e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-siso-text/70" />
            <Input
              placeholder="Instagram URL"
              value={formData.instagramUrl}
              onChange={(e) => onFormChange('instagramUrl', e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Twitter className="w-4 h-4 text-siso-text/70" />
            <Input
              placeholder="Twitter URL"
              value={formData.twitterUrl}
              onChange={(e) => onFormChange('twitterUrl', e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-siso-text hover:text-siso-red transition-colors">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          )}
          {websiteUrl && (
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-siso-text hover:text-siso-red transition-colors">
              <Globe className="w-4 h-4" />
              Website
            </a>
          )}
          {youtubeUrl && (
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-siso-text hover:text-siso-red transition-colors">
              <Youtube className="w-4 h-4" />
              YouTube
            </a>
          )}
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-siso-text hover:text-siso-red transition-colors">
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
          )}
          {twitterUrl && (
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-siso-text hover:text-siso-red transition-colors">
              <Twitter className="w-4 h-4" />
              Twitter
            </a>
          )}
          {!linkedinUrl && !websiteUrl && !youtubeUrl && !instagramUrl && !twitterUrl && (
            <p className="text-siso-text/70">No social media links set</p>
          )}
        </div>
      )}
    </CardContent>
  );
};