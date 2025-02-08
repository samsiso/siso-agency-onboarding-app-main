
import { GraduationCap } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfileCard } from './ProfileCard';
import { ProfileSection } from './ProfileSection';

interface InterestsBioProps {
  interests?: string[] | null;
  bio?: string | null;
  isEditing: boolean;
  formData: {
    interests: string;
    bio: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export const InterestsBio = ({
  interests,
  bio,
  isEditing,
  formData,
  onFormChange,
}: InterestsBioProps) => {
  return (
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
  );
};
