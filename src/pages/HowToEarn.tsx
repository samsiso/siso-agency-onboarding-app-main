import { Trophy, Star, Calendar, Share2, MessageSquare, Wrench, GraduationCap, Target, Bot, Network, Heart, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';

const HowToEarn = () => {
  const earningSections = [
    {
      title: 'Daily Activity',
      icon: Calendar,
      description: 'Login daily and maintain streaks to earn points.',
      items: [
        { action: 'Daily Login', points: '5 points' },
        { action: '7-Day Login Streak', points: '50 points bonus' }
      ]
    },
    {
      title: 'Content Interaction',
      icon: MessageSquare,
      description: 'Engage with articles and content.',
      items: [
        { action: 'Read Article', points: '2 points' },
        { action: 'Comment on Article', points: '5 points' },
        { action: 'Share Article', points: '10 points' },
        { action: 'Suggest Article', points: '15 points' }
      ]
    },
    {
      title: 'Tools & Resources',
      icon: Wrench,
      description: 'Contribute and interact with tools.',
      items: [
        { action: 'Use Tool', points: '5 points' },
        { action: 'Submit Tool', points: '20 points' },
        { action: 'Write Tool Review', points: '10 points' },
        { action: 'Receive Tool Like', points: '2 points' },
        { action: 'Receive Tool Star', points: '5 points' }
      ]
    },
    {
      title: 'Educational Content',
      icon: GraduationCap,
      description: 'Learn and share knowledge.',
      items: [
        { action: 'Watch Tutorial', points: '10 points' },
        { action: 'Submit Education Content', points: '25 points' },
        { action: 'Create Tutorial', points: '30 points' },
        { action: 'Receive Education Like', points: '2 points' },
        { action: 'Receive Education Star', points: '5 points' }
      ]
    },
    {
      title: 'Automation & AI',
      icon: Bot,
      description: 'Contribute to automation ecosystem.',
      items: [
        { action: 'Use Automation', points: '5 points' },
        { action: 'Submit Automation', points: '20 points' },
        { action: 'Share Workflow', points: '10 points' },
        { action: 'Use Assistant', points: '5 points' },
        { action: 'Train Assistant', points: '15 points' },
        { action: 'Assistant Feedback', points: '5 points' }
      ]
    },
    {
      title: 'Community & Network',
      icon: Network,
      description: 'Build connections and contribute.',
      items: [
        { action: 'Network Reply', points: '5 points' },
        { action: 'Network Discussion', points: '10 points' },
        { action: 'Network Referral', points: '25 points' },
        { action: 'Host Event', points: '50 points' }
      ]
    },
    {
      title: 'Special Activities',
      icon: Award,
      description: 'Participate in special events and testing.',
      items: [
        { action: 'Complete Challenge', points: '25-100 points' },
        { action: 'Beta Testing', points: '50 points' },
        { action: 'Report Bug', points: '15 points' },
        { action: 'Promotional Share', points: '10 points' }
      ]
    },
    {
      title: 'Referral Program',
      icon: Heart,
      description: 'Grow the community.',
      items: [
        { action: 'Referral Signup', points: '50 points' },
        { action: 'Referral Milestone', points: '100 points' }
      ]
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-siso-red/20 to-transparent blur-3xl animate-float-slow left-[-20%] top-[10%]" />
          <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-siso-orange/20 to-transparent blur-3xl animate-float-slower right-[-30%] top-[40%]" />
        </div>

        <Sidebar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="w-8 h-8 text-siso-orange" />
              <h1 className="text-3xl font-bold text-siso-text-bold">How to Earn SISO Points</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {earningSections.map((section, index) => (
                <Card key={index} className="bg-black/20 border-siso-text/10 backdrop-blur-sm hover:border-siso-text/20 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-siso-text-bold">
                      <section.icon className="w-5 h-5 text-siso-orange" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-siso-text/90">{section.description}</p>
                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between text-sm">
                          <span className="text-siso-text/80">{item.action}</span>
                          <span className="text-siso-red font-medium">{item.points}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 bg-black/20 border-siso-text/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-siso-text-bold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-siso-orange" />
                  Ranks and Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-siso-text/90">
                  As you earn points, you'll progress through different ranks. Each rank unlocks new features and benefits:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    { name: 'Bronze', threshold: '0-99,999 points', benefits: 'Basic features access' },
                    { name: 'Silver', threshold: '100,000-249,999 points', benefits: 'Enhanced tools access' },
                    { name: 'Gold', threshold: '250,000-499,999 points', benefits: 'Premium features + custom badge' },
                    { name: 'Platinum', threshold: '500,000-999,999 points', benefits: 'VIP access + special events' },
                    { name: 'Diamond', threshold: '1,000,000+ points', benefits: 'Elite status + all perks' }
                  ].map((rank) => (
                    <div key={rank.name} className="flex flex-col gap-2 p-4 rounded-lg bg-gradient-to-br from-siso-text/5 to-siso-text/10 border border-siso-text/10 hover:border-siso-text/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-siso-orange" />
                        <span className="text-sm font-medium text-siso-text-bold">{rank.name}</span>
                      </div>
                      <span className="text-xs text-siso-orange/90">{rank.threshold}</span>
                      <span className="text-xs text-siso-text/60">{rank.benefits}</span>
                    </div>
                  ))}
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