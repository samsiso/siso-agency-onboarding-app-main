import { Shield, Trophy, Star, Building2, Briefcase, GraduationCap, Linkedin, Globe, Youtube, Instagram, Twitter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  professionalRole
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
          interests: formData.interests.split(',').map(i => i.trim()),
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
        {!isEditing ? (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        )}
      </CardHeader>
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
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, professionalRole: e.target.value }))}
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
        <div>
          <p className="text-sm text-siso-text/70 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Business Information
          </p>
          {isEditing ? (
            <div className="space-y-2 mt-1">
              <Input
                placeholder="Business Name"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              />
              <Input
                placeholder="Business Type"
                value={formData.businessType}
                onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
              />
              <Input
                placeholder="Industry"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              />
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-siso-text">{businessName || 'No business name set'}</p>
              <p className="text-siso-text/70 text-sm">{businessType || 'No business type set'}</p>
              <p className="text-siso-text/70 text-sm">{industry || 'No industry set'}</p>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-siso-text/70 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Interests
          </p>
          {isEditing ? (
            <Input
              placeholder="Interests (comma-separated)"
              value={formData.interests}
              onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="mt-1"
            />
          ) : (
            <p className="text-siso-text">{bio || 'No bio set'}</p>
          )}
        </div>
        <div>
          <p className="text-sm text-siso-text/70 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Social Media & Links
          </p>
          {isEditing ? (
            <div className="space-y-2 mt-1">
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-siso-text/70" />
                <Input
                  placeholder="LinkedIn URL"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-siso-text/70" />
                <Input
                  placeholder="Website URL"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-siso-text/70" />
                <Input
                  placeholder="YouTube URL"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-siso-text/70" />
                <Input
                  placeholder="Instagram URL"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Twitter className="w-4 h-4 text-siso-text/70" />
                <Input
                  placeholder="Twitter URL"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitterUrl: e.target.value }))}
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
        </div>
      </CardContent>
    </Card>
  );
};