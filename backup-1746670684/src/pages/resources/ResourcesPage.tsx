
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BookOpen, FileText, HelpCircle, User } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { GettingStartedContent } from "@/components/help/content/GettingStartedContent";
import { DocumentationContent } from "@/components/help/content/DocumentationContent";
import { FAQContent } from "@/components/help/content/FAQContent";
import { ProfileContent } from "@/components/resources/ProfileContent";

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("getting-started");

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

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resources & Support</h1>
          <p className="text-muted-foreground">
            Find help, documentation and manage your profile all in one place
          </p>
        </div>
        
        <Card className="bg-black/20 border border-siso-text/10 backdrop-blur-sm p-6">
          <Tabs defaultValue="getting-started" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="getting-started" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Getting Started</span>
              </TabsTrigger>
              <TabsTrigger value="documentation" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Documentation</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>FAQ</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile & Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="getting-started" className="mt-6">
              <GettingStartedContent />
            </TabsContent>
            
            <TabsContent value="documentation" className="mt-6">
              <DocumentationContent />
            </TabsContent>
            
            <TabsContent value="faq" className="mt-6">
              <FAQContent />
            </TabsContent>
            
            <TabsContent value="profile" className="mt-6">
              <ProfileContent />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  );
}
