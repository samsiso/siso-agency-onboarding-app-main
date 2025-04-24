
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectDetails } from '@/components/projects/ProjectDetails';

export default function ProjectDetailsPage() {
  const { id, tab } = useParams();
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <ProjectDetails />
      </div>
    </AppLayout>
  );
}
