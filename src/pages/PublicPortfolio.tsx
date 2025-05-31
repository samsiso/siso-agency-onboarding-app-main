import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { adaptPortfolioToLeaderboard } from '@/components/portfolio/PortfolioLeaderboardAdapter';
import { PortfolioLeaderboardTable } from '@/components/portfolio/PortfolioLeaderboardTable';
import CountUp from 'react-countup';

export default function PublicPortfolio() {
  const { items, loading } = usePortfolioData();
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const portfolioEntries = adaptPortfolioToLeaderboard(items);

  // Calculate portfolio stats
  const totalProjects = items.length;
  const completedProjects = items.filter(item => item.development_status === 'completed').length;
  const totalValue = portfolioEntries.reduce((sum, entry) => sum + (entry as any).estimated_value, 0);
  const totalTechnologies = [...new Set(items.flatMap(item => item.technologies))].length;

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded mb-4"></div>
            <div className="h-4 bg-gray-800 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-800 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            animation: gradient 6s ease infinite;
          }
          .bg-300\\% {
            background-size: 300% 300%;
          }
        `
      }} />
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          
          {/* Clean Minimal Header */}
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
                alt="SISO Agency" 
                className="w-16 h-16 mx-auto mb-8"
              />
              
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
                SISO AGENCY
              </h1>
              
              <div className="w-24 h-0.5 bg-siso-orange mx-auto mb-6"></div>
              
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Premium digital solutions for ambitious businesses.
              </p>
            </motion.div>
          </div>

          {/* Clean Minimal Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="bg-black border border-gray-800 hover:border-siso-orange/50 transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-siso-orange rounded-full mx-auto mb-4"></div>
                    <p className="text-4xl font-bold text-white mb-2">
                      <CountUp end={totalProjects} delay={0.5} duration={2} />
                    </p>
                    <p className="text-sm text-gray-400 uppercase tracking-wider">Total Projects</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-black border border-gray-800 hover:border-siso-orange/50 transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-siso-orange rounded-full mx-auto mb-4"></div>
                    <p className="text-4xl font-bold text-white mb-2">
                      <CountUp end={completedProjects} delay={0.7} duration={2} />
                    </p>
                    <p className="text-sm text-gray-400 uppercase tracking-wider">Completed</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="bg-black border border-gray-800 hover:border-siso-orange/50 transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-siso-orange rounded-full mx-auto mb-4"></div>
                    <p className="text-4xl font-bold text-white mb-2">
                      $<CountUp end={totalValue} delay={0.9} duration={2.5} separator="," />
                    </p>
                    <p className="text-sm text-gray-400 uppercase tracking-wider">Portfolio Value</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="bg-black border border-gray-800 hover:border-siso-orange/50 transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-siso-orange rounded-full mx-auto mb-4"></div>
                    <p className="text-4xl font-bold text-white mb-2">
                      <CountUp end={totalTechnologies} delay={1.1} duration={2} />
                    </p>
                    <p className="text-sm text-gray-400 uppercase tracking-wider">Technologies</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Clean Professional Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-20"
          >
            <Card className="border border-gray-800 bg-black">
              <CardHeader className="border-b border-gray-800 py-8">
                <CardTitle className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-1 h-8 bg-siso-orange"></div>
                    <h2 className="text-2xl font-bold text-white">Client Projects</h2>
                    <div className="w-1 h-8 bg-siso-orange"></div>
                  </div>
                  <p className="text-sm text-gray-400 font-normal">Live portfolio showcase</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <PortfolioLeaderboardTable 
                  projectData={portfolioEntries as any} 
                  onProjectClick={handleProjectClick}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Clean Professional CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <Card className="bg-black border border-siso-orange/30">
              <CardContent className="py-16 px-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Ready to Start Your Project?
                </h3>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  Join our client portfolio. Let's build something exceptional together.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    className="bg-siso-orange hover:bg-siso-orange/90 text-black font-medium px-8 py-3"
                    onClick={() => window.open('mailto:siso@sisoinnovatorshub.io', '_blank')}
                  >
                    Start Project
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-900 px-8 py-3"
                    onClick={() => window.open('/auth', '_blank')}
                  >
                    View Platform
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
} 