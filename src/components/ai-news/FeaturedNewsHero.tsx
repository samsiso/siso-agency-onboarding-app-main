
import { motion } from 'framer-motion';
import { NewsCardMedia } from './NewsCardMedia';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, BookmarkPlus, Star, AlertCircle, AlertOctagon, ChartPie, Clock, Info, ArrowRight } from 'lucide-react';
import { NewsItem } from '@/types/blog';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { GradientText } from '@/components/ui/gradient-text';

// [Analysis] Enhanced props interface with clear type definitions
interface FeaturedNewsHeroProps {
  article: NewsItem;
  onGenerateSummary: (id: string) => Promise<void>;
  summary: string;
  loadingSummary: boolean;
}

const FeaturedNewsHero = ({
  article,
  onGenerateSummary,
  summary,
  loadingSummary
}: FeaturedNewsHeroProps) => {
  // [Analysis] Fallback UI when article isn't available with improved visuals
  if (!article) return (
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
                    <div 
                      className={`h-full ${color}`} 
                      style={{ width: `${percentage}%` }} 
                    />
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

  // [Analysis] Enhanced featured article display with improved visual hierarchy and interactive elements
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full rounded-xl overflow-hidden mb-8"
    >
      <div className="relative">
        {/* Featured image with enhanced media component */}
        <NewsCardMedia 
          imageUrl={article.image_url} 
          title={article.title} 
          isFeatured={true}
          className="h-64 md:h-[400px]" 
        />
        
        {/* Overlay content with gradient background for better readability */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8">
          <div className="bg-black/60 backdrop-blur-sm p-4 sm:p-6 rounded-xl">
            <div className="flex flex-col space-y-3">
              {/* Category badge */}
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-siso-red text-white border-none px-2.5 py-0.5">
                  {article.category || 'Technology'}
                </Badge>
                {article.impact && (
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-none px-2.5 py-0.5">
                    {article.impact} Impact
                  </Badge>
                )}
              </div>
              
              {/* Title with gradient effect for emphasis */}
              <GradientHeading 
                variant="sunset" 
                size="lg" 
                className="mt-2 leading-tight tracking-tight"
              >
                {article.title}
              </GradientHeading>
              
              {/* Description with improved readability */}
              <p className="text-gray-200 text-base sm:text-lg max-w-3xl line-clamp-3 leading-relaxed">
                {article.description}
              </p>
              
              {/* Article metadata and actions */}
              <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-siso-text/70">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{article.reading_time || 5} min read</span>
                  </div>
                  <div className="flex items-center text-siso-text/70">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{article.views || 0} views</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <BookmarkPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                  <Button variant="default" size="sm" className="gap-1.5 bg-siso-red hover:bg-siso-red/90">
                    Read Article
                    <ArrowRight className="h-4 w-4" />
                  </Button>
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
