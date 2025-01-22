import { PointsExchange } from "@/components/crypto/PointsExchange";
import { NFTGallery } from "@/components/crypto/NFTGallery";

const CryptoExchange = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Crypto Exchange</h1>
      <div className="grid gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Exchange Points</h2>
          <PointsExchange />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your NFT Gallery</h2>
          <NFTGallery />
        </section>
      </div>
    </div>
  );
};

export default CryptoExchange;