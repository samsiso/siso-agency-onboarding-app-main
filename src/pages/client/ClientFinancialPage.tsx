
import React from 'react';
import { Helmet } from 'react-helmet';
import { ClientDashboardLayout } from '@/components/client/ClientDashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ClientFinancialPage() {
  return (
    <ProtectedRoute>
      <Helmet>
        <title>Payments & Billing | SISO Agency</title>
      </Helmet>
      <ClientDashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Payments & Billing</h1>
            <Button variant="outline" className="border-siso-border">
              <Download className="mr-2 h-4 w-4" />
              Export Statements
            </Button>
          </div>
          
          {/* Payment Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/30 border-siso-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-siso-text">Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">$4,500</span>
                  <span className="text-siso-text text-xs ml-2">USD</span>
                </div>
                <p className="text-xs text-siso-text mt-1">Updated: May 1, 2025</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 border-siso-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-siso-text">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">$2,000</span>
                  <span className="text-siso-text text-xs ml-2">USD</span>
                </div>
                <p className="text-xs text-red-400 mt-1">Due in 5 days</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 border-siso-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-siso-text">Total Paid (2025)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">$12,500</span>
                  <span className="text-siso-text text-xs ml-2">USD</span>
                </div>
                <p className="text-xs text-siso-text mt-1">Across 3 projects</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Payment Methods and Transactions */}
          <Tabs defaultValue="invoices">
            <TabsList className="bg-black/30">
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
              <TabsTrigger value="billing-history">Billing History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="invoices" className="mt-6">
              <Card className="bg-black/30 border-siso-border">
                <CardHeader>
                  <CardTitle>Pending Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Invoice 1 */}
                    <div className="p-4 bg-black/20 rounded-lg border-l-4 border-red-500">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">Invoice #UBH-2025-04</h3>
                        <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded">Due in 5 days</span>
                      </div>
                      <p className="text-sm mt-2 text-siso-text">
                        UbahCrypt Project - Development Phase 2
                      </p>
                      <div className="flex justify-between mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span>Amount: <strong>$2,000</strong></span>
                          <span className="text-xs bg-black/30 px-2 py-1 rounded">Issued: Apr 25, 2025</span>
                          <span className="text-xs bg-black/30 px-2 py-1 rounded">Due: May 10, 2025</span>
                        </div>
                        <Button>Pay Now</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Paid Invoices</h3>
                    <div className="space-y-4">
                      {/* Invoice 2 */}
                      <div className="p-4 bg-black/20 rounded-lg border-l-4 border-green-500">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">Invoice #UBH-2025-03</h3>
                          <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Paid</span>
                        </div>
                        <p className="text-sm mt-2 text-siso-text">
                          UbahCrypt Project - Development Phase 1
                        </p>
                        <div className="flex justify-between mt-3">
                          <div className="flex items-center gap-2 text-sm">
                            <span>Amount: <strong>$2,500</strong></span>
                            <span className="text-xs bg-black/30 px-2 py-1 rounded">Paid: Mar 15, 2025</span>
                          </div>
                          <Button variant="outline" size="sm">View Receipt</Button>
                        </div>
                      </div>
                      
                      {/* Invoice 3 */}
                      <div className="p-4 bg-black/20 rounded-lg border-l-4 border-green-500">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">Invoice #UBH-2025-02</h3>
                          <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Paid</span>
                        </div>
                        <p className="text-sm mt-2 text-siso-text">
                          UbahCrypt Project - Planning & Design
                        </p>
                        <div className="flex justify-between mt-3">
                          <div className="flex items-center gap-2 text-sm">
                            <span>Amount: <strong>$2,000</strong></span>
                            <span className="text-xs bg-black/30 px-2 py-1 rounded">Paid: Feb 20, 2025</span>
                          </div>
                          <Button variant="outline" size="sm">View Receipt</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment-methods" className="mt-6">
              <Card className="bg-black/30 border-siso-border">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Default Payment Method */}
                    <div className="p-4 bg-black/20 rounded-lg border border-siso-border/50">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-siso-orange" />
                          <div>
                            <h3 className="font-semibold">Visa ending in 4242</h3>
                            <p className="text-xs text-siso-text">Expires: 05/2027</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-siso-orange/20 text-siso-orange px-2 py-1 rounded">Default</span>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Add New Payment Method */}
                    <div className="mt-6">
                      <Button>Add Payment Method</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing-history" className="mt-6">
              <Card className="bg-black/30 border-siso-border">
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Transaction 1 */}
                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">Payment for Invoice #UBH-2025-03</h3>
                          <p className="text-xs text-siso-text mt-1">March 15, 2025</p>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">$2,500</span>
                          <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>Successful</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Transaction 2 */}
                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">Payment for Invoice #UBH-2025-02</h3>
                          <p className="text-xs text-siso-text mt-1">February 20, 2025</p>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">$2,000</span>
                          <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>Successful</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Transaction 3 */}
                    <div className="p-4 bg-black/20 rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">Payment for Invoice #UBH-2025-01</h3>
                          <p className="text-xs text-siso-text mt-1">January 10, 2025</p>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">$1,500</span>
                          <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>Successful</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ClientDashboardLayout>
    </ProtectedRoute>
  );
}
