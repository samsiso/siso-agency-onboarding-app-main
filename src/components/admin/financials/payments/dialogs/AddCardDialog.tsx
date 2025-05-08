import React, { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Calendar, Lock } from 'lucide-react';

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCardDialog({ open, onOpenChange }: AddCardDialogProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };
  
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would securely send the card details to a payment processor
    setTimeout(() => {
      onOpenChange(false);
    }, 1000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border border-purple-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Add Payment Card</DialogTitle>
          <DialogDescription className="text-center text-white/70">
            Add a new credit or debit card for secure payments.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-number" className="text-white">Card Number</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
              <Input 
                id="card-number" 
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="bg-black/40 border-purple-500/30 text-white pl-10"
                maxLength={19}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="card-name" className="text-white">Cardholder Name</Label>
            <Input 
              id="card-name" 
              placeholder="John Smith"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="bg-black/40 border-purple-500/30 text-white"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry-date" className="text-white">Expiry Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                <Input 
                  id="expiry-date" 
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  className="bg-black/40 border-purple-500/30 text-white pl-10"
                  maxLength={5}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv" className="text-white">CVV</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                <Input 
                  id="cvv" 
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="bg-black/40 border-purple-500/30 text-white pl-10"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="save-card" 
              checked={saveCard} 
              onCheckedChange={(checked) => setSaveCard(checked as boolean)}
              className="data-[state=checked]:bg-purple-500 border-purple-500/50"
            />
            <Label htmlFor="save-card" className="text-white/70 text-sm">Save this card for future payments</Label>
          </div>
          
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            >
              Add Card
            </Button>
          </DialogFooter>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-white/60">
            Your payment information is encrypted and stored securely.
            We do not store your full card details on our servers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
