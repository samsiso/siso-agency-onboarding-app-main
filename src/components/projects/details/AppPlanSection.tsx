
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileCheck, ChevronRight, Clock, ArrowRight, CheckCircle, ExternalLink, Search, File, FileArchive, FilePlus, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { ClientDocument } from '@/types/client.types';

export function AppPlanSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock documents data for the Market Research tab
  const mockDocuments: ClientDocument[] = [
    {
      id: "1",
      client_id: "123",
      title: "Competitor Analysis: Binance",
      content: "Detailed analysis of Binance's features and market position.",
      document_type: "app_plan",
      created_at: "2025-05-01",
      updated_at: "2025-05-01"
    },
    {
      id: "2",
      client_id: "123",
      title: "Competitor Analysis: Coinbase",
      content: "Analysis of Coinbase's user experience and features.",
      document_type: "functionalities",
      created_at: "2025-05-01",
      updated_at: "2025-05-01"
    },
    {
      id: "3",
      client_id: "123",
      title: "Market Trends",
      content: "Overview of current trends in Web3 trading platforms.",
      document_type: "wireframes",
      created_at: "2025-05-02",
      updated_at: "2025-05-02"
    },
    {
      id: "4",
      client_id: "123",
      title: "Target Audience Analysis",
      content: "Detailed breakdown of target user demographics and needs.",
      document_type: "inspiration",
      created_at: "2025-05-02",
      updated_at: "2025-05-02"
    },
    {
      id: "5",
      client_id: "123",
      title: "Competitive Edge Assessment",
      content: "Analysis of UbahCrypt's unique value propositions.",
      document_type: "app_plan",
      created_at: "2025-05-03",
      updated_at: "2025-05-03"
    }
  ];

  useEffect(() => {
    // Simulating document fetching
    setLoading(true);
    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 800);
  }, []);

  const getDocumentIcon = (documentType: string) => {
    switch (documentType) {
      case 'app_plan':
        return <FileArchive className="h-5 w-5 text-orange-500" />;
      case 'functionalities':
        return <FileCheck className="h-5 w-5 text-blue-500" />;
      case 'wireframes':
        return <Image className="h-5 w-5 text-purple-500" />;
      case 'inspiration':
        return <FilePlus className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-slate-500" />;
    }
  };

  const getDocumentTypeName = (documentType: string) => {
    switch (documentType) {
      case 'app_plan':
        return 'App Plan';
      case 'functionalities':
        return 'Functionalities';
      case 'wireframes':
        return 'Wireframes';
      case 'inspiration':
        return 'Inspiration';
      default:
        return documentType;
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    getDocumentTypeName(doc.document_type).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">App Development Plan</h2>
          <p className="text-neutral-400">Comprehensive roadmap for Ubahcrypt's development lifecycle.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#9b87f5] hover:bg-[#8a76e4] text-white">
            Export Plan
          </Button>
          <Button variant="outline" className="border-white/10 text-white">
            Edit Plan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="agency-steps" className="w-full">
        <TabsList className="bg-black/30 border border-white/10 mb-6">
          <TabsTrigger value="agency-steps">Agency Steps</TabsTrigger>
          <TabsTrigger value="market-research">Market Research</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="wireframe">Wireframe</TabsTrigger>
          <TabsTrigger value="user-flow">User Flow</TabsTrigger>
          <TabsTrigger value="feedback-log">Feedback Log</TabsTrigger>
        </TabsList>

        {/* Agency Steps Tab Content */}
        <TabsContent value="agency-steps" className="space-y-6">
          <h3 className="text-lg font-semibold text-white">SISO Agency's App-Building Framework</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Step 1: Project Kickoff",
                description: "Define project scope and requirements."
              },
              {
                title: "Step 2: Market Research",
                description: "Analyze competitors and market needs."
              },
              {
                title: "Step 3: Design & Wireframing",
                description: "Create wireframes and UI designs."
              },
              {
                title: "Step 4: Development",
                description: "Build core functionality and features."
              },
              {
                title: "Step 5: Testing & Feedback",
                description: "Test the app and gather feedback."
              },
              {
                title: "Step 6: Deployment",
                description: "Launch the app and provide handover."
              }
            ].map((step, index) => (
              <AnimatedCard key={index} className="border border-white/10">
                <div>
                  <h4 className="font-medium text-[#9b87f5] mb-2">{step.title}</h4>
                  <p className="text-neutral-300 text-sm">{step.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </TabsContent>

        {/* Market Research Tab Content - Adapted from ClientDocumentsPage */}
        <TabsContent value="market-research" className="space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4">Market Research Documents</h3>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search market research documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/20 border border-white/10 text-white placeholder-neutral-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-5 border border-white/10 bg-black/20">
                  <div className="animate-pulse flex items-start gap-3">
                    <div className="p-2 bg-white/5 rounded-md h-10 w-10"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-white/5 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-white/5 rounded w-1/2 mb-1"></div>
                      <div className="h-3 bg-white/5 rounded w-1/4"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredDocuments.length === 0 ? (
            <Card className="p-8 text-center border border-white/10 bg-black/20">
              <FileCheck className="h-12 w-12 mx-auto text-neutral-500 mb-3" />
              <h2 className="text-xl font-medium mb-2 text-white">No Documents Found</h2>
              <p className="text-neutral-400 mb-6">
                {documents.length === 0 
                  ? "No market research documents are available yet."
                  : "No documents match your search criteria."}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="p-5 border border-white/10 bg-black/20 hover:bg-black/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-black/30 rounded-md">
                      {getDocumentIcon(doc.document_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate" title={doc.title}>
                        {doc.title}
                      </h3>
                      <p className="text-sm text-neutral-400 mb-1">
                        {getDocumentTypeName(doc.document_type)}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Updated: {new Date(doc.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#9b87f5] hover:text-[#8a76e4]">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Button 
              variant="outline" 
              className="border-white/10 text-[#9b87f5] hover:text-[#8a76e4] hover:bg-[#9b87f5]/10"
            >
              View All Documents
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* Features Tab Content */}
        <TabsContent value="features" className="space-y-6">
          <AnimatedCard className="xl:col-span-2 border border-white/10">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-[#9b87f5]/10 rounded-lg text-center">
                <h4 className="font-medium text-white mb-2">Total Features</h4>
                <p className="text-2xl font-bold text-[#9b87f5]">24</p>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg text-center">
                <h4 className="font-medium text-white mb-2">Implemented</h4>
                <p className="text-2xl font-bold text-green-500">8</p>
              </div>
              <div className="p-4 bg-[#ea384c]/10 rounded-lg text-center">
                <h4 className="font-medium text-white mb-2">In Progress</h4>
                <p className="text-2xl font-bold text-[#ea384c]">6</p>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-4">Core Features</h3>
            <div className="space-y-3">
              {[
                { name: "Wallet Integration", status: "completed" },
                { name: "Trading Interface", status: "in_progress" },
                { name: "User Authentication", status: "completed" },
                { name: "Token Staking", status: "in_progress" },
                { name: "Transaction History", status: "upcoming" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      feature.status === 'completed' ? 'bg-green-500' : 
                      feature.status === 'in_progress' ? 'bg-[#9b87f5]' : 
                      'bg-neutral-500'
                    }`} />
                    <span className="text-white">{feature.name}</span>
                  </div>
                  <Badge variant={
                    feature.status === 'completed' ? 'success' : 
                    feature.status === 'in_progress' ? 'purple' : 
                    'secondary'
                  }>
                    {feature.status === 'completed' ? 'Completed' : 
                     feature.status === 'in_progress' ? 'In Progress' : 
                     'Upcoming'}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button 
                variant="ghost" 
                className="text-[#9b87f5] hover:text-[#8a76e4]"
                onClick={() => window.location.href = `/projects/features`}
              >
                View all features
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </AnimatedCard>
        </TabsContent>

        {/* Wireframe Tab Content */}
        <TabsContent value="wireframe" className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Wireframes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedCard className="border border-white/10">
              <div>
                <h4 className="font-medium text-[#9b87f5] mb-2">All Pages Overview</h4>
                <p className="text-neutral-300 text-sm mb-4">Overview of all pages in the UbahCrypt Project.</p>
                <ul className="space-y-2 mb-4">
                  <li className="text-neutral-300 text-sm flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#9b87f5]/70"></div>
                    Landing Page
                  </li>
                  <li className="text-neutral-300 text-sm flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#9b87f5]/70"></div>
                    Dashboard
                  </li>
                  <li className="text-neutral-300 text-sm flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#9b87f5]/70"></div>
                    Trading Interface
                  </li>
                  <li className="text-neutral-300 text-sm flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#9b87f5]/70"></div>
                    Wallet Connection
                  </li>
                  <li className="text-neutral-300 text-sm flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#9b87f5]/70"></div>
                    Settings
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-[#9b87f5] hover:text-[#8a76e4] border-[#9b87f5]/20"
                  onClick={() => window.open('https://sprout-draw-9ec.notion.site/Wireframe-All-Pages', '_blank')}
                >
                  View Details
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </AnimatedCard>
            
            <AnimatedCard className="border border-white/10">
              <div>
                <h4 className="font-medium text-[#9b87f5] mb-2">Detailed Pages</h4>
                <p className="text-neutral-300 text-sm mb-4">Detailed wireframes with UI photos and descriptions.</p>
                
                <div className="space-y-4">
                  {[
                    { 
                      name: "Landing Page", 
                      description: "Entry point for users with wallet connection.",
                      link: "https://sprout-draw-9ec.notion.site/Wireframe-Landing-Page"
                    },
                    { 
                      name: "Dashboard", 
                      description: "Main interface showing portfolio and assets.",
                      link: "https://sprout-draw-9ec.notion.site/Wireframe-Dashboard"
                    },
                    { 
                      name: "Trading Interface", 
                      description: "Interface for buying and selling tokens.",
                      link: "https://sprout-draw-9ec.notion.site/Wireframe-Trading-Interface"
                    }
                  ].map((page, index) => (
                    <div key={index} className="border border-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-white text-sm font-medium">{page.name}</h5>
                          <p className="text-neutral-400 text-xs mt-1">{page.description}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[#9b87f5] hover:text-[#8a76e4]"
                          onClick={() => window.open(page.link, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          </div>
        </TabsContent>

        {/* User Flow Tab Content */}
        <TabsContent value="user-flow" className="space-y-6">
          <AnimatedCard className="border border-white/10">
            <div>
              <h4 className="font-medium text-[#9b87f5] mb-2">User Flow Graph</h4>
              <p className="text-neutral-300 text-sm mb-4">Navigation flow between pages in the application.</p>
              
              <div className="p-4 bg-black/30 border border-white/10 rounded-lg mb-4">
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Flow: Landing Page → Wallet Connection → Dashboard → Trading Interface → Staking System → Transaction History → Community Features → Logout
                </p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[#9b87f5] hover:text-[#8a76e4] border-[#9b87f5]/20"
                onClick={() => window.open('https://sprout-draw-9ec.notion.site/User-Flow-Graph', '_blank')}
              >
                View Details
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </AnimatedCard>
        </TabsContent>

        {/* Feedback Log Tab Content */}
        <TabsContent value="feedback-log" className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Feedback Log</h3>
          <div className="space-y-4">
            {[
              {
                source: "Client Feedback",
                content: "The wallet connection needs to be faster.",
                date: "May 1, 2025"
              },
              {
                source: "User Feedback",
                content: "Trading interface is intuitive but needs more customization options.",
                date: "May 2, 2025"
              },
              {
                source: "AI Feedback",
                content: "Optimize loading times for the dashboard page.",
                date: "May 3, 2025"
              }
            ].map((feedback, index) => (
              <AnimatedCard key={index} className="border border-white/10">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-[#9b87f5]">{feedback.source}</h4>
                    <span className="text-neutral-500 text-xs">{feedback.date}</span>
                  </div>
                  <p className="text-neutral-300 text-sm">{feedback.content}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
