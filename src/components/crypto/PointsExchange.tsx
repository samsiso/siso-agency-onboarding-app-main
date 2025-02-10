import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowDown, Loader2, Settings, History, Wallet } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('siso_tokens')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setSisoTokens(profile.siso_tokens || 0);
        }

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
          fetchUserData();
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
        const container = document.querySelector('.exchange-container');
        if (container) {
          const particle = document.createElement('div');
          particle.className = 'success-particle';
          container.appendChild(particle);
          setTimeout(() => particle.remove(), 1000);
        }

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

  const handleQuickSelect = (percentage: number) => {
    const amount = Math.floor((userPoints * percentage) / 100);
    setPointsToExchange(amount.toString());
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 exchange-container relative">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-siso-text-bold">Swap</h2>
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-siso-text/5 rounded-lg transition-colors relative group" 
            title="Transaction History"
          >
            <History className="w-5 h-5 text-siso-text/60 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-siso-text/5 rounded-lg transition-colors relative group" 
            title="Exchange Settings"
          >
            <Settings className="w-5 h-5 text-siso-text/60 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {showHistory ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-siso-bg-alt rounded-lg p-4 border border-siso-text/10"
          >
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <motion.div 
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-black/20 rounded-lg border border-siso-text/5 hover:border-siso-text/20 transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-siso-text/80">
                        {tx.points_exchanged.toLocaleString()} Points → {tx.tokens_received.toLocaleString()} Tokens
                      </span>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        tx.status === 'completed' && "bg-green-500/20 text-green-400",
                        tx.status === 'failed' && "bg-red-500/20 text-red-400",
                        tx.status === 'pending' && "bg-yellow-500/20 text-yellow-400"
                      )}>
                        {tx.status}
                      </span>
                    </div>
                    <div className="text-xs text-siso-text/60 mt-1">
                      {new Date(tx.created_at).toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <div className="text-sm text-siso-text/60 uppercase tracking-wider">From</div>
              <motion.div 
                className="bg-siso-bg-alt rounded-lg p-4 border border-siso-text/10 hover:border-siso-text/20 transition-all duration-300 relative group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-siso-red/5 to-siso-orange/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-siso-red to-siso-orange flex items-center justify-center relative"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-white font-semibold text-sm">SP</span>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-siso-red to-siso-orange blur-lg opacity-50" />
                      </motion.div>
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
                    className="bg-transparent border-none text-2xl font-bold text-siso-text-bold placeholder:text-siso-text/30 focus-visible:ring-0 relative z-10"
                  />
                  <div className="flex gap-2 mt-2">
                    {[25, 50, 75, 100].map((percentage) => (
                      <motion.button
                        key={percentage}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickSelect(percentage)}
                        className="px-2 py-1 text-xs rounded-md bg-siso-text/10 hover:bg-siso-text/20 text-siso-text-bold transition-colors relative group"
                      >
                        {percentage}%
                        <div className="absolute inset-0 bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="flex justify-center -my-2"
              animate={{ 
                rotate: loading ? 360 : 0,
              }}
              transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
            >
              <motion.div 
                className="w-10 h-10 rounded-full bg-siso-bg-alt border border-siso-text/10 flex items-center justify-center relative group"
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowDown className="w-5 h-5 text-siso-text/60 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </motion.div>

            <div className="space-y-2">
              <div className="text-sm text-siso-text/60 uppercase tracking-wider">To</div>
              <motion.div 
                className="bg-siso-bg-alt rounded-lg p-4 border border-siso-text/10 hover:border-siso-text/20 transition-all duration-300 relative group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-siso-red/5 to-siso-orange/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-siso-red to-siso-orange flex items-center justify-center relative"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-white font-semibold text-sm">ST</span>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-siso-red to-siso-orange blur-lg opacity-50" />
                      </motion.div>
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
                    className="bg-transparent border-none text-2xl font-bold text-siso-text-bold placeholder:text-siso-text/30 focus-visible:ring-0 relative z-10"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-siso-text/60 text-center p-2 rounded-lg bg-siso-text/5 relative overflow-hidden group"
            >
              <div className="relative z-10">1 SISO Token = 1,000 SISO Points</div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleExchange}
                disabled={loading || !pointsToExchange}
                className={cn(
                  "w-full h-12 bg-gradient-to-r from-siso-red to-siso-orange relative group overflow-hidden",
                  "hover:from-siso-red/90 hover:to-siso-orange/90",
                  "text-white font-semibold rounded-lg transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    <span className="relative z-10">Swap Points for Tokens</span>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .success-particle {
          position: absolute;
          pointer-events: none;
          width: 10px;
          height: 10px;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          animation: particle-burst 1s ease-out forwards;
        }

        @keyframes particle-burst {
          0% {
            transform: scale(0) translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: scale(20) translate(var(--tx), var(--ty));
            opacity: 0;
          }
        }

        .shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
};
