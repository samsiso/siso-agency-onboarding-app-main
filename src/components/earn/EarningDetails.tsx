import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { usePoints } from '@/hooks/usePoints';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EarningTask {
  action: string;
  points: string;
}

interface EarningDetailsProps {
  title: string;
  description: string;
  items: EarningTask[];
}

export const EarningDetails = ({ title, description, items }: EarningDetailsProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const { awardPoints } = usePoints(userId || undefined);
  const { toast } = useToast();

  useEffect(() => {
    // Get the current user's ID
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleTaskClick = async (action: string) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please sign in to earn points",
      });
      return;
    }

    try {
      // Convert the display action to the database action type
      const dbAction = action.toLowerCase().replace(/ /g, '_') as any;
      await awardPoints(dbAction);
      
      toast({
        title: "Points Awarded!",
        description: `You've earned points for ${action}`,
      });
    } catch (error) {
      console.error('Error awarding points:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to award points at this time",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-lg text-siso-text/80 leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      <div className="grid gap-4">
        {items.map((item, index) => (
          <Card 
            key={index}
            onClick={() => handleTaskClick(item.action)}
            className={cn(
              "p-4 border-siso-border hover:border-siso-border-hover",
              "bg-gradient-to-r from-siso-text/5 to-transparent",
              "hover:from-siso-text/10 transition-all duration-300",
              "group cursor-pointer"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-siso-red/10 to-siso-orange/10 
                  flex items-center justify-center group-hover:from-siso-red/20 group-hover:to-siso-orange/20 
                  transition-all duration-300">
                  <Star className="w-5 h-5 text-siso-orange" />
                </div>
                <span className="text-siso-text group-hover:text-siso-text-bold transition-colors duration-300">
                  {item.action}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-siso-red/10 to-siso-orange/10 
                text-siso-orange font-semibold text-sm group-hover:from-siso-red/20 group-hover:to-siso-orange/20 
                transition-all duration-300">
                {item.points}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};