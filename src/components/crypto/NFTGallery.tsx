import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface NFT {
  name: string;
  image: string;
  description?: string;
}

export const NFTGallery = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to view your NFTs.",
        });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('solana_wallet_address')
        .eq('id', session.user.id)
        .single();

      if (!profile?.solana_wallet_address) {
        toast({
          variant: "destructive",
          title: "Wallet not connected",
          description: "Please connect your Solana wallet to view your NFTs.",
        });
        return;
      }

      const { data: nftData, error } = await supabase.functions.invoke('fetch-solana-nfts', {
        body: { walletAddress: profile.solana_wallet_address }
      });

      if (error) throw error;
      setNfts(nftData || []);
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

  return (
    <Card className="bg-black/20 border-siso-text/10">
      <CardHeader>
        <CardTitle className="text-siso-text-bold">Your NFT Collection</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
          </div>
        ) : nfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nfts.map((nft, index) => (
              <Card key={index} className="bg-background/50">
                <CardContent className="p-4">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full aspect-square object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-siso-text-bold">{nft.name}</h3>
                  {nft.description && (
                    <p className="text-sm text-siso-text/80 mt-2">{nft.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-siso-text/60 mb-4">No NFTs found in your wallet</p>
            <Button
              onClick={fetchNFTs}
              className="bg-siso-red hover:bg-siso-red/90"
            >
              Refresh NFTs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};