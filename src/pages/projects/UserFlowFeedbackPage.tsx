import React from 'react';
import { useParams } from 'react-router-dom';
import { ProjectHeader } from '@/components/projects/details/ProjectHeader';
import { ProjectCardNavigation } from '@/components/projects/details/ProjectCardNavigation';
import { UserFlowNavigation } from '@/components/projects/userflow/UserFlowNavigation';
import { FeedbackLogPage } from '@/components/projects/userflow/feedback/FeedbackLogPage';

export default function UserFlowFeedbackPage() {
  const { projectId = '123' } = useParams<{ projectId: string }>();
  
  // Mock project data - this would come from an API in a real app
  const projectData = {
    name: 'UbahCrypt Project',
    description: 'A revolutionary blockchain-based cryptocurrency platform with enhanced security features and cross-chain capabilities.',
    status: 'ACTIVE',
    created_at: '2025-04-01T10:00:00Z',
  };
  
  return (
    <>
      {/* Project Header */}
      <ProjectHeader 
        name={projectData.name} 
        description={projectData.description} 
        status={projectData.status} 
        created_at={projectData.created_at} 
      />
      
      {/* Project Card Navigation */}
      <ProjectCardNavigation projectId={projectId} />
      
      {/* User Flow Navigation */}
      <UserFlowNavigation 
        projectId={projectId}
        projectName="Agency Onboarding App"
        status="draft"
      />
      
      {/* Feedback Log Content */}
      <div className="container mx-auto pb-12">
        <FeedbackLogPage />
      </div>
    </>
  );
} 