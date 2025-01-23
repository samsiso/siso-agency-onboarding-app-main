import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowDown, Loader2, Settings } from 'lucide-react';

export const PointsExchange = ({ userPoints }: { userPoints: number }) => {
  const [pointsToExchange, setPointsToExchange] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExchange = async () => {
    const points = parseInt(pointsToExchange);
    if (!points || points <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid number of points to exchange.",
      });
      return;
    }

    if (points > userPoints) {
      toast({
        variant: "destructive",
        title: "Insufficient points",
        description: "You don't have enough points for this exchange.",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to exchange points.",
        });
        return;
      }

      const { error } = await supabase
        .from('crypto_transactions')
        .insert([{
          user_id: session.user.id,
          points_exchanged: points,
          tokens_received: points / 1000,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Exchange initiated",
        description: `Converting ${points} points to ${points / 1000} SISO tokens...`,
      });

      setPointsToExchange('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Exchange failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const tokensToReceive = pointsToExchange ? parseInt(pointsToExchange) / 1000 : 0;

  return (
    <div className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-lg rounded-xl border border-siso-text/10 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-siso-text-bold">Swap</h2>
        <button className="p-2 hover:bg-siso-text/5 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-siso-text/60" />
        </button>
      </div>

      {/* From Section */}
      <div className="space-y-2">
        <div className="text-sm text-siso-text/60 uppercase tracking-wider">From</div>
        <div className="bg-siso-bg-alt rounded-lg p-4 border border-siso-text/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-siso-red to-siso-orange flex items-center justify-center">
                <span className="text-white font-semibold text-sm">SP</span>
              </div>
              <span className="font-semibold text-siso-text-bold">SISO Points</span>
            </div>
            <div className="text-sm text-siso-text/60">
              Balance: {userPoints}
            </div>
          </div>
          <Input
            type="number"
            value={pointsToExchange}
            onChange={(e) => setPointsToExchange(e.target.value)}
            placeholder="0.0"
            className="bg-transparent border-none text-2xl font-bold text-siso-text-bold placeholder:text-siso-text/30 focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Swap Icon */}
      <div className="flex justify-center -my-2">
        <div className="w-10 h-10 rounded-full bg-siso-bg-alt border border-siso-text/10 flex items-center justify-center">
          <ArrowDown className="w-5 h-5 text-siso-text/60" />
        </div>
      </div>

      {/* To Section */}
      <div className="space-y-2">
        <div className="text-sm text-siso-text/60 uppercase tracking-wider">To</div>
        <div className="bg-siso-bg-alt rounded-lg p-4 border border-siso-text/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">ST</span>
              </div>
              <span className="font-semibold text-siso-text-bold">SISO Tokens</span>
            </div>
          </div>
          <Input
            type="text"
            value={tokensToReceive ? `${tokensToReceive}` : ''}
            readOnly
            placeholder="0.0"
            className="bg-transparent border-none text-2xl font-bold text-siso-text-bold placeholder:text-siso-text/30 focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Exchange Rate Info */}
      <div className="text-sm text-siso-text/60 text-center">
        1 SISO Token = 1000 SISO Points
      </div>

      {/* Swap Button */}
      <Button
        onClick={handleExchange}
        disabled={loading || !pointsToExchange}
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          'Swap Points for Tokens'
        )}
      </Button>
    </div>
  );
};