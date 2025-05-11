import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectDetails } from '@/components/projects/ProjectDetails';

interface ProjectDetailsPageProps {
  tab?: string;
}

export default function ProjectDetailsPage({ tab: propTab }: ProjectDetailsPageProps = {}) {
  const { id, tab: paramTab, documentId } = useParams();
  const activeTab = propTab || paramTab;
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <ProjectDetails initialTab={activeTab} />
      </div>
    </AppLayout>
  );
}
