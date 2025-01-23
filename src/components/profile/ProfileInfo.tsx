import { Shield, Trophy, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BasicInfo } from './BasicInfo';
import { BusinessInfo } from './BusinessInfo';
import { InterestsBio } from './InterestsBio';
import { SocialMediaLinks } from './SocialMediaLinks';
import { ConnectWalletButton } from '../crypto/ConnectWalletButton';

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
  solanaWalletAddress
}: ProfileInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: fullName || '',
    businessName: businessName || '',
    businessType: businessType || '',
    industry: industry || '',
    interests: interests?.join(', ') || '',
    bio: bio || '',
    linkedinUrl: linkedinUrl || '',
    websiteUrl: websiteUrl || '',
    youtubeUrl: youtubeUrl || '',
    instagramUrl: instagramUrl || '',
    twitterUrl: twitterUrl || '',
    professionalRole: professionalRole || ''
  });
  const { toast } = useToast();

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          business_name: formData.businessName,
          business_type: formData.businessType,
          industry: formData.industry,
          interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
          bio: formData.bio,
          linkedin_url: formData.linkedinUrl,
          website_url: formData.websiteUrl,
          youtube_url: formData.youtubeUrl,
          instagram_url: formData.instagramUrl,
          twitter_url: formData.twitterUrl,
          professional_role: formData.professionalRole
        })
        .eq('id', user.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    }
  };

  return (
    <Card className="bg-black/20 border-siso-text/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-siso-text-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-siso-red" />
          Profile Information
        </CardTitle>
        <div className="flex gap-2">
          {!solanaWalletAddress && <ConnectWalletButton />}
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
              className="border-siso-red text-siso-text hover:bg-siso-red hover:text-white"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(false)}
                className="border-siso-text/20 text-siso-text hover:bg-siso-text/10"
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSave}
                className="bg-siso-red hover:bg-siso-red/90 text-white"
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <BasicInfo
        email={email}
        fullName={fullName}
        points={points}
        rank={rank}
        professionalRole={professionalRole}
        isEditing={isEditing}
        formData={formData}
        onFormChange={handleFormChange}
      />
      <BusinessInfo
        businessName={businessName}
        businessType={businessType}
        industry={industry}
        isEditing={isEditing}
        formData={formData}
        onFormChange={handleFormChange}
      />
      <InterestsBio
        interests={interests}
        bio={bio}
        isEditing={isEditing}
        formData={formData}
        onFormChange={handleFormChange}
      />
      <SocialMediaLinks
        linkedinUrl={linkedinUrl}
        websiteUrl={websiteUrl}
        youtubeUrl={youtubeUrl}
        instagramUrl={instagramUrl}
        twitterUrl={twitterUrl}
        isEditing={isEditing}
        formData={formData}
        onFormChange={handleFormChange}
      />
    </Card>
  );
};