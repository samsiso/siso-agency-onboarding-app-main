import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ArrowRightLeft } from 'lucide-react';
import { PointsExchange } from "@/components/crypto/PointsExchange";
import { NFTGallery } from "@/components/crypto/NFTGallery";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <ArrowRightLeft className="w-8 h-8 text-siso-orange" />
        <h1 className="text-3xl font-bold text-siso-text-bold">Crypto Exchange</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-black/20 border-siso-text/10">
          <h2 className="text-xl font-semibold text-siso-text-bold mb-6">Points Exchange</h2>
          <PointsExchange userPoints={userPoints} />
        </Card>

        <Card className="p-6 bg-black/20 border-siso-text/10">
          <h2 className="text-xl font-semibold text-siso-text-bold mb-6">Your NFT Gallery</h2>
          <NFTGallery />
        </Card>
      </div>
    </div>
  );
};

export default CryptoExchange;