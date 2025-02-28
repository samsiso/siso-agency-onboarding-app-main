
import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class NewsErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  // [Analysis] Static method to derive error state from any errors thrown in children
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  // [Analysis] Lifecycle method to capture detailed error information
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console for debugging
    console.error('NewsErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  // [Analysis] Method to reset the error state and attempt to recover
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-red-500/10 p-4 rounded-full mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            There was an error loading the news content. This might be a temporary issue or a problem with your connection.
          </p>
          
          <div className="space-y-4 w-full max-w-md">
            <Button 
              variant="default" 
              onClick={this.handleReset}
              className="w-full gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <details className="text-left text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
              <summary className="cursor-pointer font-medium">Technical Details</summary>
              <div className="mt-2 overflow-auto max-h-64 text-xs font-mono">
                <p className="mb-2">{this.state.error?.toString()}</p>
                <pre>
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
