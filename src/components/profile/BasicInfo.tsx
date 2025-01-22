import { Shield, Trophy, Star } from 'lucide-react';
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface BasicInfoProps {
  email: string | null;
  fullName: string | null;
  points: number;
  rank: string;
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
  points, 
  rank,
  professionalRole,
  isEditing,
  formData,
  onFormChange,
}: BasicInfoProps) => {
  return (
    <CardContent className="space-y-4">
      <div>
        <p className="text-sm text-siso-text/70">Email</p>
        <p className="text-siso-text">{email}</p>
      </div>
      <div>
        <p className="text-sm text-siso-text/70">Full Name</p>
        {isEditing ? (
          <Input
            value={formData.fullName}
            onChange={(e) => onFormChange('fullName', e.target.value)}
            className="mt-1"
          />
        ) : (
          <p className="text-siso-text">{fullName || 'Not set'}</p>
        )}
      </div>
      <div>
        <p className="text-sm text-siso-text/70">Professional Role</p>
        {isEditing ? (
          <Input
            value={formData.professionalRole}
            onChange={(e) => onFormChange('professionalRole', e.target.value)}
            className="mt-1"
            placeholder="e.g., Software Engineer, Product Manager"
          />
        ) : (
          <p className="text-siso-text">{professionalRole || 'Not set'}</p>
        )}
      </div>
      <div>
        <p className="text-sm text-siso-text/70">Points</p>
        <p className="text-siso-text flex items-center gap-2">
          <Trophy className="w-4 h-4 text-siso-orange" />
          {points || 0}
        </p>
      </div>
      <div>
        <p className="text-sm text-siso-text/70">Rank</p>
        <p className="text-siso-text flex items-center gap-2">
          <Star className="w-4 h-4 text-siso-orange" />
          {rank || 'Newbie'}
        </p>
      </div>
    </CardContent>
  );
};