import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, MessageSquare, Filter } from 'lucide-react';
import { AddFeedbackDialog } from './feedback/AddFeedbackDialog';
import { FeedbackEntryCard } from './feedback/FeedbackEntryCard';
import { AnimatedCard } from '@/components/ui/animated-card';
import { feedbackData } from './feedback/sampleFeedbackData';

type FeedbackType = 'all' | 'feature' | 'bug' | 'ui' | 'performance' | 'other';
type FeedbackStatus = 'all' | 'new' | 'in-progress' | 'implemented' | 'rejected';
type FeedbackPriority = 'all' | 'low' | 'medium' | 'high';
type SortOption = 'newest' | 'oldest' | 'priority-high' | 'priority-low';

interface FeedbackEntry {
  id: string;
  source: string;
  date: string;
  type: Exclude<FeedbackType, 'all'>;
  status: Exclude<FeedbackStatus, 'all'>;
  priority: Exclude<FeedbackPriority, 'all'>;
  title: string;
  description: string;
  response?: string;
}

export function FeedbackLogSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<FeedbackType>('all');
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<FeedbackPriority>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>(feedbackData);

  // Filter and sort logic
  const filteredFeedback = feedbackEntries
    .filter(entry => {
      const matchesType = typeFilter === 'all' || entry.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || entry.priority === priorityFilter;
      const matchesSearch = 
        searchQuery === '' || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.source.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesType && matchesStatus && matchesPriority && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'priority-high':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'priority-low':
          const priorityOrderReverse = { high: 1, medium: 2, low: 3 };
          return priorityOrderReverse[b.priority] - priorityOrderReverse[a.priority];
        default:
          return 0;
      }
    });

  const addFeedbackEntry = (newEntry: FeedbackEntry) => {
    setFeedbackEntries(prev => [newEntry, ...prev]);
  };

  const updateFeedbackEntry = (updatedEntry: FeedbackEntry) => {
    setFeedbackEntries(prev => 
      prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry)
    );
  };

  return (
    <div className="space-y-6">
      <AnimatedCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Feedback Log</h2>
            <p className="text-gray-400">Track and manage feedback for your project</p>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-600/90 hover:to-violet-600/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Feedback
          </Button>
        </div>

        {/* Filters and search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search feedback..."
              className="pl-9 bg-black/20 border-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={typeFilter} onValueChange={(value: FeedbackType) => setTypeFilter(value)}>
            <SelectTrigger className="bg-black/20 border-gray-800">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-gray-500" />
                <span>{typeFilter === 'all' ? 'Type: All' : `Type: ${typeFilter}`}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="feature">Feature Request</SelectItem>
              <SelectItem value="bug">Bug Report</SelectItem>
              <SelectItem value="ui">UI/UX Feedback</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={(value: FeedbackStatus) => setStatusFilter(value)}>
            <SelectTrigger className="bg-black/20 border-gray-800">
              <span>{statusFilter === 'all' ? 'Status: All' : `Status: ${statusFilter}`}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="implemented">Implemented</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={(value: FeedbackPriority) => setPriorityFilter(value)}>
            <SelectTrigger className="bg-black/20 border-gray-800">
              <span>{priorityFilter === 'all' ? 'Priority: All' : `Priority: ${priorityFilter}`}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
            <SelectTrigger className="bg-black/20 border-gray-800">
              <span>Sort: {getSortLabel(sortOption)}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="priority-high">Highest Priority</SelectItem>
              <SelectItem value="priority-low">Lowest Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-black/30 rounded-lg border border-gray-800 p-3">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Total Feedback</h3>
            <p className="text-2xl font-bold text-white">{feedbackEntries.length}</p>
          </div>
          <div className="bg-black/30 rounded-lg border border-gray-800 p-3">
            <h3 className="text-sm font-medium text-gray-400 mb-1">New</h3>
            <p className="text-2xl font-bold text-emerald-500">
              {feedbackEntries.filter(entry => entry.status === 'new').length}
            </p>
          </div>
          <div className="bg-black/30 rounded-lg border border-gray-800 p-3">
            <h3 className="text-sm font-medium text-gray-400 mb-1">In Progress</h3>
            <p className="text-2xl font-bold text-amber-500">
              {feedbackEntries.filter(entry => entry.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-black/30 rounded-lg border border-gray-800 p-3">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Implemented</h3>
            <p className="text-2xl font-bold text-indigo-500">
              {feedbackEntries.filter(entry => entry.status === 'implemented').length}
            </p>
          </div>
        </div>
      </AnimatedCard>

      {/* Feedback entries */}
      <div className="space-y-4">
        {filteredFeedback.length === 0 ? (
          <div className="bg-black/20 border border-gray-800 rounded-lg p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No feedback found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all'
                ? "No feedback matches your filters. Try adjusting your search criteria."
                : "There's no feedback yet. Add your first feedback entry."}
            </p>
            {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' ? (
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}>
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => setIsDialogOpen(true)}>
                Add First Feedback
              </Button>
            )}
          </div>
        ) : (
          filteredFeedback.map((entry) => (
            <FeedbackEntryCard 
              key={entry.id} 
              entry={entry}
              onUpdate={updateFeedbackEntry}
            />
          ))
        )}
      </div>

      <AddFeedbackDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddFeedback={addFeedbackEntry}
      />
    </div>
  );
}

function getSortLabel(sortOption: SortOption): string {
  switch (sortOption) {
    case 'newest': return 'Newest First';
    case 'oldest': return 'Oldest First';
    case 'priority-high': return 'Highest Priority';
    case 'priority-low': return 'Lowest Priority';
    default: return 'Newest First';
  }
} 