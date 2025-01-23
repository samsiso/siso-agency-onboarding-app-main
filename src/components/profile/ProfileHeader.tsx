import { User, Trophy, Star, Upload, Briefcase, Mail, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

interface ProfileHeaderProps {
  fullName: string | null;
  email: string | null;
  points: number;
  rank: string;
  avatarUrl?: string | null;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const ProfileHeader = ({ 
  fullName, 
  email, 
  points, 
  rank, 
  avatarUrl,
  onLogout, 
  onBackToHome 
}: ProfileHeaderProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });

      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload profile photo",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-full mb-8">
      {/* Background Banner */}
      <div className="absolute inset-0 h-32 bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-t-lg" />
      
      <Card className="relative mt-16 bg-black/20 backdrop-blur-sm border-siso-text/10">
        <div className="p-6 space-y-6">
          {/* Profile Header Content */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar Section */}
            <div className="relative -mt-20 group">
              <div className="h-24 w-24 rounded-full ring-4 ring-black/20 overflow-hidden bg-gradient-to-br from-siso-red/20 to-siso-orange/20">
                {avatarUrl ? (
                  <img 
                    src={supabase.storage.from('avatars').getPublicUrl(avatarUrl).data.publicUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User className="w-12 h-12 text-siso-red" />
                  </div>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
                <Upload className="w-6 h-6 text-white" />
              </label>
            </div>

            {/* User Info Section */}
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold text-siso-text-bold">
                {fullName || email?.split('@')[0]}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-siso-text/70">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-siso-orange" />
                  <span>{points || 0} points</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-siso-orange" />
                  <span>{rank || 'Newbie'}</span>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-siso-red text-siso-text hover:bg-siso-red hover:text-white transition-colors flex items-center gap-2"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-siso-text/20 text-siso-text-bold hover:bg-siso-text/10 flex items-center gap-2"
                onClick={onBackToHome}
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};