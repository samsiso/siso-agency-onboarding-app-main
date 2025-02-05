import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// [Analysis] Further optimizing chunk strategy for better initial load performance
// [Plan] Monitor chunk sizes and adjust splits if any chunk exceeds 50kb
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
          // Core vendor bundle - essential for all routes
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          
          // UI Components bundles - split by feature
          'ui-core': ['@radix-ui/react-slot'],
          'ui-navigation': [
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-tabs'
          ],
          'ui-overlay': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip'
          ],
          'ui-forms': [
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-switch',
            '@radix-ui/react-checkbox'
          ],
          'ui-data': [
            '@radix-ui/react-avatar',
            '@radix-ui/react-progress'
          ],
          
          // Landing page specific chunks
          'landing-hero': [
            '@/components/ui/animated-hero',
            '@/components/ui/waves-background'
          ],
          'landing-features': [
            '@/components/blocks/feature-section-with-hover-effects',
            '@/components/blocks/shadcnblocks-com-feature108'
          ],
          'landing-testimonials': [
            '@/components/landing/TestimonialSection',
            '@/components/landing/TestimonialCard'
          ],
          'landing-pricing': [
            '@/components/ui/pricing-card'
          ],
          
          // Utilities bundle - split by function
          'utils-styling': ['clsx', 'tailwind-merge'],
          'utils-icons': ['lucide-react'],
          'utils-animation': ['framer-motion'],
          
          // Form handling bundle
          'form-vendor': ['react-hook-form', 'zod'],
          
          // Data management bundles
          'data-query': ['@tanstack/react-query'],
          'data-charts': ['recharts'],
          
          // Auth bundles - split by provider
          'auth-supabase': ['@supabase/auth-helpers-react'],
          'auth-ui': ['@supabase/auth-ui-react'],
          
          // Blockchain bundles - split by chain
          'blockchain-solana': ['@solana/web3.js'],
          'blockchain-moralis': ['moralis']
        },
        
        // Optimize chunk size
        chunkSizeWarningLimit: 500, // Reduced from 1000 to catch smaller chunks
        
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