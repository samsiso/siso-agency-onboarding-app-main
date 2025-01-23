import { useEffect, useState } from 'react';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { PointsExchange } from "@/components/crypto/PointsExchange";
import { NFTGallery } from "@/components/crypto/NFTGallery";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Sidebar } from '@/components/Sidebar';
import { FloatingOrbs } from '@/components/effects/FloatingOrbs';

const CryptoExchange = () => {
  const [userPoints, setUserPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            variant: "destructive",
            title: "Authentication required",
            description: "Please sign in to access this page.",
          });
          setLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        setUserPoints(profile?.points || 0);
      } catch (error: any) {
        console.error('Error fetching user points:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user points. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-b from-siso-bg via-black to-siso-bg relative overflow-hidden">
        <FloatingOrbs />
        
        {/* Content */}
        <div className="container mx-auto p-6 space-y-8 relative z-10">
          {/* Enhanced Header Section */}
          <div className="flex flex-col space-y-2 bg-black/20 p-6 rounded-lg backdrop-blur-sm border border-siso-text/5">
            <div className="flex items-center gap-3">
              <ArrowRightLeft className="w-8 h-8 text-gradient bg-gradient-to-r from-siso-red to-siso-orange" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
                Crypto Exchange
              </h1>
            </div>
            <p className="text-siso-text/80 ml-11">
              Convert your SISO Points to SISO Tokens and manage your NFTs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Swap Section */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-siso-text-bold">
                  Swap Your Points
                </h2>
                <div className="text-sm text-siso-text/60">
                  Balance: {userPoints.toLocaleString()} Points
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-siso-text/10 p-6 hover:border-siso-text/20 transition-all duration-300 shadow-lg">
                <PointsExchange userPoints={userPoints} />
              </div>
            </div>

            {/* Enhanced NFT Gallery Section */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-siso-text-bold">
                  Your NFT Gallery
                </h2>
                <div className="text-sm text-siso-text/60">
                  Connected to Solana
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-lg rounded-xl border border-siso-text/10 p-6 hover:border-siso-text/20 transition-all duration-300 shadow-lg">
                <NFTGallery />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoExchange;