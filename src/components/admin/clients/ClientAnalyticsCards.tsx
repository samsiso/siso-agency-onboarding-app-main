
import { Card } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { Users, TrendingUp, DollarSign, BarChart } from 'lucide-react';

// We'll define an interface for the analytics props
interface ClientAnalyticsCardsProps {
  activeClients: number;
  pipelineClients: number;
  pipelineValue: number;
  conversionRate: number;
  isLoading?: boolean;
}

export function ClientAnalyticsCards({
  activeClients = 0,
  pipelineClients = 0,
  pipelineValue = 0,
  conversionRate = 0,
  isLoading = false
}: ClientAnalyticsCardsProps) {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Active Clients Card */}
      <Card className="bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Clients</p>
            <h3 className="text-2xl font-bold mt-1">{isLoading ? '—' : formatNumber(activeClients)}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-3 text-xs">
          <span className="text-green-500 font-medium">↑ 12%</span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
        </div>
      </Card>

      {/* Pipeline Clients Card */}
      <Card className="bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pipeline Clients</p>
            <h3 className="text-2xl font-bold mt-1">{isLoading ? '—' : formatNumber(pipelineClients)}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="mt-3 text-xs">
          <span className="text-green-500 font-medium">↑ 7%</span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
        </div>
      </Card>

      {/* Pipeline Value Card */}
      <Card className="bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pipeline Value</p>
            <h3 className="text-2xl font-bold mt-1">{isLoading ? '—' : formatCurrency(pipelineValue)}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="mt-3 text-xs">
          <span className="text-green-500 font-medium">↑ 18%</span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
        </div>
      </Card>

      {/* Conversion Rate Card */}
      <Card className="bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversion Rate</p>
            <h3 className="text-2xl font-bold mt-1">{isLoading ? '—' : `${conversionRate}%`}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <BarChart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <div className="mt-3 text-xs">
          <span className="text-red-500 font-medium">↓ 3%</span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
        </div>
      </Card>
    </div>
  );
}
