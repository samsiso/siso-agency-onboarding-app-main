import { Shield, Briefcase, GraduationCap, Link } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfileCard } from './ProfileCard';
import { ProfileSection } from './ProfileSection';

interface ProfileInfoProps {
  email: string | null;
  fullName: string | null;
  points: number;
  rank: string;
  businessName?: string | null;
  businessType?: string | null;
  industry?: string | null;
  interests?: string[] | null;
  bio?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  youtubeUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  professionalRole?: string | null;
  solanaWalletAddress?: string | null;
  isEditing: boolean;
  formData: {
    fullName: string;
    businessName: string;
    businessType: string;
    industry: string;
    interests: string;
    bio: string;
    linkedinUrl: string;
    websiteUrl: string;
    youtubeUrl: string;
    instagramUrl: string;
    twitterUrl: string;
    professionalRole: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export const ProfileInfo = ({ 
  email, 
  fullName, 
  points, 
  rank,
  businessName,
  businessType,
  industry,
  interests,
  bio,
  linkedinUrl,
  websiteUrl,
  youtubeUrl,
  instagramUrl,
  twitterUrl,
  professionalRole,
  isEditing,
  formData,
  onFormChange,
}: ProfileInfoProps) => {
  return (
    <div className="grid gap-6">
      <ProfileCard icon={Shield} title="Basic Information">
        <div className="space-y-4">
          <ProfileSection label="Email">
            <p className="text-siso-text">{email}</p>
          </ProfileSection>
          
          <ProfileSection label="Full Name">
            {isEditing ? (
              <Input
                value={formData.fullName}
                onChange={(e) => onFormChange('fullName', e.target.value)}
                className="bg-siso-bg-alt border-siso-border"
              />
            ) : (
              <p className="text-siso-text">{fullName || 'Not set'}</p>
            )}
          </ProfileSection>

          <ProfileSection label="Professional Role">
            {isEditing ? (
              <Input
                value={formData.professionalRole}
                onChange={(e) => onFormChange('professionalRole', e.target.value)}
                className="bg-siso-bg-alt border-siso-border"
                placeholder="e.g., Software Engineer, Product Manager"
              />
            ) : (
              <p className="text-siso-text">{professionalRole || 'Not set'}</p>
            )}
          </ProfileSection>
        </div>
      </ProfileCard>

      <ProfileCard icon={Briefcase} title="Business Information">
        <div className="space-y-4">
          <ProfileSection label="Business Name">
            {isEditing ? (
              <Input
                value={formData.businessName}
                onChange={(e) => onFormChange('businessName', e.target.value)}
                className="bg-siso-bg-alt border-siso-border"
              />
            ) : (
              <p className="text-siso-text">{businessName || 'No business name set'}</p>
            )}
          </ProfileSection>

          <ProfileSection label="Business Type">
            {isEditing ? (
              <Input
                value={formData.businessType}
                onChange={(e) => onFormChange('businessType', e.target.value)}
                className="bg-siso-bg-alt border-siso-border"
              />
            ) : (
              <p className="text-siso-text">{businessType || 'No business type set'}</p>
            )}
          </ProfileSection>

          <ProfileSection label="Industry">
            {isEditing ? (
              <Input
                value={formData.industry}
                onChange={(e) => onFormChange('industry', e.target.value)}
                className="bg-siso-bg-alt border-siso-border"
              />
            ) : (
              <p className="text-siso-text">{industry || 'No industry set'}</p>
            )}
          </ProfileSection>
        </div>
      </ProfileCard>

      <ProfileCard icon={GraduationCap} title="Interests & Bio">
        <div className="space-y-4">
          <ProfileSection label="Interests">
            {isEditing ? (
              <Input
                placeholder="Interests (comma-separated)"
                value={formData.interests}
                onChange={(e) => onFormChange('interests', e.target.value)}
                className="bg-siso-bg-alt border-siso-border"
              />
            ) : (
              <p className="text-siso-text">{interests?.join(', ') || 'No interests set'}</p>
            )}
          </ProfileSection>

          <ProfileSection label="Bio">
            {isEditing ? (
              <Textarea
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => onFormChange('bio', e.target.value)}
                className="bg-siso-bg-alt border-siso-border min-h-[100px]"
              />
            ) : (
              <p className="text-siso-text">{bio || 'No bio set'}</p>
            )}
          </ProfileSection>
        </div>
      </ProfileCard>

      <ProfileCard icon={Link} title="Social Media & Links">
        <div className="space-y-4">
          {isEditing ? (
            <>
              <Input
                placeholder="LinkedIn URL"
                value={formData.linkedinUrl}
                onChange={(e) => onFormChange('linkedinUrl', e.target.value)}
                className="bg-siso-bg-alt border-siso-border"
              />
              <Input
                placeholder="Website URL"
                value={formData.websiteUrl}
                onChange={(e) => onFormChange('websiteUrl', e.target.value)}
                className="bg-siso-bg-alt border-siso-border"
              />
              <Input
                placeholder="YouTube URL"
                value={formData.youtubeUrl}
                onChange={(e) => onFormChange('youtubeUrl', e.target.value)}
                className="bg-siso-bg-alt border-siso-border"
              />
              <Input
                placeholder="Instagram URL"
                value={formData.instagramUrl}
                onChange={(e) => onFormChange('instagramUrl', e.target.value)}
                className="bg-siso-bg-alt border-siso-border"
              />
              <Input
                placeholder="Twitter URL"
                value={formData.twitterUrl}
                onChange={(e) => onFormChange('twitterUrl', e.target.value)}
                className="bg-siso-bg-alt border-siso-border"
              />
            </>
          ) : (
            <div className="space-y-2">
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-2 text-siso-text hover:text-siso-red transition-colors">
                  LinkedIn
                </a>
              )}
              {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-siso-text hover:text-siso-red transition-colors">
                  Website
                </a>
              )}
              {youtubeUrl && (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-siso-text hover:text-siso-red transition-colors">
                  YouTube
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-siso-text hover:text-siso-red transition-colors">
                  Instagram
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-siso-text hover:text-siso-red transition-colors">
                  Twitter
                </a>
              )}
              {!linkedinUrl && !websiteUrl && !youtubeUrl && !instagramUrl && !twitterUrl && (
                <p className="text-siso-text/70">No social media links set</p>
              )}
            </div>
          )}
        </div>
      </ProfileCard>
    </div>
  );
};