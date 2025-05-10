import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  FileText,
  HelpCircle,
  User,
  Sparkles,
  Search,
  Video,
  MessageSquare,
  LifeBuoy,
  BookMarked,
  Settings,
  Code,
  ExternalLink,
  Newspaper,
  Clock,
  Calendar,
  Mail,
  Phone,
  Users,
  Play
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { GettingStartedContent } from "@/components/help/content/GettingStartedContent";
import { DocumentationContent } from "@/components/help/content/DocumentationContent";
import { FAQContent } from "@/components/help/content/FAQContent";
import { TutorialsContent } from "@/components/help/content/TutorialsContent";
import { ProfileContent } from "@/components/resources/ProfileContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResources, setFilteredResources] = useState<any[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Parse the tab from query params on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");
    if (tabParam && ["getting-started", "documentation", "faq", "profile", "tutorials"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Update URL when tab changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("tab", activeTab);
    window.history.replaceState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
  }, [activeTab]);

  // Sample resources for search demonstration
  const resourcesList = [
    { title: "Account Setup Guide", type: "guide", category: "getting-started", url: "/resources/help/getting-started#account-setup" },
    { title: "API Documentation", type: "doc", category: "documentation", url: "/resources/help/documentation#api" },
    { title: "Billing FAQ", type: "faq", category: "faq", url: "/resources/help/faq#billing" },
    { title: "Security Best Practices", type: "guide", category: "documentation", url: "/resources/help/documentation#security" },
    { title: "Two-factor Authentication", type: "tutorial", category: "tutorials", url: "/resources/tutorials/security/2fa" },
    { title: "Profile Settings", type: "settings", category: "profile", url: "/resources?tab=profile" },
    { title: "Dashboard Overview", type: "tutorial", category: "tutorials", url: "/resources/tutorials/dashboard" },
    { title: "Password Reset", type: "faq", category: "faq", url: "/resources/help/faq#password-reset" },
  ];

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setIsSearchActive(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = resourcesList.filter(resource => 
      resource.title.toLowerCase().includes(query) || 
      resource.category.toLowerCase().includes(query) ||
      resource.type.toLowerCase().includes(query)
    );
    
    setFilteredResources(results);
    setIsSearchActive(true);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchActive(false);
  };

  // Get icon for resource type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "guide": return <BookOpen className="h-4 w-4" />;
      case "doc": return <FileText className="h-4 w-4" />;
      case "faq": return <HelpCircle className="h-4 w-4" />;
      case "tutorial": return <Video className="h-4 w-4" />;
      case "settings": return <Settings className="h-4 w-4" />;
      default: return <BookMarked className="h-4 w-4" />;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/resources">Resources & Support</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header section with title and search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent mb-2">
                Resources & Support
              </h1>
              <p className="text-gray-400">
                Find help, documentation and manage your profile all in one place
              </p>
            </div>
            
            <form onSubmit={handleSearch} className="w-full md:w-auto md:min-w-[320px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search resources..."
                  className="pl-9 bg-black/20 border-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
          
          {/* Featured resources banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg bg-gradient-to-r from-indigo-900/80 via-violet-900/80 to-purple-900/80 border border-indigo-500/30 p-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-300" />
                  Resource Center
                </h2>
                <p className="text-indigo-200 text-sm max-w-2xl">
                  Your centralized hub for help, guides, documentation, and account management. Find everything you need to make the most of our platform.
                </p>
              </div>
              <Button 
                className="mt-4 md:mt-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg"
                size="sm"
                onClick={() => window.open('https://calendly.com/sisoagency/consultation', '_blank')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Schedule Consultation
              </Button>
            </div>
            
            {/* Quick access buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <Button 
                variant="outline" 
                className="bg-black/30 border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 justify-start"
                onClick={() => setActiveTab("getting-started")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Getting Started
              </Button>
              <Button 
                variant="outline" 
                className="bg-black/30 border-purple-500/30 hover:bg-purple-500/20 text-purple-300 justify-start"
                onClick={() => setActiveTab("documentation")}
              >
                <Code className="mr-2 h-4 w-4" />
                API Docs
              </Button>
              <Button 
                variant="outline" 
                className="bg-black/30 border-blue-500/30 hover:bg-blue-500/20 text-blue-300 justify-start"
                onClick={() => window.open('/resources/tutorials', '_blank')}
              >
                <Video className="mr-2 h-4 w-4" />
                Video Tutorials
              </Button>
              <Button 
                variant="outline" 
                className="bg-black/30 border-teal-500/30 hover:bg-teal-500/20 text-teal-300 justify-start"
                onClick={() => window.open('mailto:support@sisoagency.com')}
              >
                <LifeBuoy className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Search results section (conditionally rendered) */}
        {isSearchActive && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-8"
          >
            <Card className="bg-black/30 border-gray-800 overflow-hidden">
              <CardHeader className="bg-black/40 pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-white">
                    Search Results ({filteredResources.length})
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearSearch} className="h-8 px-2 text-gray-400">
                    Clear Search
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {filteredResources.length > 0 ? (
                  <div className="space-y-3">
                    {filteredResources.map((resource, index) => (
                      <a 
                        key={index} 
                        href={resource.url}
                        className="flex items-center p-3 bg-black/20 hover:bg-black/40 rounded-md border border-gray-800 hover:border-indigo-500/30 transition-colors duration-200"
                      >
                        <div className="mr-3 p-2 bg-gray-800 rounded-md">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{resource.title}</h4>
                          <div className="flex items-center mt-1">
                            <Badge 
                              variant="outline" 
                              className="text-xs mr-2 bg-black/30 border-gray-700 text-gray-400"
                            >
                              {resource.category.replace("-", " ")}
                            </Badge>
                            <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-500 ml-auto" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <HelpCircle className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white mb-1">No results found</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      We couldn't find any resources matching "{searchQuery}"
                    </p>
                    <Button variant="outline" onClick={clearSearch} className="border-gray-700 text-gray-300">
                      Clear Search
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Main content area */}
        <Card className="bg-black/20 border border-gray-800 backdrop-blur-sm">
          <Tabs defaultValue="getting-started" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-0 p-1 bg-black/40 border-b border-gray-800">
              <TabsTrigger 
                value="getting-started" 
                className="flex items-center gap-2 data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Getting</span> Started
              </TabsTrigger>
              <TabsTrigger 
                value="documentation" 
                className="flex items-center gap-2 data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Documentation</span>
                <span className="sm:hidden">Docs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tutorials" 
                className="flex items-center gap-2 data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300"
              >
                <Video className="h-4 w-4" />
                <span>Tutorials</span>
              </TabsTrigger>
              <TabsTrigger 
                value="faq" 
                className="flex items-center gap-2 data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300"
              >
                <HelpCircle className="h-4 w-4" />
                <span>FAQ</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-300"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="p-6">
              <TabsContent value="getting-started" className="mt-0">
                <GettingStartedContent />
              </TabsContent>
              
              <TabsContent value="documentation" className="mt-0">
                <DocumentationContent />
              </TabsContent>
              
              <TabsContent value="tutorials" className="mt-0">
                <TutorialsContent />
              </TabsContent>
              
              <TabsContent value="faq" className="mt-0">
                <FAQContent />
              </TabsContent>
              
              <TabsContent value="profile" className="mt-0">
                <ProfileContent />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
        
        {/* Resource updates section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/20 border border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Newspaper className="h-5 w-5 text-blue-400" />
                Latest Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-4 py-1">
                <p className="font-medium text-white">New API Documentation</p>
                <p className="text-sm text-gray-400">Complete reference for our latest API endpoints</p>
                <p className="text-xs text-gray-500 mt-1">3 days ago</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-4 py-1">
                <p className="font-medium text-white">Profile Settings Expanded</p>
                <p className="text-sm text-gray-400">More customization options for your account</p>
                <p className="text-xs text-gray-500 mt-1">1 week ago</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-4 py-1">
                <p className="font-medium text-white">Security Best Practices</p>
                <p className="text-sm text-gray-400">Updated guidelines for account protection</p>
                <p className="text-xs text-gray-500 mt-1">2 weeks ago</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 border border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-green-400" />
                Support Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-gray-800">
                <div className="p-2 bg-green-500/20 rounded-md">
                  <MessageSquare className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Live Chat</p>
                  <p className="text-sm text-gray-400">Available weekdays 9am-5pm</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-gray-800">
                <div className="p-2 bg-blue-500/20 rounded-md">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Email Support</p>
                  <p className="text-sm text-gray-400">support@sisoagency.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-gray-800">
                <div className="p-2 bg-purple-500/20 rounded-md">
                  <Phone className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Phone Support</p>
                  <p className="text-sm text-gray-400">Premium accounts only</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/20 border border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookMarked className="h-5 w-5 text-amber-400" />
                Quick Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center h-20 bg-black/20 border-gray-700 hover:bg-amber-500/5 hover:border-amber-500/20"
                  onClick={() => window.open('/resources/help/documentation', '_blank')}
                >
                  <BookOpen className="h-5 w-5 mb-1 text-amber-400" />
                  <span className="text-xs text-white">API Docs</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center h-20 bg-black/20 border-gray-700 hover:bg-amber-500/5 hover:border-amber-500/20"
                  onClick={() => window.open('/resources/help/faq', '_blank')}
                >
                  <FileText className="h-5 w-5 mb-1 text-amber-400" />
                  <span className="text-xs text-white">Guides</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center h-20 bg-black/20 border-gray-700 hover:bg-amber-500/5 hover:border-amber-500/20"
                  onClick={() => window.open('/resources/community', '_blank')}
                >
                  <Users className="h-5 w-5 mb-1 text-amber-400" />
                  <span className="text-xs text-white">Community</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center h-20 bg-black/20 border-gray-700 hover:bg-amber-500/5 hover:border-amber-500/20"
                  onClick={() => window.open('/resources/changelog', '_blank')}
                >
                  <Newspaper className="h-5 w-5 mb-1 text-amber-400" />
                  <span className="text-xs text-white">What's New</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
