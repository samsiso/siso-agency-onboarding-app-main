
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

// Debug why the app isn't rendering
console.log('Starting app initialization')

// Error boundary component for catching React errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#300', color: 'white', margin: '20px' }}>
          <h2>Something went wrong rendering the app</h2>
          <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#400', padding: '10px' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}

// Create a client with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
})

// Try to log information about the DOM root element
const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

try {
  console.log('Attempting to create React root');
  const reactRoot = ReactDOM.createRoot(rootElement!);
  console.log('React root created successfully');
  
  reactRoot.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('Render method called');
} catch (error) {
  console.error('Failed to initialize React application:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; background-color: #300; color: white; margin: 20px;">
      <h2>Error Initializing Application</h2>
      <pre style="white-space: pre-wrap; background-color: #400; padding: 10px;">
        ${error instanceof Error ? error.message : String(error)}
      </pre>
    </div>
  `;
}
