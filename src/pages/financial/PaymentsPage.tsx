
import { useState, useEffect } from 'react';
import { FinancialLayout } from '@/components/layout/FinancialLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchInvoices, fetchInvoiceById } from '@/utils/financial/invoicesApi';
import { fetchTransactions, getFinancialSummary } from '@/utils/financial';
import { TotalCostCard } from '@/components/admin/financials/TotalCostCard';
import { ExpensesTimeline } from '@/components/admin/financials/ExpensesTimeline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Wallet, FileText, AlertCircle, Download, CreditCard, 
  Clock, DownloadCloud, Filter, ChevronDown, PieChart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Invoice, FinancialTransaction } from '@/utils/financial/types';

export default function PaymentsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch invoices
  const { 
    data: invoices, 
    isLoading: isLoadingInvoices, 
    error: invoicesError 
  } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });

  // Fetch transactions for expenses
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  // Fetch financial summary
  const {
    data: financialSummary,
    isLoading: isLoadingSummary,
    error: summaryError
  } = useQuery({
    queryKey: ['financialSummary'],
    queryFn: () => getFinancialSummary('month'),
  });

  const isLoading = isLoadingInvoices || isLoadingTransactions || isLoadingSummary;
  const error = invoicesError || transactionsError || summaryError;
  
  // Filter active expenses (paid by agency for client)
  const activeExpenses = transactions?.filter(tx => 
    tx.type === 'expense' && tx.status === 'completed'
  ) || [];
  
  // Calculate upcoming payments (due in next 7 days)
  const upcomingPayments = invoices?.filter(invoice => {
    if (invoice.status !== 'pending' && invoice.status !== 'overdue') return false;
    const dueDate = new Date(invoice.due_date);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }) || [];
  
  // Group expenses by category
  const expensesByCategory = activeExpenses.reduce((acc, expense) => {
    const category = expense.category?.name || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(expense);
    return acc;
  }, {} as Record<string, FinancialTransaction[]>);
  
  // Calculate totals
  const totalCurrentExpenses = activeExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalOutstandingInvoices = (invoices || [])
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + Number(inv.amount), 0);
  
  // Find next payment due
  const nextPaymentDue = upcomingPayments.length > 0 
    ? upcomingPayments.reduce((earliest, inv) => {
        return new Date(inv.due_date) < new Date(earliest.due_date) ? inv : earliest;
      }) 
    : null;

  const handlePayNow = (invoice: Invoice) => {
    toast({
      title: "Payment Initiated",
      description: `Processing payment for invoice ${invoice.invoice_number}`,
    });
    // Here you would implement actual payment processing
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Downloading Invoice",
      description: "Your invoice will begin downloading shortly.",
    });
    // Here you would implement the download functionality
  };

  const handleDownloadAll = () => {
    toast({
      title: "Downloading All Invoices",
      description: "Your invoices will begin downloading shortly.",
    });
    // Here you would implement batch download functionality
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      'Hosting': 'bg-blue-500',
      'Software': 'bg-purple-500',
      'API Services': 'bg-green-500',
      'Infrastructure': 'bg-orange-500',
      'Support': 'bg-cyan-500',
      'Development': 'bg-indigo-500',
    };
    
    return categoryColors[category] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    }).format(date);
  };

  // Calculate total current costs from expenses
  const totalCurrentCosts = activeExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  // Calculate predicted costs (recurring expenses for the next month)
  const predictedMonthlyCosts = activeExpenses
    .filter(expense => expense.recurring_type === 'monthly')
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <FinancialLayout title="Payments & Billing">
      {/* Total Cost Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TotalCostCard 
          currentCosts={totalCurrentCosts}
          predictedCosts={predictedMonthlyCosts}
        />
        <ExpensesTimeline expenses={activeExpenses} />
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadAll}>
              <DownloadCloud className="mr-2 h-4 w-4" />
              Download All
            </Button>
            
            <Button variant="default" size="sm">
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Payment
            </Button>
          </div>
        </div>

        {/* Financial Overview Tab */}
        <TabsContent value="overview">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-siso-orange"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-siso-text">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-siso-red" />
              <p>There was an error loading your financial data.</p>
            </div>
          ) : (
            <>
              {/* Financial Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-black/20 border border-siso-text/10 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-siso-orange" />
                      Total Current Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{activeExpenses[0]?.currency || '£'} {totalCurrentExpenses.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Monthly recurring expenses</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/20 border border-siso-text/10 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-siso-orange" />
                      Outstanding Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">£ {totalOutstandingInvoices.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{invoices?.filter(i => i.status === 'pending' || i.status === 'overdue').length || 0} pending invoices</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/20 border border-siso-text/10 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-siso-orange" />
                      Total App Cost
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">£ {(financialSummary?.totalExpenses || 0).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Total investment to date</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/20 border border-siso-text/10 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-siso-orange" />
                      Next Payment Due
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {nextPaymentDue ? (
                      <>
                        <p className="text-2xl font-bold">{formatDate(nextPaymentDue.due_date)}</p>
                        <p className="text-xs text-muted-foreground">£{nextPaymentDue.amount.toFixed(2)} ({nextPaymentDue.invoice_number})</p>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold">No payments due</p>
                        <p className="text-xs text-muted-foreground">All invoices are paid</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Payment Methods Section */}
              <Card className="bg-black/20 border border-siso-text/10 backdrop-blur-sm mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Payment Methods</CardTitle>
                  <Button variant="outline" size="sm">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-4 border border-siso-text/10 rounded-lg bg-gradient-to-r from-purple-900/10 to-blue-900/10">
                      <div className="pr-4">
                        <CreditCard className="h-10 w-10 text-siso-orange" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">**** **** **** 4285</p>
                        <p className="text-sm text-muted-foreground">Expires 09/25</p>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm">Change</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Payments */}
              <Card className="bg-black/20 border border-siso-text/10 backdrop-blur-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Upcoming Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingPayments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingPayments.map(invoice => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 border border-siso-text/10 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-siso-orange/20 rounded-full">
                              <Clock className="h-4 w-4 text-siso-orange" />
                            </div>
                            <div>
                              <p className="font-medium">{invoice.invoice_number}</p>
                              <p className="text-sm text-muted-foreground">Due {formatDate(invoice.due_date)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={getStatusBadgeClass(invoice.status)}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                            <p className="font-bold">{invoice.currency} {invoice.amount.toFixed(2)}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handlePayNow(invoice)}
                          >
                            Pay Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No upcoming payments due</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="history">
          <Card className="bg-black/20 border border-siso-text/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-siso-orange" />
                Payment History
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <ScrollArea className="h-[450px]">
              <CardContent>
                {isLoadingInvoices ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-siso-orange mx-auto"></div>
                    <p className="mt-2 text-siso-text">Loading invoices...</p>
                  </div>
                ) : invoicesError ? (
                  <div className="text-center py-8 text-siso-text">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-siso-red" />
                    <p>There was an error loading your invoices.</p>
                  </div>
                ) : invoices && invoices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-siso-text/10">
                          <th className="text-left py-3 px-4 text-sm font-medium text-siso-text">Invoice Number</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-siso-text">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-siso-text">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-siso-text">Channel</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-siso-text">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-siso-text">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="border-b border-siso-text/5 hover:bg-siso-text/5">
                            <td className="py-3 px-4">{invoice.invoice_number}</td>
                            <td className="py-3 px-4">{formatDate(invoice.due_date)}</td>
                            <td className="py-3 px-4">{invoice.currency} {invoice.amount.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${getCategoryColor('Software')}`}></div>
                                <span>Software</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDownloadInvoice(invoice.id)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                
                                {invoice.status.toLowerCase() !== 'paid' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handlePayNow(invoice)}
                                  >
                                    Pay Now
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-siso-text">No invoices found.</p>
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <Card className="bg-black/20 border border-siso-text/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Wallet className="h-5 w-5 text-siso-orange" />
                Active Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-siso-orange mx-auto"></div>
                  <p className="mt-2 text-siso-text">Loading expenses...</p>
                </div>
              ) : transactionsError ? (
                <div className="text-center py-8 text-siso-text">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-siso-red" />
                  <p>There was an error loading expenses.</p>
                </div>
              ) : activeExpenses.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(expensesByCategory).map(([category, expenses]) => {
                    const categoryTotal = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
                    const categoryPercentage = (categoryTotal / totalCurrentExpenses) * 100;
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${getCategoryColor(category)}`}></div>
                            <h3 className="font-medium">{category}</h3>
                          </div>
                          <p className="font-medium">{expenses[0]?.currency || '£'} {categoryTotal.toFixed(2)}</p>
                        </div>
                        
                        <Progress value={categoryPercentage} className="h-2" />
                        
                        <div className="pl-5 space-y-2">
                          {expenses.map((expense) => (
                            <div key={expense.id} className="flex justify-between items-center py-2 border-b border-siso-text/5 last:border-0">
                              <div>
                                <p className="font-medium">{expense.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  {expense.recurring_type ? 'Recurring' : 'One-time'} • 
                                  {expense.vendor?.name && ` ${expense.vendor.name} • `}
                                  Last paid {formatDate(expense.date)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{expense.currency} {expense.amount.toFixed(2)}</p>
                                <Badge variant="outline" className="text-xs">Active</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-siso-text">No active expenses found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FinancialLayout>
  );
}
