import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Grid, List, SortAsc, SortDesc } from 'lucide-react';
import { NFTDetailsModal } from './NFTDetailsModal';

interface NFT {
  name: string;
  image: string;
  description?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export const NFTGallery = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [filterAttribute, setFilterAttribute] = useState<string>('all');
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
      
      // Sort NFTs
      const sortedNFTs = [...(nftData || [])].sort((a, b) => {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });
      
      setNfts(sortedNFTs);
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

  useEffect(() => {
    fetchNFTs();
  }, [sortOrder]);

  const getUniqueAttributes = () => {
    const attributes = new Set<string>();
    nfts.forEach(nft => {
      nft.attributes?.forEach(attr => {
        attributes.add(attr.trait_type);
      });
    });
    return Array.from(attributes);
  };

  const filteredNFTs = nfts.filter(nft => {
    if (filterAttribute === 'all') return true;
    return nft.attributes?.some(attr => attr.trait_type === filterAttribute);
  });

  return (
    <Card className="bg-black/20 border-siso-text/10">
      <CardHeader className="space-y-4">
        <CardTitle className="text-siso-text-bold">Your NFT Collection</CardTitle>
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-siso-text/10' : ''}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-siso-text/10' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Select
            value={filterAttribute}
            onValueChange={setFilterAttribute}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by attribute" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Attributes</SelectItem>
              {getUniqueAttributes().map((attr) => (
                <SelectItem key={attr} value={attr}>
                  {attr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
          </div>
        ) : filteredNFTs.length > 0 ? (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredNFTs.map((nft, index) => (
              <Card 
                key={index} 
                className="bg-background/50 cursor-pointer hover:bg-background/60 transition-colors"
                onClick={() => setSelectedNFT(nft)}
              >
                <CardContent className={`p-4 ${
                  viewMode === 'list' ? 'flex items-center gap-4' : ''
                }`}>
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className={`rounded-lg mb-4 ${
                      viewMode === 'list' 
                        ? 'w-24 h-24 mb-0' 
                        : 'w-full aspect-square'
                    } object-cover`}
                  />
                  <div>
                    <h3 className="font-semibold text-siso-text-bold">{nft.name}</h3>
                    {nft.description && viewMode === 'list' && (
                      <p className="text-sm text-siso-text/80 mt-1 line-clamp-2">
                        {nft.description}
                      </p>
                    )}
                  </div>
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
      <NFTDetailsModal
        nft={selectedNFT}
        isOpen={!!selectedNFT}
        onClose={() => setSelectedNFT(null)}
      />
    </Card>
  );
};