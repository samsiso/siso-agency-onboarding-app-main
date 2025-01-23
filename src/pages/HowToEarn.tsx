import { Trophy, Star, Calendar, Share2, MessageSquare, Wrench, GraduationCap, Bot, Heart, Award, Gem, DollarSign, Coins, Users, Newspaper, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface NFTCollection {
  tier: string;
  name: string;
  description: string;
  points_cost: number;
  crypto_cost: number;
  points_multiplier: number;
  weekly_bonus: number;
  benefits: string[];
  image_url: string | null;
  opensea_url: string;
  contract_address: string;
  chain_id: string;
}

const HowToEarn = () => {
  const [nftCollections, setNftCollections] = useState<NFTCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTCollections = async () => {
      try {
        const { data, error } = await supabase
          .from('nft_collections')
          .select('*')
          .order('points_cost', { ascending: true });

        if (error) throw error;
        
        const transformedData = data?.map(collection => ({
          ...collection,
          benefits: Array.isArray(collection.benefits) 
            ? collection.benefits 
            : typeof collection.benefits === 'string' 
              ? JSON.parse(collection.benefits)
              : []
        })) || [];

        setNftCollections(transformedData);
      } catch (error) {
        console.error('Error fetching NFT collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTCollections();
  }, []);

  const earningSections = [
    {
      title: 'Daily Activity',
      icon: Calendar,
      description: 'Login daily and maintain streaks to earn points.',
      items: [
        { action: 'Daily Login', points: '5 points' },
        { action: '7-Day Login Streak', points: '50 points bonus' },
        { action: '30-Day Login Streak', points: '250 points bonus' }
      ]
    },
    {
      title: 'Content Creation',
      icon: MessageSquare,
      description: 'Create and share valuable content with the community.',
      items: [
        { action: 'Write Article', points: '50 points' },
        { action: 'Create Tutorial', points: '100 points' },
        { action: 'Share Workflow', points: '25 points' },
        { action: 'Submit Tool', points: '75 points' }
      ]
    },
    {
      title: 'Community Engagement',
      icon: Heart,
      description: 'Interact with other members and content.',
      items: [
        { action: 'Comment on Article', points: '5 points' },
        { action: 'Network Reply', points: '5 points' },
        { action: 'Network Discussion', points: '10 points' },
        { action: 'Host Event', points: '100 points' }
      ]
    },
    {
      title: 'Educational Progress',
      icon: GraduationCap,
      description: 'Learn and grow with educational content.',
      items: [
        { action: 'Watch Tutorial', points: '10 points' },
        { action: 'Complete Course', points: '50 points' },
        { action: 'Pass Assessment', points: '25 points' }
      ]
    },
    {
      title: 'Tool Mastery',
      icon: Wrench,
      description: 'Utilize and contribute to the tools ecosystem.',
      items: [
        { action: 'Use Tool', points: '5 points' },
        { action: 'Tool Review', points: '10 points' },
        { action: 'Tool Integration', points: '25 points' }
      ]
    },
    {
      title: 'AI Contributions',
      icon: Bot,
      description: 'Help improve AI systems and assistants.',
      items: [
        { action: 'Train Assistant', points: '15 points' },
        { action: 'Assistant Feedback', points: '5 points' },
        { action: 'AI Model Testing', points: '20 points' }
      ]
    },
    {
      title: 'Social Sharing',
      icon: Share2,
      description: 'Spread the word and grow the community.',
      items: [
        { action: 'Share Article', points: '10 points' },
        { action: 'Social Media Post', points: '5 points' },
        { action: 'Referral Signup', points: '50 points' }
      ]
    },
    {
      title: 'Special Achievements',
      icon: Trophy,
      description: 'Complete special tasks and challenges.',
      items: [
        { action: 'Complete Challenge', points: '25-100 points' },
        { action: 'Beta Testing', points: '50 points' },
        { action: 'Bug Report', points: '15 points' }
      ]
    },
    {
      title: 'Expert Recognition',
      icon: Award,
      description: 'Achieve expert status and recognition.',
      items: [
        { action: 'Become Verified Expert', points: '500 points' },
        { action: 'Expert Answer', points: '25 points' },
        { action: 'Knowledge Base Contribution', points: '50 points' }
      ]
    },
    {
      title: 'News & Updates',
      icon: Newspaper,
      description: 'Stay engaged with platform news and updates.',
      items: [
        { action: 'Read News Article', points: '5 points' },
        { action: 'News Comment', points: '5 points' },
        { action: 'News Share', points: '10 points' }
      ]
    },
    {
      title: 'Referral Program',
      icon: Users,
      description: 'Invite others to join the community.',
      items: [
        { action: 'Successful Referral', points: '100 points' },
        { action: "Referral's First Post", points: '50 points bonus' },
        { action: 'Monthly Referral Champion', points: '500 points bonus' }
      ]
    },
    {
      title: 'Crypto & NFTs',
      icon: Coins,
      description: 'Engage with our Web3 features.',
      items: [
        { action: 'First NFT Purchase', points: '200 points' },
        { action: 'Connect Wallet', points: '50 points' },
        { action: 'Token Holder Bonus', points: '25 points/week' }
      ]
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-siso-red/20 to-transparent blur-3xl animate-float-slow left-[-20%] top-[10%]" />
          <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-siso-orange/20 to-transparent blur-3xl animate-float-slower right-[-30%] top-[40%]" />
        </div>

        <Sidebar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="space-y-6 relative z-10">
            {/* Header Section with Introduction */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy className="w-12 h-12 text-siso-orange animate-bounce" />
                <h1 className="text-4xl font-bold text-siso-text-bold">How to Earn SISO Points</h1>
              </div>
              <p className="text-lg text-siso-text/80 max-w-2xl mx-auto">
                Maximize your points by completing daily activities and contributing to the community. 
                Every action counts towards your progress!
              </p>
              <div className="mt-6">
                <Link 
                  to="/leaderboards"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-siso-red to-siso-orange 
                    rounded-lg text-white font-semibold hover:opacity-90 transition-all duration-300 animate-glow"
                >
                  <Trophy className="w-5 h-5" />
                  View Leaderboard
                </Link>
              </div>
            </div>

            {/* Earning Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {earningSections.map((section, index) => (
                <Card 
                  key={index} 
                  className="group hover:scale-[1.02] transition-all duration-300 bg-black/20 
                    border-siso-text/10 backdrop-blur-sm hover:border-siso-text/20 hover:shadow-lg"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-siso-text-bold">
                      <section.icon className="w-8 h-8 text-siso-orange group-hover:scale-110 transition-transform duration-300" />
                      {section.title}
                    </CardTitle>
                    <p className="text-siso-text/80 mt-2">{section.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {section.items.map((item, itemIndex) => (
                        <div 
                          key={itemIndex} 
                          className="flex items-center justify-between p-3 rounded-lg
                            bg-gradient-to-r from-siso-text/5 to-transparent
                            hover:from-siso-text/10 transition-colors duration-300"
                        >
                          <span className="text-siso-text flex items-center gap-2">
                            <Star className="w-4 h-4 text-siso-orange" />
                            {item.action}
                          </span>
                          <span className="text-siso-orange font-semibold">{item.points}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* NFT Membership Tiers Section */}
            <Card className="mt-12 bg-black/20 border-siso-text/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-siso-text-bold flex items-center gap-2">
                  <Gem className="w-8 h-8 text-siso-orange" />
                  NFT Membership Tiers
                </CardTitle>
                <p className="text-siso-text/80">
                  Unlock exclusive benefits and boost your earning potential with our NFT membership tiers
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {loading ? (
                    Array(4).fill(0).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="h-48 bg-siso-text/5 rounded-lg mb-4"></div>
                        <div className="h-4 bg-siso-text/5 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-siso-text/5 rounded w-1/2"></div>
                      </div>
                    ))
                  ) : (
                    nftCollections.map((nft) => (
                      <div 
                        key={nft.tier} 
                        className="group flex flex-col gap-4 p-6 rounded-lg 
                          bg-gradient-to-br from-siso-text/5 to-siso-text/10 
                          border border-siso-text/10 hover:border-siso-text/20 
                          transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-2">
                          <Gem className="w-5 h-5 text-siso-orange group-hover:scale-110 transition-transform duration-300" />
                          <h3 className="text-lg font-semibold text-siso-text-bold">{nft.name}</h3>
                        </div>
                        <p className="text-sm text-siso-text/80">{nft.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-siso-text/70">Points Cost</span>
                            <span className="text-siso-orange font-medium">{nft.points_cost.toLocaleString()} SISO</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-siso-text/70">Crypto Cost</span>
                            <span className="text-siso-orange font-medium">{nft.crypto_cost.toLocaleString()} MATIC</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-siso-text/70">Points Multiplier</span>
                            <span className="text-siso-orange font-medium">x{nft.points_multiplier}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-siso-text/70">Weekly Bonus</span>
                            <span className="text-siso-orange font-medium">+{nft.weekly_bonus} points</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-siso-text-bold mb-2">Benefits:</h4>
                          <ul className="space-y-1">
                            {nft.benefits.map((benefit, index) => (
                              <li key={index} className="text-xs text-siso-text/70 flex items-start gap-2">
                                <Star className="w-3 h-3 text-siso-orange shrink-0 mt-0.5" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HowToEarn;