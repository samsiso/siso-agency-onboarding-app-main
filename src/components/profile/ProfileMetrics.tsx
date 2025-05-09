
import { LoginStreakTracker } from '@/components/points/LoginStreakTracker';
import { PointsDisplay } from '@/components/points/PointsDisplay';
import { ConnectWalletButton } from '@/components/crypto/ConnectWalletButton';
import { MintNFTButton } from '@/components/crypto/MintNFTButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Wallet, Star, Award } from 'lucide-react';

interface ProfileMetricsProps {
  userId: string;
  solanaWalletAddress?: string;
}

export const ProfileMetrics = ({ userId, solanaWalletAddress }: ProfileMetricsProps) => {
  return (
    <div className="space-y-6">
      {/* Login Streak */}
      <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-white">
            <Star className="mr-2 h-5 w-5 text-yellow-400" />
            Daily Login Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginStreakTracker userId={userId} />
        </CardContent>
      </Card>
      
      {/* Points */}
      <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-white">
            <Trophy className="mr-2 h-5 w-5 text-orange-400" />
            Points & Rank
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PointsDisplay userId={userId} />
        </CardContent>
      </Card>
      
      {/* Wallet */}
      <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-white">
            <Wallet className="mr-2 h-5 w-5 text-purple-400" />
            Crypto Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConnectWalletButton />
        </CardContent>
      </Card>

      {/* NFT - Only show if wallet is connected */}
      {solanaWalletAddress && (
        <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-white">
              <Award className="mr-2 h-5 w-5 text-cyan-400" />
              SISO NFTs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MintNFTButton />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
