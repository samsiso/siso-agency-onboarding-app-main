import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Globe, Brain, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for now - in a real app, this would come from an API or database
const newsItems = [
  {
    id: 1,
    title: "OpenAI Releases GPT-5",
    description: "Latest breakthrough in language models pushes boundaries of AI capabilities with unprecedented reasoning abilities and multimodal understanding. Researchers highlight significant improvements in context handling and reduced hallucinations.",
    date: "2024-03-15",
    source: "AI Weekly",
    category: "Technology",
    icon: Brain,
    impact: "High",
  },
  {
    id: 2,
    title: "AI Regulation Framework Proposed",
    description: "Global initiative to standardize AI development and deployment gains traction as major tech companies and governments collaborate on comprehensive guidelines for responsible AI implementation.",
    date: "2024-03-14",
    source: "Tech News",
    category: "Policy",
    icon: Globe,
    impact: "Medium",
  },
  {
    id: 3,
    title: "New AI Research Centers Announced",
    description: "Leading universities launch dedicated AI research facilities focusing on ethical AI development, machine learning optimization, and practical applications in healthcare and climate science.",
    date: "2024-03-13",
    source: "Education Times",
    category: "Research",
    icon: Sparkles,
    impact: "Medium",
  },
];

const AINews = () => {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 bg-siso-bg p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
                Significant AI News
              </h1>
              <p className="text-lg text-siso-text/80 max-w-2xl">
                Stay updated with the latest breakthroughs, policy changes, and significant developments in the AI industry.
              </p>
            </div>
            
            <motion.div 
              className="grid gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {newsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={item.id} 
                    variants={itemVariants}
                  >
                    <Card className="glow-card group hover:scale-[1.01] transition-all duration-300 border-siso-text/5">
                      <CardHeader className="flex flex-row items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-siso-red/10 to-siso-orange/10 group-hover:from-siso-red/20 group-hover:to-siso-orange/20 transition-colors">
                          <Icon className="w-6 h-6 text-siso-orange" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold text-siso-text-bold group-hover:text-siso-red transition-colors">
                              {item.title}
                            </CardTitle>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.impact === 'High' 
                                ? 'bg-siso-red/10 text-siso-red' 
                                : 'bg-siso-orange/10 text-siso-orange'
                            }`}>
                              {item.impact} Impact
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-siso-text/70">
                            <span className="font-medium">{item.source}</span>
                            <span className="w-1 h-1 rounded-full bg-siso-text/30" />
                            <span>{item.date}</span>
                            <span className="w-1 h-1 rounded-full bg-siso-text/30" />
                            <span className="text-siso-orange">{item.category}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-siso-text/90 leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AINews;