
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Sample leaderboard data - in a real app, these would come from an API
const leaders = [
  { rank: 1, name: "Alex Smith", points: 2450, avatar: "😎" },
  { rank: 2, name: "Jordan Lee", points: 2280, avatar: "🚀" },
  { rank: 3, name: "Casey Jones", points: 2120, avatar: "🔥" },
  { rank: 4, name: "Riley Taylor", points: 1980, avatar: "⚡" },
  { rank: 5, name: "Jamie Wilson", points: 1845, avatar: "💫" }
];

export function LeaderboardPreviewCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="border-siso-border bg-black/30 hover:border-purple-500/30 transition-all duration-300 h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            Top Contributors
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-2">
            {leaders.map(leader => (
              <div 
                key={leader.rank}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    leader.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                    leader.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                    leader.rank === 3 ? 'bg-amber-600/20 text-amber-600' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {leader.rank}
                  </div>
                  <span className="text-lg mr-2">{leader.avatar}</span>
                  <span className="text-white">{leader.name}</span>
                </div>
                <span className="font-semibold text-purple-400">{leader.points}</span>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-3 bg-black/30 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            onClick={() => navigate('/economy/leaderboards')}
          >
            Full Leaderboard
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
