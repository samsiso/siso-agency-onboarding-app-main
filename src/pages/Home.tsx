
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { useUser } from '@/hooks/useUser';

export default function Home() {
  const { user, loading } = useUser();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black/40 backdrop-blur-md rounded-lg border border-siso-text/10 shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gradient-to-r from-siso-red to-siso-orange mb-4">
            Welcome to Your Dashboard
          </h1>
          
          {loading ? (
            <div className="animate-pulse bg-gray-700/50 h-10 w-1/3 rounded mb-4"></div>
          ) : (
            <p className="text-siso-text mb-6">
              Hello, {user?.email ? user.email.split('@')[0] : 'User'}! Your OnlyFans Management Platform is ready.
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <DashboardCard 
              title="Content Management" 
              description="Manage your OnlyFans content schedule and posts."
              icon="📸"
            />
            <DashboardCard 
              title="Creator Analytics" 
              description="Track earnings, views, and engagement metrics."
              icon="📊"
            />
            <DashboardCard 
              title="Subscription Management" 
              description="Keep track of your subscribers and their activity."
              icon="👥"
            />
            <DashboardCard 
              title="Messaging" 
              description="Engage with your fans through private messages."
              icon="💬"
            />
            <DashboardCard 
              title="Financial Reports" 
              description="Track revenue, expenses, and overall profitability."
              icon="💰"
            />
            <DashboardCard 
              title="Support" 
              description="Get help with platform features and management."
              icon="🛟"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
}

function DashboardCard({ title, description, icon }: DashboardCardProps) {
  return (
    <div className="bg-black/30 border border-siso-text/10 rounded-lg p-6 transition-all duration-300 hover:border-siso-orange/50 hover:shadow-lg">
      <div className="flex items-start">
        <div className="text-4xl mr-4">{icon}</div>
        <div>
          <h3 className="font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-siso-text">{description}</p>
        </div>
      </div>
    </div>
  );
}
