
import { User, Trophy, Star, Upload, Briefcase, Mail, LogOut, Home, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProfileHeaderProps {
  fullName: string | null;
  email: string | null;
  points: number;
  rank: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const ProfileHeader = ({ 
  fullName, 
  email, 
  points, 
  rank, 
  avatarUrl,
  bannerUrl,
  onLogout, 
  onBackToHome 
}: ProfileHeaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [isHoveringBanner, setIsHoveringBanner] = useState(false);
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

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingBanner(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_banners')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ banner_url: filePath })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Banner photo updated successfully",
      });

      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload banner photo",
      });
    } finally {
      setUploadingBanner(false);
    }
  };

  return (
    <div className="relative w-full mb-8">
      {/* Background Banner */}
      <div className="relative h-48 md:h-64 rounded-t-lg overflow-hidden group">
        {bannerUrl ? (
          <img
            src={supabase.storage.from('profile_banners').getPublicUrl(bannerUrl).data.publicUrl}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-siso-red/10 to-siso-orange/10" />
        )}
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
          onHoverStart={() => setIsHoveringBanner(true)}
          onHoverEnd={() => setIsHoveringBanner(false)}
        >
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerUpload}
              disabled={uploadingBanner}
            />
            <Camera className="w-8 h-8 text-white" />
            <span className="block text-sm text-white mt-2">
              {uploadingBanner ? 'Uploading...' : 'Change Banner'}
            </span>
          </label>
        </motion.div>
      </div>
      
      <Card className="relative -mt-16 mx-6 bg-black/20 backdrop-blur-sm border-siso-text/10">
        <div className="p-6 space-y-6">
          {/* Profile Header Content */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar Section */}
            <motion.div 
              className="relative -mt-20 group"
              onHoverStart={() => setIsHoveringAvatar(true)}
              onHoverEnd={() => setIsHoveringAvatar(false)}
            >
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
              <AnimatePresence>
                {isHoveringAvatar && (
                  <motion.label 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                    <Camera className="w-6 h-6 text-white" />
                  </motion.label>
                )}
              </AnimatePresence>
            </motion.div>

            {/* User Info Section */}
            <div className="flex-1 space-y-2">
              <motion.h1 
                className="text-3xl font-bold text-siso-text-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {fullName || email?.split('@')[0]}
              </motion.h1>
              <div className="flex flex-wrap items-center gap-4 text-siso-text/70">
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Mail className="w-4 h-4" />
                  <span>{email}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Trophy className="w-4 h-4 text-siso-orange" />
                  <span className="font-medium">{points || 0} points</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Star className="w-4 h-4 text-siso-orange" />
                  <span className="font-medium">{rank || 'Newbie'}</span>
                </motion.div>
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
