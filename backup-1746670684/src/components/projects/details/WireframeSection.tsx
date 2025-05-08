
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

  // Even if there's an error, we'll show the default wireframes
  // So we only respect the loading state

  return (
    <Card className="p-6 bg-black/30 border-siso-text/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-white">App Wireframes & UI Plans</h3>
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
      
      <div className="mb-4 p-3 bg-black/20 rounded-lg border border-purple-500/20">
        <p className="text-sm text-gray-300">
          This section contains all planned pages for your application with wireframes, UI plans, and detailed requirements.
          Each wireframe includes links to Notion documents that provide comprehensive specifications and design inspiration.
        </p>
      </div>
      
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="bg-black/40 border border-gray-800">
          <TabsTrigger value="list">All Wireframes</TabsTrigger>
        </TabsList>
        

        
        <TabsContent value="list" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wireframes.map(wireframe => (
              <div 
                key={wireframe.id} 
                className="bg-gradient-to-b from-slate-900 to-black border border-gray-800 rounded-lg overflow-hidden transition-all duration-200 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 group"
              >
                <div className="p-4 pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full text-white border border-indigo-500/20">
                      {wireframe.title.includes('/') ? 'Complex UI' : 'Core UI'}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>Planned</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 pt-2 space-y-3">
                  <h4 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors border-b border-white/10 pb-2">
                    {wireframe.title}
                  </h4>
                  
                  {wireframe.description && (
                    <div className="py-2">
                      <p className="text-sm text-gray-300">{wireframe.description}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2 pt-1">
                    <div className={`flex items-center gap-2 text-xs ${wireframe.wireframeStatus === 'complete' ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {wireframe.wireframeStatus === 'complete' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      )}
                      <span>Wireframe {wireframe.wireframeStatus === 'complete' ? 'complete' : 'in progress'}</span>
                    </div>

                    <div className={`flex items-center gap-2 text-xs ${wireframe.specsStatus === 'approved' ? 'text-blue-400' : 'text-gray-400'}`}>
                      {wireframe.specsStatus === 'approved' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 11 12 14 22 4"></polyline>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      )}
                      <span>Specifications {wireframe.specsStatus === 'approved' ? 'approved' : 'pending'}</span>
                    </div>

                    <div className={`flex items-center gap-2 text-xs ${wireframe.devStatus === 'complete' ? 'text-emerald-400' : wireframe.devStatus === 'in-progress' ? 'text-amber-400' : 'text-gray-400'}`}>
                      {wireframe.devStatus === 'complete' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      ) : wireframe.devStatus === 'in-progress' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 4 23 10 17 10"></polyline>
                          <polyline points="1 20 1 14 7 14"></polyline>
                          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      )}
                      <span>
                        {wireframe.devStatus === 'complete' ? 'Development complete' : 
                         wireframe.devStatus === 'in-progress' ? 'Development in progress' : 
                         'Pending development'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2 grid grid-cols-1 gap-2">
                    {wireframe.notionUiPlanLink && (
                      <a 
                        href={wireframe.notionUiPlanLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-white bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-600 hover:to-purple-600 transition-colors p-2 rounded-md border border-indigo-400/30"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 9V5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4 15V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>View Complete Documentation</span>
                        <svg className="ml-auto" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    )}
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
