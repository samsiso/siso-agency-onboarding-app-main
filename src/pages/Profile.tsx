import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';
import { User, Shield, Award, Badge, Trophy, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [nfts, setNfts] = useState<any[]>([]);
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

        // Fetch profile data including points and rank
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch user's NFTs
        const { data: nftData, error: nftError } = await supabase
          .from('user_nfts')
          .select(`
            *,
            nft_collections (
              name,
              description,
              image_url
            )
          `)
          .eq('user_id', session.user.id);

        if (nftError) throw nftError;
        setNfts(nftData || []);
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
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-siso-text/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-siso-red" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-siso-text-bold">
                    {profile?.full_name || user?.email?.split('@')[0]}
                  </h1>
                  <div className="flex items-center gap-2 text-siso-text/70">
                    <Trophy className="w-4 h-4 text-siso-orange" />
                    <span>{profile?.points || 0} points</span>
                    <Star className="w-4 h-4 text-siso-orange ml-2" />
                    <span>{profile?.rank || 'Newbie'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="border-siso-red text-siso-text hover:bg-siso-red hover:text-white transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                <Button 
                  variant="outline" 
                  className="border-siso-text/20 text-siso-text-bold hover:bg-siso-text/10"
                  onClick={handleBackToHome}
                >
                  Back to Home
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Info */}
              <Card className="bg-black/20 border-siso-text/10">
                <CardHeader>
                  <CardTitle className="text-siso-text-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-siso-red" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-siso-text/70">Email</p>
                    <p className="text-siso-text">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-siso-text/70">Full Name</p>
                    <p className="text-siso-text">{profile?.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-siso-text/70">Points</p>
                    <p className="text-siso-text flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-siso-orange" />
                      {profile?.points || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-siso-text/70">Rank</p>
                    <p className="text-siso-text flex items-center gap-2">
                      <Star className="w-4 h-4 text-siso-orange" />
                      {profile?.rank || 'Newbie'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* NFT Status */}
              <Card className="bg-black/20 border-siso-text/10">
                <CardHeader>
                  <CardTitle className="text-siso-text-bold flex items-center gap-2">
                    <Award className="w-5 h-5 text-siso-orange" />
                    NFT Status
                  </CardTitle>
                  <CardDescription className="text-siso-text/70">
                    Your verified NFTs and ranks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {nfts.length > 0 ? (
                    <div className="space-y-4">
                      {nfts.map((nft) => (
                        <div key={nft.id} className="flex items-center gap-4 p-3 rounded-lg bg-siso-text/5 border border-siso-text/10">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
                            <Badge className="w-6 h-6 text-siso-orange" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-siso-text-bold">
                              {nft.nft_collections?.name || 'Unknown Collection'}
                            </p>
                            <p className="text-xs text-siso-text/70">
                              Token ID: {nft.token_id}
                            </p>
                            <div className="mt-1 inline-flex items-center rounded-full bg-siso-red/10 px-2.5 py-0.5 text-xs font-medium text-siso-red">
                              {nft.rank}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-siso-text/70">
                      <Badge className="w-8 h-8 mx-auto mb-2 text-siso-text/40" />
                      <p>No NFTs connected yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4 border-siso-red text-siso-text hover:bg-siso-red hover:text-white transition-colors"
                        onClick={() => toast({
                          title: "Coming Soon",
                          description: "NFT connection feature will be available soon!",
                        })}
                      >
                        Connect NFT Wallet
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;