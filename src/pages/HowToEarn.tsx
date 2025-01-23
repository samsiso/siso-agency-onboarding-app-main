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
    title: "Daily Engagement",
    icon: Calendar,
    description: "Regular platform activities and streaks.",
    items: [
      { action: "Daily Login", points: "5 points" },
      { action: "7-Day Login Streak", points: "50 points bonus" },
      { action: "30-Day Login Streak", points: "250 points bonus" },
      { action: "Read News Article", points: "5 points" },
      { action: "News Comment", points: "5 points" },
      { action: "Use Tool", points: "5 points" }
    ]
  },
  {
    title: "Content & Learning",
    icon: MessageSquare,
    description: "Create, share, and learn from content.",
    items: [
      { action: "Write Article", points: "50 points" },
      { action: "Create Tutorial", points: "100 points" },
      { action: "Share Workflow", points: "25 points" },
      { action: "Watch Tutorial", points: "10 points" },
      { action: "Complete Course", points: "50 points" },
      { action: "Pass Assessment", points: "25 points" },
      { action: "Knowledge Base Contribution", points: "50 points" }
    ]
  },
  {
    title: "Community Building",
    icon: Users,
    description: "Grow and engage with the community.",
    items: [
      { action: "Comment on Article", points: "5 points" },
      { action: "Network Reply", points: "5 points" },
      { action: "Network Discussion", points: "10 points" },
      { action: "Host Event", points: "100 points" },
      { action: "Social Media Post", points: "5 points" },
      { action: "Successful Referral", points: "100 points" },
      { action: "Monthly Referral Champion", points: "500 points bonus" }
    ]
  },
  {
    title: "AI & Tools",
    icon: Bot,
    description: "Contribute to AI and tool development.",
    items: [
      { action: "Train Assistant", points: "15 points" },
      { action: "Assistant Feedback", points: "5 points" },
      { action: "AI Model Testing", points: "20 points" },
      { action: "Tool Review", points: "10 points" },
      { action: "Tool Integration", points: "25 points" },
      { action: "Submit Tool", points: "75 points" }
    ]
  },
  {
    title: "Expert Achievements",
    icon: Award,
    description: "Recognition and special accomplishments.",
    items: [
      { action: "Become Verified Expert", points: "500 points" },
      { action: "Expert Answer", points: "25 points" },
      { action: "Complete Challenge", points: "25-100 points" },
      { action: "Beta Testing", points: "50 points" },
      { action: "Bug Report", points: "15 points" }
    ]
  },
  {
    title: "Web3 Integration",
    icon: Coins,
    description: "Engage with crypto and NFT features.",
    items: [
      { action: "First NFT Purchase", points: "200 points" },
      { action: "Connect Wallet", points: "50 points" },
      { action: "Token Holder Bonus", points: "25 points/week" }
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