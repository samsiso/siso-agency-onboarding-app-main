import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, HelpCircle, User, Search, ArrowRight, Sparkles, MessageCircle } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { GettingStartedContent } from "@/components/help/content/GettingStartedContent";
import { DocumentationContent } from "@/components/help/content/DocumentationContent";
import { FAQContent } from "@/components/help/content/FAQContent";
import { ProfileContent } from "@/components/resources/ProfileContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const featuredArticles = [
    {
      title: "Getting Started with SISO",
      description: "Learn the basics of the platform and set up your account",
      icon: <BookOpen className="h-5 w-5" />,
      tag: "Guide",
      category: "getting-started"
    },
    {
      title: "Building Your First Project",
      description: "Step-by-step walkthrough of creating a new project",
      icon: <FileText className="h-5 w-5" />,
      tag: "Tutorial",
      category: "documentation"
    },
    {
      title: "API Integration Guide",
      description: "How to integrate with external APIs and services",
      icon: <HelpCircle className="h-5 w-5" />,
      tag: "Advanced",
      category: "documentation"
    }
  ];

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

        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="relative mb-10 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[url('/images/resources-bg.jpg')] bg-cover bg-center z-0 opacity-50"></div>
          
          <div className="relative z-20 px-8 py-12 md:py-16 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Resources & Support
            </h1>
            <p className="text-xl text-gray-200 mb-6">
              Find help, documentation, and manage your profile all in one place
            </p>
            
            <div className="relative max-w-md">
              <Input
                type="text"
                placeholder="Search for help articles..."
                className="pr-10 bg-black/30 border-gray-700 backdrop-blur-sm focus:ring-siso-orange/50 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Featured Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-siso-orange" />
              <h2 className="text-2xl font-bold">Featured Resources</h2>
            </div>
            <Button variant="link" className="text-siso-orange">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="cursor-pointer"
                onClick={() => setActiveTab(article.category)}
              >
                <Card className="bg-black/30 border-gray-800 h-full hover:border-siso-orange/40 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-10 rounded-full bg-black/40 border border-gray-700 flex items-center justify-center">
                        {article.icon}
                      </div>
                      <Badge variant="secondary" className="bg-black/40 text-gray-300 border-gray-700">
                        {article.tag}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 text-xl">{article.title}</CardTitle>
                    <CardDescription className="text-gray-400">{article.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="h-5 w-5 text-siso-orange" />
            <h2 className="text-2xl font-bold">Need Help?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-black/40 to-black/20 border-gray-800 hover:border-siso-orange/40 transition-all">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-full bg-siso-orange/20 border border-siso-orange/30 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-siso-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Live Chat Support</h3>
                    <p className="text-gray-400 mb-4">Get instant help from our support team via live chat</p>
                    <Button>Start a Conversation</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-black/40 to-black/20 border-gray-800 hover:border-siso-orange/40 transition-all">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Browse Knowledge Base</h3>
                    <p className="text-gray-400 mb-4">Find answers in our comprehensive documentation</p>
                    <Button variant="outline">View Articles</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-black/30 border-gray-800 backdrop-blur-sm p-6">
            <Tabs defaultValue="getting-started" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8 bg-black/40">
                <TabsTrigger value="getting-started" className="flex items-center gap-2 data-[state=active]:bg-siso-orange/20 data-[state=active]:text-white">
                  <BookOpen className="h-4 w-4" />
                  <span>Getting Started</span>
                </TabsTrigger>
                <TabsTrigger value="documentation" className="flex items-center gap-2 data-[state=active]:bg-siso-orange/20 data-[state=active]:text-white">
                  <FileText className="h-4 w-4" />
                  <span>Documentation</span>
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex items-center gap-2 data-[state=active]:bg-siso-orange/20 data-[state=active]:text-white">
                  <HelpCircle className="h-4 w-4" />
                  <span>FAQ</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-siso-orange/20 data-[state=active]:text-white">
                  <User className="h-4 w-4" />
                  <span>Profile & Settings</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="getting-started" className="mt-6 focus-visible:outline-none">
                <GettingStartedContent />
              </TabsContent>
              
              <TabsContent value="documentation" className="mt-6 focus-visible:outline-none">
                <DocumentationContent />
              </TabsContent>
              
              <TabsContent value="faq" className="mt-6 focus-visible:outline-none">
                <FAQContent />
              </TabsContent>
              
              <TabsContent value="profile" className="mt-6 focus-visible:outline-none">
                <ProfileContent />
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
