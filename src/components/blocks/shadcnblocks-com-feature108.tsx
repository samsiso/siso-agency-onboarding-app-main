import { BookOpen, Users, BarChart, Zap, Newspaper, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

const Feature108 = ({
  badge = "SISO Agency",
  heading = "Resource Hub Features",
  description = "Discover powerful tools and insights designed to help your business grow.",
  tabs = [
    {
      value: "ai-tools",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "AI-Powered Analysis",
      content: {
        badge: "Smart Solutions",
        title: "Transform Your Agency with AI",
        description:
          "Get tailored insights by cross-referencing industry videos and your agency needs. Our AI-powered tools help you make data-driven decisions and stay ahead of the competition.",
        buttonText: "Explore Tools",
        imageSrc: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
        imageAlt: "AI Analysis Dashboard",
      },
    },
    {
      value: "education",
      icon: <BookOpen className="h-auto w-4 shrink-0" />,
      label: "Education Hub",
      content: {
        badge: "Learn & Grow",
        title: "Access Premium Educational Content",
        description:
          "Dive into our curated collection of YouTube videos, expert analysis, and top video recommendations tailored to your business needs. Stay ahead with continuous learning.",
        buttonText: "Start Learning",
        imageSrc: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
        imageAlt: "Education Resources",
      },
    },
    {
      value: "community",
      icon: <Users className="h-auto w-4 shrink-0" />,
      label: "Community & Network",
      content: {
        badge: "Connect & Collaborate",
        title: "Join a Thriving Community",
        description:
          "Engage with industry experts, get personalized GP assistance, and become part of a vibrant community of agency owners and professionals sharing insights and opportunities.",
        buttonText: "Join Network",
        imageSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
        imageAlt: "Community Network",
      },
    },
    {
      value: "economy",
      icon: <BarChart className="h-auto w-4 shrink-0" />,
      label: "Economy Insights",
      content: {
        badge: "Market Intelligence",
        title: "Navigate Economic Trends",
        description:
          "Access powerful tools and visualizations to understand economic trends and make informed decisions. Stay ahead of market changes with our comprehensive analysis.",
        buttonText: "View Insights",
        imageSrc: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7",
        imageAlt: "Economic Analysis",
      },
    },
    {
      value: "news",
      icon: <Newspaper className="h-auto w-4 shrink-0" />,
      label: "AI News",
      content: {
        badge: "Stay Updated",
        title: "Latest AI Industry News",
        description:
          "Keep up with the rapidly evolving AI landscape through our curated news feed. Get insights on the latest developments, trends, and innovations in the AI industry.",
        buttonText: "Read News",
        imageSrc: "https://images.unsplash.com/photo-1655720828018-edd2daec9349",
        imageAlt: "AI News Feed",
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
            <Badge className="bg-siso-bg-alt text-siso-text px-4 py-2 rounded-full">
              {badge}
            </Badge>
            
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-siso-text-bold">
              {heading}
            </h2>

            {/* Added subtitle with Globe icon */}
            <div className="flex items-center gap-2 text-siso-text/80 text-lg">
              <Globe className="w-5 h-5" />
              <p>Powered by thousands of innovators worldwide</p>
            </div>

            <p className="mx-auto max-w-[700px] text-siso-text/80 md:text-xl">
              {description}
            </p>
          </div>

          <div className="mt-12">
            <div className="container max-w-7xl mx-auto px-6 lg:px-8">
              {/* Tab Triggers */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:flex-row md:gap-8 mb-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold 
                      transition-all duration-300
                      ${activeTab === tab.value 
                        ? 'text-siso-text-bold bg-gradient-to-r from-siso-red/20 to-siso-orange/20 shadow-lg shadow-siso-red/10' 
                        : 'text-siso-text hover:text-siso-text-bold hover:bg-gradient-to-r hover:from-siso-red/20 hover:to-siso-orange/20'
                      }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Display */}
              {activeContent && (
                <div className="mt-8 px-4">
                  <div className="rounded-lg border border-siso-border bg-black/90 backdrop-blur-sm p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div className="flex flex-col gap-4">
                        <Badge variant="outline" className="w-fit bg-black/50 backdrop-blur-sm border-siso-orange/20">
                          {activeContent.badge}
                        </Badge>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
                          {activeContent.title}
                        </h3>
                        <p className="text-siso-text/80">
                          {activeContent.description}
                        </p>
                        <Button 
                          className="w-fit bg-gradient-to-r from-siso-red to-siso-orange hover:from-siso-red/90 hover:to-siso-orange/90 
                            text-white shadow-lg shadow-siso-red/20 transition-all duration-300 hover:shadow-xl hover:shadow-siso-orange/30"
                        >
                          {activeContent.buttonText}
                        </Button>
                      </div>
                      <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-xl shadow-black/20">
                        <img
                          src={activeContent.imageSrc}
                          alt={activeContent.imageAlt}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature108 };
