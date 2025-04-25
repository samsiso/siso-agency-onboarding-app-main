
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
            {leaders.slice(0, 5).map((leader, index) => (
              <motion.div 
                key={leader.rank}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400/10 via-gray-400/5 to-transparent' :
                  index === 2 ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent' :
                  'bg-black/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                    index === 1 ? 'bg-gray-400/20 text-gray-400' :
                    index === 2 ? 'bg-amber-600/20 text-amber-600' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-xl mr-2">{leader.avatar}</span>
                  <div>
                    <span className="text-white font-medium">{leader.name}</span>
                    <div className="flex items-center gap-2 text-xs text-siso-text">
                      <span>{leader.points} points</span>
                      {Math.random() > 0.5 ? (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>
                <span className="font-semibold text-purple-400">{leader.points}</span>
              </motion.div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4 bg-black/30 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            onClick={() => navigate('/economy/leaderboards')}
          >
            View Full Leaderboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
