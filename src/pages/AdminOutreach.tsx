
import React, { useState, useCallback, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInstagramLeads } from '@/hooks/useInstagramLeads';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollableTable } from '@/components/admin/clients/ScrollableTable';
import { ClientColumnPreference } from '@/types/client.types';
import { ColumnManager } from '@/components/admin/clients/ColumnManager';
import { toast } from "sonner";
import { formatCompactNumber } from '@/lib/formatters';
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
  Calendar,
  Plus,
  Instagram,
  Download,
  Filter,
  X,
  ChevronDown,
  RefreshCw,
  UserPlus,
  BarChart3,
  Star
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LeadsFunnelChart } from '@/components/admin/outreach/LeadsFunnelChart';
import { OutreachAnalyticsCards } from '@/components/admin/outreach/OutreachAnalyticsCards';
import { OutreachActivityLog } from '@/components/admin/outreach/OutreachActivityLog';
import { useOutreachColumnPreferences } from '@/hooks/useOutreachColumnPreferences';
import { LeadDetailSheet } from '@/components/admin/outreach/LeadDetailSheet';

interface OutreachStats {
  total: number;
  contacted: number;
  converted: number;
  pending: number;
  conversionRate: number;
}

interface LeadTableColumn {
  key: string;
  label: string;
  visible: boolean;
  width?: number;
  pinned?: boolean;
}

const INITIAL_COLUMNS: LeadTableColumn[] = [
  { key: 'username', label: 'Username', visible: true, width: 150, pinned: true },
  { key: 'full_name', label: 'Name', visible: true, width: 180 },
  { key: 'followers_count', label: 'Followers', visible: true, width: 120 },
  { key: 'status', label: 'Status', visible: true, width: 120 },
  { key: 'source', label: 'Source', visible: true, width: 120 },
  { key: 'outreach_account', label: 'Outreach Account', visible: true, width: 150 },
  { key: 'followed', label: 'Followed', visible: true, width: 100 },
  { key: 'commented', label: 'Commented', visible: true, width: 120 },
  { key: 'messaged', label: 'DMed', visible: true, width: 100 },
  { key: 'app_plan_status', label: 'Plan Status', visible: true, width: 130 },
  { key: 'app_plan_url', label: 'Plan URL', visible: false, width: 150 },
  { key: 'last_interaction', label: 'Last Interaction', visible: false, width: 180 },
  { key: 'created_at', label: 'Added Date', visible: true, width: 120 },
  { key: 'assigned_to', label: 'Assigned To', visible: false, width: 150 },
  { key: 'notes', label: 'Notes', visible: false, width: 200 },
];

const AdminOutreach = () => {
  const [activeTab, setActiveTab] = useState('leads-overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [activeLead, setActiveLead] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { leads, isLoading, refetch, addLead } = useInstagramLeads(100);
  
  const { 
    columns, 
    sortColumn, 
    sortDirection, 
    setColumns, 
    setSortColumn, 
    setSortDirection,
    showAllColumns,
    toggleShowAllColumns,
    moveColumn
  } = useOutreachColumnPreferences(INITIAL_COLUMNS);
  
  const visibleColumns = useMemo(() => 
    columns.filter(col => showAllColumns || col.visible),
    [columns, showAllColumns]
  );

  const pinnedColumns = useMemo(() => 
    visibleColumns.filter(col => col.pinned),
    [visibleColumns]
  );

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

  const stats: OutreachStats = useMemo(() => {
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

  const filteredLeads = useMemo(() => {
    let filtered = [...leads];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(lead => 
        lead.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.full_name && lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }
    
    // Sort leads
    if (sortColumn) {
      filtered.sort((a, b) => {
        let valA = a[sortColumn as keyof typeof a] || '';
        let valB = b[sortColumn as keyof typeof b] || '';
        
        // Handle numerical values
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        
        // Handle string values
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
        
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [leads, searchQuery, statusFilter, sortColumn, sortDirection]);

  const handleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection, setSortColumn, setSortDirection]);

  const handleSelectAll = useCallback(() => {
    setSelectedLeads(prev => 
      prev.length === filteredLeads.length ? [] : filteredLeads.map(lead => lead.id)
    );
  }, [filteredLeads]);

  const handleSelectLead = useCallback((leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  }, []);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleRowClick = (leadId: string) => {
    setActiveLead(leadId);
  };

  const handleExportLeads = () => {
    const leadsToExport = selectedLeads.length > 0 
      ? leads.filter(lead => selectedLeads.includes(lead.id)) 
      : filteredLeads;
    
    const csv = [
      // CSV headers
      Object.keys(leadsToExport[0] || {}).join(','),
      // CSV data rows
      ...leadsToExport.map(lead => Object.values(lead).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `instagram_leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success(`Exported ${leadsToExport.length} leads to CSV`);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Outreach Management</h1>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="mb-6">
            <TabsTrigger value="leads-overview">Leads Overview</TabsTrigger>
            <TabsTrigger value="lead-management">Lead Management</TabsTrigger>
            <TabsTrigger value="outreach-accounts">Outreach Accounts</TabsTrigger>
            <TabsTrigger value="outreach-campaigns">Campaigns & Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads-overview">
            <OutreachAnalyticsCards stats={stats} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Funnel Conversion</CardTitle>
                  <CardDescription>Track your lead conversion process</CardDescription>
                </CardHeader>
                <CardContent>
                  <LeadsFunnelChart stats={stats} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Outreach Activity</CardTitle>
                  <CardDescription>Latest lead interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <OutreachActivityLog />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Leads</CardTitle>
                  <CardDescription>Recently added Instagram leads</CardDescription>
                </div>
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
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lead Database</CardTitle>
                  <CardDescription>Manage and track your Instagram leads</CardDescription>
                </div>
                
                <div className="flex items-center gap-3">
                  <form onSubmit={handleAddLead} className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search leads or add new..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 w-[240px]"
                      />
                    </div>
                    <Button type="submit" disabled={addLead.isPending || !searchQuery.trim()}>
                      {addLead.isPending ? 'Adding...' : 'Add Lead'}
                    </Button>
                  </form>
                </div>
              </CardHeader>
              
              <div className="px-4 py-2 border-b flex flex-wrap gap-2 items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Filter className="h-4 w-4 mr-1" />
                      Status: {statusFilter === 'all' ? 'All' : statusFilter}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusFilterChange('all')}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilterChange('new')}>
                      New
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilterChange('contacted')}>
                      Contacted
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilterChange('converted')}>
                      Converted
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <div className="flex-grow"></div>
                
                {selectedLeads.length > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{selectedLeads.length} leads selected</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedLeads([])}
                      className="h-8 ml-2"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                )}
                
                <ColumnManager 
                  columns={columns}
                  onColumnsChange={setColumns}
                  showAllColumns={showAllColumns}
                  onToggleShowAll={toggleShowAllColumns}
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={handleExportLeads}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => refetch()}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
              
              <DndProvider backend={HTML5Backend}>
                <ScrollableTable pinnedColumns={pinnedColumns} className="max-h-[calc(100vh-300px)]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 sticky left-0 bg-background z-20">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                              onChange={handleSelectAll}
                              className="rounded border-muted"
                            />
                          </div>
                        </TableHead>
                        
                        {visibleColumns.map((column, index) => {
                          const isPinned = !!column.pinned;
                          const isSorted = sortColumn === column.key;
                          let leftPosition = 40; // width of checkbox column
                          
                          if (isPinned) {
                            for (let i = 0; i < index; i++) {
                              if (visibleColumns[i].pinned) {
                                leftPosition += visibleColumns[i].width || 150;
                              }
                            }
                          }
                          
                          return (
                            <TableHead 
                              key={column.key}
                              className={cn(
                                "font-medium",
                                isPinned ? "sticky bg-background z-20" : ""
                              )}
                              style={{
                                minWidth: `${column.width || 150}px`,
                                width: `${column.width || 150}px`,
                                left: isPinned ? `${leftPosition}px` : undefined
                              }}
                              onClick={() => handleSort(column.key)}
                            >
                              <div className="flex items-center cursor-pointer">
                                {column.label}
                                {isSorted && (
                                  <ChevronDown 
                                    className={cn(
                                      "ml-1 h-4 w-4 transition-transform",
                                      sortDirection === 'desc' ? "transform rotate-180" : ""
                                    )}
                                  />
                                )}
                              </div>
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={visibleColumns.length + 1} className="text-center py-10">
                            Loading leads...
                          </TableCell>
                        </TableRow>
                      ) : filteredLeads.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={visibleColumns.length + 1} className="text-center py-10">
                            No leads found. Add your first lead.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLeads.map((lead) => (
                          <TableRow 
                            key={lead.id} 
                            className="cursor-pointer hover:bg-muted/30"
                            onClick={() => handleRowClick(lead.id)}
                          >
                            <TableCell 
                              className="sticky left-0 bg-background z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectLead(lead.id);
                              }}
                            >
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={selectedLeads.includes(lead.id)}
                                  onChange={() => {}} // Handled by onClick
                                  className="rounded border-muted"
                                />
                              </div>
                            </TableCell>
                            
                            {visibleColumns.map((column, index) => {
                              const isPinned = !!column.pinned;
                              let leftPosition = 40; // width of checkbox column
                              
                              if (isPinned) {
                                for (let i = 0; i < index; i++) {
                                  if (visibleColumns[i].pinned) {
                                    leftPosition += visibleColumns[i].width || 150;
                                  }
                                }
                              }
                              
                              return (
                                <TableCell 
                                  key={`${lead.id}-${column.key}`}
                                  className={cn(
                                    isPinned ? "sticky bg-background z-10" : ""
                                  )}
                                  style={{
                                    left: isPinned ? `${leftPosition}px` : undefined,
                                    maxWidth: `${column.width || 150}px`
                                  }}
                                >
                                  {renderCellContent(lead, column.key)}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollableTable>
              </DndProvider>
            </Card>
          </TabsContent>
          
          <TabsContent value="outreach-accounts">
            <Card>
              <CardHeader>
                <CardTitle>Instagram Outreach Accounts</CardTitle>
                <CardDescription>Manage accounts used for lead outreach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-medium text-lg">Active Accounts</h3>
                    <p className="text-sm text-muted-foreground">Manage your Instagram outreach accounts</p>
                  </div>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Example account cards */}
                  {[1, 2, 3].map(idx => (
                    <Card key={idx} className="overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3"></div>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Instagram className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">@siso_agency{idx}</h4>
                            <p className="text-xs text-muted-foreground">Business Account</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center mb-3">
                          <div>
                            <p className="text-sm font-medium">15/{idx * 10}</p>
                            <p className="text-xs text-muted-foreground">DMs Today</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{idx * 5}/{idx * 20}</p>
                            <p className="text-xs text-muted-foreground">Follows</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{idx * 3}/{idx * 15}</p>
                            <p className="text-xs text-muted-foreground">Comments</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Badge variant={idx === 1 ? "outline" : "default"} className="text-xs">
                            {idx === 1 ? "Paused" : "Active"}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="font-medium text-lg mb-4">Outreach Limits</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Daily DM Limit</span>
                        <span className="text-sm text-muted-foreground">20 / 30</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Daily Follow Limit</span>
                        <span className="text-sm text-muted-foreground">15 / 50</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Daily Comment Limit</span>
                        <span className="text-sm text-muted-foreground">12 / 40</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="outreach-campaigns">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Outreach Funnel Performance</CardTitle>
                  <CardDescription>Conversion metrics across funnel stages</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                  <p className="ml-4 text-muted-foreground">
                    Campaign analytics coming soon...
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Templates</CardTitle>
                  <CardDescription>Save and reuse outreach campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-4">
                    <Plus className="h-4 w-4 mr-2" />
                    New Campaign
                  </Button>
                  
                  <div className="space-y-3">
                    {['Fitness App Outreach', 'Agency Owner Outreach', 'E-commerce Owners'].map((template, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-400 mr-2" />
                          <span>{template}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {activeLead && (
        <LeadDetailSheet
          leadId={activeLead}
          isOpen={!!activeLead}
          onClose={() => setActiveLead(null)}
          onUpdate={refetch}
        />
      )}
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

// Helper function to render cell content based on column key
const renderCellContent = (lead: any, key: string) => {
  switch (key) {
    case 'username':
      return (
        <div className="flex items-center">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white mr-2">
            {lead.username.charAt(0).toUpperCase()}
          </div>
          <span>@{lead.username}</span>
        </div>
      );
      
    case 'followers_count':
      return lead.followers_count 
        ? formatCompactNumber(lead.followers_count) 
        : 'N/A';
        
    case 'status':
      return getStatusBadge(lead.status);
      
    case 'created_at':
      return new Date(lead.created_at).toLocaleDateString();
      
    case 'source':
      return <Badge variant="outline">Instagram</Badge>;
      
    case 'followed':
      return lead.followed ? (
        <div className="bg-green-500/10 text-green-500 w-5 h-5 rounded-full flex items-center justify-center">
          <CheckCircle className="h-3 w-3" />
        </div>
      ) : (
        <div className="bg-muted w-5 h-5 rounded-full flex items-center justify-center">
          <XCircle className="h-3 w-3 text-muted-foreground/50" />
        </div>
      );
      
    case 'commented':
      return lead.commented ? (
        <div className="bg-green-500/10 text-green-500 w-5 h-5 rounded-full flex items-center justify-center">
          <CheckCircle className="h-3 w-3" />
        </div>
      ) : (
        <div className="bg-muted w-5 h-5 rounded-full flex items-center justify-center">
          <XCircle className="h-3 w-3 text-muted-foreground/50" />
        </div>
      );
      
    case 'messaged':
      return lead.messaged ? (
        <div className="bg-green-500/10 text-green-500 w-5 h-5 rounded-full flex items-center justify-center">
          <CheckCircle className="h-3 w-3" />
        </div>
      ) : (
        <div className="bg-muted w-5 h-5 rounded-full flex items-center justify-center">
          <XCircle className="h-3 w-3 text-muted-foreground/50" />
        </div>
      );
      
    case 'outreach_account':
      return lead.outreach_account || (
        <span className="text-muted-foreground">Not assigned</span>
      );
      
    case 'app_plan_status':
      if (lead.app_plan_status === 'completed') {
        return <Badge className="bg-green-500/20 text-green-400">Completed</Badge>;
      } else if (lead.app_plan_status === 'in_progress') {
        return <Badge className="bg-blue-500/20 text-blue-400">In Progress</Badge>;
      } else {
        return <Badge variant="outline">Not Started</Badge>;
      }
      
    case 'app_plan_url':
      return lead.app_plan_url ? (
        <a 
          href={lead.app_plan_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline flex items-center"
          onClick={e => e.stopPropagation()}
        >
          <FileText className="h-4 w-4 mr-1" />
          View Plan
        </a>
      ) : '-';
      
    case 'last_interaction':
      return lead.last_interaction_at ? (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
          {new Date(lead.last_interaction_at).toLocaleDateString()}
        </div>
      ) : '-';
      
    case 'assigned_to':
      return lead.assigned_to || '-';
      
    case 'notes':
      return lead.notes || '-';
      
    default:
      return lead[key] || '-';
  }
};

export default AdminOutreach;
