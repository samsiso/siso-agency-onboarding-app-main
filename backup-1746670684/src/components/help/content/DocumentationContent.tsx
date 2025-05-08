
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from 'lucide-react';

export function DocumentationContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-siso-orange" />
        <h1 className="text-3xl font-bold">Documentation</h1>
      </div>
      
      <Card className="bg-black/30 border border-siso-text/10">
        <CardContent className="pt-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Platform Documentation</h2>
            <p className="text-muted-foreground">
              Comprehensive documentation for all platform features and capabilities.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">API Reference</h3>
            <p className="text-muted-foreground">
              Detailed API documentation for developers and integrators.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
            <p className="text-muted-foreground">
              Learn about recommended approaches and best practices for using our platform.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
