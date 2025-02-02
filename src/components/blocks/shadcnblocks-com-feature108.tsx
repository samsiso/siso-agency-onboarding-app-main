import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, BarChart, Zap, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  return (
    <section className="relative py-24">
      {/* Background Elements - Simplified */}
      <div className="absolute inset-0 bg-gradient-radial from-siso-orange/10 via-transparent to-transparent opacity-30" />

      <div className="relative">
        <div className="container flex flex-col items-center gap-4 text-center">
          <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-siso-orange/20">
            {badge}
          </Badge>
          <h2 className="max-w-2xl text-3xl font-bold md:text-4xl lg:text-5xl bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
            {heading}
          </h2>
          <p className="max-w-xl text-lg text-siso-text/80">
            {description}
          </p>
        </div>

        <div className="mt-12">
          <Tabs defaultValue={tabs[0].value} className="w-full">
            <TabsList className="container flex flex-wrap items-center justify-center gap-4 sm:flex-row md:gap-8">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold 
                    text-siso-text transition-all duration-300 hover:text-siso-text-bold
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-siso-red/20 
                    data-[state=active]:to-siso-orange/20 data-[state=active]:text-siso-text-bold
                    data-[state=active]:shadow-lg data-[state=active]:shadow-siso-red/10"
                >
                  {tab.icon} {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="container mt-8 max-w-screen-xl">
              {tabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="rounded-2xl border border-siso-border bg-black/40 backdrop-blur-sm p-6 lg:p-8"
                >
                  <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 place-items-center">
                    <div className="flex flex-col gap-4 lg:order-1">
                      <Badge variant="outline" className="w-fit bg-black/50 backdrop-blur-sm border-siso-orange/20">
                        {tab.content.badge}
                      </Badge>
                      <h3 className="text-2xl font-bold lg:text-3xl bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
                        {tab.content.title}
                      </h3>
                      <p className="text-base text-siso-text/80">
                        {tab.content.description}
                      </p>
                      <Button 
                        size="lg"
                        className="w-fit bg-gradient-to-r from-siso-red to-siso-orange hover:from-siso-red/90 hover:to-siso-orange/90 
                          text-white shadow-lg shadow-siso-red/20 transition-all duration-300 hover:shadow-xl hover:shadow-siso-orange/30"
                      >
                        {tab.content.buttonText}
                      </Button>
                    </div>
                    <div className="w-full h-[250px] lg:h-[300px] rounded-xl overflow-hidden shadow-2xl shadow-black/20 lg:order-2">
                      <img
                        src={tab.content.imageSrc}
                        alt={tab.content.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export { Feature108 };
