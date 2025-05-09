
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { PointsHistory } from '@/components/profile/PointsHistory';
import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { ProfileMetrics } from '@/components/profile/ProfileMetrics';
import { ProfileProgress } from '@/components/profile/ProfileProgress';
import { useProfileData } from '@/hooks/useProfileData';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, UserCircle, BadgeCheck, History, Trophy } from 'lucide-react';
import { Spotlight } from '@/components/ui/spotlight';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    user,
    profile,
    loading,
    isEditing,
    formData,
    handleFormChange
  } = useProfileData();

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user || !profile) {
    return (
      <ProfileLayout>
        <div className="text-center text-siso-text">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p>Unable to load profile data. Please try again later.</p>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="relative">
        <Spotlight className="-top-40 left-0" />
        
        {/* Main profile container */}
        <div className="space-y-8 max-w-7xl mx-auto">
          {/* Hero section with profile banner, avatar and main stats */}
          <div className="bg-black/30 rounded-xl overflow-hidden border border-purple-400/30 backdrop-blur-sm shadow-lg">
            <ProfileHeader
              fullName={profile?.full_name}
              email={user?.email}
              points={profile?.points || 0}
              rank={profile?.rank || 'Bronze'}
              avatarUrl={profile?.avatar_url}
              bannerUrl={profile?.banner_url}
              user={user}
              onUpdateProfile={() => window.location.reload()}
              onLogout={async () => {
                try {
                  const { error } = await supabase.auth.signOut();
                  if (error) throw error;
                  navigate('/');
                } catch (error: any) {
                  toast({
                    variant: "destructive",
                    title: "Error signing out",
                    description: error.message,
                  });
                }
              }}
              onBackToHome={() => navigate('/')}
            />
            
            {/* Header actions and progress */}
            <div className="px-6 pb-6 pt-2">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
                  My Profile
                </h1>
                <SignOutButton />
              </div>
              <ProfileProgress profile={profile} user={user} />
            </div>
          </div>
          
          {/* Tabbed content for better organization */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-6 bg-black/30 border border-purple-400/30 rounded-lg">
              <TabsTrigger value="profile" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
                <UserCircle className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
                <Trophy className="w-4 h-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="rewards" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
                <Sparkles className="w-4 h-4 mr-2" />
                Rewards
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
                <History className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Social & Metrics */}
                <div className="space-y-6">
                  <ProfileMetrics 
                    userId={user.id}
                    solanaWalletAddress={profile?.solana_wallet_address}
                  />
                </div>
                
                {/* Right Column - Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-purple-400/30 shadow-lg">
                    <ProfileInfo
                      email={user?.email}
                      fullName={profile?.full_name}
                      points={profile?.points || 0}
                      rank={profile?.rank || 'Bronze'}
                      businessName={profile?.business_name}
                      businessType={profile?.business_type}
                      industry={profile?.industry}
                      interests={profile?.interests}
                      bio={profile?.bio}
                      linkedinUrl={profile?.linkedin_url}
                      websiteUrl={profile?.website_url}
                      youtubeUrl={profile?.youtube_url}
                      instagramUrl={profile?.instagram_url}
                      twitterUrl={profile?.twitter_url}
                      professionalRole={profile?.professional_role}
                      isEditing={isEditing}
                      formData={formData}
                      onFormChange={handleFormChange}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Achievements Tab */}
            <TabsContent value="achievements" className="mt-0">
              <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-purple-400/30 shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <BadgeCheck className="mr-2 text-purple-400" />
                  Your Achievements
                </h3>
                <p className="text-white/80">
                  Track your progress and view earned badges and achievements.
                </p>
              </div>
            </TabsContent>
            
            {/* Rewards Tab */}
            <TabsContent value="rewards" className="mt-0">
              <div className="bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-purple-400/30 shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Sparkles className="mr-2 text-yellow-400" />
                  Available Rewards
                </h3>
                <p className="text-white/80">
                  Redeem your points for exclusive rewards and benefits.
                </p>
              </div>
            </TabsContent>
            
            {/* History Tab */}
            <TabsContent value="history" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                  {user && <PointsHistory userId={user.id} />}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default Profile;
