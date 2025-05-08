import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useClientAppDetails } from '@/hooks/useClientAppDetails';
import { ClientAppHeader } from '@/components/client-app/ClientAppHeader';
import { ClientAppStats } from '@/components/client-app/ClientAppStats';
import { ClientAppTimeline } from '@/components/client-app/ClientAppTimeline';
import { ClientAppFeatures } from '@/components/client-app/ClientAppFeatures';
import { ClientAppMediaPreview } from '@/components/client-app/ClientAppMediaPreview';
import { ClientAppCaseStudy } from '@/components/client-app/ClientAppCaseStudy';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectActions } from '@/components/projects/details/ProjectActions';
import { ArrowLeft } from 'lucide-react';
import { Spotlight } from '@/components/ui/spotlight';

export default function ClientAppDetailsPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const { appData, clientData, loading, error } = useClientAppDetails(clientId);

  if (error) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-black/30 border border-siso-text/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-white">App Details Not Found</h2>
            <p className="text-siso-text mb-6">
              We couldn't find the app details you're looking for. This might be because:
              <br />
              - The client ID is invalid
              <br />
              - You don't have access to this client
              <br />
              - The client hasn't set up their app yet
            </p>
            <Button asChild>
              <Link to="/economy/leaderboards">Return to Leaderboard</Link>
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Mock data for our new components - in a real app this would come from the API
  const mockCaseStudy = {
    challenge: "The client needed a comprehensive platform to manage their OnlyFans content creation business, struggling with manual processes and scattered tools.",
    solution: "We developed a centralized management platform with automated scheduling, analytics, and team collaboration features.",
    results: [
      "Reduced content scheduling time by 75%",
      "Increased revenue by 40% through better analytics",
      "Improved team coordination and communication"
    ],
    metrics: {
      timeToMarket: "45 days",
      costSavings: "$50,000/year",
      userBase: "500+ creators"
    }
  };

  const mockPreviewData = {
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    wireframeUrls: [
      "https://via.placeholder.com/800x450",
      "https://via.placeholder.com/800x450"
    ]
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 relative">
        <Spotlight className="-top-40 left-0" />
        
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link to="/economy/leaderboards">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Leaderboard
            </Link>
          </Button>
        </div>

        {loading ? (
          <LoadingState />
        ) : (
          <div className="space-y-8">
            <ClientAppHeader 
              appName={appData?.app_name || "App Name"} 
              clientName={clientData?.full_name || clientData?.business_name || "Client"} 
              status={appData?.status || "pending"}
              description={appData?.description || undefined}
            />
            
            <ClientAppStats 
              estimatedCost={appData?.estimated_cost}
              estimatedDays={appData?.estimated_days}
              completionPercentage={clientData?.current_step ? 
                Math.round((clientData.current_step / (clientData.total_steps || 1)) * 100) : 20}
            />

            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="case-study">Case Study</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="preview">
                <ClientAppMediaPreview {...mockPreviewData} />
              </TabsContent>

              <TabsContent value="features">
                <ClientAppFeatures features={appData?.features || []} />
              </TabsContent>

              <TabsContent value="case-study">
                <ClientAppCaseStudy {...mockCaseStudy} />
              </TabsContent>

              <TabsContent value="timeline">
                <ClientAppTimeline clientData={clientData} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="bg-black/30 border border-siso-text/10 rounded-lg p-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-full max-w-2xl mb-2" />
        <Skeleton className="h-6 w-full max-w-md" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
      
      <div>
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="bg-black/30 border border-siso-text/10 rounded-lg p-8">
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
