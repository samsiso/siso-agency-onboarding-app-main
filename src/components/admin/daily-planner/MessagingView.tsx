
import React from 'react';
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { BrandTelegram, MessageSquare } from 'lucide-react';

export function MessagingView() {
  return (
    <div className="bg-white rounded-md border p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Task Messaging Integration</h2>
        <p className="text-sm text-muted-foreground">
          Connect with Telegram or WhatsApp to receive daily task lists
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-4">Select Messaging Platform</h3>
        <ToggleGroup type="single" defaultValue="telegram" className="justify-start">
          <ToggleGroupItem value="telegram" className="flex items-center gap-1">
            <BrandTelegram className="h-4 w-4" />
            Telegram
          </ToggleGroupItem>
          <ToggleGroupItem value="whatsapp" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            WhatsApp
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Messaging Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Telegram Username or Phone</label>
              <Input placeholder="@username or +1234567890" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Send Time</label>
              <Input type="time" defaultValue="08:00" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input type="checkbox" id="automated" />
            <label htmlFor="automated" className="text-sm">Enable automated daily to-do lists</label>
          </div>
          
          <Button className="w-full md:w-auto">
            Save Messaging Settings
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Manual Message</h3>
        <div className="space-y-4">
          <Button className="w-full md:w-auto">
            Send Today's Tasks Now
          </Button>
          <p className="text-xs text-muted-foreground">
            No messaging history available yet. Configure your settings and send your first message.
          </p>
        </div>
      </div>
    </div>
  );
}
