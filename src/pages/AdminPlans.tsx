
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, ChevronDown, Download, UserCheck, CheckCircle, AlertCircle, Clock, Eye } from 'lucide-react';

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
}

const AdminPlans = () => {
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
  
  const { toast } = useToast();
  const plansPerPage = 10;
  
  useEffect(() => {
    fetchPlans();
  }, []);
  
  useEffect(() => {
    // Filter and sort plans whenever search query or sort options change
    let results = [...plans];
    
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
  }, [plans, searchQuery, sortBy]);
  
  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setPlans(data || []);
      setFilteredPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: 'Error fetching plans',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
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
  
  const exportToCSV = () => {
    const headers = ['ID', 'App Name', 'Company', 'Username', 'Cost', 'Days', 'Status', 'Created'];
    
    const csvData = filteredPlans.map(plan => [
      plan.id,
      plan.app_name,
      plan.company_name || 'N/A',
      plan.username,
      plan.estimated_cost,
      plan.estimated_days,
      plan.status,
      new Date(plan.created_at).toLocaleDateString()
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
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredPlans.length} plans found
                </span>
              </div>
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
                      <TableCell colSpan={8} className="h-16">
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
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(plan)}
                          className="h-8 px-2"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
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
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AdminPlans;
