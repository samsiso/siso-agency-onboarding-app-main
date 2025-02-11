
/// <reference types="react" />
import React, { useState, useEffect } from "react";
import { BookOpen, Users, BarChart, Zap, Newspaper, Globe, Bot, Coins, Check, Clock, Award, ArrowRight, TrendingUp, Users2, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

interface Feature108Props {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const getCardStyles = (type: string) => {
  switch (type) {
    case "ai-tools":
      return "bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20 hover:border-purple-500/40";
    case "education":
      return "bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-500/20 hover:border-green-500/40";
    case "community":
      return "bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/20 hover:border-orange-500/40";
    case "economy":
      return "bg-gradient-to-br from-emerald-900/30 to-yellow-900/30 border-emerald-500/20 hover:border-emerald-500/40";
    case "news":
      return "bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/20 hover:border-blue-500/40";
    default:
      return "bg-black/90";
  }
};

const getCardStats = (type: string) => {
  switch (type) {
    case "ai-tools":
      return {
        mainStat: "24/7",
        mainLabel: "AI Availability",
        secondaryStat: "95%",
        secondaryLabel: "Accuracy Rate",
        benefits: ["Custom Recommendations", "Real-time Analysis", "Data-driven Insights"]
      };
    case "education":
      return {
        mainStat: "1000+",
        mainLabel: "Video Resources",
        secondaryStat: "10x",
        secondaryLabel: "Learning Speed",
        benefits: ["AI-Powered Summaries", "Interactive Learning", "Progress Tracking"]
      };
    case "community":
      return {
        mainStat: "1M+",
        mainLabel: "Members",
        secondaryStat: "50k+",
        secondaryLabel: "Active Daily",
        benefits: ["Global Network", "Niche Groups", "Expert Connections"]
      };
    case "economy":
      return {
        mainStat: "$10M+",
        mainLabel: "Total Value",
        secondaryStat: "100k+",
        secondaryLabel: "Token Holders",
        benefits: ["Tokenized Rewards", "Premium Features", "Economic Benefits"]
      };
    case "news":
      return {
        mainStat: "24/7",
        mainLabel: "Updates",
        secondaryStat: "1hr",
        secondaryLabel: "Avg. Response",
        benefits: ["Real-time Updates", "Curated Content", "Industry Analysis"]
      };
    default:
      return null;
  }
};

const Feature108: React.FC<Feature108Props> = ({
  badge = "SISO Agency",
  heading = "Resource Hub Features",
  description = "Access our comprehensive suite of tools and insights designed to accelerate your agency's growth.",
  tabs = [
    {
      value: "ai-tools",
      icon: <Bot className="h-auto w-4 shrink-0" />,
      label: "AI Analysis",
      content: {
        badge: "Smart Assistant",
        title: "Custom AI Resource Finder",
        description:
          "Use our AI assistant to discover perfect tools for your agency. We analyze our database of successful agencies to suggest solutions that work best in your field. Get data-driven recommendations based on real success stories.",
        buttonText: "Try AI Assistant",
        imageSrc: "/lovable-uploads/9c6a19b7-a212-4e1b-a835-28401a7fb75a.png",
        imageAlt: "AI Chat Demo",
      },
    },
    {
      value: "education",
      icon: <BookOpen className="h-auto w-4 shrink-0" />,
      label: "Education Hub",
      content: {
        badge: "Daily Updates",
        title: "AI-Powered Video Analysis",
        description:
          "Access our daily-updated YouTube content from curated creators. Our AI analyzes videos to extract key takeaways, saving you hours of watching time. Get the most valuable insights 10x faster.",
        buttonText: "Explore Content",
        imageSrc: "/lovable-uploads/2abbfd96-461a-4ccc-87d0-1ec32698671f.png",
        imageAlt: "Education Interface Demo",
      },
    },
    {
      value: "community",
      icon: <Users className="h-auto w-4 shrink-0" />,
      label: "Network",
      content: {
        badge: "1M+ Agency Owners",
        title: "Global Agency Network",
        description:
          "Connect with a million-strong community of agency owners. Find and join the perfect networking groups for your niche, engage in meaningful conversations, and grow your agency through valuable connections.",
        buttonText: "Join Network",
        imageSrc: "/lovable-uploads/2a89d9b1-9fbb-4a86-a53a-36d9f63d1f7a.png",
        imageAlt: "Network Interface Demo",
      },
    },
    {
      value: "economy",
      icon: <Coins className="h-auto w-4 shrink-0" />,
      label: "Economy",
      content: {
        badge: "Earn & Grow",
        title: "Tokenized Rewards System",
        description:
          "Earn points for every platform interaction, convertible to our native cryptocurrency. Use tokens for premium features, rank upgrades, or trade them. Participate in the platform's economic future.",
        buttonText: "View Economy",
        imageSrc: "/lovable-uploads/4ac2a247-8806-47db-9d59-0a0c7bf75136.png",
        imageAlt: "Economy System Demo",
      },
    },
    {
      value: "news",
      icon: <Newspaper className="h-auto w-4 shrink-0" />,
      label: "AI News",
      content: {
        badge: "Daily AI Updates",
        title: "Curated AI Industry News",
        description:
          "Stay informed with daily AI news curated for agency owners. Earn points by engaging with articles and sharing insights. Get personalized news feeds based on your agency's focus.",
        buttonText: "Read News",
        imageSrc: "/lovable-uploads/3b17a23d-630e-4e55-94bf-9d6fef9e6fc4.png",
        imageAlt: "News Interface Demo",
      },
    },
  ],
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const activeContent = tabs.find(tab => tab.value === activeTab)?.content;

  // Enhanced debug logging
  console.log('[Feature108] Current active tab:', activeTab);
  console.log('[Feature108] Active content:', activeContent);
  
  const handleImageLoad = () => {
    console.log('[Feature108] Image loaded successfully:', activeContent?.imageSrc);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    console.error('[Feature108] Image failed to load:', {
      src: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      error: e
    });
    setImageLoaded(false);
    setImageError(true);
  };

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    console.log('[Feature108] Tab changed, resetting image states');
  }, [activeTab]);

  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-gradient-radial from-siso-orange/10 via-transparent to-transparent opacity-30" />

      <div className="relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-gradient-to-r from-siso-red/20 to-siso-orange/20 text-siso-text px-4 py-2 rounded-full border border-siso-orange/20">
                {badge}
              </Badge>
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {heading}
            </motion.h2>

            <motion.div 
              className="flex items-center gap-2 text-siso-text/80 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Globe className="w-5 h-5 text-siso-orange" />
              <p>Powered by thousands of innovators worldwide</p>
            </motion.div>

            <motion.p 
              className="mx-auto max-w-[700px] text-siso-text/80 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {description}
            </motion.p>
          </div>

          <div className="mt-12">
            <div className="container max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:flex-row md:gap-8 mb-8">
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold 
                      transition-all duration-300 hover:scale-105 border
                      ${activeTab === tab.value 
                        ? 'text-siso-text-bold border-siso-orange bg-gradient-to-r from-siso-red/20 to-siso-orange/20 shadow-lg shadow-siso-red/10' 
                        : 'text-siso-text border-transparent hover:text-siso-text-bold hover:bg-gradient-to-r hover:from-siso-red/10 hover:to-siso-orange/10'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab.icon} {tab.label}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeContent && (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8 px-4"
                  >
                    <motion.div 
                      className="rounded-xl border border-siso-orange/20 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm p-8 shadow-2xl transition-all duration-500 hover:border-siso-orange/40"
                      whileHover={{ scale: 1.02 }}
                      layout
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <motion.div 
                          className="flex flex-col gap-6"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <div className="space-y-4">
                            <Badge 
                              variant="outline" 
                              className="w-fit bg-gradient-to-r from-siso-red/10 to-siso-orange/10 border-siso-orange/20"
                            >
                              {activeContent.badge}
                            </Badge>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
                              {activeContent.title}
                            </h3>
                          </div>

                          {getCardStats(activeTab) && (
                            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gradient-to-br from-siso-red/5 to-siso-orange/5 border border-siso-orange/10">
                              <div className="space-y-1">
                                <p className="text-2xl font-bold text-siso-orange">
                                  {getCardStats(activeTab)?.mainStat}
                                </p>
                                <p className="text-sm text-siso-text/70">
                                  {getCardStats(activeTab)?.mainLabel}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-2xl font-bold text-siso-orange">
                                  {getCardStats(activeTab)?.secondaryStat}
                                </p>
                                <p className="text-sm text-siso-text/70">
                                  {getCardStats(activeTab)?.secondaryLabel}
                                </p>
                              </div>
                            </div>
                          )}

                          <p className="text-siso-text/80 leading-relaxed">
                            {activeContent.description}
                          </p>

                          <div className="space-y-2">
                            {getCardStats(activeTab)?.benefits.map((benefit, index) => (
                              <motion.div 
                                key={benefit}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2"
                              >
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-siso-orange" />
                                </div>
                                <span className="text-siso-text/80">{benefit}</span>
                              </motion.div>
                            ))}
                          </div>

                          <div className="flex items-center gap-4">
                            <Button 
                              className="bg-gradient-to-r from-siso-red to-siso-orange hover:from-siso-red/90 hover:to-siso-orange/90 
                                text-white shadow-lg shadow-siso-red/20 transition-all duration-300 hover:shadow-xl hover:shadow-siso-orange/30"
                            >
                              {activeContent.buttonText}
                            </Button>
                            <Button 
                              variant="outline"
                              className="border-siso-orange/20 hover:bg-siso-orange/10"
                            >
                              Learn More
                            </Button>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <div className="relative h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-siso-orange/20 shadow-lg shadow-siso-orange/5">
                            {!imageError ? (
                              <>
                                {!imageLoaded && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-siso-orange border-t-transparent rounded-full animate-spin" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-radial from-siso-orange/10 via-transparent to-transparent opacity-30" />
                                <img
                                  src={activeContent?.imageSrc}
                                  alt={activeContent?.imageAlt}
                                  className={`w-full h-full object-contain transition-all duration-300 hover:scale-105 ${
                                    imageLoaded ? 'opacity-100' : 'opacity-0'
                                  }`}
                                  onLoad={handleImageLoad}
                                  onError={handleImageError}
                                  style={{
                                    maxHeight: '100%',
                                    width: 'auto',
                                    margin: '0 auto',
                                    padding: '1rem'
                                  }}
                                />
                              </>
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <ImageOff className="w-12 h-12 text-siso-orange mb-2" />
                                <p className="text-sm text-siso-text/70">Unable to load image</p>
                                <p className="text-xs text-siso-text/50 mt-1">{activeContent?.imageSrc}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature108 };
