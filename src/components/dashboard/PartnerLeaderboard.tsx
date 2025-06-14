import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  earnings: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  deals: number;
  isCurrentUser?: boolean;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Sarah Johnson", earnings: 4500, tier: "Platinum", deals: 18 },
  { rank: 2, name: "Mike Chen", earnings: 3200, tier: "Gold", deals: 12 },
  { rank: 3, name: "Emma Davis", earnings: 2800, tier: "Gold", deals: 10 },
  { rank: 4, name: "James Wilson", earnings: 2100, tier: "Silver", deals: 8 },
  { rank: 5, name: "Lisa Garcia", earnings: 1900, tier: "Silver", deals: 7 },
  { rank: 6, name: "You", earnings: 0, tier: "Bronze", deals: 0, isCurrentUser: true },
  { rank: 7, name: "Tom Anderson", earnings: 1200, tier: "Bronze", deals: 5 },
  { rank: 8, name: "Maria Rodriguez", earnings: 950, tier: "Bronze", deals: 4 },
];

type TimeFilter = 'monthly' | 'quarterly' | 'yearly';

export function PartnerLeaderboard() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('monthly');
  const [showAnonymous, setShowAnonymous] = useState(false);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-orange-400" />;
      default: return <span className="text-sm font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'text-purple-400 bg-purple-400/20';
      case 'Gold': return 'text-yellow-400 bg-yellow-400/20';
      case 'Silver': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-orange-400 bg-orange-400/20';
    }
  };

  const getTierBadge = (tier: string) => {
    const colorClass = getTierColor(tier);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {tier}
      </span>
    );
  };

  const getDisplayName = (entry: LeaderboardEntry) => {
    if (showAnonymous && !entry.isCurrentUser) {
      return `Partner #${entry.rank}`;
    }
    return entry.name;
  };

  const filteredData = mockLeaderboard.slice(0, 8); // Show top 8

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-white">Leaderboard</h2>
          </div>
          <button
            onClick={() => setShowAnonymous(!showAnonymous)}
            className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showAnonymous ? 'Show Names' : 'Anonymous'}</span>
          </button>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
          {(['monthly', 'quarterly', 'yearly'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                timeFilter === filter
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="p-6">
        <div className="space-y-3">
          {filteredData.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                entry.isCurrentUser 
                  ? 'bg-orange-600/20 border border-orange-600/30' 
                  : 'bg-gray-700/50 hover:bg-gray-700/70'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${
                      entry.isCurrentUser ? 'text-orange-300' : 'text-white'
                    }`}>
                      {getDisplayName(entry)}
                    </span>
                    {entry.isCurrentUser && (
                      <span className="text-xs text-orange-400">(You)</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    {getTierBadge(entry.tier)}
                    <span className="text-xs text-gray-400">
                      {entry.deals} deals
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`font-bold ${
                  entry.isCurrentUser ? 'text-orange-300' : 'text-white'
                }`}>
                  £{entry.earnings.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">
                  {timeFilter.slice(0, -2)} earnings
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current User Rank (if not in top 8) */}
        {!filteredData.some(entry => entry.isCurrentUser) && (
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="text-center text-sm text-gray-400 mb-3">Your Position</div>
            <div className="flex items-center justify-between p-4 bg-orange-600/20 border border-orange-600/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 flex justify-center">
                  <span className="text-sm font-bold text-orange-400">#15</span>
                </div>
                <div>
                  <div className="font-medium text-orange-300">You</div>
                  <div className="flex items-center space-x-2 mt-1">
                    {getTierBadge('Bronze')}
                    <span className="text-xs text-gray-400">0 deals</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-orange-300">£0</div>
                <div className="text-xs text-gray-400">monthly earnings</div>
              </div>
            </div>
          </div>
        )}

        {/* Tier Information */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h3 className="text-sm font-medium text-white mb-3">Partner Tiers</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-gray-400">Bronze: £0-£999</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-400">Silver: £1K-£2.5K</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-400">Gold: £2.5K-£5K</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-gray-400">Platinum: £5K+</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <button className="flex items-center justify-center w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium transition-colors">
            <TrendingUp className="h-4 w-4 mr-2" />
            Start Earning Today
          </button>
        </div>
      </div>
    </div>
  );
} 