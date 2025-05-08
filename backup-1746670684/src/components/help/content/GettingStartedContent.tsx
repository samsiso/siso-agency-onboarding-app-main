
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from 'lucide-react';

export function GettingStartedContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-siso-orange" />
        <h1 className="text-3xl font-bold">Getting Started Guide</h1>
      </div>
      
      <Card className="bg-black/30 border border-siso-text/10">
        <CardContent className="pt-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Welcome to the Platform</h2>
            <p className="text-muted-foreground">
              This guide will help you get started with our platform. Follow these steps
              to make the most of your experience.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">1. Setting Up Your Account</h3>
            <p className="text-muted-foreground">
              Complete your profile and configure your initial settings to personalize your experience.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">2. Creating Your First Project</h3>
            <p className="text-muted-foreground">
              Learn how to create and manage projects using our intuitive interface.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">3. Exploring Features</h3>
            <p className="text-muted-foreground">
              Discover the key features that will help you succeed with our platform.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
