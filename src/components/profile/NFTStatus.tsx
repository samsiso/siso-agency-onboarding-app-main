import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Diamond } from 'lucide-react';

interface NFT {
  id: string;
  name: string;
  imageUrl?: string;
  rank?: string;
}

interface NFTStatusProps {
  nfts: NFT[];
}

export const NFTStatus = ({ nfts }: NFTStatusProps) => {
  return (
    <Card className="bg-black/20 border-siso-text/10">
      <CardHeader>
        <CardTitle className="text-siso-text-bold flex items-center gap-2">
          <Diamond className="w-5 h-5 text-siso-orange" />
          NFT Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {nfts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className="p-4 rounded-lg bg-siso-text/5 border border-siso-text/10"
              >
                {nft.imageUrl && (
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <p className="text-sm font-medium text-siso-text-bold">{nft.name}</p>
                {nft.rank && (
                  <p className="text-xs text-siso-text/70">Rank: {nft.rank}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-siso-text/70">
            <Diamond className="w-8 h-8 mx-auto mb-2 text-siso-text/40" />
            <p>No NFTs connected yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};