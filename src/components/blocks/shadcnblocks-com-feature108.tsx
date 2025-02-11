
import { BookOpen, Users, BarChart, Zap, Newspaper, Globe, Bot, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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

// [Analysis] Each theme type gets its own gradient and styling
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

const Feature108 = ({
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
        imageSrc: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
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
        imageSrc: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
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
        imageSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
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
        imageSrc: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7",
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
        imageSrc: "https://images.unsplash.com/photo-1655720828018-edd2daec9349",
        imageAlt: "News Interface Demo",
      },
    },
  ],
}: Feature108Props) => {
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const activeContent = tabs.find(tab => tab.value === activeTab)?.content;

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
              <Badge className="bg-siso-bg-alt text-siso-text px-4 py-2 rounded-full">
                {badge}
              </Badge>
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-siso-text-bold"
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
              <Globe className="w-5 h-5" />
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
              {/* Tab Triggers */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:flex-row md:gap-8 mb-8">
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold 
                      transition-all duration-300 hover:scale-105
                      ${activeTab === tab.value 
                        ? 'text-siso-text-bold bg-gradient-to-r from-siso-red/20 to-siso-orange/20 shadow-lg shadow-siso-red/10' 
                        : 'text-siso-text hover:text-siso-text-bold hover:bg-gradient-to-r hover:from-siso-red/20 hover:to-siso-orange/20'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab.icon} {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Content Display */}
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
                      className={`rounded-lg border backdrop-blur-sm p-8 shadow-2xl transition-all duration-500
                        ${getCardStyles(activeTab)}`}
                      whileHover={{ scale: 1.02 }}
                      layout
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <motion.div 
                          className="flex flex-col gap-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <Badge 
                            variant="outline" 
                            className="w-fit bg-black/50 backdrop-blur-sm border-siso-orange/20 hover:border-siso-orange/40 transition-colors"
                          >
                            {activeContent.badge}
                          </Badge>
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
                            {activeContent.title}
                          </h3>
                          <p className="text-siso-text/80 leading-relaxed">
                            {activeContent.description}
                          </p>
                          <Button 
                            className="w-fit bg-gradient-to-r from-siso-red to-siso-orange hover:from-siso-red/90 hover:to-siso-orange/90 
                              text-white shadow-lg shadow-siso-red/20 transition-all duration-300 hover:shadow-xl hover:shadow-siso-orange/30
                              hover:scale-105"
                          >
                            {activeContent.buttonText}
                          </Button>
                        </motion.div>
                        <motion.div 
                          className="w-full h-[300px] rounded-lg overflow-hidden shadow-xl shadow-black/20
                            ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <motion.img
                            src={activeContent.imageSrc}
                            alt={activeContent.imageAlt}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.7 }}
                          />
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
