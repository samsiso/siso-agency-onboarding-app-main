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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Copy, CheckCircle, Wallet, Bitcoin, CircleDollarSign } from 'lucide-react';

interface ConnectWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectWalletDialog({ open, onOpenChange }: ConnectWalletDialogProps) {
  const [copied, setCopied] = React.useState(false);
  const [selectedWallet, setSelectedWallet] = React.useState<string | null>(null);
  
  const walletAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const wallets = [
    { name: 'MetaMask', icon: CircleDollarSign, color: 'text-orange-500'},
    { name: 'Coinbase Wallet', icon: Wallet, color: 'text-blue-500'},
    { name: 'Trust Wallet', icon: Wallet, color: 'text-green-500'},
    { name: 'Bitcoin', icon: Bitcoin, color: 'text-yellow-500'},
  ];
  
  const handleConnectWallet = () => {
    // In a real implementation, this would connect to the selected wallet
    setTimeout(() => {
      onOpenChange(false);
    }, 1000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border border-purple-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Connect Wallet</DialogTitle>
          <DialogDescription className="text-center text-white/70">
            Connect your cryptocurrency wallet to receive a 20% discount on all payments.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="connect" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 bg-black/50">
            <TabsTrigger value="connect" className="text-white data-[state=active]:bg-purple-500/20">Connect</TabsTrigger>
            <TabsTrigger value="address" className="text-white data-[state=active]:bg-purple-500/20">Address</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.name}
                  variant="outline"
                  className={`flex flex-col items-center justify-center h-24 border-purple-500/30 bg-black/30 hover:bg-purple-950/20 ${selectedWallet === wallet.name ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={() => setSelectedWallet(wallet.name)}
                >
                  <wallet.icon className={`h-8 w-8 mb-2 ${wallet.color}`} />
                  <span className="text-white">{wallet.name}</span>
                </Button>
              ))}
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
              disabled={!selectedWallet}
              onClick={handleConnectWallet}
            >
              Connect {selectedWallet || 'Wallet'}
            </Button>
          </TabsContent>
          
          <TabsContent value="address">
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white p-4 rounded-lg">
                  <QrCode className="h-40 w-40 text-black" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wallet-address" className="text-white">SISO Agency Wallet Address</Label>
                <div className="flex">
                  <Input 
                    id="wallet-address" 
                    value={walletAddress} 
                    readOnly 
                    className="bg-black/40 border-purple-500/30 text-white"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="ml-2 bg-black/40 border-purple-500/30"
                    onClick={copyToClipboard}
                  >
                    {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-white" />}
                  </Button>
                </div>
                <p className="text-xs text-white/60">Send your payment to this address to receive your 20% discount.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col space-y-2">
          <div className="px-2 py-1 bg-orange-500/20 rounded-md text-center">
            <p className="text-sm text-orange-300">
              <span className="font-bold">20% Discount</span> applied when paying with crypto
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
