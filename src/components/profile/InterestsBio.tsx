import { GraduationCap } from 'lucide-react';
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    <CardContent className="space-y-4">
      <div>
        <p className="text-sm text-siso-text/70 flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          Interests
        </p>
        {isEditing ? (
          <Input
            placeholder="Interests (comma-separated)"
            value={formData.interests}
            onChange={(e) => onFormChange('interests', e.target.value)}
            className="mt-1"
          />
        ) : (
          <p className="text-siso-text">{interests?.join(', ') || 'No interests set'}</p>
        )}
      </div>
      <div>
        <p className="text-sm text-siso-text/70">Bio</p>
        {isEditing ? (
          <Textarea
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={(e) => onFormChange('bio', e.target.value)}
            className="mt-1"
          />
        ) : (
          <p className="text-siso-text">{bio || 'No bio set'}</p>
        )}
      </div>
    </CardContent>
  );
};