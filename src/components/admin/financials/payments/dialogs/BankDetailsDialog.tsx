import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, CheckCircle, Building, FileText } from 'lucide-react';

interface BankDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BankDetailsDialog({ open, onOpenChange }: BankDetailsDialogProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  
  const bankDetails = {
    accountName: 'SISO Agency Ltd',
    accountNumber: '12345678',
    sortCode: '12-34-56',
    iban: 'GB29NWBK60161331926819',
    swift: 'NWBKGB2L',
    bankName: 'Barclays Bank',
    reference: 'INV-2025-001' // This would be dynamic based on the invoice
  };
  
  const copyToClipboard = (field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border border-blue-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Bank Transfer Details</DialogTitle>
          <DialogDescription className="text-center text-white/70">
            Use these details to make a direct bank transfer payment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex items-center space-x-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Building className="h-5 w-5 text-blue-400" />
            <span className="text-white/80 font-medium">{bankDetails.bankName}</span>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="account-name" className="text-white">Account Name</Label>
              <div className="flex">
                <Input 
                  id="account-name" 
                  value={bankDetails.accountName} 
                  readOnly 
                  className="bg-black/40 border-blue-500/30 text-white"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-2 bg-black/40 border-blue-500/30"
                  onClick={() => copyToClipboard('accountName', bankDetails.accountName)}
                >
                  {copiedField === 'accountName' ? 
                    <CheckCircle className="h-4 w-4 text-green-500" /> : 
                    <Copy className="h-4 w-4 text-white" />
                  }
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="account-number" className="text-white">Account Number</Label>
                <div className="flex">
                  <Input 
                    id="account-number" 
                    value={bankDetails.accountNumber} 
                    readOnly 
                    className="bg-black/40 border-blue-500/30 text-white"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="ml-2 bg-black/40 border-blue-500/30"
                    onClick={() => copyToClipboard('accountNumber', bankDetails.accountNumber)}
                  >
                    {copiedField === 'accountNumber' ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> : 
                      <Copy className="h-4 w-4 text-white" />
                    }
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="sort-code" className="text-white">Sort Code</Label>
                <div className="flex">
                  <Input 
                    id="sort-code" 
                    value={bankDetails.sortCode} 
                    readOnly 
                    className="bg-black/40 border-blue-500/30 text-white"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="ml-2 bg-black/40 border-blue-500/30"
                    onClick={() => copyToClipboard('sortCode', bankDetails.sortCode)}
                  >
                    {copiedField === 'sortCode' ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> : 
                      <Copy className="h-4 w-4 text-white" />
                    }
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="iban" className="text-white">IBAN</Label>
              <div className="flex">
                <Input 
                  id="iban" 
                  value={bankDetails.iban} 
                  readOnly 
                  className="bg-black/40 border-blue-500/30 text-white"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-2 bg-black/40 border-blue-500/30"
                  onClick={() => copyToClipboard('iban', bankDetails.iban)}
                >
                  {copiedField === 'iban' ? 
                    <CheckCircle className="h-4 w-4 text-green-500" /> : 
                    <Copy className="h-4 w-4 text-white" />
                  }
                </Button>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="swift" className="text-white">SWIFT/BIC</Label>
              <div className="flex">
                <Input 
                  id="swift" 
                  value={bankDetails.swift} 
                  readOnly 
                  className="bg-black/40 border-blue-500/30 text-white"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-2 bg-black/40 border-blue-500/30"
                  onClick={() => copyToClipboard('swift', bankDetails.swift)}
                >
                  {copiedField === 'swift' ? 
                    <CheckCircle className="h-4 w-4 text-green-500" /> : 
                    <Copy className="h-4 w-4 text-white" />
                  }
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-400" />
              <span className="text-white/80 text-sm font-medium">Payment Reference</span>
            </div>
            <div className="flex">
              <Input 
                id="reference" 
                value={bankDetails.reference} 
                readOnly 
                className="bg-black/40 border-blue-500/30 text-white"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="ml-2 bg-black/40 border-blue-500/30"
                onClick={() => copyToClipboard('reference', bankDetails.reference)}
              >
                {copiedField === 'reference' ? 
                  <CheckCircle className="h-4 w-4 text-green-500" /> : 
                  <Copy className="h-4 w-4 text-white" />
                }
              </Button>
            </div>
            <p className="text-xs text-white/60">Please include this reference with your payment</p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col space-y-2">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
          >
            Done
          </Button>
          <p className="text-xs text-white/60 text-center">
            Once your payment is received, we'll update your account automatically.
            This may take 1-3 business days to process.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
