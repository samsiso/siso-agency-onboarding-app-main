import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  ChevronDown, 
  Download, 
  UserCheck, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Eye, 
  ExternalLink,
  Layers,
  Globe,
  Users,
  Filter,
  PlusCircle,
  Briefcase
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Plan {
  id: string;
  app_name: string;
  company_name: string | null;
  username: string;
  estimated_cost: number;
  estimated_days: number;
  features: string[];
  status: string;
  created_at: string;
  industry_type?: string;
}

interface IndustryTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  client_count: number;
  icon: string;
}

const industryTemplates: IndustryTemplate[] = [
  { 
    id: '1', 
    name: 'OnlyFans Management', 
    slug: 'onlyfans-management',
    description: 'Complete suite for OnlyFans creator agencies',
    client_count: 3,
    icon: 'users'
  },
  { 
    id: '2', 
    name: 'Digital Marketing Agencies', 
    slug: 'digital-marketing', 
    description: 'Solutions for digital marketing campaign management',
    client_count: 5,
    icon: 'globe'
  },
  { 
    id: '3', 
    name: 'Content Marketing Agencies', 
    slug: 'content-marketing',
    description: 'Content creation and publishing workflows',
    client_count: 2,
    icon: 'file-text'
  },
  { 
    id: '4', 
    name: 'Specialized Niche Agencies', 
    slug: 'specialized-niche',
    description: 'Custom solutions for specialized agency needs',
    client_count: 4,
    icon: 'target'
  },
  { 
    id: '5', 
    name: 'Personal Branding & Coaching Agencies', 
    slug: 'personal-branding',
    description: 'Client management for coaching businesses',
    client_count: 6,
    icon: 'user'
  },
  { 
    id: '6', 
    name: 'E-commerce & Sales Automation', 
    slug: 'ecommerce-sales',
    description: 'Sales pipeline and product management',
    client_count: 3,
    icon: 'shopping-cart'
  },
  { 
    id: '7', 
    name: 'AI Automation Agencies', 
    slug: 'ai-automation',
    description: 'AI-powered workflow automation tools',
    client_count: 1,
    icon: 'cpu'
  },
  { 
    id: '8', 
    name: 'Lead Generation Agencies', 
    slug: 'lead-generation',
    description: 'Lead capture and management systems',
    client_count: 4,
    icon: 'filter'
  },
  { 
    id: '9', 
    name: 'SaaS/Tech Product Agencies', 
    slug: 'saas-tech',
    description: 'Client and product management for tech agencies',
    client_count: 2,
    icon: 'code'
  },
  { 
    id: '10', 
    name: 'Influencer Marketing Agencies', 
    slug: 'influencer-marketing',
    description: 'Influencer campaign and relationship management',
    client_count: 5,
    icon: 'star'
  },
  { 
    id: '11', 
    name: 'Consulting & Strategy Agencies', 
    slug: 'consulting-strategy',
    description: 'Project and client management for consultants',
    client_count: 3,
    icon: 'briefcase'
  }
];

const AdminPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<{field: string; direction: 'asc' | 'desc'}>({
    field: 'created_at',
    direction: 'desc'
  });
  const [activeTab, setActiveTab] = useState<string>("all-plans");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [industryFilteredPlans, setIndustryFilteredPlans] = useState<Plan[]>([]);
  
  const { toast } = useToast();
  const plansPerPage = 10;
  
  useEffect(() => {
    fetchPlans();
  }, []);
  
  useEffect(() => {
    // Filter and sort plans whenever search query or sort options change
    let results = [...plans];
    
    // Apply industry filter if on industry tab
    if (activeTab === "industry-plans" && selectedIndustry) {
      results = results.filter(plan => plan.industry_type === selectedIndustry);
      setIndustryFilteredPlans(results);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(plan => 
        plan.app_name?.toLowerCase().includes(query) ||
        plan.company_name?.toLowerCase().includes(query) ||
        plan.username.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    results.sort((a: Plan, b: Plan) => {
      const fieldA = a[sortBy.field as keyof Plan];
      const fieldB = b[sortBy.field as keyof Plan];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortBy.direction === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      } else if (fieldA instanceof Date && fieldB instanceof Date) {
        return sortBy.direction === 'asc'
          ? fieldA.getTime() - fieldB.getTime()
          : fieldB.getTime() - fieldA.getTime();
      } else {
        // For numeric or other types
        if (fieldA < fieldB) return sortBy.direction === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortBy.direction === 'asc' ? 1 : -1;
        return 0;
      }
    });
    
    setFilteredPlans(results);
  }, [plans, searchQuery, sortBy, activeTab, selectedIndustry]);
  
  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, we'd fetch from the database
      // For now, we'll mock the industry_type in our results
      setTimeout(() => {
        const mockData: Plan[] = [
          {
            id: '1',
            app_name: 'Decora OnlyFans Suite',
            company_name: 'Decora Agency',
            username: 'decora',
            estimated_cost: 4997,
            estimated_days: 14,
            features: ['Content Management', 'Analytics Dashboard', 'Client Portal'],
            status: 'completed',
            created_at: '2024-03-01T12:00:00Z',
            industry_type: 'onlyfans-management'
          },
          {
            id: '2',
            app_name: 'SocialBoost Marketing Hub',
            company_name: 'SocialBoost Media',
            username: 'socialboost',
            estimated_cost: 3997,
            estimated_days: 21,
            features: ['Campaign Management', 'Analytics', 'Client Reporting'],
            status: 'in_progress',
            created_at: '2024-03-15T12:00:00Z',
            industry_type: 'digital-marketing'
          },
          {
            id: '3',
            app_name: 'ContentFlow Studio',
            company_name: 'ContentFlow Agency',
            username: 'contentflow',
            estimated_cost: 2997,
            estimated_days: 10,
            features: ['Editorial Calendar', 'Asset Management', 'Publishing Tools'],
            status: 'pending',
            created_at: '2024-04-01T12:00:00Z',
            industry_type: 'content-marketing'
          },
          {
            id: '4',
            app_name: 'CreatorPro Portal',
            company_name: 'Stellar Creators',
            username: 'stellarcreators',
            estimated_cost: 4500,
            estimated_days: 16,
            features: ['Content Management', 'Collaboration Tools', 'Analytics'],
            status: 'in_progress',
            created_at: '2024-03-25T12:00:00Z',
            industry_type: 'onlyfans-management'
          },
          {
            id: '5',
            app_name: 'LeadGen Pro',
            company_name: 'LeadGen Solutions',
            username: 'leadgen',
            estimated_cost: 3750,
            estimated_days: 14,
            features: ['Lead Capture', 'CRM Integration', 'Analytics'],
            status: 'pending',
            created_at: '2024-04-10T12:00:00Z',
            industry_type: 'lead-generation'
          }
        ];
        
        setPlans(mockData);
        setFilteredPlans(mockData);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: 'Error fetching plans',
        description: 'Please try again later',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  const handleSort = (field: string) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleViewDetails = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDetailOpen(true);
  };
  
  const handleViewPlan = () => {
    navigate('/decora-plan', { replace: true });
  };
  
  const handleViewPlanFromDetails = () => {
    setIsDetailOpen(false);
    navigate('/decora-plan', { replace: true });
  };

  const handleIndustrySelect = (industry: string | null) => {
    setSelectedIndustry(industry);
    setCurrentPage(1);
  };
  
  const exportToCSV = () => {
    const headers = ['ID', 'App Name', 'Company', 'Username', 'Cost', 'Days', 'Status', 'Created', 'Industry'];
    
    const csvData = filteredPlans.map(plan => [
      plan.id,
      plan.app_name,
      plan.company_name || 'N/A',
      plan.username,
      plan.estimated_cost,
      plan.estimated_days,
      plan.status,
      new Date(plan.created_at).toLocaleDateString(),
      plan.industry_type || 'N/A'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `plans_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getIndustryClientCount = (industrySlug: string) => {
    return plans.filter(plan => plan.industry_type === industrySlug).length;
  };

  const handleCreateNewPlan = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The ability to create new plans will be available soon.",
    });
  };

  const handleCreateNewIndustryTemplate = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The ability to create new industry templates will be available soon.",
    });
  };
  
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * plansPerPage,
    currentPage * plansPerPage
  );
  
  const totalPages = Math.ceil(filteredPlans.length / plansPerPage);
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'users': return <Users className="h-5 w-5" />;
      case 'globe': return <Globe className="h-5 w-5" />;
      case 'briefcase': return <Briefcase className="h-5 w-5" />;
      case 'layers': return <Layers className="h-5 w-5" />;
      default: return <Briefcase className="h-5 w-5" />;
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard: Plans</h1>
          
          <div className="flex gap-2">
            <Button 
              onClick={exportToCSV}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all-plans" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-card border">
            <TabsTrigger value="all-plans" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Plans
            </TabsTrigger>
            <TabsTrigger value="industry-templates" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Industry Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-plans">
            <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search plans..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={selectedIndustry || 'all'} onValueChange={(value) => handleIndustrySelect(value === 'all' ? null : value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Industries" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Industries</SelectItem>
                          {industryTemplates.map((industry) => (
                            <SelectItem key={industry.id} value={industry.slug}>{industry.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      variant="default"
                      size="sm"
                      onClick={handleCreateNewPlan}
                      className="whitespace-nowrap"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      New Plan
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <span>{filteredPlans.length} plans found</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('app_name')}
                      >
                        <div className="flex items-center gap-1">
                          App Name
                          {sortBy.field === 'app_name' && (
                            <ChevronDown 
                              className={`h-4 w-4 ${sortBy.direction === 'desc' ? 'rotate-180' : ''}`} 
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('company_name')}
                      >
                        <div className="flex items-center gap-1">
                          Company
                          {sortBy.field === 'company_name' && (
                            <ChevronDown 
                              className={`h-4 w-4 ${sortBy.direction === 'desc' ? 'rotate-180' : ''}`} 
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead 
                        className="text-right cursor-pointer"
                        onClick={() => handleSort('estimated_cost')}
                      >
                        <div className="flex items-center gap-1 justify-end">
                          Est. Cost
                          {sortBy.field === 'estimated_cost' && (
                            <ChevronDown 
                              className={`h-4 w-4 ${sortBy.direction === 'desc' ? 'rotate-180' : ''}`} 
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Timeline</TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          {sortBy.field === 'status' && (
                            <ChevronDown 
                              className={`h-4 w-4 ${sortBy.direction === 'desc' ? 'rotate-180' : ''}`} 
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('created_at')}
                      >
                        <div className="flex items-center gap-1">
                          Created
                          {sortBy.field === 'created_at' && (
                            <ChevronDown 
                              className={`h-4 w-4 ${sortBy.direction === 'desc' ? 'rotate-180' : ''}`} 
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={9} className="h-16">
                            <div className="w-full h-4 bg-muted rounded animate-pulse" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : paginatedPlans.length > 0 ? (
                      paginatedPlans.map((plan, index) => (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">
                            {(currentPage - 1) * plansPerPage + index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {plan.app_name || 'Unnamed'}
                          </TableCell>
                          <TableCell>{plan.company_name || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-blue-500" />
                              {plan.username}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {plan.industry_type?.replace('-', ' ') || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            ${plan.estimated_cost}
                          </TableCell>
                          <TableCell className="text-right">
                            {plan.estimated_days} days
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(plan.status)}
                              <span className="capitalize">{plan.status.replace('_', ' ')}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(plan.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewDetails(plan)}
                                className="h-8 px-2"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleViewPlan}
                                className="h-8 px-2"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Plan
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No plans found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {filteredPlans.length > plansPerPage && (
                <div className="p-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5) {
                          if (currentPage > 3 && currentPage < totalPages - 1) {
                            pageNum = currentPage - 2 + i;
                          } else if (currentPage >= totalPages - 1) {
                            pageNum = totalPages - 4 + i;
                          }
                        }
                        
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(pageNum);
                              }}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="industry-templates">
            <div className="bg-card border rounded-lg shadow-sm p-4 mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Industry Templates</h3>
                <p className="text-sm text-muted-foreground">Manage base templates for each industry type</p>
              </div>
              <Button onClick={handleCreateNewIndustryTemplate}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {industryTemplates.map((industry) => (
                <Card key={industry.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-primary/10 rounded-md">
                          {getIconComponent(industry.icon)}
                        </div>
                        <CardTitle>{industry.name}</CardTitle>
                      </div>
                      <Badge variant="outline">
                        {getIndustryClientCount(industry.slug)} clients
                      </Badge>
                    </div>
                    <CardDescription>{industry.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pain Points:</span>
                        <span>5 defined</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Features:</span>
                        <span>12 available</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Case Studies:</span>
                        <span>3 published</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex justify-between w-full">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleIndustrySelect(industry.slug)}>
                        <Users className="h-4 w-4 mr-2" />
                        View Clients
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Plan Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Plan Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected plan
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
                  <div className="bg-muted/50 p-4 rounded-md space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">App Name:</span>
                      <p className="font-medium">{selectedPlan.app_name || 'Unnamed App'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Company:</span>
                      <p className="font-medium">{selectedPlan.company_name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Username:</span>
                      <p className="font-medium">{selectedPlan.username}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Industry Type:</span>
                      <p className="font-medium capitalize">{selectedPlan.industry_type?.replace('-', ' ') || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Cost & Timeline</h3>
                  <div className="bg-muted/50 p-4 rounded-md space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Estimated Cost:</span>
                      <p className="font-medium">${selectedPlan.estimated_cost}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Estimated Days:</span>
                      <p className="font-medium">{selectedPlan.estimated_days} days</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedPlan.status)}
                        <p className="font-medium capitalize">{selectedPlan.status.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Selected Features</h3>
                <div className="bg-muted/50 p-4 rounded-md">
                  {selectedPlan.features && selectedPlan.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No features selected</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(selectedPlan.created_at).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={handleViewPlanFromDetails} className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Plan
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AdminPlans;
