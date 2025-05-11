import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, ChevronDown, MessageSquare, CheckCircle, X, AlertTriangle } from 'lucide-react';

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  screen?: string;
  comments?: number;
}

export function FeedbackLogPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample feedback data
  const feedbackItems: FeedbackItem[] = [
    {
      id: 'fb-001',
      title: 'Navigation bar is not responsive on mobile',
      description: 'When viewing on iPhone 12, the navigation menu overlaps with the content.',
      status: 'open',
      priority: 'high',
      date: '2023-09-15',
      author: {
        name: 'Emma Watson',
        avatar: '/avatars/emma.jpg'
      },
      screen: 'Dashboard',
      comments: 3
    },
    {
      id: 'fb-002',
      title: 'Add dark mode toggle in settings',
      description: 'Users want the ability to switch between light and dark themes.',
      status: 'resolved',
      priority: 'medium',
      date: '2023-09-10',
      author: {
        name: 'John Smith',
        avatar: '/avatars/john.jpg'
      },
      screen: 'Settings',
      comments: 5
    },
    {
      id: 'fb-003',
      title: 'Payment form validation issues',
      description: 'Credit card validation is not working properly for American Express cards.',
      status: 'open',
      priority: 'high',
      date: '2023-09-18',
      author: {
        name: 'Alex Johnson',
        avatar: '/avatars/alex.jpg'
      },
      screen: 'Checkout',
      comments: 2
    },
    {
      id: 'fb-004',
      title: 'Loading time too long for image gallery',
      description: 'The image gallery takes more than 5 seconds to load on average connections.',
      status: 'open',
      priority: 'medium',
      date: '2023-09-12',
      author: {
        name: 'Sarah Parker',
        avatar: '/avatars/sarah.jpg'
      },
      screen: 'Gallery',
      comments: 1
    },
    {
      id: 'fb-005',
      title: 'Font size too small in article pages',
      description: 'Many users have reported difficulty reading the content due to small font size.',
      status: 'rejected',
      priority: 'low',
      date: '2023-09-08',
      author: {
        name: 'Mike Brown',
        avatar: '/avatars/mike.jpg'
      },
      screen: 'Blog',
      comments: 4
    }
  ];

  // Filter feedback based on active tab and search query
  const filteredFeedback = feedbackItems.filter(item => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'open' && item.status === 'open') ||
      (activeTab === 'resolved' && item.status === 'resolved') ||
      (activeTab === 'rejected' && item.status === 'rejected');
    
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.screen?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-500">Low</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Feedback Log</h1>
          <p className="text-muted-foreground">Track and manage feedback from stakeholders</p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Feedback
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="bg-black/20 backdrop-blur-sm border border-siso-text/10">
        <CardHeader>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Feedback</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {filteredFeedback.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <p className="mt-2 text-muted-foreground">No feedback entries found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 border border-siso-text/10 rounded-lg hover:bg-siso-text/5 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {getPriorityBadge(item.priority)}
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-siso-orange text-xs flex items-center justify-center">
                        {item.author.name.charAt(0)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.author.name} • {formatDate(item.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.screen && (
                        <Badge variant="outline" className="text-xs">
                          {item.screen}
                        </Badge>
                      )}
                      {item.comments && item.comments > 0 && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {item.comments}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 