
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInstagramLeads } from '@/hooks/useInstagramLeads';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  User, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Phone, 
  FileText, 
  Edit, 
  Search,
  TrendingUp,
  Calendar 
} from 'lucide-react';
import { toast } from "sonner";
import { formatCompactNumber } from '@/lib/formatters';

interface OutreachStats {
  total: number;
  contacted: number;
  converted: number;
  pending: number;
  conversionRate: number;
}

const AdminOutreach = () => {
  const [activeTab, setActiveTab] = useState('leads-overview');
  const [searchQuery, setSearchQuery] = useState('');
  const { leads, isLoading, refetch, addLead } = useInstagramLeads(100);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      await addLead.mutateAsync({ username: searchQuery });
      setSearchQuery('');
      toast.success('Lead added successfully');
    } catch (error) {
      toast.error('Failed to add lead');
    }
  };

  const stats: OutreachStats = React.useMemo(() => {
    const total = leads.length;
    const contacted = leads.filter(lead => lead.status === 'contacted').length;
    const converted = leads.filter(lead => lead.status === 'converted').length;
    const pending = leads.filter(lead => lead.status === 'new').length;
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
    
    return {
      total,
      contacted,
      converted,
      pending,
      conversionRate
    };
  }, [leads]);

  const filteredLeads = React.useMemo(() => {
    if (!searchQuery) return leads;
    
    return leads.filter(lead => 
      lead.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.full_name && lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [leads, searchQuery]);

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Outreach Management</h1>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="mb-6">
            <TabsTrigger value="leads-overview">Leads Overview</TabsTrigger>
            <TabsTrigger value="lead-management">Lead Management</TabsTrigger>
            <TabsTrigger value="outreach-campaigns">Outreach Campaigns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads-overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-900/10 to-blue-900/5">
                <CardContent className="p-6 flex flex-col">
                  <div className="text-blue-400 mb-2">
                    <User className="h-6 w-6" />
                  </div>
                  <p className="text-muted-foreground text-sm">Total Leads</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-900/10 to-amber-900/5">
                <CardContent className="p-6 flex flex-col">
                  <div className="text-amber-400 mb-2">
                    <Mail className="h-6 w-6" />
                  </div>
                  <p className="text-muted-foreground text-sm">Contacted</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.contacted}</h3>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-900/10 to-green-900/5">
                <CardContent className="p-6 flex flex-col">
                  <div className="text-green-400 mb-2">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <p className="text-muted-foreground text-sm">Converted</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.converted}</h3>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-900/10 to-purple-900/5">
                <CardContent className="p-6 flex flex-col">
                  <div className="text-purple-400 mb-2">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <p className="text-muted-foreground text-sm">Conversion Rate</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.conversionRate}%</h3>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Leads</h2>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('lead-management')}
                >
                  View All Leads
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Followers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          Loading leads...
                        </TableCell>
                      </TableRow>
                    ) : leads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          No leads found. Add your first lead.
                        </TableCell>
                      </TableRow>
                    ) : (
                      leads.slice(0, 5).map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>@{lead.username}</TableCell>
                          <TableCell>{lead.full_name || '-'}</TableCell>
                          <TableCell>
                            {lead.followers_count 
                              ? formatCompactNumber(lead.followers_count) 
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(lead.status)}
                          </TableCell>
                          <TableCell>
                            {new Date(lead.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="lead-management">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold">Lead Management</h2>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <form onSubmit={handleAddLead} className="flex gap-2">
                    <Input
                      placeholder="Instagram username..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-auto"
                    />
                    <Button type="submit" disabled={addLead.isPending}>
                      {addLead.isPending ? 'Adding...' : 'Add Lead'}
                    </Button>
                  </form>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Followers</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Added</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            Loading leads...
                          </TableCell>
                        </TableRow>
                      ) : filteredLeads.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            No leads found. Add your first lead.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLeads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell>@{lead.username}</TableCell>
                            <TableCell>{lead.full_name || '-'}</TableCell>
                            <TableCell>
                              {lead.followers_count 
                                ? formatCompactNumber(lead.followers_count) 
                                : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(lead.status)}
                            </TableCell>
                            <TableCell>
                              {new Date(lead.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="outreach-campaigns">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Outreach Campaigns</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-10">
                  Campaign management coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

// Helper function to render status badges
const getStatusBadge = (status: string | null) => {
  switch (status) {
    case 'contacted':
      return <Badge className="bg-blue-500/20 text-blue-400">Contacted</Badge>;
    case 'converted':
      return <Badge className="bg-green-500/20 text-green-400">Converted</Badge>;
    case 'new':
    default:
      return <Badge className="bg-amber-500/20 text-amber-400">New</Badge>;
  }
};

export default AdminOutreach;
