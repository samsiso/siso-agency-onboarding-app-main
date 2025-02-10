
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
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NFT {
  name: string;
  image: string;
  description?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

// [Analysis] Added masonry layout with responsive grid and smooth animations
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
    <Card className="bg-black/20 border-siso-text/10 backdrop-blur-sm">
      <CardHeader className="space-y-4">
        <CardTitle className="text-siso-text-bold flex items-center gap-2">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2"
          >
            {viewMode === 'grid' ? (
              <Grid className="h-6 w-6 text-siso-orange" />
            ) : (
              <List className="h-6 w-6 text-siso-orange" />
            )}
            Your NFT Collection
          </motion.div>
        </CardTitle>
        <motion.div 
          className="flex flex-wrap gap-4 items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={cn(
                "transition-all duration-300",
                viewMode === 'grid' ? 'bg-siso-text/10 hover:bg-siso-text/20' : ''
              )}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('list')}
              className={cn(
                "transition-all duration-300",
                viewMode === 'list' ? 'bg-siso-text/10 hover:bg-siso-text/20' : ''
              )}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="transition-all duration-300 hover:bg-siso-text/10"
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
            <SelectTrigger className="w-[180px] bg-black/20 border-siso-text/10">
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
        </motion.div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              className="flex justify-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
            </motion.div>
          ) : filteredNFTs.length > 0 ? (
            <motion.div 
              className={cn(
                "grid gap-4",
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr'
                  : 'grid-cols-1'
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredNFTs.map((nft, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="h-full"
                >
                  <Card 
                    className={cn(
                      "bg-background/50 cursor-pointer h-full",
                      "hover:bg-background/60 transition-all duration-300",
                      "border border-siso-text/10 hover:border-siso-text/20",
                      "backdrop-blur-sm shadow-lg hover:shadow-xl"
                    )}
                    onClick={() => setSelectedNFT(nft)}
                  >
                    <CardContent className={cn(
                      "p-4",
                      viewMode === 'list' ? 'flex items-center gap-4' : ''
                    )}>
                      <motion.div 
                        className={cn(
                          "relative overflow-hidden rounded-lg",
                          viewMode === 'list' ? 'w-24 h-24' : 'w-full aspect-square'
                        )}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="w-full h-full object-cover transform transition-transform duration-300"
                        />
                      </motion.div>
                      <div className="flex-1 mt-4">
                        <h3 className="font-semibold text-siso-text-bold text-lg">{nft.name}</h3>
                        {nft.description && viewMode === 'list' && (
                          <p className="text-sm text-siso-text/80 mt-1 line-clamp-2">
                            {nft.description}
                          </p>
                        )}
                        {nft.attributes && nft.attributes.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {nft.attributes.slice(0, 3).map((attr, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs rounded-full bg-siso-text/10 text-siso-text/80"
                              >
                                {attr.trait_type}: {attr.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-siso-text/60 mb-4">No NFTs found in your wallet</p>
              <Button
                onClick={fetchNFTs}
                className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
              >
                Refresh NFTs
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <NFTDetailsModal
        nft={selectedNFT}
        isOpen={!!selectedNFT}
        onClose={() => setSelectedNFT(null)}
      />
    </Card>
  );
};
