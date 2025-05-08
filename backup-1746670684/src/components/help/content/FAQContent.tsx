
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from 'lucide-react';

export function FAQContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-8 h-8 text-siso-orange" />
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      </div>
      
      <Card className="bg-black/30 border border-siso-text/10">
        <CardContent className="pt-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Common Questions</h2>
            <p className="text-muted-foreground">
              Find answers to frequently asked questions about our platform.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Account Management</h3>
            <p className="text-muted-foreground">
              Learn about account settings, security, and profile management.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Billing & Subscriptions</h3>
            <p className="text-muted-foreground">
              Information about pricing, billing cycles, and subscription management.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
