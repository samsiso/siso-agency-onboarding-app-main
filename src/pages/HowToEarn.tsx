import { useState } from 'react';
import { Trophy, Calendar, MessageSquare, Heart, GraduationCap, Wrench, Bot, Share2, Award, Star, Newspaper, Users, Coins } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { EarningCategory } from '@/components/earn/EarningCategory';
import { EarningDetails } from '@/components/earn/EarningDetails';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const earningSections = [
  {
    title: "Daily Activity",
    icon: Calendar,
    description: "Login daily and maintain streaks to earn points.",
    items: [
      { action: "Daily Login", points: "5 points" },
      { action: "7-Day Login Streak", points: "50 points bonus" },
      { action: "30-Day Login Streak", points: "250 points bonus" }
    ]
  },
  {
    title: "Content Creation",
    icon: MessageSquare,
    description: "Create and share valuable content with the community.",
    items: [
      { action: "Write Article", points: "50 points" },
      { action: "Create Tutorial", points: "100 points" },
      { action: "Share Workflow", points: "25 points" },
      { action: "Submit Tool", points: "75 points" }
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

const HowToEarn = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy className="w-12 h-12 text-siso-orange animate-bounce" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
                  How to Earn SISO Points
                </h1>
              </div>
              <p className="text-lg text-siso-text/80 max-w-2xl mx-auto mb-6">
                Maximize your points by completing daily activities and contributing to the community. 
                Every action counts towards your progress!
              </p>
              <Button
                onClick={() => navigate('/economy/leaderboards')}
                className="bg-gradient-to-r from-siso-red to-siso-orange hover:from-siso-red/90 hover:to-siso-orange/90 
                  text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
              >
                View Leaderboard
              </Button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Panel - Categories */}
              <div className="lg:col-span-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-4 
                scrollbar-thin scrollbar-thumb-siso-border scrollbar-track-transparent">
                {earningSections.map((section, index) => (
                  <EarningCategory
                    key={index}
                    title={section.title}
                    description={section.description}
                    icon={section.icon}
                    items={section.items}
                    isSelected={selectedCategory === index}
                    onClick={() => setSelectedCategory(index)}
                    progress={{ completed: 1, total: section.items.length }}
                  />
                ))}
              </div>

              {/* Right Panel - Details */}
              <div className="lg:col-span-8">
                <EarningDetails
                  title={earningSections[selectedCategory].title}
                  description={earningSections[selectedCategory].description}
                  items={earningSections[selectedCategory].items}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HowToEarn;