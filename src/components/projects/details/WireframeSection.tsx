
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Image, Upload, Download } from "lucide-react";
import { NavLink } from "@/components/ui/nav-link";
import { WireframeViewer } from "@/components/projects/wireframes/WireframeViewer";
import { WireframeNavigation } from "@/components/projects/wireframes/WireframeNavigation";
import { WireframeFlowConnector } from "@/components/projects/wireframes/WireframeFlowConnector";
import { useProjectWireframes } from "@/hooks/useProjectWireframes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WireframeSection() {
  const {
    wireframes,
    connections,
    loading,
    error,
    activeWireframeId,
    setActiveWireframeId,
    activeWireframe,
    downloadWireframe
  } = useProjectWireframes();

  if (loading) {
    return (
      <Card className="p-6 bg-black/30 border-siso-text/10">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-white">Wireframes</h3>
          <Image className="w-5 h-5 text-[#9b87f5]" />
        </div>
        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4 animate-pulse h-72"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-black/30 border-siso-text/10">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-white">Wireframes</h3>
          <Image className="w-5 h-5 text-[#9b87f5]" />
        </div>
        <div className="bg-black/20 rounded-lg p-4">
          <p className="text-red-400">Error loading wireframes: {error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-black/30 border-siso-text/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-white">Wireframes & User Flow</h3>
          <Image className="w-5 h-5 text-[#9b87f5]" />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-black/30 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
        >
          <Upload className="w-4 h-4 mr-2" />
          <span>Upload New</span>
        </Button>
      </div>
      
      <Tabs defaultValue="viewer" className="space-y-6">
        <TabsList className="bg-black/40 border border-gray-800">
          <TabsTrigger value="viewer">Wireframe Viewer</TabsTrigger>
          <TabsTrigger value="flow">User Flow</TabsTrigger>
          <TabsTrigger value="list">All Wireframes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="viewer" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {activeWireframe ? (
                <WireframeViewer 
                  imageUrl={activeWireframe.imageUrl} 
                  title={activeWireframe.title} 
                  onDownload={downloadWireframe}
                />
              ) : (
                <div className="bg-black/20 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-400">No wireframe selected</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Wireframes</h3>
              <WireframeNavigation 
                wireframes={wireframes} 
                activeWireframeId={activeWireframeId} 
                onSelect={setActiveWireframeId} 
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="flow" className="space-y-6">
          <WireframeFlowConnector 
            connections={connections} 
            wireframes={wireframes.map(w => ({ id: w.id, title: w.title }))} 
            onNavigate={setActiveWireframeId} 
          />
        </TabsContent>
        
        <TabsContent value="list" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {wireframes.map(wireframe => (
              <div 
                key={wireframe.id} 
                className="bg-black/20 border border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:border-purple-500/30 transition-colors"
                onClick={() => {
                  setActiveWireframeId(wireframe.id);
                  document.querySelector('[data-state="active"][value="viewer"]')?.click();
                }}
              >
                <div className="h-36 overflow-hidden bg-black/30">
                  {wireframe.imageUrl ? (
                    <img 
                      src={wireframe.imageUrl} 
                      alt={wireframe.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-white">{wireframe.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs px-2 py-0.5 bg-black/30 rounded-full text-gray-400">
                      {wireframe.category}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveWireframeId(wireframe.id);
                        downloadWireframe();
                      }}
                    >
                      <Download className="h-3 w-3 text-gray-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="border-t border-gray-800 mt-6 pt-4">
        <NavLink href="/resources/documents" className="flex items-center gap-2 text-[#9b87f5] hover:text-[#9b87f5]/80">
          <span>View All Project Documents</span>
          <ArrowRight className="w-4 h-4" />
        </NavLink>
      </div>
    </Card>
  );
}
