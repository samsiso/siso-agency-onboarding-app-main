import { AppLayout } from '@/components/layout/AppLayout';

export default function TimelinePage() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-4">Timeline Page</h1>
        <p className="text-white/70">This is the Timeline page that should display when clicking "Timeline" in the sidebar.</p>
      </div>
    </AppLayout>
  );
} 