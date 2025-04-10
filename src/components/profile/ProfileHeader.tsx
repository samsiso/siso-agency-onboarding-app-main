
import React from 'react';
import { User } from '@supabase/supabase-js';
import { MutableRefObject, useRef, useState } from 'react';
import { Edit, Camera, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserSocialLinks } from './UserSocialLinks';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AchievementList from './AchievementList';

interface ProfileHeaderProps {
  user: User | null;
  profile: {
    avatar_url?: string;
    bio?: string;
    business_name?: string;
    created_at?: string;
    full_name?: string;
    id?: string;
    instagram_url?: string;
    linkedin_url?: string;
    onboarding_completed?: boolean;
    professional_role?: string;
    siso_tokens?: number;
    solana_wallet_address?: string;
    twitter_url?: string;
    updated_at?: string;
    website_url?: string;
    youtube_url?: string;
  };
  achievements?: Array<{ name: string; icon?: string }>;
  onUpdateProfile: () => void;
  editable?: boolean;
}

export const ProfileHeader = ({ 
  user,
  profile,
  achievements = [],
  onUpdateProfile,
  editable = false
}: ProfileHeaderProps) => {
  const { toast } = useToast();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [deletingAvatar, setDeletingAvatar] = useState(false);

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      if (data) {
        await supabase
          .from('profiles')
          .update({
            avatar_url: data.publicUrl,
          })
          .eq('id', user?.id);

        // Custom property for the header banner - note this would need to be properly typed in the database
        // Normally we would add a banner_url column to the profiles table
        toast({
          title: "Avatar updated",
          description: "Your avatar has been updated successfully.",
        });
        
        onUpdateProfile();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload avatar",
      });
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user?.id);
      
      toast({
        title: "Avatar removed",
        description: "Your avatar has been removed.",
      });
      
      setDeletingAvatar(false);
      onUpdateProfile();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove avatar",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="relative h-32 sm:h-48 rounded-lg bg-gradient-to-r from-siso-text/10 to-siso-text/5 overflow-hidden">
        {/* Allow banner upload if editable */}
        {editable && (
          <>
            <input
              type="file"
              ref={bannerInputRef as MutableRefObject<HTMLInputElement>}
              accept="image/*"
              className="hidden"
              onChange={() => {/* Banner upload would go here */}}
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 bg-black/40 hover:bg-black/60"
              onClick={() => bannerInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 -mt-16 sm:-mt-20 px-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background overflow-hidden">
            <AspectRatio ratio={1} className="bg-muted">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name || 'Avatar'} 
                  className="object-cover h-full w-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-siso-text/10 text-siso-text/60 font-medium text-lg">
                  {(profile.full_name || user?.email || 'User').charAt(0).toUpperCase()}
                </div>
              )}
            </AspectRatio>
          </div>

          {/* Avatar edit controls */}
          {editable && (
            <>
              <input
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full bg-background hover:bg-siso-text/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => avatarInputRef.current?.click()}>
                    <Camera className="h-4 w-4 mr-2" /> Change Avatar
                  </DropdownMenuItem>
                  {profile.avatar_url && (
                    <DropdownMenuItem onClick={() => setDeletingAvatar(true)} className="text-red-500">
                      <Trash2 className="h-4 w-4 mr-2" /> Remove Avatar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* User details */}
        <div className="flex-1 flex flex-col justify-end">
          <div>
            <h1 className="text-2xl font-bold text-siso-text-bold">
              {profile.full_name || 'Anonymous User'}
            </h1>
            <p className="text-siso-text/60 text-sm">
              {profile.professional_role || 'Community Member'}
            </p>
            
            {profile.bio && (
              <p className="text-siso-text/80 text-sm mt-2 max-w-3xl">
                {profile.bio}
              </p>
            )}
            
            {/* Social links */}
            <UserSocialLinks profile={profile} className="mt-3" />
          </div>
        </div>
      </div>
      
      {/* Achievements & stats */}
      <div className="px-4">
        <AchievementList achievements={achievements} />
      </div>

      {/* Delete avatar confirmation dialog */}
      <AlertDialog open={deletingAvatar} onOpenChange={setDeletingAvatar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Avatar?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove your avatar? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAvatarDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
