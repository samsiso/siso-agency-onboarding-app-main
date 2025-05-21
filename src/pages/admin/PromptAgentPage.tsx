import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { ProjectList } from '@/components/admin/prompt-agent/ProjectList';
import { PromptList } from '@/components/admin/prompt-agent/PromptList';
import { PromptForm } from '@/components/admin/prompt-agent/PromptForm';
import { PageNavigation } from '@/components/admin/prompt-agent/PageNavigation';
import { StretchList } from '@/components/admin/prompt-agent/StretchList';
import { PromptIterations } from '@/components/admin/prompt-agent/PromptIterations';
import { PagePromptsView } from '@/components/admin/prompt-agent/PagePromptsView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, LayoutGrid, List } from 'lucide-react';

export const PromptAgentPage = () => {
  const { projectName, promptId } = useParams<{
    projectName?: string;
    promptId?: string;
  }>();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get('page');
  const stretchParam = searchParams.get('stretch');
  const viewParam = searchParams.get('view') || 'pages'; // Default to pages view
  
  const [currentPage, setCurrentPage] = useState<number>(pageParam ? parseInt(pageParam, 10) : 1);
  const [selectedStretchId, setSelectedStretchId] = useState<string | null>(stretchParam || null);
  const [activeView, setActiveView] = useState<string>(viewParam);
  
  const navigate = useNavigate();
  
  // Update URL when page, stretch or view changes
  useEffect(() => {
    if (projectName) {
      const newParams = new URLSearchParams();
      
      if (currentPage > 1) {
        newParams.set('page', currentPage.toString());
      }
      
      if (selectedStretchId) {
        newParams.set('stretch', selectedStretchId);
      }
      
      if (activeView !== 'pages') {
        newParams.set('view', activeView);
      }
      
      // Only update if the params are different to avoid unnecessary history entries
      if (searchParams.toString() !== newParams.toString()) {
        setSearchParams(newParams);
      }
    }
  }, [projectName, currentPage, selectedStretchId, activeView, setSearchParams, searchParams]);
  
  // If the URL is malformed, redirect to the main page
  useEffect(() => {
    if (projectName === '') {
      navigate('/admin/prompt-agent');
    }
  }, [projectName, navigate]);
  
  // Safely decode the project name from URL
  const decodedProjectName = projectName ? decodeURIComponent(projectName) : undefined;
  
  // If promptId is "new", we're creating a new prompt
  const isCreatingPrompt = promptId === 'new';
  const isEditingPrompt = !!promptId && promptId !== 'new';
  
  // Handle page navigation
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedStretchId(null); // Clear selected stretch when changing page
  };
  
  // Handle stretch selection
  const handleStretchClick = (stretchId: string) => {
    setSelectedStretchId(stretchId);
  };
  
  // Handle going back from stretch to page
  const handleBackFromStretch = () => {
    setSelectedStretchId(null);
  };
  
  // Handle changing view
  const handleViewChange = (view: string) => {
    setActiveView(view);
    setSelectedStretchId(null); // Clear selected stretch when changing views
  };
  
  return (
    <AdminLayout>
      <div className="container py-6">
        {/* Show project list if no project is selected */}
        {!decodedProjectName && (
          <ProjectList />
        )}
        
        {/* If project is selected but no prompt, show project views */}
        {decodedProjectName && !promptId && (
          <>
            {/* If a stretch is selected, show prompt iterations */}
            {selectedStretchId ? (
              <PromptIterations 
                projectName={decodedProjectName}
                stretchId={selectedStretchId}
                onBack={handleBackFromStretch}
              />
            ) : (
              <>
                {/* Tabs for switching between views */}
                <Tabs 
                  defaultValue={activeView} 
                  onValueChange={handleViewChange}
                  className="mb-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{decodedProjectName} Prompts</h2>
                    <TabsList>
                      <TabsTrigger value="pages" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>Pages</span>
                      </TabsTrigger>
                      <TabsTrigger value="list" className="flex items-center gap-1">
                        <List className="h-4 w-4" />
                        <span>List</span>
                      </TabsTrigger>
                      <TabsTrigger value="stretches" className="flex items-center gap-1">
                        <LayoutGrid className="h-4 w-4" />
                        <span>Stretches</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  {/* Pages View - New grouped by page view */}
                  <TabsContent value="pages" className="mt-0">
                    <PagePromptsView projectName={decodedProjectName} />
                  </TabsContent>
                  
                  {/* List View - Original flat list view */}
                  <TabsContent value="list" className="mt-0">
                    <PromptList projectName={decodedProjectName} />
                  </TabsContent>
                  
                  {/* Stretches View - Our stretch-based organization */}
                  <TabsContent value="stretches" className="mt-0">
                    <div>
                      <PageNavigation 
                        projectName={decodedProjectName}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                      />
                      
                      <StretchList 
                        projectName={decodedProjectName}
                        pageNumber={currentPage}
                        onStretchClick={handleStretchClick}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </>
        )}
        
        {/* Show prompt form for creating/editing */}
        {decodedProjectName && isCreatingPrompt && (
          <PromptForm 
            projectName={decodedProjectName} 
            stretchId={searchParams.get('stretch') || undefined}
            pageName={searchParams.get('page') || undefined}
          />
        )}
        
        {decodedProjectName && isEditingPrompt && (
          <PromptForm 
            projectName={decodedProjectName} 
            promptId={promptId} 
            isEditing={true} 
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default PromptAgentPage; 