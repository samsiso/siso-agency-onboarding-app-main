import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface NFT {
  name: string;
  uri: string;
  symbol: string;
}

export const NFTGallery = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('solana_wallet_address')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        if (!profile?.solana_wallet_address) {
          setLoading(false);
          return;
        }

        // Here we'll call our edge function to fetch NFTs
        const { data, error } = await supabase.functions.invoke('fetch-solana-nfts', {
          body: { walletAddress: profile.solana_wallet_address }
        });

        if (error) throw error;
        setNfts(data);
      } catch (error: any) {
        console.error('Error fetching NFTs:', error);
        toast({
          variant: "destructive",
          title: "Error fetching NFTs",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  if (loading) {
    return (
      <Card className="bg-black/20 border-siso-text/10">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 border-siso-text/10">
      <CardHeader>
        <CardTitle className="text-siso-text-bold">Your NFT Collection</CardTitle>
      </CardHeader>
      <CardContent>
        {nfts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nfts.map((nft, index) => (
              <Card key={index} className="bg-background/50 border-siso-text/10">
                <CardContent className="p-4">
                  <img
                    src={nft.uri}
                    alt={nft.name}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-medium text-siso-text-bold">{nft.name}</h3>
                  <p className="text-sm text-siso-text/60">{nft.symbol}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-siso-text/60 py-8">
            No NFTs found in your wallet. Make sure your wallet address is connected in your profile.
          </p>
        )}
      </CardContent>
    </Card>
  );
};