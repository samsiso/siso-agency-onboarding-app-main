import { AppLayout } from '@/components/layout/AppLayout';

export default function TasksPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-4">Tasks Page</h1>
        <p className="text-white/70">This is the Tasks page that should display when clicking "Active Tasks" in the sidebar.</p>
      </div>
    </AppLayout>
  );
} 