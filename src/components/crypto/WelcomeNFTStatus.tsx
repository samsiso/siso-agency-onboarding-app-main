import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  mint_address: string;
}

interface WelcomeNFTStatus {
  status: 'pending' | 'completed' | 'failed';
  error_message?: string;
  metadata?: NFTMetadata;
}

// Type guard to check if metadata has the correct shape
const isValidNFTMetadata = (metadata: any): metadata is NFTMetadata => {
  return (
    metadata &&
    typeof metadata.name === 'string' &&
    typeof metadata.description === 'string' &&
    typeof metadata.image === 'string' &&
    typeof metadata.mint_address === 'string'
  );
};

export const WelcomeNFTStatus = () => {
  const [status, setStatus] = useState<WelcomeNFTStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('welcome_nft_mints')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;

        // Transform the data to match our expected type
        const nftStatus: WelcomeNFTStatus = {
          status: data.status,
          error_message: data.error_message,
          metadata: isValidNFTMetadata(data.metadata) ? data.metadata : undefined
        };

        setStatus(nftStatus);

        // If completed, show success toast
        if (data?.status === 'completed' && isValidNFTMetadata(data.metadata)) {
          toast({
            title: "Welcome NFT Minted!",
            description: "Your welcome NFT has been successfully minted.",
          });
        }
      } catch (error: any) {
        console.error('Error fetching welcome NFT status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Subscribe to changes
    const channel = supabase
      .channel('welcome-nft-status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'welcome_nft_mints',
          filter: `user_id=eq.${supabase.auth.getUser()}`
        },
        (payload) => {
          const newData = payload.new;
          const nftStatus: WelcomeNFTStatus = {
            status: newData.status,
            error_message: newData.error_message,
            metadata: isValidNFTMetadata(newData.metadata) ? newData.metadata : undefined
          };
          
          setStatus(nftStatus);
          
          if (newData.status === 'completed' && isValidNFTMetadata(newData.metadata)) {
            toast({
              title: "Welcome NFT Minted!",
              description: "Your welcome NFT has been successfully minted.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <Card className="bg-black/20 border-siso-text/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-siso-orange" />
            Welcome NFT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-siso-orange" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) return null;

  return (
    <Card className="bg-black/20 border-siso-text/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-siso-orange" />
          Welcome NFT
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {status.status === 'pending' && (
            <div className="flex items-center gap-2 text-siso-text">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Minting your welcome NFT...</span>
            </div>
          )}

          {status.status === 'completed' && status.metadata && (
            <div className="space-y-4">
              <img
                src={status.metadata.image}
                alt={status.metadata.name}
                className="w-full aspect-square rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-siso-text-bold mb-1">
                  {status.metadata.name}
                </h3>
                <p className="text-sm text-siso-text/80">
                  {status.metadata.description}
                </p>
                <p className="text-xs text-siso-text/60 mt-2">
                  Mint address: {status.metadata.mint_address}
                </p>
              </div>
            </div>
          )}

          {status.status === 'failed' && (
            <div className="text-red-500">
              <p>Failed to mint NFT</p>
              {status.error_message && (
                <p className="text-sm mt-1">{status.error_message}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};