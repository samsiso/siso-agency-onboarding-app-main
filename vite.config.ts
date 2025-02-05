import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// [Analysis] Optimizing chunk strategy for better initial load performance
// [Plan] Monitor chunk sizes and adjust splits if any chunk exceeds 100kb
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    cssCodeSplit: true,
    modulePreload: {
      polyfill: true
    },
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor bundle
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI Components bundle
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-avatar',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-switch'
          ],
          
          // Utilities bundle
          'utils-vendor': ['clsx', 'tailwind-merge', 'lucide-react'],
          
          // Animation bundle
          'animation-vendor': ['framer-motion'],
          
          // Form handling bundle
          'form-vendor': ['react-hook-form', 'zod'],
          
          // Data management bundle
          'data-vendor': ['@tanstack/react-query'],
          
          // Auth bundle
          'auth-vendor': ['@supabase/auth-helpers-react', '@supabase/auth-ui-react'],
          
          // Blockchain bundle
          'blockchain-vendor': ['@solana/web3.js', 'moralis'],
          
          // Chart bundle
          'chart-vendor': ['recharts']
        },
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          const extType = assetInfo.name.split('.').pop() || '';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/img/[name]-[hash][extname]`;
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // Optimize entry file name
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // Enable source maps for production debugging
    sourcemap: mode === 'development',
  },
  // Optimize dev server performance
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      'clsx',
      'tailwind-merge',
      'lucide-react'
    ],
    exclude: ['moralis']
  },
  // Add preload directives
  experimental: {
    renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) {
      if (hostType === 'html') {
        return { relative: true };
      }
      return { relative: true };
    },
  }
}));