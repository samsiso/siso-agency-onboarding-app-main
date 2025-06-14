import React, { useState } from 'react';
import { 
  Clock, 
  Rocket, 
  CheckCircle, 
  Star, 
  Mail,
  Calendar,
  BarChart3,
  Users,
  FileText,
  Zap
} from 'lucide-react';

const upcomingFeatures = [
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Deep insights into your referral performance',
    status: 'In Development',
    eta: 'March 2025'
  },
  {
    icon: Users,
    title: 'Client Management',
    description: 'Track and manage your referred clients',
    status: 'Coming Soon',
    eta: 'April 2025'
  },
  {
    icon: FileText,
    title: 'Resource Library',
    description: 'Sales materials and training resources',
    status: 'Planned',
    eta: 'May 2025'
  },
  {
    icon: Zap,
    title: 'Automated Workflows',
    description: 'Streamline your referral process',
    status: 'Planned',
    eta: 'June 2025'
  }
];

export function ComingSoonSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBetaSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      // TODO: Implement actual beta signup logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubscribed(true);
    } catch (error) {
      console.error('Beta signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-orange-600/20 p-2 rounded-lg">
            <Rocket className="h-5 w-5 text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold text-white">Partner Dashboard - Coming Soon</h2>
        </div>
        <p className="text-gray-400">
          We're building an amazing partner experience. Get early access to new features!
        </p>
      </div>

      {/* Development Progress */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Development Progress</h3>
          <div className="flex items-center space-x-2 text-sm text-orange-500">
            <Clock className="h-4 w-4" />
            <span>Launch: Q2 2025</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Overall Progress</span>
            <span className="text-white font-medium">25%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: '25%' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-sm text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span>Authentication System</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span>Basic Dashboard Layout</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-orange-500">
            <Clock className="h-4 w-4" />
            <span>Commission Tracking</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-orange-500">
            <Clock className="h-4 w-4" />
            <span>Client Management</span>
          </div>
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Upcoming Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-600/20 p-2 rounded-lg flex-shrink-0">
                    <Icon className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{feature.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{feature.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-orange-500">{feature.status}</span>
                      <span className="text-xs text-gray-400">{feature.eta}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Beta Access Form */}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-medium text-white">Get Early Access</h3>
        </div>
        
        {isSubscribed ? (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">You're on the beta list!</span>
            </div>
            <p className="text-sm text-green-300 mt-1">
              We'll notify you when new features become available.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBetaSignup} className="space-y-4">
            <p className="text-gray-400 text-sm">
              Be the first to access new partner features and provide feedback.
            </p>
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Join Beta'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 