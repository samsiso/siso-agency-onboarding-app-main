
import { useState, useEffect } from 'react';
import { FinancialLayout } from '@/components/layout/FinancialLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchInvoices } from '@/utils/financial/invoicesApi';
import { Invoice } from '@/utils/financial/types';
import { Button } from '@/components/ui/button';
import { Wallet, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentsPage() {
  const { toast } = useToast();
  
  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });

  const handlePayNow = (invoice: Invoice) => {
    toast({
      title: "Payment Initiated",
      description: `Processing payment for invoice ${invoice.invoice_number}`,
    });
    // Here you would implement actual payment processing
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

  return (
    <FinancialLayout title="Payments & Billing">
      <div className="bg-black/20 rounded-lg border border-siso-text/10 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-siso-orange" />
            <h2 className="text-xl font-semibold">Your Invoices</h2>
          </div>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            View All
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-siso-orange mx-auto"></div>
            <p className="mt-2 text-siso-text">Loading invoices...</p>
          </div>
        ) : error ? (
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-siso-text">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-siso-text">Due Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-siso-text">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-siso-text">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-siso-text/5 hover:bg-siso-text/5">
                    <td className="py-3 px-4">{invoice.invoice_number}</td>
                    <td className="py-3 px-4">{invoice.currency} {invoice.amount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {invoice.status.toLowerCase() !== 'paid' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePayNow(invoice)}
                        >
                          Pay Now
                        </Button>
                      )}
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
      </div>
    </FinancialLayout>
  );
}
