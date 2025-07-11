import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

// Optimized QueryClient for super-fast performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000, // 15 minutes - aggressive caching
      gcTime: 30 * 60 * 1000, // 30 minutes - keep in memory longer
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: 'always',
      // Use background refetch for better UX
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
})

// Filter out harmless development errors in console
if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    // Suppress common development tool connection errors
    if (message.includes('net::ERR_CONNECTION_REFUSED') ||
        message.includes('18883') ||
        message.includes('Failed to load resource')) {
      return; // Suppress these specific errors
    }
    originalError.apply(console, args);
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </HashRouter>
  </React.StrictMode>
)
