import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Loader2 } from 'lucide-react';

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
        .insert([
          {
            user_id: session.user.id,
            points_exchanged: points,
            tokens_received: points / 1000, // 1:1000 exchange rate
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Exchange initiated",
        description: `Converting ${points} points to ${points / 1000} tokens...`,
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

  return (
    <Card className="bg-black/20 border-siso-text/10">
      <CardHeader>
        <CardTitle className="text-siso-text-bold">Exchange Points for Tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="number"
              value={pointsToExchange}
              onChange={(e) => setPointsToExchange(e.target.value)}
              placeholder="Enter points to exchange"
              className="bg-background"
            />
          </div>
          <ArrowRight className="text-siso-text/60" />
          <div className="flex-1">
            <Input
              type="text"
              value={pointsToExchange ? `${parseInt(pointsToExchange) / 1000} tokens` : ''}
              readOnly
              className="bg-background"
            />
          </div>
        </div>
        <Button
          onClick={handleExchange}
          disabled={loading || !pointsToExchange}
          className="w-full bg-siso-red hover:bg-siso-red/90"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Exchange Points'
          )}
        </Button>
        <p className="text-xs text-siso-text/60 text-center">
          Exchange rate: 1000 points = 1 token
        </p>
      </CardContent>
    </Card>
  );
};