import { Trophy, Star, Calendar, Share2, MessageSquare, Wrench, GraduationCap, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';

const HowToEarn = () => {
  const earningSections = [
    {
      title: 'Daily Login',
      icon: Calendar,
      description: 'Earn 5 points for logging in daily. Get bonus points for maintaining login streaks!',
      points: '5 points/day'
    },
    {
      title: 'Using Tools',
      icon: Wrench,
      description: 'Earn points by exploring and using our curated tools and platforms.',
      points: '10 points/tool'
    },
    {
      title: 'Educational Content',
      icon: GraduationCap,
      description: 'Watch tutorials and engage with educational content to earn points.',
      points: '15 points/video'
    },
    {
      title: 'Social Sharing',
      icon: Share2,
      description: 'Share articles and tools with your network to earn bonus points.',
      points: '20 points/share'
    },
    {
      title: 'Community Engagement',
      icon: MessageSquare,
      description: 'Comment on articles and participate in discussions.',
      points: '10 points/comment'
    },
    {
      title: 'Challenges',
      icon: Target,
      description: 'Complete special challenges to earn significant point bonuses.',
      points: '50+ points'
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="w-8 h-8 text-siso-orange" />
              <h1 className="text-3xl font-bold text-siso-text-bold">How to Earn SISO Points</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {earningSections.map((section, index) => (
                <Card key={index} className="bg-black/20 border-siso-text/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-siso-text-bold">
                      <section.icon className="w-5 h-5 text-siso-orange" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-siso-text/90">{section.description}</p>
                    <div className="flex items-center gap-1 text-siso-red">
                      <Star className="w-4 h-4" />
                      <span className="font-medium">{section.points}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 bg-black/20 border-siso-text/10">
              <CardHeader>
                <CardTitle className="text-siso-text-bold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-siso-orange" />
                  Ranks and Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-siso-text/90">
                  As you earn points, you'll progress through different ranks:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].map((rank, index) => (
                    <div key={rank} className="flex items-center gap-2 p-3 rounded-lg bg-siso-text/5 border border-siso-text/10">
                      <Star className="w-4 h-4 text-siso-orange" />
                      <span className="text-sm font-medium text-siso-text-bold">{rank}</span>
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