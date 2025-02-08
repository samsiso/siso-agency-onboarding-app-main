
import { Shield } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ProfileCard } from './ProfileCard';
import { ProfileSection } from './ProfileSection';

interface BasicInfoProps {
  email: string | null;
  fullName: string | null;
  professionalRole?: string | null;
  isEditing: boolean;
  formData: {
    fullName: string;
    professionalRole: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export const BasicInfo = ({
  email,
  fullName,
  professionalRole,
  isEditing,
  formData,
  onFormChange,
}: BasicInfoProps) => {
  return (
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
  );
};
