import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Globe, Briefcase, Users, Award, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { adaptPortfolioToLeaderboard } from '@/components/portfolio/PortfolioLeaderboardAdapter';
import { PortfolioLeaderboardTable } from '@/components/portfolio/PortfolioLeaderboardTable';
import { Spotlight } from '@/components/ui/spotlight';
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
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="relative">
          <Spotlight className="-top-40 left-0" />
          
          {/* Header Section */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
                  alt="SISO Agency" 
                  className="w-16 h-16 mr-4"
                />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
                  SISO Agency Portfolio
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover our award-winning client projects ranked by complexity, innovation, and impact. 
                Each project represents our commitment to delivering exceptional digital solutions.
              </p>
            </motion.div>
          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-gray-900 border-gray-700 hover:border-siso-orange/30 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Projects</p>
                      <p className="text-2xl font-bold text-white">
                        <CountUp end={totalProjects} delay={0} />
                      </p>
                    </div>
                    <Briefcase className="h-8 w-8 text-siso-orange opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-gray-900 border-gray-700 hover:border-siso-orange/30 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Completed</p>
                      <p className="text-2xl font-bold text-white">
                        <CountUp end={completedProjects} delay={0.1} />
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-siso-orange opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gray-900 border-gray-700 hover:border-siso-orange/30 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Value</p>
                      <p className="text-2xl font-bold text-white">
                        $<CountUp end={totalValue} delay={0.2} separator="," />
                      </p>
                    </div>
                    <Trophy className="h-8 w-8 text-siso-orange opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gray-900 border-gray-700 hover:border-siso-orange/30 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Technologies</p>
                      <p className="text-2xl font-bold text-white">
                        <CountUp end={totalTechnologies} delay={0.3} />
                      </p>
                    </div>
                    <Globe className="h-8 w-8 text-siso-orange opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Portfolio Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-siso-border bg-black text-white">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-siso-orange" />
                    Project Portfolio Rankings
                  </span>
                  <span className="text-sm font-normal text-gray-300">
                    {totalProjects} Live Projects
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-black p-0">
                <PortfolioLeaderboardTable 
                  projectData={portfolioEntries as any} 
                  onProjectClick={handleProjectClick}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Card className="bg-gradient-to-r from-siso-red/10 to-siso-orange/10 border-siso-orange/30">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Start Your Project?
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Join our growing list of successful clients. Let SISO Agency bring your vision to life 
                  with cutting-edge technology and innovative design.
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <Button 
                    className="bg-gradient-to-r from-siso-red to-siso-orange hover:from-siso-red/90 hover:to-siso-orange/90 text-white"
                    onClick={() => window.open('mailto:siso@sisoinnovatorshub.io', '_blank')}
                  >
                    Start Your Project
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-siso-orange text-siso-orange hover:bg-siso-orange/10"
                    onClick={() => window.open('/auth', '_blank')}
                  >
                    View Full Platform
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 