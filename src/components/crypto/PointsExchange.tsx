
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowDown, Loader2, Settings, History } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Transaction {
  id: string;
  points_exchanged: number;
  tokens_received: number;
  status: string;
  created_at: string;
  transaction_type: string;
}

export const PointsExchange = ({ userPoints }: { userPoints: number }) => {
  const [pointsToExchange, setPointsToExchange] = useState('');
  const [loading, setLoading] = useState(false);
  const [sisoTokens, setSisoTokens] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  // Fetch user's SISO token balance and transaction history
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Fetch SISO tokens balance
        const { data: profile } = await supabase
          .from('profiles')
          .select('siso_tokens')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setSisoTokens(profile.siso_tokens || 0);
        }

        // Fetch transaction history
        const { data: txHistory } = await supabase
          .from('user_crypto_history')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (txHistory) {
          setTransactions(txHistory);
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();

    // Set up realtime subscription for transactions
    const channel = supabase
      .channel('crypto-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crypto_transactions',
        },
        (payload) => {
          console.log('Transaction update:', payload);
          fetchUserData(); // Refresh data when transactions change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

      const { data, error } = await supabase
        .from('crypto_transactions')
        .insert([{
          user_id: session.user.id,
          points_exchanged: points,
          tokens_received: points / 1000,
          transaction_type: 'exchange'
        }])
        .select()
        .single();

      if (error) throw error;

      if (data.status === 'completed') {
        toast({
          title: "Exchange successful",
          description: `Converted ${points} points to ${points / 1000} SISO tokens.`,
        });
        setPointsToExchange('');
      } else {
        toast({
          variant: "destructive",
          title: "Exchange failed",
          description: "Failed to process the exchange. Please try again.",
        });
      }
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
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-siso-text-bold">Swap</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-siso-text/5 rounded-lg transition-colors" 
            title="Transaction History"
          >
            <History className="w-5 h-5 text-siso-text/60" />
          </button>
          <button 
            className="p-2 hover:bg-siso-text/5 rounded-lg transition-colors" 
            title="Exchange Settings"
          >
            <Settings className="w-5 h-5 text-siso-text/60" />
          </button>
        </div>
      </div>

      {showHistory ? (
        <div className="bg-siso-bg-alt rounded-lg p-4 border border-siso-text/10">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className="p-3 bg-black/20 rounded-lg border border-siso-text/5"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-siso-text/80">
                      {tx.points_exchanged.toLocaleString()} Points → {tx.tokens_received.toLocaleString()} Tokens
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      tx.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                  <div className="text-xs text-siso-text/60 mt-1">
                    {new Date(tx.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <>
          {/* From Section */}
          <div className="space-y-2">
            <div className="text-sm text-siso-text/60 uppercase tracking-wider">From</div>
            <div className="bg-siso-bg-alt rounded-lg p-4 border border-siso-text/10 hover:border-siso-text/20 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-siso-red to-siso-orange flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">SP</span>
                  </div>
                  <span className="font-semibold text-siso-text-bold">SISO Points</span>
                </div>
                <div className="text-sm text-siso-text/60">
                  Balance: {userPoints.toLocaleString()}
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
            <div className="bg-siso-bg-alt rounded-lg p-4 border border-siso-text/10 hover:border-siso-text/20 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-siso-red to-siso-orange flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">ST</span>
                  </div>
                  <span className="font-semibold text-siso-text-bold">SISO Tokens</span>
                </div>
                <div className="text-sm text-siso-text/60">
                  Balance: {sisoTokens.toLocaleString()}
                </div>
              </div>
              <Input
                type="text"
                value={tokensToReceive ? tokensToReceive.toLocaleString() : ''}
                readOnly
                placeholder="0.0"
                className="bg-transparent border-none text-2xl font-bold text-siso-text-bold placeholder:text-siso-text/30 focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="text-sm text-siso-text/60 text-center">
            1 SISO Token = 1,000 SISO Points
          </div>

          {/* Swap Button */}
          <Button
            onClick={handleExchange}
            disabled={loading || !pointsToExchange}
            className="w-full h-12 bg-gradient-to-r from-siso-red to-siso-orange hover:from-siso-red/90 hover:to-siso-orange/90 text-white font-semibold rounded-lg transition-all duration-200"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Swap Points for Tokens'
            )}
          </Button>
        </>
      )}
    </div>
  );
};
