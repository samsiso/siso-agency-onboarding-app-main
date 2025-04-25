
import { Card } from '@/components/ui/card';
import { useFeatures } from '@/hooks/useFeatures';
import { FeatureCard } from '../features/FeatureCard';
import { FeatureDetailsModal } from '../features/FeatureDetailsModal';
import { FeatureControls } from '../features/FeatureControls';
import { FeatureLoadingState } from '../features/FeatureLoadingState';
import { FeatureErrorState } from '../features/FeatureErrorState';
import { FeatureRequestInput } from '../features/FeatureRequestInput';
import { MessageSquare, CheckCircle, Circle, Activity, Zap, Shield, Coins, Users } from 'lucide-react';
import { useState } from 'react';

export function FeatureRequestsSection() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const { 
    features, 
    isLoading,
    error,
    selectedFeature, 
    handleViewFeatureDetails, 
    handleCloseFeatureDetails,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    handleRetry
  } = useFeatures();

  // Calculate metrics
  const getStatusMetrics = () => {
    if (!features || features.length === 0) return { total: 0, pending: 0, inProgress: 0, completed: 0 };
    
    return {
      total: features.length,
      pending: features.filter(f => f.status === 'pending').length,
      inProgress: features.filter(f => f.status === 'in_progress').length,
      completed: features.filter(f => f.status === 'completed').length
    };
  };
  
  const metrics = getStatusMetrics();
  
  // Calculate total cost
  const totalCost = features?.reduce((sum, feature) => sum + feature.estimated_cost, 0) || 0;

  // Calculate feature categories
  const getCategoryCounts = () => {
    if (!features || features.length === 0) return { trading: 0, security: 0, staking: 0, community: 0 };
    
    return {
      trading: features.filter(f => {
        const title = f.title.toLowerCase();
        return title.includes('wallet') || title.includes('trading') || title.includes('transaction') || title.includes('market');
      }).length,
      security: features.filter(f => {
        const title = f.title.toLowerCase();
        return title.includes('smart contract') || title.includes('2fa') || title.includes('security') || title.includes('kyc') || title.includes('ddos');
      }).length,
      staking: features.filter(f => {
        const title = f.title.toLowerCase();
        return title.includes('staking') || title.includes('token') || title.includes('interest') || title.includes('compound');
      }).length,
      community: features.filter(f => {
        const title = f.title.toLowerCase();
        return title.includes('referral') || title.includes('community') || title.includes('social') || title.includes('engagement') || title.includes('education');
      }).length
    };
  };
  
  const categoryCounts = getCategoryCounts();

  // Filter features based on category
  const filteredFeatures = features?.filter(feature => {
    if (!categoryFilter) return true;
    
    const title = feature.title.toLowerCase();
    switch (categoryFilter) {
      case 'trading':
        return title.includes('wallet') || title.includes('trading') || title.includes('transaction') || title.includes('market');
      case 'security':
        return title.includes('smart contract') || title.includes('2fa') || title.includes('security') || title.includes('kyc') || title.includes('ddos');
      case 'staking':
        return title.includes('staking') || title.includes('token') || title.includes('interest') || title.includes('compound');
      case 'community':
        return title.includes('referral') || title.includes('community') || title.includes('social') || title.includes('engagement') || title.includes('education');
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6 bg-black/30 border-siso-text/10">
        <FeatureLoadingState />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-black/30 border-siso-text/10">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-white">Project Features</h3>
          <MessageSquare className="w-5 h-5 text-[#9b87f5]" />
        </div>
        <FeatureErrorState 
          message={`Error loading features: ${error instanceof Error ? error.message : 'Unknown error'}`}
          onRetry={handleRetry}
        />
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-black/30 border-siso-text/10">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-white">UbahCryp Features</h3>
          <MessageSquare className="w-5 h-5 text-[#9b87f5]" />
        </div>
      </div>
      
      {/* Feature Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/20 rounded-lg p-4 border border-siso-text/10">
          <p className="text-sm text-gray-400 mb-1">Total Features</p>
          <p className="text-2xl font-bold text-white">{metrics.total}</p>
        </div>
        <div className="bg-black/20 rounded-lg p-4 border border-siso-text/10">
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
            <Circle className="w-3 h-3" /> 
            <span>Pending</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.pending}</p>
        </div>
        <div className="bg-black/20 rounded-lg p-4 border border-siso-text/10">
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
            <Activity className="w-3 h-3 text-blue-400" /> 
            <span>In Progress</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.inProgress}</p>
        </div>
        <div className="bg-black/20 rounded-lg p-4 border border-siso-text/10">
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
            <CheckCircle className="w-3 h-3 text-green-400" /> 
            <span>Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.completed}</p>
        </div>
      </div>
      
      {/* Feature Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/20 rounded-lg p-4 border border-siso-text/10">
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
            <Zap className="w-3 h-3 text-blue-400" /> 
            <span>Trading & Transactions</span>
          </div>
          <p className="text-2xl font-bold text-white">{categoryCounts.trading}</p>
        </div>
        <div className="bg-black/20 rounded-lg p-4 border border-siso-text/10">
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
            <Shield className="w-3 h-3 text-purple-400" /> 
            <span>Security & Trust</span>
          </div>
          <p className="text-2xl font-bold text-white">{categoryCounts.security}</p>
        </div>
        <div className="bg-black/20 rounded-lg p-4 border border-siso-text/10">
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
            <Coins className="w-3 h-3 text-amber-400" /> 
            <span>Staking & Earning</span>
          </div>
          <p className="text-2xl font-bold text-white">{categoryCounts.staking}</p>
        </div>
        <div className="bg-black/20 rounded-lg p-4 border border-siso-text/10">
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
            <Users className="w-3 h-3 text-green-400" /> 
            <span>Community & Engagement</span>
          </div>
          <p className="text-2xl font-bold text-white">{categoryCounts.community}</p>
        </div>
      </div>
      
      {/* Feature Controls */}
      <div className="mb-6">
        <FeatureControls 
          filter={filter} 
          setFilter={setFilter} 
          sortBy={sortBy} 
          setSortBy={setSortBy}
          hasError={!!error}
          onRetry={handleRetry}
          isLoading={isLoading}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredFeatures && filteredFeatures.length > 0 ? (
          filteredFeatures.map(feature => (
            <FeatureCard 
              key={feature.id} 
              feature={feature} 
              onViewDetails={handleViewFeatureDetails} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 bg-black/20 rounded-lg border border-siso-text/10">
            <p className="text-gray-400">
              {filter !== 'all' || categoryFilter 
                ? 'No features match the current filters. Try changing your filter.'
                : 'No features have been added yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Total Cost Summary */}
      {features && features.length > 0 && (
        <div className="bg-black/20 rounded-lg p-4 border border-siso-text/10 mb-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">Total Estimated Cost:</p>
            <p className="text-xl font-bold text-blue-400">£{totalCost.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Feature Details Modal */}
      <FeatureDetailsModal 
        feature={selectedFeature} 
        onClose={handleCloseFeatureDetails} 
      />

      {/* Feature Request Form */}
      <div className="border-t border-siso-text/10 pt-6">
        <FeatureRequestInput />
      </div>
    </Card>
  );
}
