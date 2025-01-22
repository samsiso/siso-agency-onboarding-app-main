import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Globe, Brain } from 'lucide-react';

// Mock data for now - in a real app, this would come from an API or database
const newsItems = [
  {
    id: 1,
    title: "OpenAI Releases GPT-5",
    description: "Latest breakthrough in language models pushes boundaries of AI capabilities.",
    date: "2024-03-15",
    source: "AI Weekly",
    category: "Technology",
    icon: Brain,
  },
  {
    id: 2,
    title: "AI Regulation Framework Proposed",
    description: "Global initiative to standardize AI development and deployment.",
    date: "2024-03-14",
    source: "Tech News",
    category: "Policy",
    icon: Globe,
  },
  {
    id: 3,
    title: "New AI Research Centers Announced",
    description: "Major universities launch dedicated AI research facilities.",
    date: "2024-03-13",
    source: "Education Times",
    category: "Research",
    icon: Newspaper,
  },
];

const AINews = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 bg-siso-bg p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
              Significant AI News
            </h1>
            
            <div className="grid gap-6">
              {newsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.id} className="glow-card group hover:scale-[1.01] transition-transform">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="p-2 rounded-full bg-gradient-to-r from-siso-red/10 to-siso-orange/10">
                        <Icon className="w-6 h-6 text-siso-orange" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-siso-text-bold group-hover:text-siso-red transition-colors">
                          {item.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-siso-text/70">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-siso-text">{item.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AINews;