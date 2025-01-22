import { PointsExchange } from "@/components/crypto/PointsExchange";
import { NFTGallery } from "@/components/crypto/NFTGallery";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Wallet } from 'lucide-react';

const CryptoExchange = () => {
  const { data: userPoints } = useQuery({
    queryKey: ['userPoints'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();

      return data?.points || 0;
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Wallet className="w-8 h-8 text-siso-orange" />
        <h1 className="text-3xl font-bold text-siso-text-bold">Crypto Exchange</h1>
      </div>
      <div className="grid gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-siso-text-bold">Exchange Points</h2>
          <PointsExchange userPoints={userPoints || 0} />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-siso-text-bold">Your NFT Gallery</h2>
          <NFTGallery />
        </section>
      </div>
    </div>
  );
};

export default CryptoExchange;