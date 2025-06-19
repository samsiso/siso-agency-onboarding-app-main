
import React from 'react';
import { ClientData } from '@/types/client.types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, DollarSign, ArrowUpRight, ArrowDownRight, Plus, Download, Filter
} from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ClientFinancialSummaryProps {
  client: ClientData;
}

export function ClientFinancialSummary({ client }: ClientFinancialSummaryProps) {
  // In a real implementation, these would be fetched from the database
  const financials = {
    totalValue: 10000,
    invoiced: 6000,
    paid: 4000,
    overdue: 0,
    invoices: [
      {
        id: 'INV-2023-001',
        date: '2023-05-01',
        amount: 2000,
        status: 'paid',
        dueDate: '2023-05-15'
      },
      {
        id: 'INV-2023-002',
        date: '2023-06-01',
        amount: 2000,
        status: 'paid',
        dueDate: '2023-06-15'
      },
      {
        id: 'INV-2023-003',
        date: '2023-07-01',
        amount: 2000,
        status: 'pending',
        dueDate: '2023-07-15'
      }
    ],
    monthlyRevenue: [
      { name: 'Jan', amount: 0 },
      { name: 'Feb', amount: 0 },
      { name: 'Mar', amount: 0 },
      { name: 'Apr', amount: 0 },
      { name: 'May', amount: 2000 },
      { name: 'Jun', amount: 2000 },
      { name: 'Jul', amount: 2000 },
      { name: 'Aug', amount: 0 },
      { name: 'Sep', amount: 0 },
      { name: 'Oct', amount: 0 },
      { name: 'Nov', amount: 0 },
      { name: 'Dec', amount: 0 },
    ]
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const invoicePercentage = (financials.invoiced / financials.totalValue) * 100;
  const paidPercentage = (financials.paid / financials.totalValue) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Project Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financials.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Full contract amount</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Invoiced Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financials.invoiced.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={invoicePercentage} className="h-2" />
              <span className="text-xs text-muted-foreground">{Math.round(invoicePercentage)}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Amount Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financials.paid.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={paidPercentage} className="h-2" />
              <span className="text-xs text-muted-foreground">{Math.round(paidPercentage)}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(financials.invoiced - financials.paid).toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {financials.overdue > 0 ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-red-600" />
                  <span className="text-xs text-red-600">${financials.overdue.toLocaleString()} overdue</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600">No overdue payments</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Invoices</CardTitle>
              <Button size="sm" className="h-8 gap-1">
                <Plus className="h-4 w-4" /> New Invoice
              </Button>
            </div>
            <CardDescription>
              Invoice history for this client
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t">
              {financials.invoices.map((invoice) => (
                <div 
                  key={invoice.id}
                  className="flex items-center justify-between py-3 px-6 border-b last:border-b-0 hover:bg-muted/20"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{invoice.id}</span>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Issued: {new Date(invoice.date).toLocaleDateString()} | 
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${invoice.amount.toLocaleString()}</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button variant="link" size="sm">
              View All Invoices
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>
              Monthly revenue from this client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={financials.monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    labelFormatter={(label) => `${label} 2023`}
                  />
                  <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
