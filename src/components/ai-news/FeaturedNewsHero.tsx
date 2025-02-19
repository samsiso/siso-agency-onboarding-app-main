import { motion } from 'framer-motion';
import { NewsCardMedia } from './NewsCardMedia';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, BookmarkPlus, Star, AlertCircle, AlertOctagon, ChartPie, Clock, Info } from 'lucide-react';

interface FeaturedNewsHeroProps {
  item: any;
  onGenerateSummary: (id: string) => void;
}

const FeaturedNewsHero = ({ item, onGenerateSummary }: FeaturedNewsHeroProps) => {
  if (!item) return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full rounded-xl overflow-hidden mb-8"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-siso-red/20 via-siso-orange/10 to-transparent opacity-75" />
      <div className="absolute inset-0 bg-gradient-radial from-siso-red/10 via-siso-orange/5 to-transparent opacity-50" />
      
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-siso-bg-alt/50 backdrop-blur-sm border border-siso-border rounded-xl">
        <div className="relative">
          {/* Today's Impact Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-siso-text-bold">Today's AI Impact Summary</h2>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-siso-red" />
                <span className="text-sm text-siso-text/70">Last updated: 5m ago</span>
              </div>
            </div>
            
            {/* Impact Distribution */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-green-500/10 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">High Impact</span>
                </div>
                <span className="text-2xl font-bold">5</span>
              </div>
              <div className="bg-yellow-500/10 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Medium Impact</span>
                </div>
                <span className="text-2xl font-bold">8</span>
              </div>
              <div className="bg-blue-500/10 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Low Impact</span>
                </div>
                <span className="text-2xl font-bold">12</span>
              </div>
            </div>

            {/* Quick Highlights */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Quick Highlights</h3>
              <div className="space-y-3">
                {["OpenAI's GPT-5 Development", "Google's Quantum Breakthrough", "Meta's AR Progress"].map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2 bg-white/5 p-3 rounded-lg">
                    <Star className="h-5 w-5 text-siso-orange mt-1" />
                    <div>
                      <p className="font-medium">{highlight}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 text-xs">
                          High Impact
                        </Badge>
                        <span className="text-xs text-siso-text/70">Research & Development</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Impact Distribution Chart */}
          <div className="bg-siso-bg-alt p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Impact by Category</h3>
              <ChartPie className="h-5 w-5 text-siso-orange" />
            </div>
            <div className="space-y-3">
              {[
                { category: 'Research', percentage: 40, color: 'bg-blue-500' },
                { category: 'Applications', percentage: 30, color: 'bg-green-500' },
                { category: 'Industry', percentage: 20, color: 'bg-yellow-500' },
                { category: 'Policy', percentage: 10, color: 'bg-purple-500' }
              ].map(({ category, percentage, color }) => (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-siso-bg-alt p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Technical Complexity</h4>
                <Info className="h-4 w-4 text-siso-text/50" />
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Advanced</span>
                  <span>45%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Intermediate</span>
                  <span>35%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Basic</span>
                  <span>20%</span>
                </div>
              </div>
            </div>
            <div className="bg-siso-bg-alt p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Source Credibility</h4>
                <Info className="h-4 w-4 text-siso-text/50" />
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Verified</span>
                  <span>75%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Reputable</span>
                  <span>20%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Unverified</span>
                  <span>5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedNewsHero;
