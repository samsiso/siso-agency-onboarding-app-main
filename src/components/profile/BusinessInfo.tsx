import { Building2 } from 'lucide-react';
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    <CardContent>
      <p className="text-sm text-siso-text/70 flex items-center gap-2 mb-2">
        <Building2 className="w-4 h-4" />
        Business Information
      </p>
      {isEditing ? (
        <div className="space-y-2">
          <Input
            placeholder="Business Name"
            value={formData.businessName}
            onChange={(e) => onFormChange('businessName', e.target.value)}
          />
          <Input
            placeholder="Business Type"
            value={formData.businessType}
            onChange={(e) => onFormChange('businessType', e.target.value)}
          />
          <Input
            placeholder="Industry"
            value={formData.industry}
            onChange={(e) => onFormChange('industry', e.target.value)}
          />
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-siso-text">{businessName || 'No business name set'}</p>
          <p className="text-siso-text/70 text-sm">{businessType || 'No business type set'}</p>
          <p className="text-siso-text/70 text-sm">{industry || 'No industry set'}</p>
        </div>
      )}
    </CardContent>
  );
};