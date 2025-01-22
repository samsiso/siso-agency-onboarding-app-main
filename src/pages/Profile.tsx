import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { PointsHistory } from '@/components/profile/PointsHistory';
import { LoginStreakTracker } from '@/components/points/LoginStreakTracker';
import { PointsDisplay } from '@/components/points/PointsDisplay';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/');
          return;
        }

        setUser(session.user);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        });
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  const handleLogout = async () => {
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
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-siso-text/10 rounded w-1/4"></div>
              <div className="h-32 bg-siso-text/10 rounded"></div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="space-y-8">
            <ProfileHeader
              fullName={profile?.full_name}
              email={user?.email}
              points={profile?.points || 0}
              rank={profile?.rank || 'Bronze'}
              avatarUrl={profile?.avatar_url}
              onLogout={handleLogout}
              onBackToHome={handleBackToHome}
            />

            {user && <LoginStreakTracker userId={user.id} />}
            
            {user && (
              <div className="mb-6">
                <PointsDisplay userId={user.id} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              />
              <PointsHistory userId={user?.id} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;