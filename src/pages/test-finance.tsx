import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

// Super simple version directly in a test page to debug white screen issue
export default function TestFinancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-8">
        Test Financial Page
      </h1>
      
      <div className="bg-black/30 border border-purple-400/30 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Financial Summary</h2>
        <p className="text-white">This is a simplified test page to identify rendering issues.</p>
      </div>
      
      <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <Wallet className="h-5 w-5 text-orange-500" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-black/20 rounded-lg border border-purple-400/20">
            <h3 className="text-lg text-white mb-2">Crypto Payment</h3>
            <p className="text-white/80">Get 20% discount when paying with cryptocurrency</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
