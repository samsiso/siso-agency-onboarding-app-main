
import { Briefcase } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ProfileCard } from './ProfileCard';
import { ProfileSection } from './ProfileSection';

interface BusinessInfoProps {
  businessName?: string | null;
  businessType?: string | null;
  industry?: string | null;
  isEditing: boolean;
  formData: {
    businessName: string;
    businessType: string;
    industry: string;
  };
  onFormChange: (field: string, value: string) => void;
}

export const BusinessInfo = ({
  businessName,
  businessType,
  industry,
  isEditing,
  formData,
  onFormChange,
}: BusinessInfoProps) => {
  return (
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
  );
};
