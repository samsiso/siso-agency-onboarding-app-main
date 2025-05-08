
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreditCard, Wallet, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PaymentMethodsSection() {
  return (
    <Card className="bg-black/20 border border-siso-text/10 backdrop-blur-sm mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-white">Payment Methods</CardTitle>
        <Button variant="outline" size="sm" className="text-white hover:text-white">
          <CreditCard className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </CardHeader>
      <CardContent>
        {/* Crypto Discount Banner */}
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-siso-orange" />
              <span className="text-white font-medium">Pay with Crypto</span>
            </div>
            <Badge className="bg-siso-orange text-white">20% OFF</Badge>
          </div>
          <p className="text-sm text-white/80 mt-1">Get an instant 20% discount when paying with cryptocurrency</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Credit Card Payment */}
          <div className="flex items-center p-4 border border-siso-text/10 rounded-lg bg-gradient-to-r from-purple-900/10 to-blue-900/10">
            <div className="pr-4">
              <CreditCard className="h-10 w-10 text-siso-orange" />
            </div>
            <div className="flex-grow">
              <p className="font-medium text-white">**** **** **** 4285</p>
              <p className="text-sm text-white/60">Expires 09/25</p>
            </div>
            <div>
              <Button variant="ghost" size="sm" className="text-white hover:text-white">Change</Button>
            </div>
          </div>

          {/* Bank Transfer */}
          <div className="flex items-center p-4 border border-siso-text/10 rounded-lg bg-gradient-to-r from-purple-900/10 to-blue-900/10">
            <div className="pr-4">
              <Building2 className="h-10 w-10 text-siso-orange" />
            </div>
            <div className="flex-grow">
              <p className="font-medium text-white">Bank Transfer</p>
              <p className="text-sm text-white/60">Direct bank payment</p>
            </div>
            <div>
              <Button variant="ghost" size="sm" className="text-white hover:text-white">View Details</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
