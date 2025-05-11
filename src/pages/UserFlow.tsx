import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import UserFlowPage from './projects/UserFlowPage';

export default function UserFlow() {
  const { projectId } = useParams<{ projectId: string }>();
  
  return (
    <AppLayout>
      <UserFlowPage />
    </AppLayout>
  );
}
