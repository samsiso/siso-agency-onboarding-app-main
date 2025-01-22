import { Card } from "@/components/ui/card";
import { ArrowRightLeft } from 'lucide-react';
import { PointsExchange } from "@/components/crypto/PointsExchange";
import { NFTGallery } from "@/components/crypto/NFTGallery";

const CryptoExchange = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <ArrowRightLeft className="w-8 h-8 text-siso-orange" />
        <h1 className="text-3xl font-bold text-siso-text-bold">Crypto Exchange</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-black/20 border-siso-text/10">
          <h2 className="text-xl font-semibold text-siso-text-bold mb-6">Points Exchange</h2>
          <PointsExchange />
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