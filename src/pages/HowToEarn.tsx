import { useState } from 'react';
import { Trophy, Calendar, MessageSquare, Heart, GraduationCap, Wrench, Bot, Share2, Award, Star, Newspaper, Users, Coins } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { EarningCategory } from '@/components/earn/EarningCategory';
import { EarningDetails } from '@/components/earn/EarningDetails';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SmartEarningSearch } from '@/components/earn/SmartEarningSearch';
import { EarningChatAssistant } from '@/components/earn/EarningChatAssistant';
import { motion } from 'framer-motion';

const earningSections = [
  {
    title: "Daily Engagement",
    icon: Calendar,
    description: "Regular platform activities and streaks.",
    items: [
      { 
        action: "Daily Login",
        points: "5 points",
        cooldown_minutes: 1440, // 24 hours
        requirements: {
          description: "Simply log into your account once every 24 hours. The timer resets at midnight UTC."
        }
      },
      { 
        action: "7-Day Login Streak",
        points: "50 points bonus",
        requirements: {
          description: "Log in for 7 consecutive days. Missing a day will reset your streak to 0."
        }
      },
      { 
        action: "30-Day Login Streak",
        points: "250 points bonus",
        requirements: {
          description: "Maintain your login streak for 30 consecutive days for a major bonus."
        }
      },
      { 
        action: "Read News Article",
        points: "5 points",
        cooldown_minutes: 60,
        requirements: {
          description: "Read an article for at least 1 minute. You can earn points for up to 10 different articles per day."
        }
      },
      { 
        action: "News Comment",
        points: "5 points",
        cooldown_minutes: 60,
        requirements: {
          description: "Leave a meaningful comment of at least 20 characters on any news article."
        }
      },
      { 
        action: "Use Tool",
        points: "5 points",
        cooldown_minutes: 120,
        requirements: {
          description: "Try out any tool from our directory. Points are awarded for unique tool interactions."
        }
      }
    ]
  },
  {
    title: "Content & Learning",
    icon: MessageSquare,
    description: "Create, share, and learn from content.",
    items: [
      { 
        action: "Write Article",
        points: "50 points",
        cooldown_minutes: 1440,
        requirements: {
          description: "Submit an original article of at least 500 words. Must be approved by moderators.",
          minimum_words: 500,
          requires_approval: true
        }
      },
      { 
        action: "Create Tutorial",
        points: "100 points",
        cooldown_minutes: 2880,
        requirements: {
          description: "Create and publish a detailed tutorial with steps and examples. Minimum 1000 words.",
          minimum_words: 1000,
          requires_approval: true
        }
      },
      { 
        action: "Share Workflow",
        points: "25 points",
        cooldown_minutes: 1440,
        requirements: {
          description: "Document and share your workflow using our tools. Include screenshots or video."
        }
      },
      { 
        action: "Watch Tutorial",
        points: "10 points",
        cooldown_minutes: 240,
        requirements: {
          description: "Watch an educational tutorial for at least 5 minutes to earn points."
        }
      },
      { 
        action: "Complete Course",
        points: "50 points",
        requirements: {
          description: "Finish all modules in a course and pass the final assessment."
        }
      },
      { 
        action: "Pass Assessment",
        points: "25 points",
        cooldown_minutes: 1440,
        requirements: {
          description: "Score at least 80% on a skill assessment test."
        }
      }
    ]
  },
  {
    title: "Community Building",
    icon: Users,
    description: "Grow and engage with the community.",
    items: [
      { 
        action: "Comment on Article",
        points: "5 points",
        cooldown_minutes: 60,
        requirements: {
          description: "Leave thoughtful comments of at least 30 characters on articles.",
          minimum_length: 30
        }
      },
      { 
        action: "Network Reply",
        points: "5 points",
        cooldown_minutes: 30,
        requirements: {
          description: "Respond to community discussions with helpful information."
        }
      },
      { 
        action: "Network Discussion",
        points: "10 points",
        cooldown_minutes: 120,
        requirements: {
          description: "Start a new discussion thread in the community forum."
        }
      },
      { 
        action: "Host Event",
        points: "100 points",
        requirements: {
          description: "Organize and host a community event or workshop. Must be pre-approved.",
          requires_approval: true
        }
      },
      { 
        action: "Social Media Post",
        points: "5 points",
        cooldown_minutes: 360,
        requirements: {
          description: "Share SISO content on Twitter, LinkedIn, or other platforms with our hashtag."
        }
      },
      { 
        action: "Successful Referral",
        points: "100 points",
        requirements: {
          description: "Invite a new user who completes their profile and earns their first 50 points."
        }
      }
    ]
  },
  {
    title: "AI & Tools",
    icon: Bot,
    description: "Contribute to AI and tool development.",
    items: [
      { 
        action: "Train Assistant",
        points: "15 points",
        cooldown_minutes: 180,
        requirements: {
          description: "Help train our AI by providing feedback and corrections on responses."
        }
      },
      { 
        action: "Assistant Feedback",
        points: "5 points",
        cooldown_minutes: 60,
        requirements: {
          description: "Rate and provide detailed feedback on AI assistant interactions."
        }
      },
      { 
        action: "AI Model Testing",
        points: "20 points",
        cooldown_minutes: 240,
        requirements: {
          description: "Participate in testing new AI models and features. Minimum 10 test cases."
        }
      },
      { 
        action: "Tool Review",
        points: "10 points",
        cooldown_minutes: 1440,
        requirements: {
          description: "Write a detailed review of at least 100 words for any tool in our directory."
        }
      },
      { 
        action: "Tool Integration",
        points: "25 points",
        requirements: {
          description: "Successfully integrate and demonstrate use of our tools in your workflow."
        }
      },
      { 
        action: "Submit Tool",
        points: "75 points",
        requirements: {
          description: "Submit a new tool to our directory with complete documentation.",
          requires_approval: true
        }
      }
    ]
  },
  {
    title: "Expert Achievements",
    icon: Award,
    description: "Recognition and special accomplishments.",
    items: [
      { 
        action: "Become Verified Expert",
        points: "500 points",
        requirements: {
          description: "Complete expert verification process including skill assessments and portfolio review.",
          requires_approval: true
        }
      },
      { 
        action: "Expert Answer",
        points: "25 points",
        cooldown_minutes: 120,
        requirements: {
          description: "Provide a detailed, verified solution to a community question."
        }
      },
      { 
        action: "Complete Challenge",
        points: "25-100 points",
        requirements: {
          description: "Complete special challenges that test your skills. Points vary by difficulty."
        }
      },
      { 
        action: "Beta Testing",
        points: "50 points",
        requirements: {
          description: "Participate in beta testing new features and provide detailed feedback."
        }
      },
      { 
        action: "Bug Report",
        points: "15 points",
        cooldown_minutes: 1440,
        requirements: {
          description: "Submit a verified bug report with steps to reproduce and relevant screenshots."
        }
      }
    ]
  },
  {
    title: "Web3 Integration",
    icon: Coins,
    description: "Engage with crypto and NFT features.",
    items: [
      { 
        action: "First NFT Purchase",
        points: "200 points",
        requirements: {
          description: "Purchase your first SISO NFT from our collection. One-time bonus."
        }
      },
      { 
        action: "Connect Wallet",
        points: "50 points",
        requirements: {
          description: "Connect and verify your Web3 wallet to your account. One-time bonus."
        }
      },
      { 
        action: "Token Holder Bonus",
        points: "25 points/week",
        requirements: {
          description: "Hold SISO tokens in your connected wallet to earn weekly bonus points."
        }
      }
    ]
  }
];

const HowToEarn = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: pointConfigs, isLoading } = useQuery({
    queryKey: ['pointConfigurations'],
    queryFn: async () => {
      console.log('Fetching point configurations...');
      const { data, error } = await supabase
        .from('point_configurations')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching point configurations:', error);
        throw error;
      }
      
      console.log('Point configurations fetched:', data);
      return data;
    }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
          <Sidebar />
          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="animate-pulse"
              >
                <div className="h-12 w-48 bg-siso-text/10 rounded mb-4 mx-auto"></div>
                <div className="h-6 w-96 bg-siso-text/10 rounded mb-8 mx-auto"></div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-4 space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-24 bg-siso-text/10 rounded"></div>
                    ))}
                  </div>
                  <div className="lg:col-span-8">
                    <div className="h-96 bg-siso-text/10 rounded"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex items-center justify-center gap-3 mb-4"
              >
                <Trophy className="w-12 h-12 text-siso-orange animate-bounce" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
                  How to Earn SISO Points
                </h1>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-siso-text/80 max-w-2xl mx-auto mb-6"
              >
                Maximize your points by completing daily activities and contributing to the community. 
                Every action counts towards your progress!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={() => navigate('/leaderboards')}
                  className="bg-gradient-to-r from-siso-red to-siso-orange hover:from-siso-red/90 hover:to-siso-orange/90 
                    text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  View Leaderboard
                </Button>
              </motion.div>
            </motion.div>

            <SmartEarningSearch onSearch={handleSearch} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-4 
                  scrollbar-thin scrollbar-thumb-siso-border scrollbar-track-transparent"
              >
                {earningSections.map((section, index) => (
                  <EarningCategory
                    key={index}
                    title={section.title}
                    description={section.description}
                    icon={section.icon}
                    items={section.items}
                    isSelected={selectedCategory === index}
                    onClick={() => setSelectedCategory(index)}
                    progress={{ 
                      completed: pointConfigs?.filter(pc => 
                        section.items.some(item => 
                          pc.action === item.action.toLowerCase().replace(/ /g, '_')
                        )
                      )?.length || 0,
                      total: section.items.length 
                    }}
                  />
                ))}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-8"
              >
                <EarningDetails
                  title={earningSections[selectedCategory].title}
                  description={earningSections[selectedCategory].description}
                  items={earningSections[selectedCategory].items}
                />
              </motion.div>
            </div>
          </div>
        </div>

        <EarningChatAssistant />
      </div>
    </SidebarProvider>
  );
};

export default HowToEarn;
