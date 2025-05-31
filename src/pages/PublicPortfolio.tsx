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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-siso-red/5 via-transparent to-siso-orange/5 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-siso-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-siso-red/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="relative">
            <Spotlight className="-top-40 left-0" />
            
            {/* Enhanced Header Section */}
            <div className="mb-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* Logo and Title Container */}
                <div className="flex flex-col items-center mb-8">
                  <motion.div 
                    className="relative mb-6"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="relative">
                      <img 
                        src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
                        alt="SISO Agency" 
                        className="w-24 h-24 md:w-32 md:h-32 mx-auto drop-shadow-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-siso-orange/20 to-siso-red/20 rounded-full blur-xl" />
                    </div>
                  </motion.div>
                  
                  <motion.h1 
                    className="text-5xl md:text-7xl lg:text-8xl font-black mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <span className="bg-gradient-to-r from-siso-red via-siso-orange to-siso-red bg-clip-text text-transparent animate-gradient bg-300% leading-tight">
                      SISO AGENCY
                    </span>
                  </motion.h1>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-2xl md:text-3xl font-bold text-white/90 mb-2"
                  >
                    Portfolio Showcase
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="max-w-4xl mx-auto"
                >
                  <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed">
                    Discover our <span className="text-siso-orange font-semibold">award-winning client projects</span> ranked by 
                    <span className="text-siso-red font-semibold"> complexity, innovation, and impact</span>. 
                    Each project represents our commitment to delivering 
                    <span className="text-white font-semibold"> exceptional digital solutions</span>.
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm">Live Projects</span>
                    </div>
                    <span className="text-gray-600">•</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-siso-orange rounded-full animate-pulse" />
                      <span className="text-sm">Real Client Work</span>
                    </div>
                    <span className="text-gray-600">•</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-siso-red rounded-full animate-pulse" />
                      <span className="text-sm">Updated Daily</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Enhanced Portfolio Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-siso-orange/50 transition-all duration-500 backdrop-blur-sm group">
                  <CardContent className="pt-8 pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Total Projects</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-white">
                            <CountUp end={totalProjects} delay={0.5} duration={2} />
                          </p>
                          <span className="text-xs text-green-500 flex items-center">
                            <span className="text-lg">🚀</span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Live & Active</p>
                      </div>
                      <div className="relative">
                        <Briefcase className="h-10 w-10 text-siso-orange opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-siso-orange/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-green-500/50 transition-all duration-500 backdrop-blur-sm group">
                  <CardContent className="pt-8 pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Completed</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-white">
                            <CountUp end={completedProjects} delay={0.7} duration={2} />
                          </p>
                          <span className="text-xs text-green-500 flex items-center">
                            <span className="text-lg">✅</span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Successfully Delivered</p>
                      </div>
                      <div className="relative">
                        <Award className="h-10 w-10 text-green-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-yellow-500/50 transition-all duration-500 backdrop-blur-sm group">
                  <CardContent className="pt-8 pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Portfolio Value</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-white">
                            $<CountUp end={totalValue} delay={0.9} duration={2.5} separator="," />
                          </p>
                          <span className="text-xs text-yellow-500 flex items-center">
                            <span className="text-lg">💎</span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Estimated Total Value</p>
                      </div>
                      <div className="relative">
                        <Trophy className="h-10 w-10 text-yellow-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 backdrop-blur-sm group">
                  <CardContent className="pt-8 pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Technologies</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-white">
                            <CountUp end={totalTechnologies} delay={1.1} duration={2} />
                          </p>
                          <span className="text-xs text-blue-500 flex items-center">
                            <span className="text-lg">⚡</span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Cutting-Edge Stack</p>
                      </div>
                      <div className="relative">
                        <Globe className="h-10 w-10 text-blue-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Enhanced Portfolio Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-16"
            >
              <Card className="border-gray-700/50 bg-gradient-to-br from-gray-900/90 to-gray-800/90 text-white backdrop-blur-sm shadow-2xl">
                <CardHeader className="border-b border-gray-700/50 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
                  <CardTitle className="flex items-center justify-between text-white">
                    <motion.div 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    >
                      <div className="relative">
                        <Trophy className="h-8 w-8 text-siso-orange" />
                        <div className="absolute inset-0 bg-siso-orange/20 rounded-full blur-xl" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
                          Project Portfolio Rankings
                        </span>
                        <p className="text-sm text-gray-400 font-normal">Real client projects ranked by impact</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="text-right"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      <span className="text-lg font-bold text-white">{totalProjects}</span>
                      <p className="text-sm font-normal text-gray-300">Live Projects</p>
                    </motion.div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-transparent p-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                  >
                    <PortfolioLeaderboardTable 
                      projectData={portfolioEntries as any} 
                      onProjectClick={handleProjectClick}
                    />
                  </motion.div>
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
              <Card className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 border-siso-orange/30 backdrop-blur-sm">
                <CardContent className="pt-8 pb-8">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent mb-4">
                    Ready to Start Your Project?
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    Join our growing list of successful clients. Let SISO Agency bring your vision to life 
                    with cutting-edge technology and innovative design.
                  </p>
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Button 
                      className="bg-gradient-to-r from-siso-red to-siso-orange hover:from-siso-red/90 hover:to-siso-orange/90 text-white shadow-lg"
                      onClick={() => window.open('mailto:siso@sisoinnovatorshub.io', '_blank')}
                    >
                      Start Your Project
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-siso-orange text-siso-orange hover:bg-siso-orange/10 bg-transparent"
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
    </>
  );
} 